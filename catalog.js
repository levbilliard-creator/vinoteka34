async function loadCatalog(){

const res = await fetch("data/products.json")
const products = await res.json()

const grid = document.querySelector(".catalog-grid")

if(!grid) return

grid.innerHTML = ""

products.forEach(p => {

const name =
p.name ||
p.name_ru ||
p.title ||
p.product ||
""

const price =
p.price ||
p.cost ||
""

const image =
p.image ||
p.img ||
"img/wine.jpg"

const category =
p.category ||
p.type ||
""

grid.innerHTML += `

<div class="card">

<img src="${image}" class="card-img">

<div class="card-body">

<div class="card-type">${category}</div>

<div class="card-name">${name}</div>

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