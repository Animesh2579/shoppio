/**
 * @fileoverview Cart Service for Shoppio
 * @description Handles shopping cart operations with localStorage persistence
 * @version 1.0.0
 */

'use strict';

/**
 * Cart Service
 * @namespace CartService
 */
const CartService = {
    /** @type {Array} Cart items */
    items: [],
    
    /**
     * Initialize cart service
     */
    init() {
        this.loadCart();
        this.updateCartCount();
    },
    
    /**
     * Load cart from localStorage
     */
    loadCart() {
        try {
            const cartData = localStorage.getItem(STORAGE_KEYS.CART);
            if (cartData) {
                this.items = JSON.parse(cartData);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
    },
    
    /**
     * Save cart to localStorage
     */
    saveCart() {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.items));
        this.updateCartCount();
    },
    
    /**
     * Add item to cart (requires login)
     * @param {number} productId - Product ID
     * @param {number} quantity - Quantity to add
     * @param {Object} options - Product options (size, color, etc.)
     * @returns {Object} Result object
     */
    addItem(productId, quantity = 1, options = {}) {
        // Check if user is logged in
        if (!AuthService.isLoggedIn()) {
            // Store intended action and redirect to login
            localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, window.location.href);
            showToast('Please login to add items to cart', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return { success: false, requiresLogin: true };
        }
        
        const product = ProductService.getById(productId);
        if (!product) {
            return { success: false, error: 'Product not found' };
        }
        
        if (product.stock < quantity) {
            return { success: false, error: 'Insufficient stock' };
        }
        
        // Check if item already exists with same options
        const existingIndex = this.items.findIndex(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (existingIndex !== -1) {
            // Update quantity
            const newQuantity = this.items[existingIndex].quantity + quantity;
            if (newQuantity > product.stock) {
                return { success: false, error: 'Cannot add more than available stock' };
            }
            this.items[existingIndex].quantity = newQuantity;
        } else {
            // Add new item
            this.items.push({
                productId,
                quantity,
                options,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        return { success: true };
    },
    
    /**
     * Remove item from cart
     * @param {number} productId - Product ID
     * @param {Object} options - Product options
     */
    removeItem(productId, options = {}) {
        this.items = this.items.filter(item => 
            !(item.productId === productId && 
              JSON.stringify(item.options) === JSON.stringify(options))
        );
        this.saveCart();
    },
    
    /**
     * Update item quantity
     * @param {number} productId - Product ID
     * @param {number} quantity - New quantity
     * @param {Object} options - Product options
     * @returns {Object} Result object
     */
    updateQuantity(productId, quantity, options = {}) {
        const product = ProductService.getById(productId);
        
        if (quantity <= 0) {
            this.removeItem(productId, options);
            return { success: true };
        }
        
        if (product && quantity > product.stock) {
            return { success: false, error: 'Exceeds available stock' };
        }
        
        const item = this.items.find(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            return { success: true };
        }
        
        return { success: false, error: 'Item not found' };
    },
    
    /**
     * Get cart item
     * @param {number} productId - Product ID
     * @param {Object} options - Product options
     * @returns {Object|null} Cart item or null
     */
    getItem(productId, options = {}) {
        return this.items.find(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        ) || null;
    },
    
    /**
     * Get all cart items with product details
     * @returns {Array} Cart items with product data
     */
    getItems() {
        return this.items.map(item => {
            const product = ProductService.getById(item.productId);
            return product ? { ...item, product } : null;
        }).filter(Boolean);
    },
    
    /**
     * Get total item count
     * @returns {number} Total items in cart
     */
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    /**
     * Get cart subtotal
     * @returns {number} Subtotal amount
     */
    getSubtotal() {
        return this.items.reduce((total, item) => {
            const product = ProductService.getById(item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    },
    
    /**
     * Get shipping cost
     * @param {number} subtotal - Cart subtotal
     * @param {string} method - Shipping method
     * @returns {number} Shipping cost
     */
    getShipping(subtotal, method = 'standard') {
        // Free shipping above threshold
        if (subtotal >= APP_CONFIG.shipping.freeThreshold) {
            return 0;
        }
        
        switch (method) {
            case 'express':
                return APP_CONFIG.shipping.expressRate;
            case 'overnight':
                return APP_CONFIG.shipping.overnightRate;
            default:
                return APP_CONFIG.shipping.standardRate;
        }
    },
    
    /**
     * Get GST amount
     * @param {number} subtotal - Cart subtotal
     * @returns {number} GST amount
     */
    getTax(subtotal) {
        return Math.round(subtotal * APP_CONFIG.tax.rate);
    },
    
    /**
     * Apply promo code
     * @param {string} code - Promo code
     * @returns {Object} Result with promo details
     */
    applyPromoCode(code) {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (!promo) {
            return { success: false, error: 'Invalid promo code' };
        }
        return { success: true, promo };
    },
    
    /**
     * Calculate discount amount
     * @param {number} subtotal - Cart subtotal
     * @param {string} promoCode - Applied promo code
     * @returns {number} Discount amount
     */
    getDiscount(subtotal, promoCode) {
        if (!promoCode) return 0;
        
        const promo = PROMO_CODES[promoCode.toUpperCase()];
        if (!promo) return 0;
        
        if (promo.type === 'percent') {
            return Math.round(subtotal * (promo.discount / 100));
        } else if (promo.type === 'fixed') {
            return Math.min(promo.discount, subtotal);
        }
        
        return 0;
    },
    
    /**
     * Get cart totals
     * @param {string} promoCode - Applied promo code
     * @param {string} shippingMethod - Shipping method
     * @returns {Object} Cart totals
     */
    getTotals(promoCode = null, shippingMethod = 'standard') {
        const subtotal = this.getSubtotal();
        const shipping = this.getShipping(subtotal, shippingMethod);
        const tax = this.getTax(subtotal);
        const discount = this.getDiscount(subtotal, promoCode);
        
        // Check for free shipping promo
        let finalShipping = shipping;
        if (promoCode && PROMO_CODES[promoCode.toUpperCase()]?.type === 'freeshipping') {
            finalShipping = 0;
        }
        
        const total = subtotal + finalShipping + tax - discount;
        
        return {
            subtotal,
            shipping: finalShipping,
            tax,
            discount,
            total: Math.max(0, total)
        };
    },
    
    /**
     * Clear cart
     */
    clear() {
        this.items = [];
        this.saveCart();
    },
    
    /**
     * Check if cart is empty
     * @returns {boolean} True if empty
     */
    isEmpty() {
        return this.items.length === 0;
    },
    
    /**
     * Update cart count in UI
     */
    updateCartCount() {
        const count = this.getItemCount();
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

/**
 * Wishlist Service
 * @namespace WishlistService
 */
const WishlistService = {
    /** @type {Array} Wishlist product IDs */
    items: [],
    
    /**
     * Initialize wishlist service
     */
    init() {
        this.loadWishlist();
    },
    
    /**
     * Load wishlist from localStorage
     */
    loadWishlist() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
            if (data) {
                this.items = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
            this.items = [];
        }
    },
    
    /**
     * Save wishlist to localStorage
     */
    saveWishlist() {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(this.items));
    },
    
    /**
     * Add item to wishlist (requires login)
     * @param {number} productId - Product ID
     * @returns {Object} Result object
     */
    addItem(productId) {
        if (!AuthService.isLoggedIn()) {
            showToast('Please login to add to wishlist', 'warning');
            return { success: false, requiresLogin: true };
        }
        
        if (!this.items.includes(productId)) {
            this.items.push(productId);
            this.saveWishlist();
            return { success: true, added: true };
        }
        return { success: true, added: false };
    },
    
    /**
     * Remove item from wishlist
     * @param {number} productId - Product ID
     */
    removeItem(productId) {
        this.items = this.items.filter(id => id !== productId);
        this.saveWishlist();
    },
    
    /**
     * Toggle item in wishlist
     * @param {number} productId - Product ID
     * @returns {Object} Result with added status
     */
    toggleItem(productId) {
        if (!AuthService.isLoggedIn()) {
            showToast('Please login to add to wishlist', 'warning');
            return { success: false, requiresLogin: true };
        }
        
        if (this.hasItem(productId)) {
            this.removeItem(productId);
            return { success: true, added: false };
        } else {
            this.items.push(productId);
            this.saveWishlist();
            return { success: true, added: true };
        }
    },
    
    /**
     * Check if item is in wishlist
     * @param {number} productId - Product ID
     * @returns {boolean} True if in wishlist
     */
    hasItem(productId) {
        return this.items.includes(productId);
    },
    
    /**
     * Get all wishlist items with product details
     * @returns {Array} Products in wishlist
     */
    getItems() {
        return this.items
            .map(id => ProductService.getById(id))
            .filter(Boolean);
    },
    
    /**
     * Get wishlist count
     * @returns {number} Number of items
     */
    getCount() {
        return this.items.length;
    },
    
    /**
     * Clear wishlist
     */
    clear() {
        this.items = [];
        this.saveWishlist();
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CartService, WishlistService };
}
