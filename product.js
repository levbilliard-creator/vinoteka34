let products=[]

async function loadProduct(){

const params=new URLSearchParams(location.search)
const id=params.get("id")

const res=await fetch("/data/products.json")
products=await res.json()

const wine=products.find(p=>String(p.id)===id)

render(wine)

}

function render(p){

const container=document.getElementById("productPage")

container.innerHTML=`

<div class="productWrapper">

<div class="productImage">

<img class="wine-img-big"
src="${p.image || "/assets/wine.jpg"}">

</div>

<div class="productInfo">

<div class="wine-type">${p.category}</div>

<h1>${p.name_ru}</h1>

<div class="wine-en">${p.name_en || ""}</div>

<div class="wine-style">
${p.color} ${p.style}
</div>

<div class="wine-price-big">
${p.price} ₽
</div>

<button class="wine-btn">
Спросить сомелье
</button>

</div>

</div>

`

}

loadProduct()