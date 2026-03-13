const grid = document.getElementById("catalog-grid")
const categories = document.getElementById("categories")

let products = []
let currentCategory = "all"

async function loadProducts(){

const res = await fetch("/data/products.json")

products = await res.json()

renderProducts()

}

function renderProducts(){

grid.innerHTML = ""

let filtered = products

if(currentCategory !== "all"){

filtered = products.filter(p => p.type === currentCategory)

}

filtered.forEach(product=>{

const card = document.createElement("div")

card.className = "product-card"

card.innerHTML = `

<img src="/assets/photo_1_2026-02-15_15-47-16.jpg" class="product-img">

<div class="product-type">
${product.type || ""}
</div>

<div class="product-name">
${product.name_en || ""}
</div>

<div class="product-name-ru">
${product.name_ru}
</div>

<div class="product-style">
${product.color || ""} ${product.style || ""}
</div>

<div class="product-price">
${product.price} ₽
</div>

<a href="/product?id=${product.id}">
<button class="btn-card">
Подробнее
</button>
</a>

`

grid.appendChild(card)

})

}

categories.addEventListener("click",e=>{

if(e.target.dataset.category){

currentCategory = e.target.dataset.category

renderProducts()

}

})

loadProducts()