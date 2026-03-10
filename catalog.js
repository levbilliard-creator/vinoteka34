let allProducts = [];

async function loadCatalog(){

const response = await fetch("data/products.json");

const products = await response.json();

allProducts = products;

renderCatalog(products);

}

function renderCatalog(products){

const container = document.getElementById("catalog");

container.innerHTML = "";

products.forEach(product => {

const nameEn = product.name_en || "";
const nameRu = product.name_ru || product.name || "";

const category = product.category || "";

const color = product.color || "";

const sugar = product.sugar || "";

const price = product.price || "";

const telegramText = encodeURIComponent(
`Здравствуйте! Хочу заказать ${nameRu}`
);

const telegramLink =
`https://t.me/vinotekakaram?text=${telegramText}`;

const card = document.createElement("div");

card.className = "wine-card";

card.innerHTML = `

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

<div class="wine-price">
${price} ₽
</div>

<a
class="wine-open"
href="${telegramLink}"
target="_blank"
>
Заказать
</a>

`;

container.appendChild(card);

});

}

function searchProducts(){

const input =
document.getElementById("searchInput")
.value
.toLowerCase();

const filtered = allProducts.filter(product => {

const name =
(product.name_ru || product.name || "")
.toLowerCase();

return name.includes(input);

});

renderCatalog(filtered);

}

document
.getElementById("searchInput")
.addEventListener("keyup", searchProducts);

loadCatalog();