(() => {
  'use strict';
  const V=window.Vino;
  const params=new URLSearchParams(location.search);
  const id=params.get('id');
  const state={type:V.typeOf(params.get('from')),query:params.get('q') || '',shown:Math.min(1000,Math.max(20,Number(params.get('shown')) || 20))};
  const status=document.getElementById('productStatus');
  const retry=document.getElementById('retryLoad');
  const content=document.getElementById('productContent');
  const back=document.getElementById('backToCatalog');
  back.href=V.catalogURL(state.type,state.query,state.shown);
  async function init() {
    content.hidden=true;retry.hidden=true;status.hidden=false;
    status.textContent='Загружаем товар…';
    try {
      const products=await V.loadProducts();
      const product=products.find(p=>String(p.id)===id);
      if(!product) {status.textContent='Товар не найден. Вернитесь в каталог и выберите другую позицию.';document.title='Товар не найден — VINOTEKA34';return;}
      document.title=product.name_ru+' — VINOTEKA34';
      document.querySelector('meta[name="description"]').content=product.name_ru+'. '+V.priceOf(product.price)+'. Винный бутик VINOTEKA34.';
      const canonical=document.querySelector('link[rel="canonical"]');
      canonical.href='https://vinoteka34.ru/product.html?id='+encodeURIComponent(product.id);
      document.querySelector('.product-title').textContent=product.name_ru;
      const original=document.querySelector('.product-name-en');
      original.textContent=product.name_en || '';original.hidden=!product.name_en;
      document.querySelector('.product-type').textContent=V.types[product.type] || 'Товар';
      document.querySelector('.product-style').textContent=[product.color,product.style].filter(Boolean).join(' · ');
      document.querySelector('.product-price').textContent=V.priceOf(product.price);
      document.querySelector('.product-image').replaceChildren(V.makeImage(product,true));
      const description=document.getElementById('productDescription');
      description.textContent=product.description || 'Подробности об этом товаре можно уточнить у сомелье.';
      const specs=document.querySelector('.product-specs');specs.replaceChildren();
      const fields=[['Тип',V.types[product.type]],['Цвет',product.color],['Стиль',product.style],['Страна',product.country],['Регион',product.region],['Сорт винограда',product.grape],['Объем',product.volume],['Год урожая',product.year]];
      for(const [label,value] of fields) {
        if(value == null || value === '') continue;
        const row=V.element('div','spec');
        row.append(V.element('dt','',label),V.element('dd','',String(value)));
        specs.append(row);
      }
      const similar=products.filter(p=>String(p.id)!==String(product.id) && p.type===product.type).slice(0,4);
      const related=document.querySelector('.similar-grid');related.replaceChildren();
      for(const item of similar) related.append(V.card(item,state));
      document.querySelector('.similar').hidden=!similar.length;
      status.hidden=true;content.hidden=false;
    } catch {
      status.textContent='Не удалось загрузить товар. Проверьте соединение и попробуйте ещё раз.';
      retry.hidden=false;
    }
  }
  retry.addEventListener('click',init);
  init();
})();
