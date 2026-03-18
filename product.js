async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  // --- загрузка товаров ---
  let products = [];
  try {
    const res = await fetch('/data/products.json');
    products = await res.json();
  } catch (e) {
    console.error('Ошибка загрузки products.json', e);
    return;
  }

  const product = products.find(p => String(p.id) === id);

  if (!product) {
    console.warn('Товар не найден');
    return;
  }

  // --- нормализация ---
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

  // --- список файлов (ПОКА БЕРЕМ ИЗВЕСТНЫЕ) ---
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

  // --- поиск лучшего совпадения ---
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

    if (bestScore >= 2 && bestFile) {
      return `/assets/wines/${bestFile}`;
    }

    return '/assets/no-image.png';
  }

  const imageUrl = findBestImage();

  // --- БЕЗОПАСНАЯ ВСТАВКА ---
  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setHTML(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = value;
  }

  // --- заполняем страницу ---
  setText('.product-title', product.name);
  setText('.product-subtitle', product.subtitle || '');
  setText('.product-price', product.price + ' ₽');
  setText('.product-description', product.description || 'Описание скоро появится');
  setText('.product-category', product.category || 'ВИНО');

  setHTML('.product-image', `
    <img src="${imageUrl}" alt="${product.name}">
  `);

  // --- характеристики ---
  const specsEl = document.querySelector('.product-specs');
  if (specsEl && product.specs) {
    specsEl.innerHTML = Object.entries(product.specs)
      .map(([k, v]) => `
        <div class="spec-row">
          <span>${k}</span>
          <span>${v}</span>
        </div>
      `).join('');
  }
}

loadProduct();