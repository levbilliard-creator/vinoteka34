async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  // --- грузим товары ---
  const res = await fetch('/data/products.json');
  const products = await res.json();

  const product = products.find(p => String(p.id) === id);

  if (!product) {
    document.body.innerHTML = '<h1>Товар не найден</h1>';
    return;
  }

  // --- НОРМАЛИЗАЦИЯ ---
  function normalize(str) {
    return str
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9\s]/gi, '')
      .trim();
  }

  function getWords(str) {
    return normalize(str).split(/\s+/).filter(w => w.length > 2);
  }

  const productWords = getWords(product.name);

  // --- ВСЕ ФАЙЛЫ (пока вручную один раз, но универсально) ---
  const files = [
    "Ален Байи Петрониј , 0.75 л.png",
    "Ален Байи Роз де Серзи, 0.75 л.png",
    "Крис Пино Гриджо, 2024, 0.75 л.png",
    "Моет & Шандон Империал Брют, 0.75 л.jpg",
    "Нед Совиньон Блан Мариско Виньярдс, 2024, 0.75 л.png",
    "Фиорино д'Оро Просекко Спуманте, 0.75 л.png",
    "арманьяк сент обен.png",
    "марселан дивноморское.jpg"
  ];

  // --- УМНОЕ СРАВНЕНИЕ ---
  function matchScore(productWords, fileName) {
    const fileWords = getWords(fileName);

    let score = 0;

    productWords.forEach(w => {
      if (fileWords.includes(w)) score++;
    });

    return score;
  }

  function findBestImage() {
    let bestScore = 0;
    let bestFile = null;

    files.forEach(file => {
      const score = matchScore(productWords, file);

      if (score > bestScore) {
        bestScore = score;
        bestFile = file;
      }
    });

    // минимум совпадений (чтобы не было мусора)
    if (bestScore >= 2) {
      return `/assets/wines/${bestFile}`;
    }

    return '/assets/no-image.png';
  }

  const imageUrl = findBestImage();

  // --- ВСТАВКА ---
  document.querySelector('.product-image').innerHTML = `
    <img src="${imageUrl}" alt="${product.name}">
  `;

  document.querySelector('.product-category').textContent = product.category || 'ВИНО';
  document.querySelector('.product-title').textContent = product.name;
  document.querySelector('.product-subtitle').textContent = product.subtitle || '';
  document.querySelector('.product-price').textContent = product.price + ' ₽';

  document.querySelector('.product-description').textContent =
    product.description || 'Описание скоро появится';

  // --- характеристики ---
  const specs = document.querySelector('.product-specs');
  if (specs && product.specs) {
    specs.innerHTML = Object.entries(product.specs)
      .map(([key, value]) => `
        <div class="spec-row">
          <span>${key}</span>
          <span>${value}</span>
        </div>
      `).join('');
  }
}

loadProduct();