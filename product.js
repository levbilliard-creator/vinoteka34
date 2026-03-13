async function loadProduct(){

const params = new URLSearchParams(window.location.search)

const id = parseInt(params.get("id"))

const res = await fetch("/data/products.json")

const products = await res.json()

const product = products.find(p => p.id === id)


document.getElementById("product-type").innerText = product.type

document.getElementById("product-name").innerText =
product.name_en || product.name_ru

document.getElementById("product-style").innerText =
(product.color || "") + " " + (product.style || "")

document.getElementById("product-price").innerText =
product.price + " ₽"



renderSimilar(products, product)

}



function renderSimilar(products, current){

const grid = document.getElementById("similar-grid")

const similar = products
.filter(p => p.type === current.type && p.id !== current.id)
.slice(0,4)


similar.forEach(p=>{

const card = document.createElement("div")

card.className = "similar-card"

card.innerHTML = `

<img src="/assets/photo_1_2026-02-15_15-47-16.jpg">

<div class="product-name-ru">
${p.name_ru}
</div>

<div class="product-price">
${p.price} ₽
</div>

<a href="/product?id=${p.id}">
<button class="btn-card">
Подробнее
</button>
</a>

`

grid.appendChild(card)

})

}


loadProduct()