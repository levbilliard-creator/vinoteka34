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


const GROUPS = {
all:{title:"Каталог"},
wine:{title:"Вино"},
spirits:{title:"Крепкие напитки"},
nonalc:{title:"Безалкогольные напитки"},
snacks:{title:"Закуски"},
tea:{title:"Чаи"},
glass:{title:"Стекло и аксессуары"},
};


function removeWineWord(text){
if(!text) return "";
return text.replace(/^\s*вино\s+/i,"").trim();
}


function toLatin(str){
if(!str) return "";
const map={
'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya',
'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
};
return String(str).split("").map(ch=>map[ch]??ch).join("").replace(/\s+/g," ").trim();
}


function titleEN(p){
const src=(p&&p.title_en)?String(p.title_en).trim():"";
if(src) return removeWineWord(src);
return removeWineWord(toLatin(p&&p.title?p.title:""));
}


function normStr(v){
return(v||"").toString().trim().toLowerCase();
}


function inferGroup(p){

const cat=normStr(p.category);

if(cat.includes("вино")||cat.includes("игрист")) return "wine";

const spirits=["водк","виск","конья","бренд","ром","джин","текил","ликер"];

if(spirits.some(k=>cat.includes(k))) return "spirits";

return "all";
}


function inferColor(p){

const c=(p.color||"").toString().trim();
if(c) return c;

const name=normStr(p.title||"");

if(name.includes("бел")) return "Белое";
if(name.includes("красн")) return "Красное";
if(name.includes("роз")) return "Розовое";
if(name.includes("игрист")) return "Игристое";

return "";
}


function inferSweetness(item){

const t=((item.title||"")+" "+(item.ru||"")+" "+(item.en||"")).toLowerCase();

if(/брют|brut/.test(t)) return "Брют";
if(/экстра\s*драй|extra\s*dry/.test(t)) return "Экстра драй";
if(/полуслад/.test(t)) return "Полусладкое";
if(/полусух/.test(t)) return "Полусухое";
if(/сух/.test(t)) return "Сухое";
if(/sweet/.test(t)) return "Сладкое";

return "";
}


function getWineTraits(item){

const traits=[];

const color=inferColor(item);
if(color) traits.push(color);

const sweet=inferSweetness(item);
if(sweet) traits.push(sweet);

return traits;
}


function formatPrice(v){

const n=Number(v);
if(!Number.isFinite(n)) return "";

return new Intl.NumberFormat("ru-RU").format(n)+" ₽";
}


function escapeHtml(s){
return String(s??"")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");
}


function buildCard(item){

const href=`/product.html?id=${encodeURIComponent(item.id)}`;

const ruTitle=removeWineWord(item.ru||item.title||"");
const enTitle=removeWineWord((item.en||item.title_en||"").trim()||titleEN(item));

const titleHtml=ruTitle
?`${escapeHtml(enTitle)}<br><span class="card__en">${escapeHtml(ruTitle)}</span>`
:escapeHtml(enTitle);

const price=formatPrice(item.price_rub??item.price);

const regionLine=[item.region,item.country].filter(Boolean).join(" • ");

const stockLine=typeof item.stock==="number"
?`Наличие: ${item.stock}`
:"";

const traits=getWineTraits(item);

const traitsHtml=traits.length
?`<div class="pill-row">${traits.map(t=>`<span class="pill">${t}</span>`).join("")}</div>`
:"";


return`

<article class="card product">

<div class="prod-head">

<div class="prod-title-wrap">

<a class="prod-title" href="${href}">${titleHtml}</a>

${regionLine?`<div class="muted small">${escapeHtml(regionLine)}</div>`:""}

${stockLine?`<div class="muted small">${escapeHtml(stockLine)}</div>`:""}

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

const res=await fetch(`/data/products.json?v=${Date.now()}`,{cache:"no-store"});
if(!res.ok) throw new Error("Ошибка загрузки каталога");

return res.json();
}


function render(items,total){

if(!elGrid) return;

elGrid.innerHTML=items.map(buildCard).join("");

if(elMeta) elMeta.textContent=`Показано: ${items.length} из ${total}`;

}


async function main(){

try{

const raw=await loadData();

const items=(raw&&raw.items)?raw.items:[];

render(items,items.length);

}catch(e){

console.error(e);

if(elGrid){

elGrid.innerHTML=`

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