async function loadProduct(){

const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

const res = await fetch("data/products.json")
const products = await res.json()

const wine = products.find(p => p.id === id)

if(!wine) return

const name = wine.name || wine.name_ru || wine.title || ""
const price = wine.price || ""
const image = wine.image || wine.img || ""
const color = wine.color || ""
const taste = wine.taste || ""

document.querySelector(".product-title").innerText = name
document.querySelector(".product-price").innerText = price + " ₽"
document.querySelector(".product-img").src = image
document.querySelector(".product-char").innerText = color + " " + taste

loadSimilar(products, wine)

}



function loadSimilar(products, wine){

const grid = document.querySelector(".similar-grid")

if(!grid) return

const similar = products
.filter(p => p.category === wine.category && p.id !== wine.id)
.slice(0,4)

grid.innerHTML = ""

similar.forEach(p=>{

const name = p.name || p.title || ""
const image = p.image || ""
const price = p.price || ""

grid.innerHTML += `

<a href="product.html?id=${p.id}" class="card">

<img src="${image}" class="card-img">

<div class="card-body">

<div class="card-name">${name}</div>

<div class="card-price">${price} ₽</div>

</div>

</a>

`

})

}

loadProduct()