/**
 * @fileoverview Cart Page Controller for Shoppio
 * @description Handles shopping cart display, updates, and promo codes
 * @version 1.0.0
 */

'use strict';

/**
 * Cart Page Controller
 * @namespace CartPage
 */
const CartPage = {
    /** @type {string|null} Applied promo code */
    appliedPromo: null,
    
    /**
     * Initialize cart page
     */
    init() {
        this.loadAppliedPromo();
        this.renderCart();
        this.setupPromoCode();
        this.setupCheckoutButton();
    },
    
    /**
     * Load previously applied promo code
     */
    loadAppliedPromo() {
        this.appliedPromo = localStorage.getItem(STORAGE_KEYS.PROMO_CODE) || null;
    },
    
    /**
     * Render cart contents
     */
    renderCart() {
        const cartContainer = document.getElementById('cart-items-container');
        const cartSummary = document.getElementById('cart-summary');
        const emptyCart = document.getElementById('empty-cart');
        const cartItemsList = document.getElementById('cart-items-list');
        
        if (!cartContainer) return;
        
        const cartItems = CartService.getItems();
        
        // Show/hide empty cart message
        if (cartItems.length === 0) {
            if (cartContainer) cartContainer.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }
        
        if (cartContainer) cartContainer.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
        
        // Render cart items
        if (cartItemsList) {
            cartItemsList.innerHTML = cartItems.map(item => this.createCartItemHTML(item)).join('');
            this.setupCartItemEvents();
        }
        
        // Update summary
        this.updateSummary();
    },
    
    /**
     * Create HTML for cart item
     * @param {Object} item - Cart item with product
     * @returns {string} HTML string
     */
    createCartItemHTML(item) {
        const p = item.product;
        const itemTotal = p.price * item.quantity;
        
        return `
            <div class="cart-item" data-product-id="${item.productId}" data-options='${JSON.stringify(item.options)}' data-testid="cart-item">
                <div class="cart-item-image">
                    <a href="product-detail.html?id=${item.productId}">
                        <img src="${p.image}" alt="${p.name}">
                    </a>
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">
                        <a href="product-detail.html?id=${item.productId}">${p.name}</a>
                    </h3>
                    ${item.options.size ? `<p class="cart-item-option">Size: ${item.options.size}</p>` : ''}
                    ${item.options.color ? `<p class="cart-item-option">Color: ${item.options.color}</p>` : ''}
                    <p class="cart-item-seller">Sold by: ${p.seller || 'Shoppio'}</p>
                    <p class="cart-item-price">${formatPrice(p.price)}</p>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-control">
                        <button class="qty-btn qty-decrease" data-testid="qty-decrease">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${p.stock}" data-testid="qty-input">
                        <button class="qty-btn qty-increase" data-testid="qty-increase">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <span class="item-total">${formatPrice(itemTotal)}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" title="Remove item" data-testid="remove-item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="move-to-wishlist-btn" title="Move to Wishlist" data-testid="move-to-wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
    },
    
    /**
     * Setup cart item event listeners
     */
    setupCartItemEvents() {
        const cartItemsList = document.getElementById('cart-items-list');
        if (!cartItemsList) return;
        
        cartItemsList.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;
            
            const productId = parseInt(cartItem.dataset.productId);
            const options = JSON.parse(cartItem.dataset.options || '{}');
            
            // Remove item
            if (e.target.closest('.remove-btn')) {
                CartService.removeItem(productId, options);
                this.renderCart();
                showToast('Item removed from cart', 'success');
            }
            
            // Move to wishlist
            if (e.target.closest('.move-to-wishlist-btn')) {
                WishlistService.addItem(productId);
                CartService.removeItem(productId, options);
                this.renderCart();
                showToast('Moved to wishlist', 'success');
            }
            
            // Decrease quantity
            if (e.target.closest('.qty-decrease')) {
                const item = CartService.getItem(productId, options);
                if (item && item.quantity > 1) {
                    CartService.updateQuantity(productId, item.quantity - 1, options);
                    this.renderCart();
                }
            }
            
            // Increase quantity
            if (e.target.closest('.qty-increase')) {
                const item = CartService.getItem(productId, options);
                const product = ProductService.getById(productId);
                if (item && product && item.quantity < product.stock) {
                    CartService.updateQuantity(productId, item.quantity + 1, options);
                    this.renderCart();
                }
            }
        });
        
        // Quantity input change
        cartItemsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const cartItem = e.target.closest('.cart-item');
                const productId = parseInt(cartItem.dataset.productId);
                const options = JSON.parse(cartItem.dataset.options || '{}');
                let quantity = parseInt(e.target.value);
                
                const product = ProductService.getById(productId);
                if (isNaN(quantity) || quantity < 1) quantity = 1;
                if (product && quantity > product.stock) quantity = product.stock;
                
                CartService.updateQuantity(productId, quantity, options);
                this.renderCart();
            }
        });
    },
    
    /**
     * Update cart summary
     */
    updateSummary() {
        const totals = CartService.getTotals(this.appliedPromo);
        
        this.setElementText('cart-subtotal', formatPrice(totals.subtotal));
        this.setElementText('cart-shipping', totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping));
        this.setElementText('cart-tax', formatPrice(totals.tax));
        this.setElementText('cart-total', formatPrice(totals.total));
        
        // Discount row
        const discountRow = document.getElementById('discount-row');
        const discountEl = document.getElementById('cart-discount');
        if (discountRow && discountEl) {
            if (totals.discount > 0) {
                discountRow.style.display = 'flex';
                discountEl.textContent = `-${formatPrice(totals.discount)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }
        
        // Free shipping message
        const freeShippingMsg = document.getElementById('free-shipping-msg');
        if (freeShippingMsg) {
            const remaining = APP_CONFIG.shipping.freeThreshold - totals.subtotal;
            if (remaining > 0) {
                freeShippingMsg.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more for FREE delivery`;
                freeShippingMsg.style.display = 'block';
            } else {
                freeShippingMsg.innerHTML = '<i class="fas fa-check-circle"></i> You qualify for FREE delivery!';
                freeShippingMsg.style.display = 'block';
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
     * Setup promo code functionality
     */
    setupPromoCode() {
        const promoForm = document.getElementById('promo-form');
        const promoInput = document.getElementById('promo-input');
        const promoMessage = document.getElementById('promo-message');
        const removePromoBtn = document.getElementById('remove-promo');
        
        if (promoForm && promoInput) {
            promoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = promoInput.value.trim().toUpperCase();
                
                if (!code) return;
                
                const result = CartService.applyPromoCode(code);
                
                if (result.success) {
                    this.appliedPromo = code;
                    localStorage.setItem(STORAGE_KEYS.PROMO_CODE, code);
                    
                    if (promoMessage) {
                        promoMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${result.promo.description}`;
                        promoMessage.className = 'promo-message success';
                    }
                    
                    this.updateSummary();
                    showToast('Promo code applied!', 'success');
                } else {
                    if (promoMessage) {
                        promoMessage.innerHTML = `<i class="fas fa-times-circle"></i> ${result.error}`;
                        promoMessage.className = 'promo-message error';
                    }
                    showToast(result.error, 'error');
                }
            });
        }
        
        if (removePromoBtn) {
            removePromoBtn.addEventListener('click', () => {
                this.appliedPromo = null;
                localStorage.removeItem(STORAGE_KEYS.PROMO_CODE);
                if (promoInput) promoInput.value = '';
                if (promoMessage) {
                    promoMessage.textContent = '';
                    promoMessage.className = 'promo-message';
                }
                this.updateSummary();
                showToast('Promo code removed', 'info');
            });
        }
    },
    
    /**
     * Setup checkout button
     */
    setupCheckoutButton() {
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (CartService.isEmpty()) {
                    showToast('Your cart is empty', 'error');
                    return;
                }
                
                // Check if logged in
                if (!AuthService.isLoggedIn()) {
                    localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, 'checkout.html');
                    showToast('Please login to proceed', 'warning');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                    return;
                }
                
                window.location.href = 'checkout.html';
            });
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'cart' || document.getElementById('cart-items-list')) {
        CartPage.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartPage;
}
