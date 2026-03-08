async function loadCatalog(){

const res = await fetch("data/products.json");

const products = await res.json();

const grid = document.getElementById("catalogGrid");

grid.innerHTML="";

products.forEach(p=>{

const card=document.createElement("div");

card.className="catalog-card";

card.innerHTML=`

<div class="catalog-type">
${p.type || ""}
</div>

<div class="catalog-title">
${cleanName(p.name)}
</div>

<div class="catalog-price">
${p.price ? p.price+" ₽":""}
</div>

<button class="catalog-btn">
Открыть
</button>

`;

card.querySelector("button").onclick=()=>{

window.location.href="/product.html?id="+p.id;

};

grid.appendChild(card);

});

}

function cleanName(name){

return name

.replace(/Вино\s*/i,"")

.replace(/сортовое\s*/gi,"")
.replace(/марочное\s*/gi,"")
.replace(/столовое\s*/gi,"")

.replace(/красное|белое|розовое/gi,"")

.replace(/сухое|полусухое|полусладкое|сладкое/gi,"")

.replace(/\s+/g," ")

.trim();

}

loadCatalog();