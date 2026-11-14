/* Shared catalog and archived-product display rules. */
(function (root) {
  'use strict';
  const types = Object.freeze({all:'Все', wine:'Вино', sparkling:'Игристое', strong:'Крепкий алкоголь', beer:'Пиво', soft:'Безалкогольные', grocery:'Бакалея', tea:'Чай', accessories:'Аксессуары'});
  const placeholder = '/assets/product-placeholder.svg';
  const formatter = new Intl.NumberFormat('ru-RU', {style:'currency', currency:'RUB', minimumFractionDigits:0, maximumFractionDigits:2});
  const typeOf = value => Object.hasOwn(types, value) ? value : 'all';
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase('ru').replace(/ё/g,'е').trim();
  function filter(products, type, query) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return products.filter(p => (type === 'all' || p.type === type) && tokens.every(token => normalize([p.name_ru,p.name_en,p.kind,p.country,p.volume,p.year].filter(Boolean).join(' ')).includes(token)));
  }
  function imageOf(product) {
    const name = typeof product.image === 'string' ? product.image.trim() : '';
    // Only a verified, explicit local filename; never guess a different product.
    return name && !/[\\/]/.test(name) && name !== '..' && name !== '.'
      ? '/assets/wines/' + encodeURIComponent(name) : placeholder;
  }
  function priceOf(value) {
    const n = typeof value === 'number' || (typeof value === 'string' && value.trim()) ? Number(value) : NaN;
    return Number.isFinite(n) && n > 0 ? formatter.format(n) : 'Цена уточняется';
  }
  function catalogURL(type='all', query='', shown=20) {
    const params = new URLSearchParams();
    if(typeOf(type) !== 'all') params.set('type', type);
    if(query.trim()) params.set('q', query.trim());
    if(shown > 20) params.set('shown', String(shown));
    return '/catalog.html' + (params.size ? '?' + params.toString() : '');
  }
  function productURL(id, state={}) {
    const params = new URLSearchParams({id:String(id)});
    if(typeOf(state.type) !== 'all') params.set('from', state.type);
    if(state.query?.trim()) params.set('q', state.query.trim());
    if(state.shown > 20) params.set('shown', String(state.shown));
    return '/product.html?' + params.toString();
  }
  async function loadProducts() {
    const response = await fetch('/data/products.json');
    if(!response.ok) throw new Error('Не удалось загрузить каталог: HTTP ' + response.status);
    const products = await response.json();
    if(!Array.isArray(products) || !products.every(p => p && p.id != null && typeof p.name_ru === 'string')) throw new Error('Неверный формат каталога');
    return products;
  }
  function makeImage(product, eager=false) {
    const img = document.createElement('img');
    const source = imageOf(product);
    img.src = source;
    img.alt = source === placeholder ? 'Фото товара пока нет' : product.name_ru;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.width = 320; img.height = 220;
    img.addEventListener('error', () => {img.src = placeholder; img.alt='Фото товара пока нет';}, {once:true});
    return img;
  }
  function element(tag, className, value) {
    const node = document.createElement(tag);
    node.className = className;
    if(value != null) node.textContent = value;
    return node;
  }
  function card(product, state={}) {
    const article = element('article','product-card');
    const media = element('div','img-wrap');
    media.append(makeImage(product));
    article.append(media);
    if(product.name_en) article.append(element('div','wine-en',product.name_en));
    article.append(element('h2','wine-ru',product.name_ru));
    const bottom = element('div','wine-bottom');
    bottom.append(element('div','wine-type', product.kind || types[product.type] || 'Товар'));
    const style = [product.color, product.style].filter(Boolean).join(' · ');
    if(style) bottom.append(element('div','wine-style',style));
    const details = [product.volume,product.year,product.packaging].filter(Boolean).join(' · ');
    if(details) bottom.append(element('div','wine-style',details));
    bottom.append(element('div','wine-price',priceOf(product.price)));
    const link = element('a','btn-link','Открыть →');
    link.href = productURL(product.id,state);
    link.setAttribute('aria-label','Открыть: ' + product.name_ru);
    bottom.append(link); article.append(bottom);
    return article;
  }
  const api = {types,placeholder,typeOf,filter,imageOf,priceOf,catalogURL,productURL,loadProducts,makeImage,element,card};
  if(typeof module !== 'undefined' && module.exports) module.exports=api;
  else root.Vino = api;
})(globalThis);
