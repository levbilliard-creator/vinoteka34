async function loadProduct(){

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const response = await fetch("/data/products.json");

const products = await response.json();

const product = products.find(p => p.id == id);

const container = document.getElementById("product-info");

if(!product){
container.innerHTML="Вино не найдено";
return;
}

container.innerHTML=`

<h1 class="product-title">
${product.name}
</h1>

<div class="product-type">
${product.type}
</div>

<div class="product-price">
${product.price} ₽
</div>

<p class="product-description">
Описание вина будет добавлено сомелье.
</p>

`;

const similar=products
.filter(p=>p.type===product.type && p.id!=product.id)
.slice(0,4);

const similarContainer=document.getElementById("similar-products");

similarContainer.innerHTML=similar.map(p=>`

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

loadProduct();