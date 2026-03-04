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


function titleEN(p){
const src = (p && p.title_en) ? String(p.title_en).trim() : "";
if(src) return cleanWineTitle(src);

const ru = p && p.title ? p.title : "";
return cleanWineTitle(ru);
}


function titleRU(p){
if(!p || !p.title) return "";
return cleanWineTitle(p.title);
}


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

<div class="card-price">
${p.price ?? ""} ₽
</div>

<button class="card-open">
Открыть
</button>

`;

return card;

}


async function loadProducts(){

const res = await fetch("data/products.json");
const data = await res.json();

return data;

}


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