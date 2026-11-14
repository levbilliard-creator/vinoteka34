(() => {
  'use strict';
  const V = window.Vino;
  const grid = document.querySelector('.catalogGrid');
  const input = document.getElementById('searchInput');
  const status = document.getElementById('catalogStatus');
  const more = document.getElementById('loadMore');
  const retry = document.getElementById('retryLoad');
  const buttons = [...document.querySelectorAll('[data-type]')];
  const params = new URLSearchParams(location.search);
  const state = {type:V.typeOf(params.get('type') || params.get('group')),query:params.get('q') || '',shown:Math.min(1000,Math.max(20,Number(params.get('shown')) || 20))};
  let products = [], items = [];
  input.value = state.query;
  function syncURL() {
    history.replaceState(null,'',V.catalogURL(state.type,state.query,state.shown));
  }
  function updateStatus() {
    status.textContent = items.length ? 'Найдено: ' + items.length + '. Показано: ' + Math.min(state.shown,items.length) + '.' : 'По вашему запросу ничего не найдено. Измените поиск или категорию.';
    more.hidden = state.shown >= items.length;
  }
  function appendRange(start,end) {
    const fragment = document.createDocumentFragment();
    for(const product of items.slice(start,end)) fragment.append(V.card(product,state));
    grid.append(fragment);
  }
  function refresh() {
    items = V.filter(products,state.type,state.query);
    state.shown = Math.min(state.shown,Math.max(20,items.length));
    grid.replaceChildren();
    buttons.forEach(button => {const active=button.dataset.type === state.type;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    appendRange(0,state.shown);
    syncURL(); updateStatus();
  }
  function showMore() {
    const previous = state.shown;
    state.shown = Math.min(items.length,previous+20);
    appendRange(previous,state.shown);
    // Links return to the complete portion of the catalog already opened.
    grid.querySelectorAll('.btn-link').forEach((link,index) => {link.href=V.productURL(items[index].id,state);});
    syncURL(); updateStatus();
  }
  async function init() {
    retry.hidden=true; more.hidden=true;
    status.textContent='Загружаем каталог…';
    grid.setAttribute('aria-busy','true');
    input.disabled=true;buttons.forEach(b=>b.disabled=true);
    try {
      products=await V.loadProducts();
      buttons.forEach(button => {const type=button.dataset.type; const count=type==='all'?products.length:products.filter(p=>p.type===type).length;button.textContent=V.types[type]+' ('+count+')';});
      refresh();
      input.disabled=false;buttons.forEach(b=>b.disabled=false);
      try {
        const saved=JSON.parse(sessionStorage.getItem('vinoteka-catalog-position') || 'null');
        if(saved?.url===location.pathname+location.search) requestAnimationFrame(()=>window.scrollTo(0,saved.y));
      } catch { /* Storage is optional. */ }
    } catch {
      status.textContent='Не удалось загрузить каталог. Проверьте соединение и попробуйте ещё раз.';
      retry.hidden=false;
    } finally {grid.setAttribute('aria-busy','false');}
  }
  buttons.forEach(button => button.addEventListener('click',()=>{state.type=button.dataset.type;state.shown=20;refresh();}));
  input.addEventListener('input',()=>{state.query=input.value;state.shown=20;refresh();});
  more.addEventListener('click',showMore);
  retry.addEventListener('click',init);
  grid.addEventListener('click',event=>{
    if(event.target.closest('.btn-link')) {
      try {sessionStorage.setItem('vinoteka-catalog-position',JSON.stringify({url:location.pathname+location.search,y:window.scrollY}));} catch { /* Storage is optional. */ }
    }
  });
  init();
})();
