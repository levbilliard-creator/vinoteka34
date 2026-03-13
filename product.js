const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

let products = [];

fetch("/data/products.json")
.then(r => r.json())
.then(data => {

products = data;

const product = products.find(p => p.id === productId);

renderProduct(product);
renderSimilar(product);

});


function renderProduct(p){

const container = document.getElementById("product-container");

container.innerHTML = `

<div class="product-layout">

<div class="product-image">
<img src="/assets/bottle.png">
</div>

<div class="product-info">

<div class="product-type">${p.type}</div>

<h1>${p.name_en || ""}</h1>

<h2>${p.name_ru}</h2>

<div class="product-params">
${p.color || ""} ${p.style || ""}
</div>

<div class="product-price">
${p.price} ₽
</div>

<button class="btn-buy">
Добавить в корзину
</button>

</div>

</div>

`;

}


function renderSimilar(p){

const similar = products
.filter(x => x.type === p.type && x.id !== p.id)
.slice(0,4);

const grid = document.getElementById("similar-products");

similar.forEach(item => {

const card = document.createElement("div");
card.className = "product-card";

card.innerHTML = `

<div class="product-type">${item.type}</div>

<div class="product-title">
${item.name_en || ""}
${item.name_ru}
</div>

<div class="product-price">
${item.price} ₽
</div>

<a href="/product.html?id=${item.id}">
<button class="btn">
Подробнее
</button>
</a>

`;

grid.appendChild(card);

});

}