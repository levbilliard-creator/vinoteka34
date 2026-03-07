document.addEventListener("DOMContentLoaded", () => {

const grid = document.getElementById("catalog-grid")
const search = document.getElementById("search")
const select = document.getElementById("category")

let products = []

const params = new URLSearchParams(location.search)
const urlCat = params.get("cat")

fetch("data/products.json")
.then(r => r.json())
.then(data => {

products = data

if(urlCat){

select.value = urlCat
render(products.filter(p => p.category === urlCat))

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

function filter(){

let filtered = [...products]

const q = search.value.toLowerCase()

if(q){
filtered = filtered.filter(p =>
p.name.toLowerCase().includes(q)
)
}

const cat = select.value

if(cat !== "all"){
filtered = filtered.filter(p => p.category === cat)
}

render(filtered)

}

search.addEventListener("input", filter)
select.addEventListener("change", filter)

})