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

if(!grid) return

grid.innerHTML = filteredProducts.map(p => `

<div class="catalog-card">

<div class="card-header">
<div class="card-type">${p.type || ""}</div>
</div>

<div class="card-title">
${p.name_ru || ""}
</div>

<div class="card-meta">

<span class="card-color">${p.color || ""}</span>
<span class="card-style">${p.style || ""}</span>

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


function filterCategory(category){

if(category === "all"){

filteredProducts = products

}

/* ВИНО */

else if(category === "wine"){

filteredProducts = products.filter(p =>
(p.type || "").toLowerCase().includes("вино")
)

}

/* ИГРИСТОЕ */

else if(category === "sparkling"){

filteredProducts = products.filter(p =>
(p.type || "").toLowerCase().includes("игрист")
)

}

/* КРЕПКИЙ АЛКОГОЛЬ */

else if(category === "strong"){

const strongTypes = [
"коньяк",
"виски",
"ром",
"водка",
"текила",
"джин",
"бренди",
"ликер",
"настойка",
"граппа",
"арманьяк",
"кальвадос"
]

filteredProducts = products.filter(p => {

const t = (p.type || "").toLowerCase()

return strongTypes.some(type => t.includes(type))

})

}

/* ПИВО */

else if(category === "beer"){

const beerTypes = [
"пиво",
"lager",
"ale",
"stout",
"porter"
]

filteredProducts = products.filter(p => {

const t = (p.type || "").toLowerCase()

return beerTypes.some(type => t.includes(type))

})

}

/* БЕЗАЛКОГОЛЬНЫЕ */

else if(category === "soft"){

const softTypes = [
"вода",
"сок",
"лимонад",
"тоник",
"cola",
"напиток"
]

filteredProducts = products.filter(p => {

const t = (p.type || "").toLowerCase()

return softTypes.some(type => t.includes(type))

})

}

/* БАКАЛЕЯ */

else if(category === "grocery"){

const groceryTypes = [
"сыр",
"оливки",
"чипсы",
"сорбиодетокс",
"мясная",
"ветчина",
"бакалея"
]

filteredProducts = products.filter(p => {

const t = (p.type || "").toLowerCase()

return groceryTypes.some(type => t.includes(type))

})

}

/* ЧАЙ */

else if(category === "tea"){

filteredProducts = products.filter(p =>
(p.type || "").toLowerCase().includes("чай")
)

}

renderCatalog()

}


/* КНОПКИ КАТЕГОРИЙ */

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