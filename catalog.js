let products = [];

async function initCatalog() {

const response = await fetch("/data/products.json");
products = await response.json();

render(products);

}

function render(list) {

const grid = document.getElementById("catalogGrid");
grid.innerHTML = "";

list.forEach(p => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `

<div class="photo">
<img src="${p.image}" onerror="this.src='/assets/wine.jpg'">
</div>

<div class="info">
<div class="category">${p.category}</div>
<div class="title">${p.name}</div>
<div class="type">${p.type || ""}</div>
<div class="price">${p.price} ₽</div>

<button class="openBtn" data-id="${p.id}">
Открыть
</button>

</div>
`;

grid.appendChild(card);

});

activateButtons();

}

function activateButtons(){

const buttons = document.querySelectorAll(".openBtn");

buttons.forEach(btn => {

btn.addEventListener("click", function(){

const id = this.dataset.id;

window.location.href = "/product.html?id=" + id;

});

});

}

document.addEventListener("DOMContentLoaded", () => {

initCatalog();

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", function(){

const value = this.value.toLowerCase();

const filtered = products.filter(p =>
p.name.toLowerCase().includes(value)
);

render(filtered);

});

const categorySelect = document.getElementById("category");

categorySelect.addEventListener("change", function(){

const value = this.value;

if(value === "all"){

render(products);
return;

}

const filtered = products.filter(p =>
p.category === value
);

render(filtered);

});

});
