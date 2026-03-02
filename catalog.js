
// GROUP_FILTER_PATCH_V8
function getGroupFromUrl(){
  const params = new URLSearchParams(window.location.search);
  return (params.get('group') || '').trim();
}
const GROUP_MAP = {
  wine: (item)=> ['Вино','Игристое'].includes(item.category),
  spirits: (item)=> ['Виски','Водка','Джин','Ром','Текила','Коньяк/Бренди'].includes(item.category),
  nonalc: (item)=> ['Другое'].includes(item.category),
  snacks: (item)=> ['Снеки'].includes(item.category),
  tea: (item)=> ['Чай'].includes(item.category),
  glass: (item)=> ['Стекло'].includes(item.category),
};
function applyGroupFilter(items){
  const g = getGroupFromUrl();
  if(!g) return items;
  const fn = GROUP_MAP[g];
  if(!fn) return items;
  return items.filter(fn);
}
const TG="https://t.me/vinotekakaram";
const GROUP=new URLSearchParams(location.search).get("group");
function inGroup(p){
  if(!GROUP || GROUP==="all") return true;
  const cat=(p.category||"").toLowerCase();
  const name=((p.full_name||p.title||"")+" "+(p.description||"")).toLowerCase();

  if(GROUP==="wine"){
    return cat.includes('вино') || cat.includes('игрист');
  }
  if(GROUP==="spirits"){
    return ['виски','водка','джин','коньяк','бренди','ром','текила','ликер','настойка','кальвадос','граппа','арманьяк'].some(x=>cat.includes(x));
  }
  if(GROUP==="snacks"){
    return ['снэк','снеки','закус','сыр','деликатес','шокол','паштет','хамон','прошутто','брезаола'].some(x=>cat.includes(x))
      || /(сыр|паштет|хамон|прошутто|брезаола|закуск)/.test(name);
  }
  if(GROUP==="nonalc"){
    return ['безалк','безалког','вода','тоник','лимонад','сок','соки','кола','напиток'].some(x=>cat.includes(x))
      || /(безалк|безалког|вода|тоник|лимонад|сок)/.test(name);
  }
  if(GROUP==="tea"){
    return ['чай','кофе'].some(x=>cat.includes(x)) || /(чай|улун|пуэр|кофе)/.test(name);
  }
  if(GROUP==="glass"){
    return ['стекло','аксесс'].some(x=>cat.includes(x)) || /(бокал|стекл|декантер|штопор|пробк|аксессуар)/.test(name);
  }
  return true;
}

function groupTitle(){
  const map={
    all:'Каталог',
    wine:'Вино',
    spirits:'Крепкие напитки',
    nonalc:'Безалкогольные напитки',
    snacks:'Закуски',
    tea:'Чаи',
    glass:'Стекло и аксессуары'
  };
  return map[(GROUP||'all').toLowerCase()] || 'Каталог';
}
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
          <a class="p__t p__tlink" href="/product.html?id=${p.id}">${cleanBadPhrases(p.title)}</a>
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
  const base=(items||[]).filter(inGroup);
  const q=document.getElementById('q').value.trim().toLowerCase();
  let cat=document.getElementById('cat').value;
  let color=document.getElementById('color').value;
  let country=document.getElementById('country').value;

  // normalize placeholders so they don't act like real filters
  if(cat==='Все') cat='';
  if(color==='Любой' || color==='Любая') color='';
  if(country==='Любая' || country==='Любой') country='';

  const minP=parseInt(document.getElementById('minP').value,10);
  const maxP=parseInt(document.getElementById('maxP').value,10);
  const sort=document.getElementById('sort').value;

  let out=base.filter(p=>{
    if(q){
      const hay=`${cleanBadPhrases(p.title)} ${p.full_name} ${p.region||''} ${p.country||''}`.toLowerCase();
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

  document.getElementById('meta').textContent=`Показано: ${out.length} из ${base.length}`;
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

  const base=items.filter(inGroup);
  // title for grouped catalog
  const titleEl=document.getElementById('catalogTitle');
  if(titleEl) titleEl.textContent=groupTitle();
  document.title = `${groupTitle()} — Винотека`;
  // build select options
  const cats=uniq(base.map(x=>x.category));
  const countries=uniq(base.map(x=>x.country));

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