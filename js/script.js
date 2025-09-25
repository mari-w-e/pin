const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');

cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

const checkoutBtn = document.getElementById('checkout-btn');
const orderForm = document.getElementById('order-form');
const closeForm = document.getElementById('close-form');

checkoutBtn.addEventListener('click', () => {
    orderForm.classList.remove('hidden');
    cartModal.classList.add('hidden');
});

closeForm.addEventListener('click', () => {
    orderForm.classList.add('hidden');
});

document.querySelector('#order-form form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Заказ создан!');
    orderForm.classList.add('hidden');
});
