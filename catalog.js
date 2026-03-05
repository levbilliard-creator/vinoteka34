const grid = document.getElementById("wineGrid")

function renderWines(list){

grid.innerHTML=""

list.forEach(wine=>{

const card = document.createElement("div")

card.className="wine-card"

card.innerHTML=`

<div class="wine-image">
<img src="${wine.image}">
</div>

<div class="wine-type">${wine.country}</div>

<div class="wine-title">
${wine.name}
</div>

<div class="wine-price">
${wine.price} ₽
</div>

<button class="wine-btn">
Открыть
</button>

`

grid.appendChild(card)

})

}

renderWines(wines)



/* ФИЛЬТР */

document.getElementById("countryFilter")
.addEventListener("change",filter)

document.getElementById("typeFilter")
.addEventListener("change",filter)

function filter(){

let country=document.getElementById("countryFilter").value
let type=document.getElementById("typeFilter").value

let filtered=wines.filter(w=>{

return (!country||w.country===country)
&& (!type||w.type===type)

})

renderWines(filtered)

}