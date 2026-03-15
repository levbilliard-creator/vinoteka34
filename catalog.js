document.addEventListener("DOMContentLoaded", function () {

let products = []
let filteredProducts = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")


/* загрузка каталога */

async function loadCatalog(){

const response = await fetch("/data/products.json")
const data = await response.json()

products = data
filteredProducts = data

renderCatalog()

}


/* очистка названия */

function cleanName(name){

if(!name) return ""

return name
.replace("Спиртной напиток прочий -", "")
.replace("Спиртной напиток", "")
.replace("Ароматизированный градосодержащий напиток из градного сырья", "")
.trim()

}


/* определение категории */

function detectCategory(product){

const name = (product.name_ru || "").toLowerCase()
const type = (product.type || "").toLowerCase()
const color = (product.color || "").toLowerCase()
const style = (product.style || "").toLowerCase()

/* БЕЗАЛКОГОЛЬНЫЕ */

if(
name.includes("вода") ||
name.includes("сок") ||
name.includes("cola") ||
name.includes("кола") ||
name.includes("лимонад")
){
return "soft"
}


/* ПИВО */

if(
name.includes("пиво") ||
name.includes("пивной напиток") ||
name.includes("на основе пива")
){
return "beer"
}


/* БАКАЛЕЯ */

if(
name.includes("печенье") ||
name.includes("сыр") ||
name.includes("оливки") ||
name.includes("чипсы") ||
name.includes("ветчина")
){
return "grocery"
}


/* ЧАЙ */

if(name.includes("чай")){
return "tea"
}


/* ИГРИСТОЕ */

if(name.includes("игрист") || name.includes("шампан")){
return "sparkling"
}


/* КРЕПКИЙ АЛКОГОЛЬ */

if(
type.includes("коньяк") ||
type.includes("виски") ||
type.includes("ром") ||
type.includes("водка") ||
type.includes("текила") ||
type.includes("джин") ||
name.includes("вермут") ||
name.includes("ром") ||
name.includes("виски") ||
name.includes("водка") ||
name.includes("текила")
){
return "strong"
}


/* ВИНО (даже если слово "вино" не написано) */

if(
type.includes("вино") ||
color !== "" ||
style !== "" ||
name.includes("рислинг") ||
name.includes("совиньон") ||
name.includes("шардоне") ||
name.includes("пино") ||
name.includes("мерло")
){
return "wine"
}

return "other"

}


/* карточки */

function renderCatalog(){

grid.innerHTML = filteredProducts.map(p => {

const category = detectCategory(p)
const name = cleanName(p.name_ru)

return `

<div class="catalog-card">

<div class="card-type">
${category.toUpperCase()}
</div>

<div class="card-title">
${name}
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

`

}).join("")

}


/* поиск */

function searchProducts(){

const value = searchInput.value.toLowerCase()

filteredProducts = products.filter(p =>

(p.name_ru || "").toLowerCase().includes(value) ||
(p.name_en || "").toLowerCase().includes(value)

)

renderCatalog()

}


/* фильтр */

function filterCategory(category){

if(category === "all"){
filteredProducts = products
}
else{
filteredProducts = products.filter(p => detectCategory(p) === category)
}

renderCatalog()

}


/* кнопки */

function initCategoryButtons(){

const buttons = document.querySelectorAll("[data-filter]")

buttons.forEach(btn => {

btn.addEventListener("click", () => {

buttons.forEach(b => b.classList.remove("active"))

btn.classList.add("active")

filterCategory(btn.dataset.filter)

})

})

}


if(searchInput){
searchInput.addEventListener("input", searchProducts)
}

initCategoryButtons()
loadCatalog()

})