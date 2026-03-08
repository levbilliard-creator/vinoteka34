async function loadProduct(){

const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

const res = await fetch("data/products.json")
const products = await res.json()

const wine = products.find(p => p.id === id)

if(!wine) return

document.querySelector(".product-title").innerText = wine.name
document.querySelector(".product-price").innerText = wine.price + " ₽"
document.querySelector(".product-img").src = wine.image
document.querySelector(".product-desc").innerText = wine.description || ""

loadSimilar(products,wine)

}

function loadSimilar(products,wine){

const grid = document.querySelector(".similar-grid")

if(!grid) return

const similar = products
.filter(p => p.category === wine.category && p.id !== wine.id)
.slice(0,4)

grid.innerHTML = ""

similar.forEach(p=>{

grid.innerHTML += `

<a href="product.html?id=${p.id}" class="card">

<img src="${p.image}" class="card-img">

<div class="card-body">

<div class="card-name">${p.name}</div>

<div class="card-price">${p.price} ₽</div>

</div>

</a>

`

})

}

loadProduct()