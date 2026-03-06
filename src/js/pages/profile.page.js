/**
 * @fileoverview Profile Pages Controller for Shoppio
 * @description Handles user profile, orders, wishlist, and order confirmation
 * @version 1.0.0
 */

'use strict';

/**
 * Profile Page Controller
 * @namespace ProfilePage
 */
const ProfilePage = {
    /**
     * Initialize profile page
     */
    init() {
        // Require login for profile pages
        if (!AuthService.isLoggedIn()) {
            localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, window.location.href);
            window.location.href = 'login.html';
            return;
        }
        
        this.renderUserInfo();
        this.setupProfileForm();
        this.setupPasswordForm();
    },
    
    /**
     * Render user information
     */
    renderUserInfo() {
        const user = AuthService.currentUser;
        if (!user) return;
        
        // Profile sidebar
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email-display');
        
        if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
        if (profileEmail) profileEmail.textContent = user.email;
        
        // Profile form
        this.setInputValue('profile-firstname', user.firstName);
        this.setInputValue('profile-lastname', user.lastName);
        this.setInputValue('profile-email', user.email);
        this.setInputValue('profile-phone', user.phone);
    },
    
    /**
     * Helper to set input value
     */
    setInputValue(id, value) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    },
    
    /**
     * Setup profile form
     */
    setupProfileForm() {
        const form = document.getElementById('profile-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('profile-firstname')?.value.trim();
            const lastName = document.getElementById('profile-lastname')?.value.trim();
            const phone = document.getElementById('profile-phone')?.value.trim();
            
            if (!firstName || !lastName) {
                showToast('Please fill in required fields', 'error');
                return;
            }
            
            const result = AuthService.updateProfile({ firstName, lastName, phone });
            
            if (result.success) {
                showToast('Profile updated successfully!', 'success');
                this.renderUserInfo();
            } else {
                showToast(result.error || 'Failed to update profile', 'error');
            }
        });
    },
    
    /**
     * Setup password change form
     */
    setupPasswordForm() {
        const form = document.getElementById('password-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password')?.value;
            const newPassword = document.getElementById('new-password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match', 'error');
                return;
            }
            
            const validation = AuthService.validatePassword(newPassword);
            if (!validation.valid) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            // In demo mode, just show success
            showToast('Password updated successfully!', 'success');
            form.reset();
        });
    }
};

/**
 * Orders Page Controller
 * @namespace OrdersPage
 */
const OrdersPage = {
    /**
     * Initialize orders page
     */
    init() {
        if (!AuthService.isLoggedIn()) {
            localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, 'orders.html');
            window.location.href = 'login.html';
            return;
        }
        
        this.renderOrders();
        this.setupFilter();
    },
    
    /**
     * Render orders list
     */
    renderOrders() {
        const container = document.getElementById('orders-list');
        if (!container) return;
        
        const orders = OrderService.getOrders();
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="no-orders" data-testid="no-orders">
                    <i class="fas fa-box-open"></i>
                    <h2>No orders yet</h2>
                    <p>When you place orders, they will appear here.</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = orders.map(order => this.createOrderCard(order)).join('');
    },
    
    /**
     * Create order card HTML
     * @param {Object} order - Order object
     * @returns {string} HTML string
     */
    createOrderCard(order) {
        const statusDisplay = OrderService.getStatusDisplay(order.status);
        const orderItems = order.items.map(item => {
            const product = ProductService.getById(item.productId);
            return product ? { ...item, product } : null;
        }).filter(Boolean);
        
        return `
            <div class="order-card" data-order-id="${order.id}" data-testid="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <span class="order-label">Order ID</span>
                        <strong class="order-id">${order.id}</strong>
                    </div>
                    <div class="order-info">
                        <span class="order-label">Placed on</span>
                        <strong>${formatDate(order.date)}</strong>
                    </div>
                    <div class="order-info">
                        <span class="order-label">Total</span>
                        <strong>${formatPrice(order.total)}</strong>
                    </div>
                    <span class="order-status status-${statusDisplay.color}" data-testid="order-status">
                        <i class="fas fa-${statusDisplay.icon}"></i> ${statusDisplay.text}
                    </span>
                </div>
                <div class="order-items">
                    ${orderItems.slice(0, 3).map(item => `
                        <div class="order-item">
                            <img src="${item.product.image}" alt="${item.product.name}">
                            <div class="order-item-details">
                                <h4>${item.product.name}</h4>
                                <p>Qty: ${item.quantity} × ${formatPrice(item.price)}</p>
                            </div>
                        </div>
                    `).join('')}
                    ${orderItems.length > 3 ? `<p class="more-items">+${orderItems.length - 3} more items</p>` : ''}
                </div>
                <div class="order-footer">
                    <a href="order-detail.html?id=${order.id}" class="btn btn-outline btn-sm">View Details</a>
                    ${order.status === ORDER_STATUS.DELIVERED ? 
                        '<button class="btn btn-outline btn-sm">Write Review</button>' : ''}
                    ${[ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status) ? 
                        `<button class="btn btn-outline btn-sm cancel-order-btn" data-order-id="${order.id}">Cancel Order</button>` : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Setup order filter
     */
    setupFilter() {
        const filterSelect = document.getElementById('order-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                const status = filterSelect.value;
                document.querySelectorAll('.order-card').forEach(card => {
                    const cardStatus = card.querySelector('.order-status')?.textContent.trim().toLowerCase();
                    card.style.display = status === 'all' || cardStatus.includes(status) ? 'block' : 'none';
                });
            });
        }
    }
};

/**
 * Wishlist Page Controller
 * @namespace WishlistPage
 */
const WishlistPage = {
    /**
     * Initialize wishlist page
     */
    init() {
        if (!AuthService.isLoggedIn()) {
            localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, 'wishlist.html');
            window.location.href = 'login.html';
            return;
        }
        
        this.renderWishlist();
    },
    
    /**
     * Render wishlist items
     */
    renderWishlist() {
        const container = document.getElementById('wishlist-grid');
        if (!container) return;
        
        const items = WishlistService.getItems();
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-wishlist" data-testid="empty-wishlist">
                    <i class="fas fa-heart"></i>
                    <h2>Your wishlist is empty</h2>
                    <p>Save items you love by clicking the heart icon on products.</p>
                    <a href="products.html" class="btn btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = items.map(product => createProductCard(product)).join('');
    }
};

/**
 * Order Confirmation Page Controller
 * @namespace OrderConfirmationPage
 */
const OrderConfirmationPage = {
    /**
     * Initialize order confirmation page
     */
    init() {
        const order = OrderService.getLastOrder();
        
        if (!order) {
            window.location.href = 'index.html';
            return;
        }
        
        this.renderConfirmation(order);
    },
    
    /**
     * Render order confirmation
     * @param {Object} order - Order object
     */
    renderConfirmation(order) {
        // Order number
        this.setElementText('confirmation-order-id', order.id);
        this.setElementText('confirmation-date', formatDate(order.date));
        
        // Shipping address
        const shippingEl = document.getElementById('confirmation-shipping');
        if (shippingEl && order.shipping) {
            const s = order.shipping;
            shippingEl.innerHTML = `
                <p><strong>${s.firstName} ${s.lastName}</strong></p>
                <p>${s.address}</p>
                <p>${s.city}, ${s.state} - ${s.pincode}</p>
                <p>Phone: ${s.phone}</p>
            `;
        }
        
        // Payment method
        const paymentEl = document.getElementById('confirmation-payment');
        if (paymentEl && order.payment) {
            const methods = {
                card: 'Credit/Debit Card',
                upi: 'UPI',
                netbanking: 'Net Banking',
                cod: 'Cash on Delivery',
                wallet: 'Wallet'
            };
            paymentEl.textContent = methods[order.payment.method] || order.payment.method;
        }
        
        // Order items
        const itemsEl = document.getElementById('confirmation-items');
        if (itemsEl) {
            itemsEl.innerHTML = order.items.map(item => {
                const product = ProductService.getById(item.productId);
                if (!product) return '';
                return `
                    <div class="confirmation-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div>
                            <h4>${product.name}</h4>
                            <p>Qty: ${item.quantity} × ${formatPrice(item.price)}</p>
                        </div>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `;
            }).join('');
        }
        
        // Totals
        this.setElementText('confirmation-subtotal', formatPrice(order.subtotal));
        this.setElementText('confirmation-shipping-cost', order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost));
        this.setElementText('confirmation-tax', formatPrice(order.tax));
        this.setElementText('confirmation-total', formatPrice(order.total));
        
        // Estimated delivery
        const deliveryEl = document.getElementById('estimated-delivery');
        if (deliveryEl) {
            deliveryEl.textContent = getDeliveryDate(5);
        }
    },
    
    /**
     * Helper to set element text
     */
    setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
};

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    
    if (page === 'profile' || document.getElementById('profile-form')) {
        ProfilePage.init();
    }
    
    if (page === 'orders' || document.getElementById('orders-list')) {
        OrdersPage.init();
    }
    
    if (page === 'wishlist' || document.getElementById('wishlist-grid')) {
        WishlistPage.init();
    }
    
    if (page === 'order-confirmation' || document.getElementById('confirmation-order-id')) {
        OrderConfirmationPage.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfilePage, OrdersPage, WishlistPage, OrderConfirmationPage };
}
