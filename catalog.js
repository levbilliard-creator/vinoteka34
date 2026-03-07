document.addEventListener("DOMContentLoaded", () => {

const grid = document.getElementById("catalog-grid")
const search = document.getElementById("search")
const select = document.getElementById("category")

let products = []

const params = new URLSearchParams(window.location.search)
const urlCategory = params.get("cat")

fetch("data/products.json")
.then(r => r.json())
.then(data => {

products = data

if(urlCategory){
select.value = urlCategory
render(filterCategory(products, urlCategory))
}else{
render(products)
}

})

function render(list){

grid.innerHTML = ""

list.forEach(p => {

const card = document.createElement("div")
card.className = "wine-card"

card.innerHTML = `

<img src="${p.image}">

<div class="wine-category">${p.category}</div>

<div class="wine-title">${p.name}</div>

<div class="wine-type">${p.type}</div>

<div class="wine-price">${p.price} ₽</div>

<a class="wine-btn" href="product.html?id=${p.id}">
Открыть
</a>

`

grid.appendChild(card)

})

}

function filterCategory(list,cat){

if(cat === "all") return list

return list.filter(p => p.category === cat)

}

function filter(){

let filtered = [...products]

const q = search.value.toLowerCase()

if(q){
filtered = filtered.filter(p =>
p.name.toLowerCase().includes(q)
)
}

const cat = select.value

filtered = filterCategory(filtered,cat)

render(filtered)

}

search.addEventListener("input", filter)
select.addEventListener("change", filter)

})