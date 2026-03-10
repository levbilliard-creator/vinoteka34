let products = [];

async function loadCatalog(){

const response = await fetch("data/products.json");
products = await response.json();

renderCatalog(products);

}

function cleanWineName(name){

if(!name) return "";

return name
.replace(/\b(вино|столовое|сортовое|марочное|натуральное|ординарное)\b/gi,"")
.replace(/\b(сухое|полусухое|полусладкое|сладкое)\b/gi,"")
.replace(/\b(красное|белое|розовое|игристое)\b/gi,"")
.replace(/\s+/g," ")
.trim();

}

function renderCatalog(list){

const container = document.getElementById("catalog-grid");
container.innerHTML = "";

list.forEach(product => {

const id = product.id;

const rawName = product.name || "";
const name = cleanWineName(rawName);

const type = product.type || "";
const price = product.price || "";

const card = document.createElement("div");

card.className = "product-card";

card.innerHTML = `

<div class="product-type">
${type}
</div>

<div class="product-name">
${name}
</div>

<div class="product-price">
${price} ₽
</div>

<a href="product.html?id=${id}" class="product-btn">
Подробнее
</a>

`;

container.appendChild(card);

});

}

function searchProducts(){

const text =
document.getElementById("search")
.value
.toLowerCase();

const filtered = products.filter(p =>

(p.name || "")
.toLowerCase()
.includes(text)

);

renderCatalog(filtered);

}

document
.getElementById("search")
.addEventListener("input", searchProducts);

loadCatalog();