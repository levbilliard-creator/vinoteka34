let products=[]
let filtered=[]

async function loadCatalog(){

const res=await fetch("/data/products.json")

products=await res.json()

filtered=[...products]

renderCatalog()

}

function renderCatalog(){

const grid=document.getElementById("catalog-grid")

grid.innerHTML=""

filtered.forEach(p=>{

const card=document.createElement("div")

card.className="product-card"

card.innerHTML=`

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


function applyFilters(){

let result=[...products]

const categories=[...document.querySelectorAll(".category:checked")].map(e=>e.value)

const colors=[...document.querySelectorAll(".color:checked")].map(e=>e.value)

const countries=[...document.querySelectorAll(".country:checked")].map(e=>e.value)

const price=document.querySelector("input[name=price]:checked")


if(categories.length){

result=result.filter(p=>categories.includes(p.category))

}

if(colors.length){

result=result.filter(p=>colors.includes(p.color))

}

if(countries.length){

result=result.filter(p=>countries.includes(p.country))

}

if(price){

result=result.filter(p=>p.price<=price.value)

}

filtered=result

renderCatalog()

}


document.addEventListener("change",(e)=>{

if(e.target.matches("input")) applyFilters()

})


document.getElementById("search").addEventListener("input",(e)=>{

const q=e.target.value.toLowerCase()

filtered=products.filter(p=>

p.name_ru.toLowerCase().includes(q)

)

renderCatalog()

})


loadCatalog()