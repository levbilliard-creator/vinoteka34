let products = []

const categoryNames = {
wine:"WINE",
sparkling:"SPARKLING",
strong:"STRONG",
beer:"BEER",
soft:"SOFT",
grocery:"GROCERY",
tea:"TEA",
accessories:"ACCESSORY"
}



async function loadProducts(){

const res = await fetch("/data/products.json")

products = await res.json()

render(products)

}



function render(list){

const grid = document.getElementById("catalogGrid")

grid.innerHTML = ""

list.forEach(product=>{

grid.appendChild(createCard(product))

})

}



function createCard(product){

const card = document.createElement("div")

card.className = "card"



const label = categoryNames[product.category] || ""



card.innerHTML = `

<div class="cardType">${label}</div>

<div class="cardTitle">
${product.name_ru}
</div>

<div class="cardInfo">
${product.color || ""} ${product.style || ""}
</div>

<div class="cardBottom">

<div class="price">
${product.price} ₽
</div>

<a class="more" href="/product.html?id=${product.id}">
Подробнее
</a>

</div>

`

return card

}



function filterCategory(category){

if(category==="all"){

render(products)

return

}



const filtered = products.filter(p=>p.category===category)

render(filtered)

}



function search(){

const value = document
.getElementById("searchInput")
.value
.toLowerCase()



const filtered = products.filter(p=>
p.name_ru.toLowerCase().includes(value)
)



render(filtered)

}



window.onload = loadProducts