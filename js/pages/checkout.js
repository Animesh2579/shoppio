// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
});

let currentStep = 1;
let shippingData = {};
let paymentData = {};
let selectedShipping = 'standard';

function initCheckoutPage() {
    // Check if cart is empty
    if (Cart.isEmpty()) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Check if user is logged in
    if (!Auth.isLoggedIn()) {
        localStorage.setItem('shoppio_redirect', 'checkout.html');
        window.location.href = 'login.html';
        return;
    }
    
    renderOrderSummary();
    initSteps();
    initShippingForm();
    initPaymentForm();
    prefillUserData();
}

function renderOrderSummary() {
    const summaryItemsContainer = document.getElementById('summary-items');
    const cartItems = Cart.getItems();
    
    if (summaryItemsContainer) {
        summaryItemsContainer.innerHTML = cartItems.map(item => `
            <div class="summary-item">
                <div class="summary-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}">
                </div>
                <div class="summary-item-details">
                    <h4>${item.product.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <span class="summary-item-price">${formatPrice(item.product.price * item.quantity)}</span>
            </div>
        `).join('');
    }
    
    updateOrderTotals();
}

function updateOrderTotals() {
    const promoCode = localStorage.getItem('shoppio_promo');
    const totals = Cart.getTotal(promoCode);
    
    // Add shipping cost based on selected method
    let shippingCost = totals.shipping;
    if (selectedShipping === 'express') {
        shippingCost = 9.99;
    } else if (selectedShipping === 'overnight') {
        shippingCost = 19.99;
    }
    
    const finalTotal = totals.subtotal + shippingCost + totals.tax - totals.discount;
    
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const taxEl = document.getElementById('summary-tax');
    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    const totalEl = document.getElementById('summary-total');
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (shippingEl) shippingEl.textContent = shippingCost === 0 ? 'FREE' : formatPrice(shippingCost);
    if (taxEl) taxEl.textContent = formatPrice(totals.tax);
    
    if (discountRow && discountEl) {
        if (totals.discount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `-${formatPrice(totals.discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    
    if (totalEl) totalEl.textContent = formatPrice(finalTotal);
}

function initSteps() {
    showStep(1);
}

function showStep(step) {
    currentStep = step;
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });
    
    // Show/hide step content
    document.querySelectorAll('.checkout-step-content').forEach((content, index) => {
        content.classList.toggle('active', index + 1 === step);
    });
}

function initShippingForm() {
    const shippingForm = document.getElementById('shipping-form');
    const continueToPaymentBtn = document.getElementById('continue-to-payment');
    
    // Shipping method selection
    document.querySelectorAll('input[name="shipping-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            selectedShipping = radio.value;
            updateOrderTotals();
        });
    });
    
    if (continueToPaymentBtn) {
        continueToPaymentBtn.addEventListener('click', () => {
            if (validateShippingForm()) {
                collectShippingData();
                showStep(2);
            }
        });
    }
}

function validateShippingForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (input && !input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else if (input) {
            input.classList.remove('error');
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields', 'error');
    }
    
    return isValid;
}

function collectShippingData() {
    shippingData = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || '',
        apartment: document.getElementById('apartment')?.value || '',
        city: document.getElementById('city')?.value || '',
        state: document.getElementById('state')?.value || '',
        zip: document.getElementById('zip')?.value || '',
        country: document.getElementById('country')?.value || '',
        shippingMethod: selectedShipping
    };
}

function initPaymentForm() {
    const continueToReviewBtn = document.getElementById('continue-to-review');
    const backToShippingBtn = document.getElementById('back-to-shipping');
    
    if (continueToReviewBtn) {
        continueToReviewBtn.addEventListener('click', () => {
            if (validatePaymentForm()) {
                collectPaymentData();
                populateReview();
                showStep(3);
            }
        });
    }
    
    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', () => {
            showStep(1);
        });
    }
    
    // Payment method selection
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const cardDetails = document.getElementById('card-details');
            if (cardDetails) {
                cardDetails.style.display = radio.value === 'card' ? 'block' : 'none';
            }
        });
    });
}

function validatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
    
    if (!paymentMethod) {
        showToast('Please select a payment method', 'error');
        return false;
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber')?.value;
        const cardExpiry = document.getElementById('cardExpiry')?.value;
        const cardCvv = document.getElementById('cardCvv')?.value;
        
        if (!cardNumber || !cardExpiry || !cardCvv) {
            showToast('Please fill in all card details', 'error');
            return false;
        }
    }
    
    return true;
}

function collectPaymentData() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
    
    paymentData = {
        method: paymentMethod,
        cardNumber: paymentMethod === 'card' ? document.getElementById('cardNumber')?.value : null,
        cardExpiry: paymentMethod === 'card' ? document.getElementById('cardExpiry')?.value : null
    };
}

function populateReview() {
    // Shipping review
    const shippingReview = document.getElementById('shipping-review');
    if (shippingReview) {
        shippingReview.innerHTML = `
            <p><strong>${shippingData.firstName} ${shippingData.lastName}</strong></p>
            <p>${shippingData.address}${shippingData.apartment ? ', ' + shippingData.apartment : ''}</p>
            <p>${shippingData.city}, ${shippingData.state} ${shippingData.zip}</p>
            <p>${shippingData.country}</p>
            <p>${shippingData.phone}</p>
        `;
    }
    
    // Payment review
    const paymentReview = document.getElementById('payment-review');
    if (paymentReview) {
        if (paymentData.method === 'card') {
            const lastFour = paymentData.cardNumber?.slice(-4) || '****';
            paymentReview.innerHTML = `<p>Credit Card ending in ${lastFour}</p>`;
        } else if (paymentData.method === 'paypal') {
            paymentReview.innerHTML = `<p>PayPal</p>`;
        } else {
            paymentReview.innerHTML = `<p>Apple Pay</p>`;
        }
    }
    
    // Items review
    const itemsReview = document.getElementById('items-review');
    if (itemsReview) {
        const cartItems = Cart.getItems();
        itemsReview.innerHTML = cartItems.map(item => `
            <div class="summary-item">
                <div class="summary-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}">
                </div>
                <div class="summary-item-details">
                    <h4>${item.product.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <span class="summary-item-price">${formatPrice(item.product.price * item.quantity)}</span>
            </div>
        `).join('');
    }
}

function prefillUserData() {
    if (Auth.currentUser) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        if (firstNameInput) firstNameInput.value = Auth.currentUser.firstName || '';
        if (lastNameInput) lastNameInput.value = Auth.currentUser.lastName || '';
        if (emailInput) emailInput.value = Auth.currentUser.email || '';
        if (phoneInput) phoneInput.value = Auth.currentUser.phone || '';
    }
}

// Place Order
const placeOrderBtn = document.getElementById('place-order-btn');
const backToPaymentBtn = document.getElementById('back-to-payment');

if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
        // Generate order
        const orderId = generateOrderId();
        const promoCode = localStorage.getItem('shoppio_promo');
        const totals = Cart.getTotal(promoCode);
        
        // Calculate shipping cost
        let shippingCost = totals.shipping;
        if (selectedShipping === 'express') shippingCost = 9.99;
        if (selectedShipping === 'overnight') shippingCost = 19.99;
        
        const order = {
            id: orderId,
            date: new Date().toISOString(),
            status: 'processing',
            items: Cart.getItems().map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
                options: item.options
            })),
            shipping: shippingData,
            payment: { method: paymentData.method },
            subtotal: totals.subtotal,
            shippingCost: shippingCost,
            tax: totals.tax,
            discount: totals.discount,
            total: totals.subtotal + shippingCost + totals.tax - totals.discount
        };
        
        // Save order
        const orders = JSON.parse(localStorage.getItem('shoppio_orders') || '[]');
        orders.push(order);
        localStorage.setItem('shoppio_orders', JSON.stringify(orders));
        
        // Clear cart and promo
        Cart.clear();
        localStorage.removeItem('shoppio_promo');
        
        // Store order for confirmation page
        localStorage.setItem('shoppio_last_order', JSON.stringify(order));
        
        // Redirect to confirmation
        window.location.href = 'order-confirmation.html';
    });
}

if (backToPaymentBtn) {
    backToPaymentBtn.addEventListener('click', () => {
        showStep(2);
    });
}

// Edit buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.edit-btn')) {
        const btn = e.target.closest('.edit-btn');
        const step = parseInt(btn.dataset.step);
        if (step) showStep(step);
    }
});
