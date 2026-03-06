let products = []

async function initCatalog(){

const response = await fetch("data/products.json")

products = await response.json()

render(products)

}

function render(list){

const grid = document.getElementById("catalogGrid")

grid.innerHTML = ""

list.forEach(product => {

const card = document.createElement("div")

card.className = "card"

card.innerHTML = `

<div class="photo">
<img src="${product.image}" onerror="this.src='assets/wine.jpg'">
</div>

<div class="info">

<div class="category">${product.category}</div>

<div class="title">${product.name}</div>

<div class="type">${product.type || ""}</div>

<div class="price">${product.price} ₽</div>

<button onclick="openProduct(${product.id})">Открыть</button>

</div>

`

grid.appendChild(card)

})

}


function openProduct(id){

window.location = "product.html?id=" + id

}


document.addEventListener("DOMContentLoaded", () => {

initCatalog()

document.getElementById("search").addEventListener("input", e => {

const value = e.target.value.toLowerCase()

const filtered = products.filter(p =>

p.name.toLowerCase().includes(value)

)

render(filtered)

})


document.getElementById("category").addEventListener("change", e => {

const value = e.target.value

if(value === "all"){

render(products)

return

}

const filtered = products.filter(p => p.category === value)

render(filtered)

})

})