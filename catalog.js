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

grid.innerHTML = filtered.map(p => `

<div class="catalog-card">

<div class="catalog-card-title">
${p.name_ru || ""}
</div>

<div class="catalog-card-price">
${p.price ? p.price + " ₽" : ""}
</div>

<a class="catalog-card-link" href="product.html?id=${p.id}">
Подробнее
</a>

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



function categoryFilter(cat){

if(cat === "all"){

filtered = products

}else{

filtered = products.filter(p => {

const category = (p.category || "").toLowerCase()

return category.includes(cat)

})

}

renderCatalog()

}



function initFilters(){

document.querySelectorAll("[data-filter]").forEach(btn => {

btn.addEventListener("click", () => {

const f = btn.dataset.filter

if(f === "wine") categoryFilter("вино")
else if(f === "sparkling") categoryFilter("игрист")
else if(f === "strong") categoryFilter("креп")
else if(f === "grocery") categoryFilter("бакале")
else if(f === "tea") categoryFilter("чай")
else categoryFilter("all")

})

})

searchInput?.addEventListener("input", searchProducts)

}



initFilters()
loadCatalog()

})