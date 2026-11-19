#!/usr/bin/env python3
"""Import a private inventory XLSX without publishing stock/accounting columns.

Usage: python3 scripts/import_inventory.py /private/act.xlsx --review docs/inventory-2026-10-31-map.json
The reviewed map is tied to the exact input SHA. No fuzzy identity matching is
performed by this importer. Unmatched old cards are archived, never deleted.
"""
import argparse
import collections
import hashlib
import json
import re
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def read_json(path, default=None):
    return json.loads(path.read_text()) if path.exists() else default

def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def key(name):
    return hashlib.sha256(re.sub(r'\s+', ' ', name.casefold().replace('ё', 'е')).strip().encode()).hexdigest()

def extract(path):
    with zipfile.ZipFile(path) as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(t.text or '' for t in x.findall('.//s:t', NS)) for x in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si', NS)]
        rows = []
        for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//s:sheetData/s:row', NS):
            cells = {}
            for c in row.findall('s:c', NS):
                v = c.find('s:v', NS)
                value = v.text if v is not None else ''
                if c.get('t') == 's': value = strings[int(value)]
                elif c.get('t') == 'inlineStr': value = ''.join(t.text or '' for t in c.findall('.//s:t', NS))
                cells[re.sub(r'\d', '', c.get('r'))] = value or ''
            if not cells.get('B', '').isdigit() or not cells.get('D'): continue
            def number(col): return float(cells.get(col) or 0)
            rows.append({'row':int(row.get('r')), 'number':int(cells['B']), 'raw_name':re.sub(r'\s+', ' ', cells['D']).strip(), 'qty_fact':number('N'), 'price':number('V'), 'amount':number('Z')})
    if not rows or len({r['number'] for r in rows}) != len(rows): raise ValueError('Invalid source rows')
    if any(r['price'] <= 0 or r['qty_fact'] < 0 for r in rows): raise ValueError('Invalid retail price or stock')
    if any(abs(r['price'] * r['qty_fact'] - r['amount']) > .011 for r in rows): raise ValueError('Source amount reconciliation failed')
    return rows

def classify(raw):
    s = raw.lower()
    if re.search(r'б/а|безалкоголь', s):
        kind = 'Безалкогольное пиво' if re.search(r'пив[оан]', s) else ('Безалкогольное игристое' if 'игрист' in s else 'Безалкогольное вино')
        return 'soft', kind
    for prefix, category, label in [('чай','tea','Чай'),('бокал','accessories','Бокалы'),('стаканчик','accessories','Стаканчик'),('пакет','accessories','Подарочная упаковка'),('вода','soft','Вода'),('виноградный сок','soft','Сок'),('пиво','beer','Пиво'),('пивной','beer','Пивной напиток'),('сидр','beer','Сидр'),('портвейн','wine','Портвейн'),('херес','wine','Херес'),('вермут','strong','Вермут'),('арманьяк','strong','Арманьяк'),('бренди','strong','Бренди'),('коньяк','strong','Коньяк'),('водка','strong','Водка'),('виски','strong','Виски'),('джин','strong','Джин'),('текила','strong','Текила'),('ром','strong','Ром'),('ликер','strong','Ликёр'),('настойка','strong','Настойка'),('кальвадос','strong','Кальвадос'),('спиртной','strong','Спиртной напиток')]:
        if s.startswith(prefix): return category, label
    if re.search(r'игрист|инрист', s): return 'sparkling', 'Игристое вино'
    if s.startswith(('вино','российское')): return 'wine', 'Креплёное вино' if 'креплен' in s else 'Вино'
    return 'grocery', 'Гастрономия'

def volume(raw):
    s = raw.lower()
    found = re.findall(r'(?<!\d)(\d+(?:[,.]\d+)?)\s*(мл|л)(?=[\s.,]|$)', s)
    if found:
        n, unit = found[-1]; n = float(n.replace(',', '.'))
        n = n/1000 if unit == 'мл' else n
    else:
        found = re.findall(r'(?<!\d)(0[,.]\d+)(?!\d)', s)
        if not found: return ''
        n = float(found[-1].replace(',', '.'))
    return (f'{n:g}'.replace('.', ',') + ' л') if .02 <= n <= 3 else ''

COUNTRIES = ['Новая Зеландия','Тринидад и Тобаго','Великобритания','Доминикана','Португалия','Нидерланды','Австралия','Аргентина','Шотландия','Ирландия','Венесуэла','Франция','Германия','Австрия','Словения','Испания','Италия','Россия','Грузия','Бельгия','Мексика','Япония','Панама','Греция','Турция','Чехия','Сербия','Чили','США','ЮАР']

def display(raw, row, review):
    category, kind = classify(raw)
    normalized = raw.replace('«','"').replace('»','"').replace('¶','').strip()
    quotes = re.findall(r'"([^"\n]+)"', normalized)
    name = review.get('display_overrides', {}).get(str(row))
    if not name:
        if category in ('grocery','tea','accessories') or kind in ('Сок','Вода'): name = normalized.replace('"','')
        elif quotes: name = quotes[-1].strip()
        elif "'Майзелс" in normalized: name = 'Майзелс Вайс Ориджинал' if 'Ориджинал' in normalized else 'Майзелс Вайс'
        else:
            name = re.sub(r'^(Водка|Виски|Игристое вино б/а брют белое|Настойка горькая)\s+', '', normalized, flags=re.I)
            name = re.split(r'\s+\d+(?:[,.]\d+)?\s*(?:л\b|%|Шотландия)', name)[0]
    # Food names retain producer, flavour and pack identity outside quotation marks.
    if category == 'grocery': name = normalized.replace('"','')
    if name.isupper(): name = name.capitalize()
    name = re.sub(r'\s+', ' ', name).strip(' ,.')
    low = raw.lower()
    color = next((v for pattern,v in [(r'розов|\bроз[эе]\b','розовое'),(r'красн','красное'),(r'бело|беле\b|белре\b','белое')] if re.search(pattern, low)), '') if category in ('wine','sparkling','soft') else ''
    if row in review.get('omit_color',[]): color = ''
    style = next((v for pattern,v in [('экстра брют','экстра брют'),('брют натюр','брют натюр'),('брют','брют'),('полуслад','полусладкое'),('полусух','полусухое'),('слад','сладкое'),('сух','сухое')] if pattern in low), '') if category in ('wine','sparkling','soft') else ''
    if category == 'beer':
        sugar = next((v for v in ['полусухой','полусладкий','сухой','сладкий'] if v in low), '')
        shade = next((v for v in ['светлое','темное','тёмное'] if v in low), '')
        filtration = 'нефильтрованный' if 'нефильтрован' in low else ('фильтрованный' if 'фильтрован' in low else '')
        style = ' · '.join(v for v in [sugar,shade,filtration] if v)
    country = next((c for c in COUNTRIES if c.lower() in low), '')
    country = review.get('country_overrides', {}).get(str(row), country)
    if row in review.get('omit_country',[]): country = ''
    years = re.findall(r'(?<!\d)((?:19|20)\d{2})(?!\d)', raw)
    year = int(years[-1]) if years else None
    # Explicit 1890 is a cuvée/brand name, not a vintage; only 1900+ is parsed.
    vol = '' if row in review.get('omit_volume',[]) else volume(raw)
    data = {'name_ru':name,'type':category,'kind':kind,'color':color,'style':style}
    if category != 'grocery' and vol: data['volume'] = vol
    if country: data['country'] = country
    if year is not None: data['year'] = year
    if re.search(r'п/у|подарочн|\+\s*2\s*рюм', low): data['packaging'] = 'Подарочная упаковка' + (' · 2 рюмки' if re.search(r'\+\s*2\s*рюм', low) else '')
    return data

def preserve_wine_characteristics(product, previous):
    """Keep reviewed drink notes only for the same inventory identity and version."""
    if not previous or product.get('type') not in {'wine', 'sparkling', 'strong'}:
        return product
    if not product.get('inventory_key') or product['inventory_key'] != previous.get('inventory_key'):
        return product
    if any(product.get(k) != previous.get(k) for k in ('type', 'color', 'year', 'kind')):
        return product
    for field in ('grape', 'aroma', 'taste', 'pairing', 'raw_material', 'minimum_age', 'ageing'):
        if previous.get(field):
            product[field] = previous[field]
    return product


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('source', type=Path); ap.add_argument('--review', type=Path, required=True)
    ap.add_argument('--date', default='2026-10-31')
    args = ap.parse_args()
    review = read_json(args.review)
    source_hash = hashlib.sha256(args.source.read_bytes()).hexdigest()
    if source_hash != review['source_sha256']: raise ValueError('Review map belongs to a different source file')
    source = extract(args.source)
    old = read_json(ROOT/'data/products.json')
    archived = read_json(ROOT/'data/products-archive.json', [])
    prior = {p['id']:p for p in archived + old}
    by_key = {p['inventory_key']:p['id'] for p in prior.values() if p.get('inventory_key')}
    image_map = read_json(ROOT/'docs/product-image-map.json', {}).get('images', {})
    next_id = max(prior)+1
    products, receipt, used = [], [], set()
    for row in source:
        if row['qty_fact'] <= 0: continue
        fingerprint = key(row['raw_name'])
        pid = by_key.get(fingerprint, review['matches'].get(str(row['row'])))
        if pid is None: pid = next_id; next_id += 1
        if pid in used: raise ValueError('Duplicate reviewed product ID')
        used.add(pid)
        previous = prior.get(pid)
        image = image_map.get(str(pid))
        if image and not (ROOT/'assets/wines'/image).is_file(): raise ValueError('Missing reviewed image: ' + image)
        p = {'id':pid, **display(row['raw_name'], row['row'], review), 'name_en':previous.get('name_en','') if previous else '', 'price':row['price'], 'image':image, 'inventory_key':fingerprint, 'stock_date':args.date}
        preserve_wine_characteristics(p, previous)
        products.append(p)
        receipt.append({'source_row':row['row'], 'id':pid, 'action':'retained' if previous and pid in {x['id'] for x in old} else ('reactivated' if previous else 'added'), 'price':p['price'], 'previous_price':previous['price'] if previous else None})
    archive = [{**p, 'active':False, 'archived_on':p.get('archived_on',args.date)} for pid,p in sorted(prior.items()) if pid not in used]
    manifest = {'inventory_date':args.date,'source_filename':args.source.name,'source_sha256':source_hash,'source_sheet':review['sheet'],'source_rows':len(source),'active_products':len(products),'excluded_zero_stock':len(source)-len(products),'archive_products':len(archive),'counts_by_type':dict(collections.Counter(p['type'] for p in products)),'added':sum(r['action']=='added' for r in receipt),'retained':sum(r['action']=='retained' for r in receipt),'reactivated':sum(r['action']=='reactivated' for r in receipt),'price_changes':sum(r['previous_price'] is not None and r['price']!=r['previous_price'] for r in receipt),'rows':receipt}
    write_json(ROOT/'data/products.json', products)
    write_json(ROOT/'data/products-archive.json', archive)
    write_json(ROOT/'docs/inventory-2026-10-31-release.json', manifest)
    print(json.dumps({k:v for k,v in manifest.items() if k!='rows'},ensure_ascii=False))

if __name__ == '__main__': main()
