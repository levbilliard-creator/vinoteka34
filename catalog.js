function cleanWineTitle(title){

if(!title) return "";

let t = title;

t = t.replace(/вино/gi,"");

t = t.replace(/сухое|полусухое|полусладкое|сладкое/gi,"");

t = t.replace(/белое|красное|розовое/gi,"");

t = t.replace(/брют|экстра драй|экстра брют/gi,"");

t = t.replace(/\s+/g," ").trim();

return t;

}
(function(){

/* ---------- CONFIG ---------- */

const DATA_URL = "products.json";

const GROUPS = {
  wine: "Вино",
  sparkling: "Игристое",
  spirits: "Крепкий алкоголь"
};

/* ---------- HELPERS ---------- */

function q(sel){ return document.querySelector(sel); }

function escapeHtml(str){
  if(!str) return "";
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function formatPrice(n){
  if(!n) return "";
  return Number(n).toLocaleString("ru-RU") + " ₽";
}

/* ---------- CARD ---------- */

function buildTags(item){

  let tags=[];

  if(item.color) tags.push(item.color);

  if(item.category==="Игристое") tags.push("Игристое");

  return tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("");

}

function buildCard(item){

  const titleEN = escapeHtml(item.title_en || "");
  const titleRU = escapeHtml(item.title_ru || "");

  const country = escapeHtml(item.country || "");
  const region = escapeHtml(item.region || "");

  const meta = [country,region].filter(Boolean).join(" • ");

  const price = formatPrice(item.price_rub);

  const tags = buildTags(item);

  return `

  <div class="card">

      <div class="card-header">

          <div class="title-en">${titleEN}</div>

          <div class="title-ru">${titleRU}</div>

      </div>

      <div class="meta">${meta}</div>

      <div class="tags">${tags}</div>

      <div class="card-bottom">

          <div class="price">${price}</div>

          <button class="open-btn">Открыть</button>

      </div>

  </div>

  `;
}

/* ---------- FILTER ---------- */

function applyGroupFilter(items){

  const params = new URLSearchParams(location.search);

  const group = params.get("group");

  if(!group) return items;

  if(!GROUPS[group]) return items;

  const category = GROUPS[group];

  return items.filter(p => p.category === category);

}

/* ---------- RENDER ---------- */

function render(items){

  const grid = q("#catalog");

  if(!grid) return;

  grid.innerHTML="";

  if(!items.length){

    grid.innerHTML=`<div class="card">Каталог пуст</div>`;
    return;

  }

  const html = items.map(buildCard).join("");

  grid.innerHTML = html;

}

/* ---------- LOAD ---------- */

async function loadCatalog(){

  try{

    const res = await fetch(DATA_URL);

    const data = await res.json();

    let items = data.items || [];

    items = applyGroupFilter(items);

    render(items);

  }

  catch(e){

    console.error(e);

    const grid = q("#catalog");

    if(grid){
      grid.innerHTML =
        `<div class="card">Ошибка загрузки каталога</div>`;
    }

  }

}

/* ---------- START ---------- */

document.addEventListener("DOMContentLoaded", loadCatalog);

})();