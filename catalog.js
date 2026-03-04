(() => {

const $ = (id) => document.getElementById(id);

const elTitle = $("pageTitle");
const elMeta = $("meta");
const elGrid = $("grid");

const elQ = $("q");
const elCategory = $("category");
const elColor = $("color");
const elCountry = $("country");
const elMin = $("minPrice");
const elMax = $("maxPrice");
const elSort = $("sort");
const elReset = $("resetBtn");


function cleanTitle(text){

if(!text) return "";

let t = String(text);

t = t.replace(/^\s*вино\s+/i,'');

t = t.replace(/\b(сухое|полусухое|полусладкое|сладкое|брют|extra\s*dry|extra\s*brut)\b/ig,'');

t = t.replace(/\b(белое|красное|розовое)\b/ig,'');

t = t.replace(/\s{2,}/g,' ').trim();

return t;

}


function inferSweetness(item){

const t = (
(item.title || "") + " " +
(item.ru || "") + " " +
(item.en || "")
).toLowerCase();

if(/брют|brut/.test(t)) return "Брют";

if(/extra\s*dry|экстра\s*драй/.test(t)) return "Экстра драй";

if(/полуслад/.test(t)) return "Полусладкое";

if(/полусух/.test(t)) return "Полусухое";

if(/сух/.test(t)) return "Сухое";

if(/sweet/.test(t)) return "Сладкое";

return "";

}


function inferColor(item){

const name = (item.title || "").toLowerCase();

if(name.includes("бел")) return "Белое";

if(name.includes("красн")) return "Красное";

if(name.includes("роз")) return "Розовое";

if(name.includes("игрист")) return "Игристое";

return "";

}


function getTraits(item){

const traits = [];

const color = inferColor(item);

const sweet = inferSweetness(item);

if(color) traits.push(color);

if(sweet) traits.push(sweet);

return traits;

}


function escapeHtml(s){

return String(s ?? "")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");

}


function formatPrice(value){

const n = Number(value);

if(!Number.isFinite(n)) return "";

return new Intl.NumberFormat("ru-RU").format(n) + " ₽";

}


function buildCard(item){

const href = `/product.html?id=${encodeURIComponent(item.id)}`;

const ruTitle = cleanTitle(item.ru || item.title || "");

const enTitle = cleanTitle(item.en || item.title_en || "");

const titleHtml = ruTitle
? `${escapeHtml(enTitle)}<br><span class="card__en">${escapeHtml(ruTitle)}</span>`
: escapeHtml(enTitle);

const price = formatPrice(item.price_rub ?? item.price);

const regionLine = [item.region, item.country].filter(Boolean).join(" • ");

const stockLine = typeof item.stock === "number"
? `Наличие: ${item.stock}`
: "";

const traits = getTraits(item);

const traitsHtml = traits.length
? `<div class="pill-row">${traits.map(t=>`<span class="pill">${t}</span>`).join("")}</div>`
: "";

return `

<article class="card product">

<div class="prod-head">

<div class="prod-title-wrap">

<a class="prod-title" href="${href}">${titleHtml}</a>

${regionLine ? `<div class="muted small">${escapeHtml(regionLine)}</div>` : ""}

${stockLine ? `<div class="muted small">${escapeHtml(stockLine)}</div>` : ""}

</div>

<div class="prod-right">

<div class="prod-price">${price}</div>

<div class="prod-price-note">Цена на сайте</div>

<a class="btn btn-open" href="${href}">Открыть</a>

</div>

</div>

<div class="prod-foot">

${traitsHtml}

</div>

</article>

`;

}


async function loadData(){

const res = await fetch(`/data/products.json?v=${Date.now()}`);

if(!res.ok) throw new Error("Ошибка загрузки каталога");

return res.json();

}


function render(items,total){

if(!elGrid) return;

elGrid.innerHTML = items.map(buildCard).join("");

if(elMeta) elMeta.textContent = `Показано: ${items.length} из ${total}`;

}


async function main(){

try{

const raw = await loadData();

const items = raw.items || [];

render(items,items.length);

}catch(e){

console.error(e);

if(elGrid){

elGrid.innerHTML = `
<div class="card" style="padding:16px">
<div style="font-weight:700;margin-bottom:6px">
Каталог временно недоступен
</div>
<div class="muted">${escapeHtml(e?.message)}</div>
</div>
`;

}

}

}

main();

})();