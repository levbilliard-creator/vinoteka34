async function loadCatalog(){

const grid = document.getElementById("catalog");

if(!grid) return;

grid.innerHTML="Загрузка...";

try{

const res = await fetch("/data/products.json");
const data = await res.json();

const items = data.items || data;

grid.innerHTML="";

items.forEach(item=>{

const titleEN = item.title_en || "";
const titleRU = item.title_ru || item.title || "";

const country = item.country || "";
const region = item.region || "";

const meta=[country,region].filter(Boolean).join(" • ");

let price="";
if(item.price_rub){
price = Number(item.price_rub).toLocaleString("ru-RU")+" ₽";
}

let color="";
if(item.color){
color=item.color;
}

const card=document.createElement("div");
card.className="wine-card";

card.innerHTML=`

<a class="wine-link" href="/product.html?id=${item.id}">

<div class="wine-title-en">${titleEN}</div>

<div class="wine-title-ru">${titleRU}</div>

<div class="wine-meta">${meta}</div>

<div class="wine-bottom">

<div class="wine-price">${price}</div>

<div class="wine-color">${color}</div>

</div>

<div class="wine-open">
Открыть →
</div>

</a>

`;

grid.appendChild(card);

});

}catch(e){

grid.innerHTML="Ошибка загрузки каталога";
console.error(e);

}

}

document.addEventListener("DOMContentLoaded",loadCatalog);