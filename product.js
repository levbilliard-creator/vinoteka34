async function loadProduct(){

const res = await fetch("/data/products.json")
const products = await res.json()

const params = new URLSearchParams(window.location.search)
const id = parseInt(params.get("id"))

const wine = products.find(p => p.id === id)

document.getElementById("title").innerText = wine.name_ru
document.getElementById("type").innerText = wine.color + " " + wine.sugar
document.getElementById("price").innerText = wine.price + " ₽"
document.getElementById("desc").innerText = wine.description

renderFood(wine)
renderSimilar(products,wine)

}

function renderFood(wine){

const box = document.getElementById("food")

let food = []

if(wine.color === "белое"){
food = ["рыба","морепродукты","белое мясо","сыры"]
}

if(wine.color === "красное"){
food = ["стейк","мясо","дичь","твёрдые сыры"]
}

if(wine.category === "sparkling"){
food = ["устрицы","икра","морепродукты","десерты"]
}

box.innerHTML = ""

food.forEach(f=>{
const li=document.createElement("li")
li.innerText=f
box.appendChild(li)
})

}

function renderSimilar(products,wine){

const grid = document.getElementById("similar")

const similar = products
.filter(p => p.category === wine.category && p.id !== wine.id)
.slice(0,4)

grid.innerHTML=""

similar.forEach(p=>{

const card=document.createElement("div")
card.className="card"

card.innerHTML=`
<img src="/assets/wine.jpg">

<div class="card-body">

<div class="card-title">${p.name_ru}</div>

<div class="card-price">${p.price} ₽</div>

<a class="card-btn" href="/product.html?id=${p.id}">
Открыть
</a>

</div>
`

grid.appendChild(card)

})

}

loadProduct()