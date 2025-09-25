// ============================
// Данные товаров (можно расширять)
// ============================
const products = [
  { id: 'p1', title: 'Ice Latte', price: 220, img: 'https://picsum.photos/seed/ice/400/300' },
  { id: 'p2', title: 'Matcha Latte', price: 240, img: 'https://picsum.photos/seed/matcha/400/300' },
  { id: 'p3', title: 'Десерт', price: 320, img: 'https://picsum.photos/seed/dessert/400/300' },
  { id: 'p4', title: 'Крабик для волос', price: 120, img: 'https://picsum.photos/seed/crab/400/300' },
  { id: 'p5', title: 'Шелковая резинка', price: 90, img: 'https://picsum.photos/seed/silk/400/300' },
  { id: 'p6', title: 'Винтажный фотоаппарат', price: 5200, img: 'https://picsum.photos/seed/camera/400/300' },
  { id: 'p7', title: 'Бальзам для губ', price: 150, img: 'https://picsum.photos/seed/balm/400/300' },
  { id: 'p8', title: 'Букет цветов', price: 800, img: 'https://picsum.photos/seed/flowers/400/300' },
  { id: 'p9', title: 'Свечи', price: 360, img: 'https://picsum.photos/seed/candles/400/300' },
  { id: 'p10', title: 'Мягкая игрушка', price: 420, img: 'https://picsum.photos/seed/toy/400/300' },
  { id: 'p11', title: 'Кольцо', price: 1400, img: 'https://picsum.photos/seed/ring/400/300' },
  { id: 'p12', title: 'Браслет', price: 980, img: 'https://picsum.photos/seed/bracelet/400/300' },
];

// ============================
// Состояние корзины и DOM элементы
// ============================
const catalogEl = document.getElementById('catalog');
const cartButton = document.getElementById('cart-button');
const cartPanel = document.getElementById('cart-panel');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const cancelOrderBtn = document.getElementById('cancel-order');
const closeOrderBtn = document.getElementById('close-order');

let cart = {}; // структура: { productId: { id, title, price, qty, img } }

// ============================
// Инициализация: render catalog
// ============================
function renderCatalog() {
  catalogEl.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="price">${p.price} ₽</div>
      <div class="card-actions">
        <button class="btn add-to-cart" data-id="${p.id}">Добавить в корзину</button>
      </div>
    `;
    catalogEl.appendChild(card);
  });
}
renderCatalog();

// ============================
// Вспомогательные: загрузка/сохранение localStorage
// ============================
const CART_KEY = 'pinterest_girl_cart_v1';

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (raw) {
    try {
      cart = JSON.parse(raw) || {};
    } catch (e) {
      cart = {};
    }
  } else {
    cart = {};
  }
}
loadCart();

// ============================
// Обновление отображения корзины
// ============================
function updateCartUI() {
  // count
  const totalQty = Object.values(cart).reduce((s, it) => s + it.qty, 0);
  cartCountEl.textContent = totalQty;

  // items
  cartItemsEl.innerHTML = '';
  for (const key in cart) {
    const it = cart[key];
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${it.img}" alt="${it.title}">
      <div class="cart-item-info" style="flex:1">
        <div>${it.title}</div>
        <div class="price">${it.price} ₽</div>
        <div class="qty-controls">
          <button class="qty-decrease" data-id="${it.id}">−</button>
          <span class="qty">${it.qty}</span>
          <button class="qty-increase" data-id="${it.id}">+</button>
          <button class="remove-item" data-id="${it.id}">Удалить</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(li);
  }

  // total sum
  const totalSum = Object.values(cart).reduce((s, it) => s + it.price * it.qty, 0);
  cartTotalEl.textContent = `${totalSum} ₽`;

  saveCart();
}

// ============================
// Добавление товара
// ============================
catalogEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;
  const id = btn.dataset.id;
  const product = products.find(p => p.id === id);
  if (!product) return;
  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { id: product.id, title: product.title, price: product.price, qty: 1, img: product.img };
  }
  updateCartUI();
});

// ============================
// Управление в корзине (удаление, изменение qty)
// ============================
cartItemsEl.addEventListener('click', (e) => {
  const inc = e.target.closest('.qty-increase');
  const dec = e.target.closest('.qty-decrease');
  const rem = e.target.closest('.remove-item');

  const id = (inc || dec || rem) && (inc || dec || rem).dataset.id;
  if (!id) return;

  if (inc) {
    cart[id].qty += 1;
  } else if (dec) {
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) delete cart[id];
  } else if (rem) {
    delete cart[id];
  }
  updateCartUI();
});

// ============================
// Открытие/закрытие панели корзины
// ============================
cartButton.addEventListener('click', () => {
  const isHidden = cartPanel.getAttribute('aria-hidden') === 'true' || cartPanel.getAttribute('aria-hidden') === null;
  cartPanel.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
});

closeCartBtn.addEventListener('click', () => {
  cartPanel.setAttribute('aria-hidden', 'true');
});

// ============================
// Оформление заказа: открытие модалки
// ============================
checkoutBtn.addEventListener('click', () => {
  orderModal.setAttribute('aria-hidden', 'false');
});

closeOrderBtn.addEventListener('click', () => {
  orderModal.setAttribute('aria-hidden', 'true');
});
cancelOrderBtn.addEventListener('click', () => {
  orderModal.setAttribute('aria-hidden', 'true');
});

// Закрытие модалки при клике на backdrop
orderModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal__backdrop')) {
    orderModal.setAttribute('aria-hidden', 'true');
  }
});

// ============================
// Обработка формы заказа
// ============================
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // простая валидация: проверим, есть ли товары в корзине и поля валидны
  const totalQty = Object.values(cart).reduce((s, it) => s + it.qty, 0);
  if (totalQty === 0) {
    alert('В корзине нет товаров.');
    return;
  }

  if (!orderForm.checkValidity()) {
    orderForm.reportValidity();
    return;
  }

  // Можно собрать данные заказа:
  const formData = new FormData(orderForm);
  const orderData = {
    buyer: {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      address: formData.get('address'),
      phone: formData.get('phone'),
    },
    items: Object.values(cart),
    total: Object.values(cart).reduce((s, it) => s + it.price * it.qty, 0),
    createdAt: new Date().toISOString()
  };

  // Для учебного проекта просто показать сообщение и очистить корзину
  console.log('Order created:', orderData);
  alert('Заказ создан!');

  // Очистим корзину
  cart = {};
  updateCartUI();
  orderForm.reset();
  orderModal.setAttribute('aria-hidden', 'true');
});


// Инициализация UI при загрузке
updateCartUI();
