async function loadCatalog(){

try{

const res = await fetch("/data/products.json");
const data = await res.json();

const items = data.items || data;

const grid = document.getElementById("catalog");

if(!grid){
console.error("catalog container not found");
return;
}

grid.innerHTML="";

const urlParams = new URLSearchParams(window.location.search);
const group = urlParams.get("group");

let filtered = items;

if(group){

if(group==="wine"){
filtered = items.filter(i=>i.category==="Вино");
}

if(group==="sparkling"){
filtered = items.filter(i=>i.category==="Игристое");
}

if(group==="spirits"){
filtered = items.filter(i=>
i.category==="Виски" ||
i.category==="Ром" ||
i.category==="Джин" ||
i.category==="Текила" ||
i.category==="Коньяк/Бренди"
);
}

}

filtered.forEach(item=>{

const card=document.createElement("div");
card.className="card";

const title=item.title || "";

const country=item.country || "";
const region=item.region || "";

const meta=[country,region].filter(Boolean).join(" • ");

let price="";

if(item.price_rub){
price=Number(item.price_rub).toLocaleString("ru-RU")+" ₽";
}

let colorTag="";

if(item.color){
colorTag=`<span class="tag">${item.color}</span>`;
}

card.innerHTML=`

<h3>${title}</h3>

<div class="meta">${meta}</div>

<div class="price">${price}</div>

<div class="tags">
${colorTag}
</div>

`;

grid.appendChild(card);

});

}catch(e){

console.error(e);

const grid = document.getElementById("catalog");

if(grid){
grid.innerHTML="<p>Ошибка загрузки каталога</p>";
}

}

}

document.addEventListener("DOMContentLoaded",loadCatalog);