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



function categoryFilter(category){

if(category === "all"){

filtered = products

}else{

filtered = products.filter(p => {

const cat = (p.category || "").toLowerCase()

return cat.includes(category)

})

}

renderCatalog()

}



function initFilters(){

document.querySelectorAll("[data-filter]").forEach(btn => {

btn.addEventListener("click", () => {

const cat = btn.dataset.filter

if(cat === "wine") categoryFilter("вино")
else if(cat === "sparkling") categoryFilter("игрист")
else if(cat === "strong") categoryFilter("креп")
else if(cat === "grocery") categoryFilter("бакале")
else if(cat === "tea") categoryFilter("чай")
else categoryFilter("all")

})

})

if(searchInput){
searchInput.addEventListener("input", searchProducts)
}

}



initFilters()
loadCatalog()

})