let products=[]
let categories=[]
let activeCategory=null

async function init(){

const productsResponse=await fetch("/data/products.json")
products=await productsResponse.json()

const catResponse=await fetch("/data/categories.json")
categories=await catResponse.json()

renderCategories()
renderCatalog(products)

}

function renderCategories(){

const list=document.getElementById("categoryList")

categories.forEach(cat=>{

const div=document.createElement("div")

div.className="category"

div.innerText=cat.name

div.onclick=()=>{

activeCategory=cat.id
filterCatalog()

}

list.appendChild(div)

})

}

function filterCatalog(){

let filtered=products

if(activeCategory){

filtered=products.filter(p=>p.category===activeCategory)

}

renderCatalog(filtered)

}

function renderCatalog(data){

const grid=document.getElementById("catalog-grid")

grid.innerHTML=""

data.forEach(p=>{

const card=document.createElement("div")

card.className="wine-card"

card.innerHTML=`

<div class="wine-type">${p.category || ""}</div>

<div class="wine-name-en">${p.name_en || ""}</div>

<div class="wine-name-ru">${p.name_ru}</div>

<div class="wine-style">${p.color || ""} ${p.style || ""}</div>

<div class="wine-price">${p.price} ₽</div>

<a class="wine-btn">Подробнее</a>

`

grid.appendChild(card)

})

}

init()