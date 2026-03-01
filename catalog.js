const TG="https://t.me/vinotekakaram";
function rub(n){return new Intl.NumberFormat("ru-RU").format(n)+" ₽";}
function toNum(v){if(v==null) return null; const s=String(v).replace(/\s/g,'').replace(',', '.'); const n=Number(s); return Number.isFinite(n)?n:null;}
function uniq(arr){return [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));}

async function loadItems(){
  const res=await fetch('/data/products.json', {cache:'no-store'});
  const data=await res.json();
  return data.items||[];
}

function buildCard(p){
  const badges=[];
  if(p.category) badges.push(p.category);
  if(p.color) badges.push(p.color);
  if(p.country) badges.push(p.country);

  const badgeHtml=badges.slice(0,3).map(b=>`<span class="badge">${b}</span>`).join('');
  const sub=[p.region?`Регион: ${p.region}`:null, (p.stock!=null?`Наличие: ${p.stock}`:null)].filter(Boolean).join(' • ');
  const msg=encodeURIComponent(`Здравствуйте! Хочу уточнить по позиции:\n\n${p.full_name}\nЦена: ${p.price_rub} ₽`);
  const href=`${TG}?text=${msg}`;
  return `
    <div class="p">
      <div class="p__top">
        <div style="min-width:0">
          <a class="p__t p__tlink" href="/product.html?id=${p.id}">${p.title}</a>
          <div class="p__sub">${sub||''}</div>
        </div>
        <div class="badges">${badgeHtml}</div>
      </div>
      <div class="p__bot">
        <div>
          <div class="price">${rub(p.price_rub)}</div>
          <div class="p__sub">Цена на сайте</div>
        </div>
        <a class="btn btn--tg" href="${href}" target="_blank" rel="noopener">Спросить</a>
      </div>
    </div>`;
}

function apply(items){
  const q=document.getElementById('q').value.trim().toLowerCase();
  const cat=document.getElementById('cat').value;
  const color=document.getElementById('color').value;
  const country=document.getElementById('country').value;
  const minP=toNum(document.getElementById('minP').value);
  const maxP=toNum(document.getElementById('maxP').value);
  const sort=document.getElementById('sort').value;

  let out=items.filter(p=>{
    if(q){
      const hay=`${p.title} ${p.full_name} ${p.region||''} ${p.country||''}`.toLowerCase();
      if(!hay.includes(q)) return false;
    }
    if(cat && p.category!==cat) return false;
    if(color && (p.color||'')!==color) return false;
    if(country && (p.country||'')!==country) return false;
    if(minP!=null && p.price_rub<minP) return false;
    if(maxP!=null && p.price_rub>maxP) return false;
    return true;
  });

  if(sort==='price_asc') out.sort((a,b)=>a.price_rub-b.price_rub);
  if(sort==='price_desc') out.sort((a,b)=>b.price_rub-a.price_rub);
  if(sort==='name_asc') out.sort((a,b)=>a.title.localeCompare(b.title,'ru'));

  document.getElementById('meta').textContent=`Показано: ${out.length} из ${items.length}`;
  document.getElementById('grid').innerHTML=out.map(buildCard).join('');
}

function applyHashDefaults(){
  const h=decodeURIComponent(location.hash||'');
  // #cat=Вино&color=Красное
  if(!h.startsWith('#')) return;
  const qs=h.slice(1).split('&').reduce((acc,p)=>{ const [k,v]=p.split('='); if(k&&v) acc[k]=v; return acc;},{});
  if(qs.cat) document.getElementById('cat').value=qs.cat;
  if(qs.color) document.getElementById('color').value=qs.color;
}

(async function(){
  const items=await loadItems();
  // build select options
  const cats=uniq(items.map(x=>x.category));
  const countries=uniq(items.map(x=>x.country));

  const catSel=document.getElementById('cat');
  cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catSel.appendChild(o);});

  const cSel=document.getElementById('country');
  countries.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;cSel.appendChild(o);});

  applyHashDefaults();

  ['q','cat','color','country','minP','maxP','sort'].forEach(id=>{
    document.getElementById(id).addEventListener('input',()=>apply(items));
    document.getElementById(id).addEventListener('change',()=>apply(items));
  });

  document.getElementById('reset').addEventListener('click',()=>{
    document.getElementById('q').value='';
    document.getElementById('cat').value='';
    document.getElementById('color').value='';
    document.getElementById('country').value='';
    document.getElementById('minP').value='';
    document.getElementById('maxP').value='';
    document.getElementById('sort').value='popular';
    history.replaceState(null,'',location.pathname);
    apply(items);
  });

  apply(items);
})();