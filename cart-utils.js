// cart-utils.js
function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-counter').textContent = totalQuantity;
}