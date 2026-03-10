let products = [];

async function loadCatalog(){

const response = await fetch("data/products.json");
products = await response.json();

renderCatalog(products);

}

function cleanWineName(name){

if(!name) return "";

let cleaned = name.toLowerCase();

cleaned = cleaned
.replace(/вино/g,"")
.replace(/столовое/g,"")
.replace(/сортовое/g,"")
.replace(/марочное/g,"")
.replace(/натуральное/g,"")
.replace(/ординарное/g,"")
.replace(/сухое/g,"")
.replace(/полусухое/g,"")
.replace(/полусладкое/g,"")
.replace(/сладкое/g,"")
.replace(/красное/g,"")
.replace(/белое/g,"")
.replace(/розовое/g,"")
.replace(/игристое/g,"");

cleaned = cleaned.replace(/\s+/g," ").trim();

cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

return cleaned;

}

function renderCatalog(list){

const container = document.getElementById("catalog-grid");
container.innerHTML = "";

list.forEach(product => {

const id = product.id;
const name = cleanWineName(product.name);
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