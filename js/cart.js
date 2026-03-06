// Cart Module
const Cart = {
    items: [],
    
    init() {
        this.loadCart();
        this.updateCartCount();
    },
    
    loadCart() {
        const cartData = localStorage.getItem('shoppio_cart');
        if (cartData) {
            this.items = JSON.parse(cartData);
        }
    },
    
    saveCart() {
        localStorage.setItem('shoppio_cart', JSON.stringify(this.items));
        this.updateCartCount();
    },
    
    addItem(productId, quantity = 1, options = {}) {
        const product = getProductById(productId);
        if (!product) return false;
        
        const existingItem = this.items.find(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId,
                quantity,
                options,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        return true;
    },
    
    removeItem(productId, options = {}) {
        this.items = this.items.filter(item => 
            !(item.productId === productId && 
              JSON.stringify(item.options) === JSON.stringify(options))
        );
        this.saveCart();
    },
    
    updateQuantity(productId, quantity, options = {}) {
        const item = this.items.find(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId, options);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    },
    
    getItem(productId, options = {}) {
        return this.items.find(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
    },
    
    getItems() {
        return this.items.map(item => {
            const product = getProductById(item.productId);
            return {
                ...item,
                product
            };
        }).filter(item => item.product);
    },
    
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    getSubtotal() {
        return this.items.reduce((total, item) => {
            const product = getProductById(item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    },
    
    getShipping(subtotal) {
        // Free shipping over $50
        return subtotal >= 50 ? 0 : 5.99;
    },
    
    getTax(subtotal) {
        // 10% tax
        return subtotal * 0.10;
    },
    
    applyPromoCode(code) {
        const promo = promoCodes[code.toUpperCase()];
        if (!promo) return { success: false, error: 'Invalid promo code' };
        
        return { success: true, promo };
    },
    
    getTotal(promoCode = null) {
        const subtotal = this.getSubtotal();
        const shipping = this.getShipping(subtotal);
        const tax = this.getTax(subtotal);
        let discount = 0;
        
        if (promoCode) {
            const promo = promoCodes[promoCode.toUpperCase()];
            if (promo) {
                if (promo.type === 'percent') {
                    discount = subtotal * (promo.discount / 100);
                } else {
                    discount = promo.discount;
                }
            }
        }
        
        return {
            subtotal,
            shipping,
            tax,
            discount,
            total: subtotal + shipping + tax - discount
        };
    },
    
    clear() {
        this.items = [];
        this.saveCart();
    },
    
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },
    
    isEmpty() {
        return this.items.length === 0;
    }
};

// Wishlist Module
const Wishlist = {
    items: [],
    
    init() {
        this.loadWishlist();
    },
    
    loadWishlist() {
        const wishlistData = localStorage.getItem('shoppio_wishlist');
        if (wishlistData) {
            this.items = JSON.parse(wishlistData);
        }
    },
    
    saveWishlist() {
        localStorage.setItem('shoppio_wishlist', JSON.stringify(this.items));
    },
    
    addItem(productId) {
        if (!this.items.includes(productId)) {
            this.items.push(productId);
            this.saveWishlist();
            return true;
        }
        return false;
    },
    
    removeItem(productId) {
        this.items = this.items.filter(id => id !== productId);
        this.saveWishlist();
    },
    
    toggleItem(productId) {
        if (this.hasItem(productId)) {
            this.removeItem(productId);
            return false;
        } else {
            this.addItem(productId);
            return true;
        }
    },
    
    hasItem(productId) {
        return this.items.includes(productId);
    },
    
    getItems() {
        return this.items.map(id => getProductById(id)).filter(p => p);
    },
    
    getCount() {
        return this.items.length;
    },
    
    clear() {
        this.items = [];
        this.saveWishlist();
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    Wishlist.init();
});
