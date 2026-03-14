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

function matchKeywords(product, keywords){

const name = (product.name_ru || "").toLowerCase()
const type = (product.type || "").toLowerCase()

return keywords.some(word =>
name.includes(word) || type.includes(word)
)

}

function filterCategory(category){

if(category === "all"){

filteredProducts = products

}

/* ВИНО */

else if(category === "wine"){

filteredProducts = products.filter(p =>
matchKeywords(p, ["вино"])
)

}

/* ИГРИСТОЕ */

else if(category === "sparkling"){

filteredProducts = products.filter(p =>
matchKeywords(p, ["игрист", "шампан"])
)

}

/* КРЕПКИЙ АЛКОГОЛЬ */

else if(category === "strong"){

filteredProducts = products.filter(p =>
matchKeywords(p, [
"коньяк","виски","ром","водка",
"текила","джин","бренди","ликер",
"настойка","граппа","арманьяк","кальвадос"
])
)

}

/* ПИВО */

else if(category === "beer"){

filteredProducts = products.filter(p =>
matchKeywords(p, [
"пиво"
])
)

}

/* БЕЗАЛКОГОЛЬНЫЕ НАПИТКИ */

else if(category === "soft"){

filteredProducts = products.filter(p =>
matchKeywords(p, [
"вода",
"сок",
"лимонад",
"кола",
"cola",
"тоник",
"напиток",
"безалкоголь"
])
)

}

/* БАКАЛЕЯ */

else if(category === "grocery"){

filteredProducts = products.filter(p =>
matchKeywords(p, [
"сыр",
"оливки",
"чипсы",
"сорбиодетокс",
"мясная",
"ветчина"
])
)

}

/* ЧАЙ */

else if(category === "tea"){

filteredProducts = products.filter(p =>
matchKeywords(p, ["чай"])
)

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