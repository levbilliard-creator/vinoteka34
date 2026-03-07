document.addEventListener("DOMContentLoaded",()=>{

const grid=document.getElementById("catalog-grid")
const search=document.getElementById("search")
const select=document.getElementById("category")

let all=[]

fetch("data/products.json")
.then(r=>r.json())
.then(data=>{

all=data

render(all)

})

function render(items){

grid.innerHTML=""

items.forEach(p=>{

const card=document.createElement("div")

card.className="wine-card"

card.innerHTML=`

<img src="${p.image}">

<div class="wine-category">${p.category}</div>

<div class="wine-title-en">${p.name_en}</div>

<div class="wine-title-ru">${p.name_ru}</div>

<div class="wine-type">${p.type}</div>

<div class="wine-price">${p.price} ₽</div>

<a class="wine-btn" href="product.html?id=${p.id}">
Открыть
</a>

`

grid.appendChild(card)

})

}

function filter(){

let items=[...all]

const q=search.value.toLowerCase()

if(q){

items=items.filter(p=>
p.name_en.toLowerCase().includes(q)||
p.name_ru.toLowerCase().includes(q)
)

}

const cat=select.value

if(cat!=="all"){
items=items.filter(p=>p.category===cat)
}

render(items)

}

search.addEventListener("input",filter)
select.addEventListener("change",filter)

})