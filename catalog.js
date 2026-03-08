async function loadCatalog(){

const res = await fetch("data/products.json")
const products = await res.json()

const grid = document.querySelector(".catalog-grid")

if(!grid) return

grid.innerHTML = ""

products.forEach(p => {

const name = p.name || p.name_ru || p.title || ""
const price = p.price || ""
const image = p.image || p.img || ""
const category = p.category || ""
const color = p.color || ""
const taste = p.taste || ""

grid.innerHTML += `

<div class="card">

<img src="${image}" class="card-img">

<div class="card-body">

<div class="card-type">${category}</div>

<div class="card-name">${name}</div>

<div class="card-char">${color} ${taste}</div>

<div class="card-price">${price} ₽</div>

<a href="product.html?id=${p.id}" class="btn-main card-btn">
Открыть
</a>

</div>

</div>

`

})

}

loadCatalog()