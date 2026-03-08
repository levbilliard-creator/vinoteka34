async function loadProduct(){

const params = new URLSearchParams(window.location.search);

const id = parseInt(params.get("id"));

const res = await fetch("data/products.json");

const products = await res.json();

const product = products.find(p => p.id === id);

document.getElementById("productTitle").innerText =
cleanName(product.name);

document.getElementById("productMeta").innerText =
product.type || "";

document.getElementById("productPrice").innerText =
product.price + " ₽";

document.getElementById("productDesc").innerText =
product.description || "";

renderSimilar(products, product);

}

function renderSimilar(products, product){

const grid = document.getElementById("similarGrid");

const similar = products
.filter(p => p.type === product.type && p.id !== product.id)
.slice(0,4);

similar.forEach(p => {

const card = document.createElement("div");

card.className = "catalog-card";

card.innerHTML = `

<div class="catalog-title">
${cleanName(p.name)}
</div>

<div class="catalog-price">
${p.price} ₽
</div>

<button class="catalog-btn">
Открыть
</button>

`;

card.querySelector("button").onclick = () => {

window.location.href = "/product.html?id=" + p.id;

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

loadProduct();