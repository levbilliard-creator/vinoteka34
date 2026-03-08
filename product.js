async function loadProduct(){

const params=new URLSearchParams(window.location.search);
const id=parseInt(params.get("id"));

const response=await fetch("/data/products.json");
const products=await response.json();

const product=products.find(p=>p.id===id);

document.querySelector(".product-title").innerText=
cleanName(product.name);

document.querySelector(".product-meta").innerText=
buildMeta(product.name);

document.querySelector(".product-price").innerText=
product.price ? product.price+" ₽":"";

document.querySelector(".product-description").innerText=
product.description || "";

renderSimilar(products,product);

}

function renderSimilar(products,product){

const grid=document.querySelector(".similar-grid");

grid.innerHTML="";

const similar=products
.filter(p=>detectType(p.name)===detectType(product.name) && p.id!==product.id)
.slice(0,4);

similar.forEach(p=>{

const card=document.createElement("div");
card.className="catalog-card";

card.innerHTML=`

<div class="catalog-title">${cleanName(p.name)}</div>

<div class="catalog-price">${p.price ? p.price+" ₽":""}</div>

<button class="catalog-btn">Открыть</button>

`;

card.querySelector("button").onclick=()=>{

window.location.href="/product.html?id="+p.id;

};

grid.appendChild(card);

});

}

function cleanName(name){

return name
.replace(/^Вино\s*/i,"")
.replace(/красное|белое|розовое/gi,"")
.replace(/сухое|полусухое|полусладкое|сладкое/gi,"")
.replace(/столовое/gi,"")
.replace(/\s+/g," ")
.replace(/\"/g,"")
.trim();

}

function buildMeta(name){

let color="";
let sugar="";

name=name.toLowerCase();

if(name.includes("крас")) color="Красное";
if(name.includes("бел")) color="Белое";
if(name.includes("роз")) color="Розовое";

if(name.includes("сух")) sugar="Сухое";
if(name.includes("полусух")) sugar="Полусухое";
if(name.includes("полуслад")) sugar="Полусладкое";

return `${color} • ${sugar}`;

}

function detectType(name){

name=name.toLowerCase();

if(name.includes("игрист")) return "Игристое";

if(
name.includes("виски") ||
name.includes("водка") ||
name.includes("джин") ||
name.includes("коньяк") ||
name.includes("ром")
){
return "Крепкий алкоголь";
}

return "Вино";

}

loadProduct();