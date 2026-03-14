document.addEventListener("DOMContentLoaded", function () {

let products = []
let filteredProducts = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")

async function loadCatalog(){

try{

const response = await fetch("/data/products.json")
const data = await response.json()

products = data
filteredProducts = products

renderCatalog()

}catch(error){

console.error("Ошибка загрузки каталога", error)

}

}

function renderCatalog(){

grid.innerHTML = filteredProducts.map(p => `

<div class="catalog-card">

<div class="card-header">
<div class="card-type">${p.type || ""}</div>
</div>

<div class="card-title">
${p.name_ru || ""}
</div>

<div class="card-meta">
<span>${p.color || ""}</span>
<span>${p.style || ""}</span>
</div>

<div class="card-bottom">

<div class="card-price">
${p.price ? p.price + " ₽" : ""}
</div>

<a class="card-button" href="product.html?id=${p.id}">
Подробнее
</a>

</div>

</div>

`).join("")

}

function searchProducts(){

const value = searchInput.value.toLowerCase()

filteredProducts = products.filter(product =>

(product.name_ru || "").toLowerCase().includes(value) ||
(product.name_en || "").toLowerCase().includes(value)

)

renderCatalog()

}


/* универсальная проверка */

function detectCategory(product){

const name = (product.name_ru || "").toLowerCase()
const type = (product.type || "").toLowerCase()

const text = name + " " + type


if(text.includes("игрист") || text.includes("шампан")) return "sparkling"

if(text.includes("вино")) return "wine"

if(
text.includes("коньяк") ||
text.includes("виски") ||
text.includes("ром") ||
text.includes("водка") ||
text.includes("текила") ||
text.includes("джин") ||
text.includes("бренди") ||
text.includes("ликер") ||
text.includes("настойка") ||
text.includes("граппа") ||
text.includes("арманьяк") ||
text.includes("кальвадос")
) return "strong"

if(text.includes("пиво")) return "beer"

if(
text.includes("вода") ||
text.includes("сок") ||
text.includes("лимонад") ||
text.includes("cola") ||
text.includes("кола") ||
text.includes("тоник") ||
text.includes("напиток")
) return "soft"

if(
text.includes("сыр") ||
text.includes("оливки") ||
text.includes("чипсы") ||
text.includes("сорбиодетокс") ||
text.includes("ветчина") ||
text.includes("мясная")
) return "grocery"

if(text.includes("чай")) return "tea"

return "other"

}


function filterCategory(category){

if(category === "all"){

filteredProducts = products

}else{

filteredProducts = products.filter(p => detectCategory(p) === category)

}

renderCatalog()

}


function initCategoryButtons(){

const buttons = document.querySelectorAll("[data-filter]")

buttons.forEach(button => {

button.addEventListener("click", () => {

buttons.forEach(b => b.classList.remove("active"))
button.classList.add("active")

const filter = button.dataset.filter
filterCategory(filter)

})

})

}


if(searchInput){
searchInput.addEventListener("input", searchProducts)
}

initCategoryButtons()
loadCatalog()

})