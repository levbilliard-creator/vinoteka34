async function loadProduct(){

const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

const res = await fetch("data/products.json")
const products = await res.json()

const wine = products.find(p => p.id === id)

if(!wine) return

const title = document.querySelector(".product-title")
const sub = document.querySelector(".product-sub")
const price = document.querySelector(".product-price")
const img = document.querySelector(".product-img")

if(title) title.innerText = wine.name_ru || ""
if(sub) sub.innerText = wine.name_en || ""
if(price) price.innerText = wine.price + " ₽"
if(img) img.src = wine.image

loadSimilar(products, wine)

}

function loadSimilar(products, wine){

const grid = document.querySelector(".similar-grid")

if(!grid) return

const similar = products
.filter(p => p.category === wine.category && p.id !== wine.id)
.slice(0,4)

grid.innerHTML = ""

similar.forEach(p => {

grid.innerHTML += `
<a href="product.html?id=${p.id}" class="card">

<img src="${p.image}" class="card-img">

<div class="card-body">

<div class="card-name">${p.name_ru}</div>

<div class="card-price">${p.price} ₽</div>

</div>

</a>
`

})

}

loadProduct()