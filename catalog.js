const grid = document.getElementById("catalog-grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".filter-btn");

let products = [];
let filter = "all";

async function loadProducts(){

const res = await fetch("./data/products.json");
products = await res.json();

render();

}

function render(){

let list = products;

if(filter !== "all"){
list = list.filter(p => p.category === filter);
}

const query = search.value?.toLowerCase() || "";

if(query){
list = list.filter(p =>
p.name.toLowerCase().includes(query)
);
}

grid.innerHTML = list.map(p => `

<div class="product-card">

<div class="product-type">
${p.type}
</div>

<div class="product-name">
${p.name}
</div>

<div class="product-price">
${p.price} ₽
</div>

<a class="product-btn" href="/product?id=${p.id}">
Открыть
</a>

</div>

`).join("");

}

buttons.forEach(btn => {

btn.onclick = () => {

buttons.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

filter = btn.dataset.filter;

render();

};

});

search.oninput = render;

loadProducts();