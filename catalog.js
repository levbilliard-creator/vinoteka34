async function loadCatalog(){

try{

const res = await fetch("products.json");
const data = await res.json();

const grid = document.getElementById("catalog");

if(!grid){
console.error("catalog container not found");
return;
}

let items = data.items || data;

grid.innerHTML="";

items.forEach(item=>{

const card=document.createElement("div");
card.className="card";

const titleEN=item.title_en || "";
const titleRU=item.title_ru || item.title || "";

const country=item.country || "";
const region=item.region || "";

const meta=[country,region].filter(Boolean).join(" • ");

const price=item.price_rub
? Number(item.price_rub).toLocaleString("ru-RU")+" ₽"
: "";

let tags="";

if(item.color)
tags+=`<span class="tag">${item.color}</span>`;

if(item.category==="Игристое")
tags+=`<span class="tag">Игристое</span>`;

card.innerHTML=`

<div class="title-en">${titleEN}</div>

<div class="title-ru">${titleRU}</div>

<div class="meta">${meta}</div>

<div class="price">${price}</div>

<div>${tags}</div>

`;

grid.appendChild(card);

});

}

catch(e){

console.error("catalog load error",e);

document.getElementById("catalog").innerHTML=
"<p>Ошибка загрузки каталога</p>";

}

}

document.addEventListener("DOMContentLoaded",loadCatalog);