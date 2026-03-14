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

grid.innerHTML = filtered.map(p => `

<div class="product-card">

<div class="product-image">
<img src="${p.image || "/assets/no-photo.png"}" alt="">
</div>

<div class="product-body">

<div class="product-title">
${p.name_ru || ""}
</div>

<div class="product-subtitle">
${p.name_en || ""}
</div>

<div class="product-price">
${p.price ? p.price + " ₽" : ""}
</div>

<a class="product-button" href="product.html?id=${p.id}">
Подробнее
</a>

</div>

</div>

`).join("")

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
filtered = products.filter(p => 
(p.category || "").toLowerCase().includes(category)
)
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