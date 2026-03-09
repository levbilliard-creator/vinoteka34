const grid = document.getElementById("catalog-grid");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");

let products = [];
let currentFilter = "all";

async function loadProducts() {
  const response = await fetch("/data/products.json");
  products = await response.json();
  renderProducts();
}

function renderProducts() {
  if (!grid) return;

  let list = products;

  if (currentFilter !== "all") {
    list = list.filter(p => p.category === currentFilter);
  }

  const query = searchInput ? searchInput.value.toLowerCase() : "";

  if (query) {
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

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;

    renderProducts();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}

loadProducts();