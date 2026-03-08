async function loadCatalog() {

const res = await fetch("data/products.json")
const products = await res.json()

const grid = document.querySelector(".catalog-grid")

const params = new URLSearchParams(window.location.search)
const cat = params.get("cat")

let filtered = products

if(cat){
filtered = products.filter(p => p.category === cat)
}

render(filtered)

function render(list){

grid.innerHTML = ""

list.forEach(p => {

grid.innerHTML += `
<div class="card">

<img src="${p.image}" class="card-img">

<div class="card-body">

<div class="card-type">${p.category}</div>

<div class="card-name">${p.name}</div>

<div class="card-sub">${p.country} ${p.year || ""}</div>

<div class="card-price">${p.price} ₽</div>

<a class="btn-open" href="product.html?id=${p.id}">
Открыть
</a>

</div>
</div>
`
})

}

}

loadCatalog()