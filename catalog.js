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


// Group mapping
const GROUPS = {
all: { title: "Каталог" },
wine: { title: "Вино" },
spirits: { title: "Крепкие напитки" },
nonalc: { title: "Безалкогольные напитки" },
snacks: { title: "Закуски" },
tea: { title: "Чай" },
glass: { title: "Стекло и аксессуары" },
};


// TRANSLIT
function toLatin(str){
if(!str) return "";
const map = {
'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y',
'К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F',
'Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Shch','Ы':'Y','Э':'E','Ю':'Yu','Я':'Ya',
'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y',
'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
'х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ы':'y','э':'e','ю':'yu','я':'ya'
};

return String(str)
.split("")
.map(ch => map[ch] ?? ch)
.join("")
.replace(/\s+/g," ")
.trim();
}


// ОЧИСТКА НАЗВАНИЯ
function cleanWineTitle(str){
if(!str) return "";
return String(str)
.replace(/\bвино\b/ig,'')
.replace(/\bкрасное\b/ig,'')
.replace(/\bбелое\b/ig,'')
.replace(/\bсухое\b/ig,'')
.replace(/\bполусухое\b/ig,'')
.replace(/\bполусладкое\b/ig,'')
.replace(/\bсладкое\b/ig,'')
.replace(/\s+/g,' ')
.trim();
}


// АНГЛИЙСКОЕ НАЗВАНИЕ
function titleEN(p){
const src = (p && p.title_en) ? String(p.title_en).trim() : "";
if(src) return cleanWineTitle(src);

const ru = p && p.title ? p.title : "";
return cleanWineTitle(toLatin(ru));
}


// РУССКОЕ НАЗВАНИЕ
function titleRU(p){
if(!p || !p.title) return "";
return cleanWineTitle(p.title);
}


// СОЗДАНИЕ КАРТОЧКИ
function createCard(p){

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `

<div class="card-title-en">
${titleEN(p)}
</div>

<div class="card-title-ru">
${titleRU(p)}
</div>

<div class="card-stock">
Наличие: ${p.stock ?? ""}
</div>

`;

return card;
}


// ЗАГРУЗКА ДАННЫХ
async function loadProducts(){

const res = await fetch("data/products.json");
const data = await res.json();

return data;

}


// РЕНДЕР КАТАЛОГА
async function render(){

const products = await loadProducts();

elGrid.innerHTML = "";

products.forEach(p => {

const card = createCard(p);
elGrid.appendChild(card);

});

}


render();

})();