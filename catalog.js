document.addEventListener("DOMContentLoaded", () => {

let products = []
let filtered = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")

async function loadCatalog(){

try{

const res = await fetch("/data/products.json")
const data = await res.json()

products = Array.isArray(data) ? data : data.products || []

filtered = products

renderCatalog()

}catch(e){

console.error("Ошибка загрузки каталога", e)

}

}


function renderCatalog(){

if(!grid) return

grid.innerHTML = filtered.map(p => {

return `

<a href="product.html?id=${p.id}" class="catalog-card">

<div class="catalog-card-image">

<img src="${p.image || "/assets/no-photo.png"}">

</div>

<div class="catalog-card-body">

<div class="catalog-card-category">
${p.category || ""}
</div>

<div class="catalog-card-title">
${p.name_ru || ""}
</div>

<div class="catalog-card-sub">
${p.name_en || ""}
</div>

<div class="catalog-card-price">
${p.price ? p.price + " ₽" : ""}
</div>

<div class="catalog-card-button">
Подробнее
</div>

</div>

</a>

`

}).join("")

}



function searchProducts(){

const value = searchInput.value.toLowerCase()

filtered = products.filter(p => {

return (

p.name_ru?.toLowerCase().includes(value) ||
p.name_en?.toLowerCase().includes(value)

)

})

renderCatalog()

}



function categoryFilter(category){

if(category === "all"){
filtered = products
}else{
filtered = products.filter(p => p.category === category)
}

renderCatalog()

}



function applyFilters(){

const color = document.getElementById("filter-color")?.value
const style = document.getElementById("filter-style")?.value
const country = document.getElementById("filter-country")?.value

filtered = products.filter(p => {

return (

(!color || p.color === color) &&
(!style || p.style === style) &&
(!country || p.country === country)

)

})

renderCatalog()

}



function initFilters(){

document.querySelectorAll("[data-filter]").forEach(btn => {

btn.addEventListener("click", () => {

categoryFilter(btn.dataset.filter)

})

})

document.getElementById("filter-color")?.addEventListener("change", applyFilters)
document.getElementById("filter-style")?.addEventListener("change", applyFilters)
document.getElementById("filter-country")?.addEventListener("change", applyFilters)

if(searchInput){
searchInput.addEventListener("input", searchProducts)
}

}



initFilters()
loadCatalog()

})