async function loadProduct(){

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const response = await fetch('/data/products.json');
const products = await response.json();

const product = products.find(p => p.id === id);

const page = document.getElementById("product");

const name = cleanName(product.name);

page.innerHTML = `

<div class="product-wrapper">

<div class="product-image">
<img src="${product.image || '/assets/wine.jpg'}">
</div>

<div class="product-info">

<div class="product-category">
${detectType(product.name)}
</div>

<h1 class="product-title">
${name}
</h1>

<div class="product-price">
${product.price ? product.price + " ₽" : ""}
</div>

</div>

</div>

<div class="similar-block">

<h2>Похожие позиции</h2>

<div class="similar-grid" id="similar"></div>

</div>

`;

renderSimilar(products, product);

}

function renderSimilar(products, product){

const similar = document.getElementById("similar");

const same = products
.filter(p => detectType(p.name) === detectType(product.name) && p.id !== product.id)
.slice(0,4);

same.forEach(p=>{

const card = document.createElement("div");

card.className = "card";

card.innerHTML = `

<img src="${p.image || '/assets/wine.jpg'}">

<h3>${cleanName(p.name)}</h3>

`;

card.onclick = ()=>{

window.location.href = `/product.html?id=${p.id}`;

};

similar.appendChild(card);

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

loadProduct();