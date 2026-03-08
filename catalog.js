async function loadCatalog(){

const res = await fetch("data/products.json")
const products = await res.json()

const grid = document.querySelector(".catalog-grid")

products.forEach(p=>{

grid.innerHTML += `

<div class="card">

<img src="${p.image}" class="card-img">

<div class="card-body">

<div class="card-type">${p.category}</div>

<div class="card-name">${p.name}</div>

<div class="card-sub">${p.region}</div>

<div class="card-price">${p.price} ₽</div>

<a href="product.html?id=${p.id}" class="btn-main card-btn">
Открыть
</a>

</div>

</div>

`

})

}

loadCatalog()