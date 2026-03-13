document.addEventListener("DOMContentLoaded", () => {

const grid = document.getElementById("catalog-grid");
const categoryList = document.getElementById("category-list");
const searchInput = document.querySelector(".search");

let products = [];
let currentCategory = "all";

fetch("/data/products.json")
.then(res => res.json())
.then(data => {

products = data;

renderCategories();
renderProducts(products);

});


function renderCategories(){

const categories = ["all"];

products.forEach(p => {

if(!categories.includes(p.type)){
categories.push(p.type);
}

});

categoryList.innerHTML = "";

categories.forEach(cat => {

const btn = document.createElement("div");
btn.className = "category-item";

btn.textContent = cat === "all"
? "Все"
: cat;

btn.onclick = () => {

currentCategory = cat;
filterProducts();

};

categoryList.appendChild(btn);

});

}


function filterProducts(){

let filtered = products;

if(currentCategory !== "all"){

filtered = filtered.filter(p => p.type === currentCategory);

}

const q = searchInput.value.toLowerCase();

if(q){

filtered = filtered.filter(p =>
(p.name_ru || "").toLowerCase().includes(q) ||
(p.name_en || "").toLowerCase().includes(q)
);

}

renderProducts(filtered);

}


searchInput.addEventListener("input", filterProducts);


function renderProducts(items){

grid.innerHTML = "";

items.forEach(p => {

const card = document.createElement("div");
card.className = "product-card";

card.innerHTML = `

<div class="card-image">
<img src="/assets/bottle.png">
</div>

<div class="product-type">${p.type}</div>

<div class="product-title">
${p.name_en ? `<b>${p.name_en}</b><br>` : ""}
${p.name_ru}
</div>

<div class="product-params">
${p.color || ""} ${p.style || ""}
</div>

<div class="product-price">
${p.price} ₽
</div>

<a href="/product.html?id=${p.id}">
<button class="btn">
Подробнее
</button>
</a>

`;

grid.appendChild(card);

});

}

});