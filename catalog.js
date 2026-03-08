async function loadCatalog(){

const res = await fetch("data/products.json");

const products = await res.json();

const grid = document.getElementById("catalogGrid");

grid.innerHTML = "";

products.forEach(product => {

const card = document.createElement("div");

card.className = "catalog-card";

card.innerHTML = `

<div class="catalog-type">${product.type || ""}</div>

<div class="catalog-title">
${cleanName(product.name)}
</div>

<div class="catalog-price">
${product.price ? product.price + " ₽" : ""}
</div>

<button class="catalog-btn">
Открыть
</button>

`;

card.querySelector("button").onclick = () => {

window.location.href = "/product.html?id=" + product.id;

};

grid.appendChild(card);

});

}

function cleanName(name){

return name
.replace(/Вино\s*/i,"")
.replace(/красное|белое|розовое/gi,"")
.replace(/сухое|полусухое|полусладкое|сладкое/gi,"")
.replace(/\s+/g," ")
.trim();

}

loadCatalog();