async function loadCatalog() {

const response = await fetch('/data/products.json');
const products = await response.json();

const catalog = document.getElementById("catalog");

catalog.innerHTML = "";

products.forEach(product => {

const card = document.createElement("div");
card.className = "card";

const name = cleanName(product.name);

card.innerHTML = `
<img src="${product.image || '/assets/wine.jpg'}" class="card-img">

<div class="card-body">

<div class="card-type">
${detectType(product.name)}
</div>

<h3 class="card-title">
${name}
</h3>

<div class="card-price">
${product.price ? product.price + " ₽" : ""}
</div>

</div>
`;

card.onclick = () => {
window.location.href = `/product.html?id=${product.id}`;
};

catalog.appendChild(card);

});

}

function cleanName(name){

return name
.replace(/^Вино\s*/i,"")
.replace(/^Вино\s(красное|белое|розовое)\s*/i,"")
.replace(/красное|белое|розовое/gi,"")
.replace(/сухое|полусухое|полусладкое|сладкое/gi,"")
.replace(/столовое/gi,"")
.replace(/\s+/g," ")
.replace(/\"/g,"")
.trim()

}

function detectType(name){

name = name.toLowerCase();

if(name.includes("игрист")) return "Игристое";

if(
name.includes("виски") ||
name.includes("джин") ||
name.includes("водка") ||
name.includes("коньяк") ||
name.includes("ром")
){
return "Крепкий алкоголь";
}

return "Вино";

}

loadCatalog();