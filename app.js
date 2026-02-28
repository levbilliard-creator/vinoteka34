/* Vinoteka34 catalog (static) */
const state = { items: [], filtered: [] };

const els = {
  q: document.getElementById('q'),
  cat: document.getElementById('cat'),
  wineColor: document.getElementById('wineColor'),
  pmin: document.getElementById('pmin'),
  pmax: document.getElementById('pmax'),
  reset: document.getElementById('reset'),
  tbody: document.querySelector('#table tbody'),
  meta: document.getElementById('meta'),
};

function parseNum(v){
  const n = Number(String(v||'').replace(/[^\d.]/g,''));
  return Number.isFinite(n) ? n : null;
}
function fmtPrice(v){
  try { return new Intl.NumberFormat('ru-RU').format(v) + ' ₽'; } catch { return v + ' ₽'; }
}
function uniq(arr){
  return Array.from(new Set(arr)).sort((a,b)=>a.localeCompare(b,'ru'));
}
function readQueryParams(){
  const url = new URL(window.location.href);
  const cat = url.searchParams.get('cat');
  if (cat) els.cat.value = cat;
}

function apply(){
  const q = (els.q.value||'').trim().toLowerCase();
  const cat = (els.cat.value||'').trim();
  const wc = (els.wineColor.value||'').trim();
  const pmin = parseNum(els.pmin.value);
  const pmax = parseNum(els.pmax.value);

  let res = state.items;
  if (cat) res = res.filter(x => x.category === cat);
  if (wc) res = res.filter(x => (x.wineColor||'') === wc);
  if (q) res = res.filter(x => (x.name||'').toLowerCase().includes(q));
  if (pmin !== null) res = res.filter(x => x.price >= pmin);
  if (pmax !== null) res = res.filter(x => x.price <= pmax);

  // sort: price asc then name
  res = res.slice().sort((a,b) => (a.price-b.price) || (a.name||'').localeCompare(b.name||'','ru'));
  state.filtered = res;
  render();
}

function render(){
  const rows = state.filtered.slice(0, 400); // limit for speed
  els.tbody.innerHTML = rows.map(x => {
    const qty = (typeof x.qty === 'number') ? x.qty : 0;
    const stock = qty > 0 ? 'в наличии' : 'под заказ';
    const tag = x.wineColor ? `<span class="tag">${x.wineColor}</span>` : '';
    const msg = encodeURIComponent(`Здравствуйте! Интересует позиция: ${x.name}. Цена на сайте: ${x.price} ₽. Есть в наличии?`);
    return `<tr>
      <td><strong>${escapeHtml(x.name)}</strong><div class="small">${tag}</div></td>
      <td>${escapeHtml(x.category||'')}</td>
      <td>${fmtPrice(x.price)}</td>
      <td><a href="https://t.me/share/url?url=&text=${msg}" target="_blank" rel="noopener">${stock}</a></td>
    </tr>`;
  }).join('');

  els.meta.textContent = `Показано: ${Math.min(state.filtered.length, 400)} из ${state.filtered.length} (всего позиций: ${state.items.length}).`;
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

async function init(){
  const resp = await fetch('./data/inventory.json?v=3', { cache: 'no-store' });
  const data = await resp.json();
  state.items = (data.items||[]).filter(x => x && x.name && x.price);

  // fill categories
  const cats = uniq(state.items.map(x => x.category).filter(Boolean));
  els.cat.innerHTML = `<option value="">Категория: все</option>` + cats.map(c => `<option>${escapeHtml(c)}</option>`).join('');

  // apply query param
  const url = new URL(window.location.href);
  const cat = url.searchParams.get('cat');
  if (cat) els.cat.value = cat;

  // events
  [els.q, els.cat, els.wineColor, els.pmin, els.pmax].forEach(el => el.addEventListener('input', apply));
  els.reset.addEventListener('click', () => {
    els.q.value=''; els.cat.value=''; els.wineColor.value='';
    els.pmin.value=''; els.pmax.value='';
    apply();
  });

  state.filtered = state.items.slice();
  apply();
}

init().catch(err => {
  console.error(err);
  els.meta.textContent = 'Ошибка загрузки каталога. Попробуйте обновить страницу.';
});
