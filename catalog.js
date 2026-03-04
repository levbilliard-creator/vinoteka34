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


async function loadCatalog(){

const response = await fetch("products.json");
const data = await response.json();

let items = data.items;

const grid = document.getElementById("catalog");

grid.innerHTML="";


const params = new URLSearchParams(window.location.search);
const group = params.get("group");


if(group){

items = items.filter(item => {

if(group==="wine") return item.category==="Вино";

if(group==="sparkling") return item.category==="Игристое";

if(group==="spirits") return item.category==="Крепкий алкоголь";

return true;

});

}


items.forEach(item=>{

const card=document.createElement("div");
card.className="card";


const titleRU = cleanWineTitle(item.title_ru || item.title || "");
const titleEN = item.title_en || "";


let tags="";

if(item.color)
tags+=`<span class="tag">${item.color}</span>`;

if(item.category==="Игристое")
tags+=`<span class="tag">Игристое</span>`;


card.innerHTML=`

<div class="title-en">
${titleEN}
</div>

<div class="title-ru">
${titleRU}
</div>

<div class="meta">
${item.country ?? ""} ${item.region ? "• "+item.region : ""}
</div>

<div class="bottom">

<div class="price">
${Number(item.price_rub).toLocaleString()} ₽
</div>

<button class="open-btn">
Открыть
</button>

</div>

<div class="tags">
${tags}
</div>

`;

grid.appendChild(card);

});

}

loadCatalog();