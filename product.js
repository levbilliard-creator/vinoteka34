async function loadProduct(){

const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

const res = await fetch("data/products.json")
const products = await res.json()

const product = products.find(p => p.id === id)

if(!product) return

document.querySelector(".product-title").innerText = product.name
document.querySelector(".product-price").innerText = product.price + " ₽"
document.querySelector(".product-img").src = product.image
document.querySelector(".product-desc").innerText = product.description || ""

loadSimilar(products, product)

}

function loadSimilar(products, product){

const block = document.querySelector(".similar-grid")

const similar = products
.filter(p => p.category === product.category && p.id !== product.id)
.slice(0,4)

similar.forEach(p => {

block.innerHTML += `
<a class="card" href="product.html?id=${p.id}">

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