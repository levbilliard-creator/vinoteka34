let products = []
let filteredProducts = []

const categoryNames = {
wine: "Вино",
sparkling: "Игристое",
strong: "Крепкий алкоголь",
beer: "Пиво",
soft: "Безалкогольные",
grocery: "Бакалея",
tea: "Чай",
accessories: "Аксессуары"
}


async function loadProducts(){

const response = await fetch("/data/products.json")

products = await response.json()

filteredProducts = products

renderProducts(filteredProducts)

}



function renderProducts(list){

const grid = document.getElementById("catalogGrid")

grid.innerHTML = ""

list.forEach(product=>{

const card = document.createElement("div")

card.className = "productCard"

card.innerHTML = `

<div class="productType">
${categoryNames[product.category] || ""}
</div>

<div class="productTitle">
${product.name_ru}
</div>

<div class="productInfo">
${product.color || ""} ${product.style || ""}
</div>

<div class="productBottom">

<div class="productPrice">
${product.price} ₽
</div>

<a href="/product.html?id=${product.id}" class="productMore">
Подробнее
</a>

</div>

`

grid.appendChild(card)

})

}



function filterCategory(category){

if(category === "all"){
filteredProducts = products
}else{
filteredProducts = products.filter(p => p.category === category)
}

renderProducts(filteredProducts)

}



function searchProducts(){

const input = document
.getElementById("searchInput")
.value
.toLowerCase()

filteredProducts = products.filter(product =>
product.name_ru.toLowerCase().includes(input)
)

renderProducts(filteredProducts)

}



document.addEventListener("DOMContentLoaded", loadProducts)