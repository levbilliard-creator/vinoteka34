let products=[]

async function init(){

const res=await fetch('/data/products.json')

products=await res.json()

render(products)

}

function render(list){

const grid=document.getElementById('catalog-grid')

grid.innerHTML=""

list.forEach(p=>{

const card=document.createElement('div')

card.className="card"

card.innerHTML=`

<div class="card-img">

<img src="${p.image}">

<div class="wine-badge">
${p.type} • ${p.sweet}
</div>

</div>

<div class="card-body">

<div class="card-category">
${p.country} • ${p.region}
</div>

<div class="card-title">
${p.name}
</div>

<div class="card-price">
${p.price} ₽
</div>

<a href="/product.html?id=${p.id}" class="card-btn">
Открыть
</a>

</div>
`

grid.appendChild(card)

})

}

function filter(){

let list=[...products]

const search=document.getElementById('search').value.toLowerCase()

const type=document.getElementById('typeFilter').value

const sort=document.getElementById('sort').value



if(search){

list=list.filter(p=>p.name.toLowerCase().includes(search))

}

if(type){

list=list.filter(p=>p.type===type)

}

if(sort==="price-asc"){

list.sort((a,b)=>a.price-b.price)

}

if(sort==="price-desc"){

list.sort((a,b)=>b.price-a.price)

}

render(list)

}

document.querySelectorAll("input,select").forEach(el=>{

el.addEventListener("input",filter)

})

init()