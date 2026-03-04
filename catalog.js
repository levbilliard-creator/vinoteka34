(() => {

const $ = (id) => document.getElementById(id);

const elTitle = $("pageTitle");
const elMeta = $("meta");
const elGrid = $("grid");

/* ---------------- GROUPS ---------------- */

const GROUPS = {
all:{title:"Каталог"},
wine:{title:"Вино"},
spirits:{title:"Крепкие напитки"},
};

/* ---------------- HELPERS ---------------- */

function norm(v){
return (v||"").toString().toLowerCase().trim();
}

function removeWineWord(text){
if(!text) return "";
return text.replace(/^\s*вино\s+/i,"").trim();
}

function escapeHtml(s){
return String(s??"")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");
}

function formatPrice(v){

const n=Number(v);

if(!Number.isFinite(n)) return "";

return new Intl.NumberFormat("ru-RU").format(n)+" ₽";

}

/* ---------------- GROUP DETECTION ---------------- */

function inferGroup(p){

const cat=norm(p.category);

if(cat.includes("вино")||cat.includes("игрист"))
return "wine";

const spirits=["водк","виск","конья","бренд","ром","джин","текил"];

if(spirits.some(k=>cat.includes(k)))
return "spirits";

return "all";

}

/* ---------------- WINE TRAITS ---------------- */

function inferColor(p){

const c=(p.color||"").trim();
if(c) return c;

const t=norm(p.title);

if(t.includes("бел")) return "Белое";
if(t.includes("красн")) return "Красное";
if(t.includes("роз")) return "Розовое";
if(t.includes("игрист")) return "Игристое";

return "";
}

function inferSweetness(p){

const t=norm(p.title+" "+p.full_name);

if(t.includes("брют")) return "Брют";
if(t.includes("экстра драй")) return "Экстра драй";
if(t.includes("полусух")) return "Полусухое";
if(t.includes("полуслад")) return "Полусладкое";
if(t.includes("сух")) return "Сухое";
if(t.includes("sweet")) return "Сладкое";

return "";

}

function getWineTraits(p){

const traits=[];

const color=inferColor(p);
if(color) traits.push(color);

const sweet=inferSweetness(p);
if(sweet) traits.push(sweet);

return traits;

}

/* ---------------- CARD ---------------- */

function buildCard(item){

const href=`/product.html?id=${item.id}`;

const ruTitle=removeWineWord(item.title);

const price=formatPrice(item.price_rub);

const region=[item.region,item.country].filter(Boolean).join(" • ");

const stock=item.stock!=null
?`Наличие: ${item.stock}`
:"";

const traits=getWineTraits(item);

const traitsHtml=traits.length
?`<div class="pill-row">${traits.map(t=>`<span class="pill">${t}</span>`).join("")}</div>`
:"";

return `

<article class="card product">

<div class="prod-head">

<div class="prod-title-wrap">

<a class="prod-title" href="${href}">
${escapeHtml(ruTitle)}
</a>

${region?`<div class="muted small">${escapeHtml(region)}</div>`:""}

${stock?`<div class="muted small">${stock}</div>`:""}

</div>

<div class="prod-right">

<div class="prod-price">${price}</div>

<div class="prod-price-note">Цена на сайте</div>

<a class="btn btn-open" href="${href}">
Открыть
</a>

</div>

</div>

<div class="prod-foot">

${traitsHtml}

</div>

</article>

`;

}

/* ---------------- DATA ---------------- */

async function loadData(){

const res=await fetch("/data/products.json?v="+Date.now(),{cache:"no-store"});

if(!res.ok)
throw new Error("Ошибка загрузки каталога");

return res.json();

}

/* ---------------- RENDER ---------------- */

function render(items,total){

if(!elGrid) return;

elGrid.innerHTML=items.map(buildCard).join("");

if(elMeta)
elMeta.textContent=`Показано: ${items.length} из ${total}`;

}

/* ---------------- MAIN ---------------- */

async function main(){

try{

const raw=await loadData();

let items=(raw && raw.items)?raw.items:[];

/* GROUP FILTER */

const params=new URLSearchParams(location.search);
const group=params.get("group");

if(group){

items=items.filter(p=>inferGroup(p)===group);

}

/* TITLE */

if(group && GROUPS[group])
document.title="ВИНОТЕКА — "+GROUPS[group].title;

/* RENDER */

render(items,items.length);

}catch(e){

console.error(e);

elGrid.innerHTML=`

<div class="card" style="padding:20px">

<b>Каталог временно недоступен</b>

<div>${escapeHtml(e.message)}</div>

</div>

`;

}

}

main();

})();