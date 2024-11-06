// Product data
const products = {
    1: {
        name: "Product 1",
        price: 99.99
    },
    2: {
        name: "Product 2",
        price: 149.99
    }
};

// PayPal button rendering function
function renderPayPalButton(productId) {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: products[productId].name,
                    amount: {
                        currency_code: "USD",
                        value: products[productId].price
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderData) {
                // Successful payment
                console.log('Capture result', orderData);
                alert('Transaction completed by ' + orderData.payer.name.given_name);
                
                // You can add custom success handling here
                handleSuccessfulPayment(orderData, productId);
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            alert('There was an error processing your payment. Please try again.');
        }
    }).render('#paypal-button-container-' + productId);
}

// Handle successful payment
function handleSuccessfulPayment(orderData, productId) {
    // You could store the order details in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        orderId: orderData.id,
        productId: productId,
        productName: products[productId].name,
        amount: products[productId].price,
        date: new Date().toISOString(),
        payerName: orderData.payer.name.given_name + ' ' + orderData.payer.name.surname,
        payerEmail: orderData.payer.email_address
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    // Redirect to success page or show success message
    showSuccessMessage(orderData.id);
}

// Show success message
function showSuccessMessage(orderId) {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <h3>Payment Successful!</h3>
        <p>Order ID: ${orderId}</p>
        <p>Thank you for your purchase.</p>
    `;
    document.querySelector('main').appendChild(message);
}

// Initialize PayPal buttons
window.onload = function() {
    // Render PayPal buttons for each product
    renderPayPalButton(1);
    renderPayPalButton(2);
};