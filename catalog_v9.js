const products = [

{
id:1,
name:"Бренди Арманьяк Сент Обен 4 года",
price:6890,
category:"strong",
type:"коньяк"
},

{
id:2,
name:"Мюскаде Севр э Мен Шато-Тебо",
price:3990,
category:"wine",
type:"вино"
},

{
id:3,
name:"Пино Нуар Тасмания Глейцер-Диксон",
price:33437,
category:"wine",
type:"вино"
},

{
id:4,
name:"Дивноморское Марселан",
price:4472,
category:"wine",
type:"вино"
},

{
id:5,
name:"Сансер Галино",
price:9504,
category:"wine",
type:"вино"
}

]


let currentCategory="all"



function renderCatalog(list){

const grid = document.getElementById("catalog-grid")

grid.innerHTML=""

list.forEach(p=>{

const card = document.createElement("div")

card.className="product-card"

card.innerHTML=`

<img src="/assets/photo_1_2026-02-15_15-47-16.jpg">

<div class="product-type">${p.type}</div>

<div class="product-name">${p.name}</div>

<div class="product-price">${p.price} ₽</div>

<button class="btn-card">Подробнее</button>

`

grid.appendChild(card)

})

}



function filterProducts(){

if(currentCategory==="all"){

renderCatalog(products)

return

}

const filtered = products.filter(p=>p.category===currentCategory)

renderCatalog(filtered)

}



document.querySelectorAll(".cat-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".cat-btn").forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

currentCategory = btn.dataset.category

filterProducts()

})

})



document.getElementById("search").addEventListener("input",(e)=>{

const q = e.target.value.toLowerCase()

const filtered = products.filter(p=>

p.name.toLowerCase().includes(q)

)

renderCatalog(filtered)

})



renderCatalog(products)
