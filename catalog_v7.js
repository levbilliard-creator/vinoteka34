let products = []

let currentCategory = "all"


async function loadCatalog(){

const res = await fetch("/data/products.json")

products = await res.json()

renderCatalog(products)

}


function renderCatalog(list){

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

list.forEach(p=>{

const card = document.createElement("div")

card.className = "product-card"

card.innerHTML = `

<img src="/assets/photo_1_2026-02-15_15-47-16.jpg">

<div class="product-type">${p.type}</div>

<div class="product-name">${p.name_ru}</div>

<div class="product-price">${p.price} ₽</div>

<a href="/product?id=${p.id}">
<button class="btn-card">Подробнее</button>
</a>

`

grid.appendChild(card)

})

}



function filterProducts(){

if(currentCategory==="all"){

renderCatalog(products)

return

}


const filtered = products.filter(p=>{

if(currentCategory==="wine") return p.type==="вино"

if(currentCategory==="sparkling") return p.type==="игристое"

if(currentCategory==="strong") return p.type==="коньяк" || p.type==="виски" || p.type==="ром"

if(currentCategory==="food") return p.type==="бакалея"

if(currentCategory==="tea") return p.type==="чай"

})


renderCatalog(filtered)

}



document.querySelectorAll(".cat-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".cat-btn").forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

currentCategory = btn.dataset.category

filterProducts()

})

})


document.getElementById("search").addEventListener("input",(e)=>{

const q = e.target.value.toLowerCase()

const filtered = products.filter(p=>

p.name_ru.toLowerCase().includes(q)

)

renderCatalog(filtered)

})


loadCatalog()
