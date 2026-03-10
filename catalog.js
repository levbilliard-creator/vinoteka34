let products = [];

async function loadCatalog() {

const response = await fetch("data/products.json");
products = await response.json();

renderCatalog(products);

}

function renderCatalog(list) {

const container = document.getElementById("catalog");

container.innerHTML = "";

list.forEach(product => {

const id = product.id || "";
const nameRu = product.name_ru || product.name || "";
const nameEn = product.name_en || "";
const image = product.image || "";
const category = product.category || "";
const color = product.color || "";
const sugar = product.sugar || "";

const card = document.createElement("div");

card.className = "wine-card";

card.innerHTML = `

<a href="product.html?id=${id}" class="card-link">

<div class="wine-img-wrap">
<img src="${image}" alt="${nameRu}">
</div>

<div class="wine-name-en">
${nameEn}
</div>

<div class="wine-name-ru">
${nameRu}
</div>

<div class="wine-type">
${category}
</div>

<div class="wine-char">
${color} ${sugar}
</div>

</a>

`;

container.appendChild(card);

});

}

loadCatalog();