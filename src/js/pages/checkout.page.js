/**
 * @fileoverview Checkout Page Controller for Shoppio
 * @description Handles multi-step checkout process
 * @version 1.0.0
 */

'use strict';

/**
 * Checkout Page Controller
 * @namespace CheckoutPage
 */
const CheckoutPage = {
    /** @type {number} Current checkout step */
    currentStep: 1,
    
    /** @type {Object} Shipping data */
    shippingData: {},
    
    /** @type {Object} Payment data */
    paymentData: {},
    
    /** @type {string} Selected shipping method */
    shippingMethod: 'standard',
    
    /**
     * Initialize checkout page
     */
    init() {
        // Require login
        if (!AuthService.isLoggedIn()) {
            localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, 'checkout.html');
            window.location.href = 'login.html';
            return;
        }
        
        // Check if cart is empty
        if (CartService.isEmpty()) {
            window.location.href = 'cart.html';
            return;
        }
        
        this.renderOrderSummary();
        this.prefillUserData();
        this.setupSteps();
        this.setupShippingForm();
        this.setupPaymentForm();
        this.setupPlaceOrder();
    },
    
    /**
     * Render order summary sidebar
     */
    renderOrderSummary() {
        const container = document.getElementById('order-items');
        const cartItems = CartService.getItems();
        
        if (container) {
            container.innerHTML = cartItems.map(item => `
                <div class="order-item" data-testid="order-item">
                    <div class="order-item-image">
                        <img src="${item.product.image}" alt="${item.product.name}">
                        <span class="order-item-qty">${item.quantity}</span>
                    </div>
                    <div class="order-item-details">
                        <h4>${item.product.name}</h4>
                        ${item.options.size ? `<span>Size: ${item.options.size}</span>` : ''}
                    </div>
                    <span class="order-item-price">${formatPrice(item.product.price * item.quantity)}</span>
                </div>
            `).join('');
        }
        
        this.updateOrderTotals();
    },
    
    /**
     * Update order totals
     */
    updateOrderTotals() {
        const promoCode = localStorage.getItem(STORAGE_KEYS.PROMO_CODE);
        const totals = CartService.getTotals(promoCode, this.shippingMethod);
        
        this.setElementText('order-subtotal', formatPrice(totals.subtotal));
        this.setElementText('order-shipping', totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping));
        this.setElementText('order-tax', formatPrice(totals.tax));
        this.setElementText('order-total', formatPrice(totals.total));
        
        const discountRow = document.getElementById('order-discount-row');
        const discountEl = document.getElementById('order-discount');
        if (discountRow && discountEl) {
            if (totals.discount > 0) {
                discountRow.style.display = 'flex';
                discountEl.textContent = `-${formatPrice(totals.discount)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }
    },
    
    /**
     * Helper to set element text
     */
    setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    },
    
    /**
     * Prefill user data in forms
     */
    prefillUserData() {
        const user = AuthService.currentUser;
        if (!user) return;
        
        this.setInputValue('shipping-firstname', user.firstName);
        this.setInputValue('shipping-lastname', user.lastName);
        this.setInputValue('shipping-email', user.email);
        this.setInputValue('shipping-phone', user.phone);
        
        if (user.address) {
            this.setInputValue('shipping-address', user.address.street);
            this.setInputValue('shipping-city', user.address.city);
            this.setInputValue('shipping-state', user.address.state);
            this.setInputValue('shipping-pincode', user.address.pincode);
        }
    },
    
    /**
     * Helper to set input value
     */
    setInputValue(id, value) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    },
    
    /**
     * Setup step navigation
     */
    setupSteps() {
        this.showStep(1);
    },
    
    /**
     * Show specific step
     * @param {number} step - Step number
     */
    showStep(step) {
        this.currentStep = step;
        
        // Update step indicators
        document.querySelectorAll('.checkout-step').forEach((el, index) => {
            el.classList.remove('active', 'completed');
            if (index + 1 < step) {
                el.classList.add('completed');
            } else if (index + 1 === step) {
                el.classList.add('active');
            }
        });
        
        // Show/hide step content
        document.querySelectorAll('.step-content').forEach((content, index) => {
            content.classList.toggle('active', index + 1 === step);
        });
        
        scrollToTop();
    },
    
    /**
     * Setup shipping form
     */
    setupShippingForm() {
        const continueBtn = document.getElementById('continue-to-payment');
        
        // Shipping method selection
        document.querySelectorAll('input[name="shipping-method"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.shippingMethod = radio.value;
                this.updateOrderTotals();
            });
        });
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (this.validateShippingForm()) {
                    this.collectShippingData();
                    this.showStep(2);
                }
            });
        }
        
        // Populate states dropdown
        const stateSelect = document.getElementById('shipping-state');
        if (stateSelect) {
            stateSelect.innerHTML = '<option value="">Select State</option>' +
                INDIAN_STATES.map(state => `<option value="${state}">${state}</option>`).join('');
        }
    },
    
    /**
     * Validate shipping form
     * @returns {boolean} True if valid
     */
    validateShippingForm() {
        const requiredFields = [
            'shipping-firstname', 'shipping-lastname', 'shipping-email',
            'shipping-phone', 'shipping-address', 'shipping-city',
            'shipping-state', 'shipping-pincode'
        ];
        
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                const value = input.value.trim();
                if (!value) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            }
        });
        
        // Validate phone
        const phone = document.getElementById('shipping-phone')?.value;
        if (phone && !validatePhone(phone)) {
            document.getElementById('shipping-phone')?.classList.add('error');
            showToast('Please enter a valid 10-digit phone number', 'error');
            return false;
        }
        
        // Validate pincode
        const pincode = document.getElementById('shipping-pincode')?.value;
        if (pincode && !validatePincode(pincode)) {
            document.getElementById('shipping-pincode')?.classList.add('error');
            showToast('Please enter a valid 6-digit PIN code', 'error');
            return false;
        }
        
        // Validate email
        const email = document.getElementById('shipping-email')?.value;
        if (email && !validateEmail(email)) {
            document.getElementById('shipping-email')?.classList.add('error');
            showToast('Please enter a valid email address', 'error');
            return false;
        }
        
        if (!isValid) {
            showToast('Please fill in all required fields', 'error');
        }
        
        return isValid;
    },
    
    /**
     * Collect shipping form data
     */
    collectShippingData() {
        this.shippingData = {
            firstName: document.getElementById('shipping-firstname')?.value || '',
            lastName: document.getElementById('shipping-lastname')?.value || '',
            email: document.getElementById('shipping-email')?.value || '',
            phone: document.getElementById('shipping-phone')?.value || '',
            address: document.getElementById('shipping-address')?.value || '',
            apartment: document.getElementById('shipping-apartment')?.value || '',
            city: document.getElementById('shipping-city')?.value || '',
            state: document.getElementById('shipping-state')?.value || '',
            pincode: document.getElementById('shipping-pincode')?.value || '',
            country: 'India',
            method: this.shippingMethod
        };
    },
    
    /**
     * Setup payment form
     */
    setupPaymentForm() {
        const continueBtn = document.getElementById('continue-to-review');
        const backBtn = document.getElementById('back-to-shipping');
        
        // Payment method selection
        document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const cardDetails = document.getElementById('card-details');
                const upiDetails = document.getElementById('upi-details');
                
                if (cardDetails) cardDetails.style.display = radio.value === 'card' ? 'block' : 'none';
                if (upiDetails) upiDetails.style.display = radio.value === 'upi' ? 'block' : 'none';
            });
        });
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (this.validatePaymentForm()) {
                    this.collectPaymentData();
                    this.populateReview();
                    this.showStep(3);
                }
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showStep(1);
            });
        }
    },
    
    /**
     * Validate payment form
     * @returns {boolean} True if valid
     */
    validatePaymentForm() {
        const method = document.querySelector('input[name="payment-method"]:checked')?.value;
        
        if (!method) {
            showToast('Please select a payment method', 'error');
            return false;
        }
        
        if (method === 'card') {
            const cardNumber = document.getElementById('card-number')?.value;
            const cardExpiry = document.getElementById('card-expiry')?.value;
            const cardCvv = document.getElementById('card-cvv')?.value;
            
            if (!cardNumber || !cardExpiry || !cardCvv) {
                showToast('Please fill in all card details', 'error');
                return false;
            }
        }
        
        if (method === 'upi') {
            const upiId = document.getElementById('upi-id')?.value;
            if (!upiId) {
                showToast('Please enter your UPI ID', 'error');
                return false;
            }
        }
        
        return true;
    },
    
    /**
     * Collect payment form data
     */
    collectPaymentData() {
        const method = document.querySelector('input[name="payment-method"]:checked')?.value;
        
        this.paymentData = {
            method,
            cardLast4: method === 'card' ? document.getElementById('card-number')?.value.slice(-4) : null,
            upiId: method === 'upi' ? document.getElementById('upi-id')?.value : null
        };
    },
    
    /**
     * Populate review step
     */
    populateReview() {
        // Shipping review
        const shippingReview = document.getElementById('review-shipping');
        if (shippingReview) {
            const s = this.shippingData;
            shippingReview.innerHTML = `
                <p><strong>${s.firstName} ${s.lastName}</strong></p>
                <p>${s.address}${s.apartment ? ', ' + s.apartment : ''}</p>
                <p>${s.city}, ${s.state} - ${s.pincode}</p>
                <p>Phone: ${s.phone}</p>
                <p>Email: ${s.email}</p>
            `;
        }
        
        // Payment review
        const paymentReview = document.getElementById('review-payment');
        if (paymentReview) {
            const p = this.paymentData;
            const methodNames = {
                card: `Credit/Debit Card ending in ${p.cardLast4}`,
                upi: `UPI (${p.upiId})`,
                netbanking: 'Net Banking',
                cod: 'Cash on Delivery',
                wallet: 'Wallet'
            };
            paymentReview.innerHTML = `<p>${methodNames[p.method] || p.method}</p>`;
        }
        
        // Items review
        const itemsReview = document.getElementById('review-items');
        if (itemsReview) {
            const cartItems = CartService.getItems();
            itemsReview.innerHTML = cartItems.map(item => `
                <div class="review-item">
                    <img src="${item.product.image}" alt="${item.product.name}">
                    <div>
                        <h4>${item.product.name}</h4>
                        <p>Qty: ${item.quantity} × ${formatPrice(item.product.price)}</p>
                    </div>
                </div>
            `).join('');
        }
    },
    
    /**
     * Setup place order button
     */
    setupPlaceOrder() {
        const placeOrderBtn = document.getElementById('place-order-btn');
        const backBtn = document.getElementById('back-to-payment');
        
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                this.placeOrder();
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showStep(2);
            });
        }
        
        // Edit buttons
        document.querySelectorAll('[data-edit-step]').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.dataset.editStep);
                this.showStep(step);
            });
        });
    },
    
    /**
     * Place order
     */
    placeOrder() {
        const promoCode = localStorage.getItem(STORAGE_KEYS.PROMO_CODE);
        const totals = CartService.getTotals(promoCode, this.shippingMethod);
        
        const order = OrderService.createOrder({
            items: CartService.getItems().map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
                options: item.options
            })),
            shipping: this.shippingData,
            payment: { method: this.paymentData.method },
            subtotal: totals.subtotal,
            shippingCost: totals.shipping,
            tax: totals.tax,
            discount: totals.discount,
            promoCode: promoCode,
            total: totals.total
        });
        
        // Clear cart and promo
        CartService.clear();
        localStorage.removeItem(STORAGE_KEYS.PROMO_CODE);
        
        // Redirect to confirmation
        showToast('Order placed successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'order-confirmation.html';
        }, 1000);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'checkout' || document.getElementById('checkout-form')) {
        CheckoutPage.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutPage;
}
