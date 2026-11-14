const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const V = require('../product-data.js');
const products = JSON.parse(readFileSync(new URL('../data/products.json','file://'+__filename)));

test('real production catalog: category counts and IDs are preserved',()=>{
  assert.equal(products.length,553);
  assert.equal(new Set(products.map(p=>String(p.id))).size,553);
  for(const [type,count] of Object.entries({wine:300,sparkling:77,strong:96,beer:14,soft:20,grocery:36,tea:6,accessories:4})) assert.equal(V.filter(products,type,'').length,count,type);
});
test('tea search cannot return brandy; changing category preserves the search constraint',()=>{
  assert.equal(V.filter(products,'tea','арманьяк').length,0);
  assert.equal(V.filter(products,'strong','арманьяк').length,1);
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
  assert.equal(V.imageOf(products[0]),'/assets/wines/'+encodeURIComponent(products[0].image));
});
test('missing or invalid prices never become a fabricated zero',()=>{
  for(const price of [null,undefined,'',0,-1,'bad']) assert.equal(V.priceOf(price),'Цена уточняется');
  assert.match(V.priceOf(6890),/6\s890/);
});
