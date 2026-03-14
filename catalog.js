document.addEventListener("DOMContentLoaded", () => {

let products = []
let filteredProducts = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")

async function loadProducts(){

try{

const response = await fetch("/data/products.json")

if(!response.ok){
throw new Error("products.json не найден")
}

const data = await response.json()

products = Array.isArray(data) ? data : data.products || []

filteredProducts = products

renderCatalog()

}
catch(e){

console.error("Ошибка загрузки каталога", e)

}

}


function renderCatalog(){

if(!grid) return

grid.innerHTML = filteredProducts.map(product => {

return `

<div class="wine-card">

<img
class="wine-img"
src="${product.image || "assets/no-photo.png"}"
>

<div class="wine-type">
${product.category || ""}
</div>

<div class="wine-name">
${product.name_ru || ""}
</div>

<div class="wine-sub">
${product.name_en || ""}
</div>

<div class="wine-price">
${product.price ? product.price + " ₽" : ""}
</div>

<button class="wine-btn">
Подробнее
</button>

</div>

`

}).join("")

}


function applyFilters(){

const color = document.getElementById("filter-color")?.value
const style = document.getElementById("filter-style")?.value
const country = document.getElementById("filter-country")?.value

filteredProducts = products.filter(product => {

return (

(!color || product.color === color) &&
(!style || product.style === style) &&
(!country || product.country === country)

)

})

renderCatalog()

}


function searchProducts(){

const value = searchInput.value.toLowerCase()

filteredProducts = products.filter(product => {

return (

product.name_ru?.toLowerCase().includes(value) ||
product.name_en?.toLowerCase().includes(value)

)

})

renderCatalog()

}


function categoryFilter(category){

if(category === "all"){

filteredProducts = products

}else{

filteredProducts = products.filter(p => p.category === category)

}

renderCatalog()

}


function initFilters(){

document.querySelectorAll("[data-filter]").forEach(btn => {

btn.addEventListener("click", () => {

categoryFilter(btn.dataset.filter)

})

})

document
.getElementById("filter-color")
?.addEventListener("change", applyFilters)

document
.getElementById("filter-style")
?.addEventListener("change", applyFilters)

document
.getElementById("filter-country")
?.addEventListener("change", applyFilters)

if(searchInput){
searchInput.addEventListener("input", searchProducts)
}

}


initFilters()
loadProducts()

})