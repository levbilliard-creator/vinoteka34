document.addEventListener("DOMContentLoaded", function () {

let products = []
let filteredProducts = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")

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
.replace(/игристое/gi,"")
.replace(/напиток, изготавливаемый на основе пива/gi,"")
.replace(/напиток на основе пива/gi,"")
.replace(/ароматизированный градосодержащий напиток из градного сырья/gi,"")
.replace(/спиртной напиток/gi,"")
.replace(/пивной напиток/gi,"")
.replace(/\s+/g," ")
.trim()

}


/* определение категории */

function detectCategory(product){

const name = (product.name_ru || "").toLowerCase()
const type = (product.type || "").toLowerCase()
const color = (product.color || "").toLowerCase()
const style = (product.style || "").toLowerCase()

/* бакалея */

if(
name.includes("печенье") ||
name.includes("сыр") ||
name.includes("оливки") ||
name.includes("чипсы") ||
name.includes("ветчина")
){
return "grocery"
}

/* безалкогольные */

if(
name.includes("вода") ||
name.includes("сок") ||
name.includes("cola") ||
name.includes("кола") ||
name.includes("лимонад")
){
return "soft"
}

/* пиво */

if(
name.includes("пиво") ||
name.includes("пивной")
){
return "beer"
}

/* чай */

if(name.includes("чай")){
return "tea"
}

/* игристое */

if(name.includes("шампан") || name.includes("кава") || name.includes("просекко")){
return "sparkling"
}

/* крепкий алкоголь */

if(
name.includes("вермут") ||
name.includes("ром") ||
name.includes("виски") ||
name.includes("водка") ||
name.includes("текила") ||
name.includes("джин") ||
type.includes("коньяк")
){
return "strong"
}

/* вино */

if(
type.includes("вино") ||
color !== "" ||
style !== "" ||
name.includes("рислинг") ||
name.includes("совиньон") ||
name.includes("шардоне") ||
name.includes("мерло") ||
name.includes("пино")
){
return "wine"
}

return "other"

}


/* рекомендации для вина */

function winePairing(product){

const color = (product.color || "").toLowerCase()

if(color === "красное"){
return "к мясу и сырам"
}

if(color === "белое"){
return "к рыбе и морепродуктам"
}

if(color === "розе"){
return "к салатам и закускам"
}

return ""

}


/* карточки */

function renderCatalog(){

grid.innerHTML = filteredProducts.map(p => {

const category = detectCategory(p)
const name = cleanName(p.name_ru)

const pairing = category === "wine"
? `<div class="wine-pair">подают: ${winePairing(p)}</div>`
: ""

return `

<div class="catalog-card">

<div class="card-type">
${category.toUpperCase()}
</div>

<div class="card-image">
<img src="/img/product-placeholder.png">
</div>

<div class="card-title">
${name}
</div>

<div class="card-meta">
<span>${p.color || ""}</span>
<span>${p.style || ""}</span>
</div>

${pairing}

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
(p.name_ru || "").toLowerCase().includes(value)
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