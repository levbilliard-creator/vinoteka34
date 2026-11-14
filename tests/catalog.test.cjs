const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const V = require('../product-data.js');
const products = JSON.parse(readFileSync(new URL('../data/products.json','file://'+__filename)));

test('October inventory: active catalog, archived IDs and category coverage',()=>{
  assert.equal(products.length,644);
  assert.equal(new Set(products.map(p=>String(p.id))).size,644);
  const archive=JSON.parse(readFileSync(new URL('../data/products-archive.json','file://'+__filename)));
  assert.equal(archive.length,233);
  const activeIds=new Set(products.map(p=>p.id));
  assert.ok(archive.every(p=>p.active===false && !activeIds.has(p.id)));
  assert.equal(new Set([...products,...archive].map(p=>p.id)).size,877);
  for(const [type,count] of Object.entries({wine:344,sparkling:99,strong:98,beer:21,soft:15,grocery:54,tea:6,accessories:7})) assert.equal(V.filter(products,type,'').length,count,type);
});
test('tea search cannot return brandy; changing category preserves the search constraint',()=>{
  assert.equal(V.filter(products,'tea','арманьяк').length,0);
  assert.equal(V.filter(products,'strong','арманьяк').length,3);
  assert.equal(V.filter(products,'all','ЧАЙ').length,6);
});
test('search matches multiple words, original names and ё/е',()=>{
  assert.deepEqual(V.filter([{type:'wine',name_ru:'Шато Ёлка',name_en:'Chateau Test'}],'wine','ТЕСТ'),[]);
  assert.equal(V.filter([{type:'wine',name_ru:'Шато Ёлка',name_en:'Chateau Test'}],'wine','елка chateau').length,1);
});
test('catalog/product return URLs retain category, search and loaded portion',()=>{
  const link=new URL(V.productURL(438,{type:'tea',query:'чай зеленый',shown:40}),'https://vinoteka34.ru');
  const back=new URL(V.catalogURL(link.searchParams.get('from'),link.searchParams.get('q'),Number(link.searchParams.get('shown'))),'https://vinoteka34.ru');
  assert.equal(back.searchParams.get('type'),'tea');assert.equal(back.searchParams.get('q'),'чай зеленый');assert.equal(back.searchParams.get('shown'),'40');
  assert.equal(V.typeOf('https://example.com'),'all');
});
test('explicit images are used; no guessed numeric filenames or fuzzy matching',()=>{
  assert.equal(V.imageOf({id:7}),'/assets/product-placeholder.svg');
  assert.equal(V.imageOf({image:'этикетка "1".png'}),'/assets/wines/'+encodeURIComponent('этикетка "1".png'));
  assert.equal(V.imageOf({image:'../secret'}),V.placeholder);
  for(const product of products.filter(p=>p.image)) assert.equal(V.imageOf(product),'/assets/wines/'+encodeURIComponent(product.image));
});
test('retail prices and rows reconcile to the reviewed import; no warehouse data is public',()=>{
  const receipt=JSON.parse(readFileSync(new URL('../docs/inventory-2026-10-31-release.json','file://'+__filename)));
  assert.equal(receipt.source_rows,645);assert.equal(receipt.excluded_zero_stock,1);
  assert.equal(receipt.rows.length,products.length);
  assert.ok(!receipt.rows.some(r=>r.source_row===623));
  const byId=new Map(products.map(p=>[p.id,p]));
  for(const row of receipt.rows) assert.equal(byId.get(row.id).price,row.price);
  for(const p of products) {
    assert.ok(p.price>0 && p.name_ru.trim() && p.stock_date==='2026-10-31');
    for(const key of ['qty_fact','qty_accounting','deviation','amount','amount_accounting']) assert.ok(!(key in p));
  }
  // Alcoholic and nonalcoholic editions, different harvests and sizes stay separate.
  const milk=V.filter(products,'all','Милк Амнезия');assert.equal(milk.length,2);
  assert.deepEqual(new Set(milk.map(p=>p.type)),new Set(['beer','soft']));
  const cava=V.filter(products,'sparkling','Вибрасионс');assert.equal(cava.length,3);
  assert.ok(cava.some(p=>p.year===2023));assert.ok(cava.some(p=>p.year===2024));
});
test('missing or invalid prices never become a fabricated zero',()=>{
  for(const price of [null,undefined,'',0,-1,'bad']) assert.equal(V.priceOf(price),'Цена уточняется');
  assert.match(V.priceOf(6890),/6\s890/);
});
