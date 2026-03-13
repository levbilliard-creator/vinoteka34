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


document.addEventListener("click",(e)=>{

if(e.target.dataset.filter){

const f=e.target.dataset.filter

if(f==="all") filtered=[...products]

else filtered=products.filter(p=>p.category===f)

renderCatalog()

}

if(e.target.dataset.color){

const c=e.target.dataset.color

filtered=products.filter(p=>p.color===c)

renderCatalog()

}

if(e.target.dataset.price){

const price=parseInt(e.target.dataset.price)

filtered=products.filter(p=>p.price<=price)

renderCatalog()

}

})

document.getElementById("search").addEventListener("input",(e)=>{

const q=e.target.value.toLowerCase()

filtered=products.filter(p=>

p.name_ru.toLowerCase().includes(q)

)

renderCatalog()

})

loadCatalog()