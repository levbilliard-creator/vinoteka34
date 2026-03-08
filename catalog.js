async function loadCatalog(){

const res = await fetch("/data/products.json")
const products = await res.json()

const grid = document.getElementById("catalog-grid")

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

const card = document.createElement("div")
card.className = "card"

card.innerHTML = `
<img src="/assets/img/wine.jpg">

<div class="card-body">

<div class="card-type">${p.category}</div>

<div class="card-title">${p.name_ru}</div>

<div class="card-sub">${p.color} ${p.sugar}</div>

<div class="card-price">${p.price} ₽</div>

<a class="card-btn" href="/product.html?id=${p.id}">
Открыть
</a>

</div>
`

grid.appendChild(card)

})

}

}

loadCatalog()