document.addEventListener("DOMContentLoaded", function () {

let products = []
let filteredProducts = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")


/* загрузка каталога */

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


/* карточки */

function renderCatalog(){

grid.innerHTML = filteredProducts.map(p => `

<div class="catalog-card">

<div class="card-type">
${getTypeLabel(p)}
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


/* определение типа для карточки */

function getTypeLabel(product){

const name = (product.name_ru || "").toLowerCase()
const type = (product.type || "").toLowerCase()

if(type) return type

if(name.includes("пиво")) return "пиво"

if(
name.includes("вода") ||
name.includes("сок") ||
name.includes("лимонад") ||
name.includes("cola") ||
name.includes("кола")
) return "безалкогольный напиток"

return ""

}


/* поиск */

function searchProducts(){

const value = searchInput.value.toLowerCase()

filteredProducts = products.filter(product =>

(product.name_ru || "").toLowerCase().includes(value) ||
(product.name_en || "").toLowerCase().includes(value)

)

renderCatalog()

}


/* фильтр категорий */

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
(p.name_ru || "").toLowerCase().includes("игрист")
)

}


/* КРЕПКИЙ АЛКОГОЛЬ */

else if(category === "strong"){

filteredProducts = products.filter(p =>{

const t = (p.type || "").toLowerCase()
const name = (p.name_ru || "").toLowerCase()

return (
t.includes("коньяк") ||
t.includes("виски") ||
t.includes("ром") ||
t.includes("водка") ||
t.includes("текила") ||
t.includes("джин") ||
name.includes("спирт")
)

})

}


/* ПИВО */

else if(category === "beer"){

filteredProducts = products.filter(p =>
(p.name_ru || "").toLowerCase().includes("пиво")
)

}


/* БЕЗАЛКОГОЛЬНЫЕ */

else if(category === "soft"){

filteredProducts = products.filter(p =>{

const name = (p.name_ru || "").toLowerCase()

return (
name.includes("вода") ||
name.includes("сок") ||
name.includes("лимонад") ||
name.includes("cola") ||
name.includes("кола")
)

})

}


/* БАКАЛЕЯ */

else if(category === "grocery"){

filteredProducts = products.filter(p =>{

const name = (p.name_ru || "").toLowerCase()

return (
name.includes("сыр") ||
name.includes("оливки") ||
name.includes("чипсы") ||
name.includes("печенье") ||
name.includes("ветчина") ||
name.includes("нарезка")
)

})

}


/* ЧАЙ */

else if(category === "tea"){

filteredProducts = products.filter(p =>
(p.name_ru || "").toLowerCase().includes("чай")
)

}

renderCatalog()

}


/* кнопки категорий */

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