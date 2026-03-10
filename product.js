let products = [];

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

cleaned =
cleaned.charAt(0).toUpperCase() +
cleaned.slice(1);

return cleaned;

}

function getId(){

const params =
new URLSearchParams(window.location.search);

return parseInt(params.get("id"));

}

async function loadProduct(){

const response =
await fetch("data/products.json");

products = await response.json();

const id = getId();

const product =
products.find(p => p.id === id);

renderProduct(product);

renderSimilar(product);

}

function renderProduct(product){

const title =
document.querySelector(".product-title");

const type =
document.querySelector(".product-type");

const price =
document.querySelector(".product-price");

title.textContent =
cleanWineName(product.name);

type.textContent =
product.type;

price.textContent =
product.price + " ₽";

}

function renderSimilar(product){

const container =
document.querySelector(".similar-grid");

if(!container) return;

const similar =
products
.filter(p =>
p.category === product.category &&
p.id !== product.id
)
.slice(0,4);

container.innerHTML = "";

similar.forEach(wine => {

const card =
document.createElement("div");

card.className =
"product-card";

card.innerHTML = `

<div class="product-type">
${wine.type}
</div>

<div class="product-name">
${cleanWineName(wine.name)}
</div>

<div class="product-price">
${wine.price} ₽
</div>

<a href="product.html?id=${wine.id}" class="product-btn">
Открыть
</a>

`;

container.appendChild(card);

});

}

loadProduct();