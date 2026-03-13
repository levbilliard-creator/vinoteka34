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

categoryList.innerHTML = "";

const cats = [
"all",
"вино",
"игристое",
"коньяк",
"виски",
"ром",
"бакалея",
"чай"
];

cats.forEach(cat => {

const el = document.createElement("div");
el.className = "category-item";

el.textContent = cat === "all" ? "Все" : cat;

el.onclick = () => {

currentCategory = cat;
filterProducts();

};

categoryList.appendChild(el);

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
<img src="/assets/wine.jpg">
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
<button class="btn">Подробнее</button>
</a>

`;

grid.appendChild(card);

});

}

});