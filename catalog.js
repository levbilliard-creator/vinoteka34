async function loadCatalog(){

const response = await fetch("data/products.json")

const products = await response.json()

const catalog = document.getElementById("catalog")

catalog.innerHTML=""

products.forEach(product=>{

const card=document.createElement("div")

card.className="card"

card.innerHTML=`

<div class="photo">
<img src="${product.image}">
</div>

<div class="category">
${product.category}
</div>

<div class="title">
${product.name}
</div>

<div class="props">
${product.type}
</div>

<div class="price">
${product.price} ₽
</div>

<button class="open">Открыть</button>

`

catalog.appendChild(card)

})

}

loadCatalog()