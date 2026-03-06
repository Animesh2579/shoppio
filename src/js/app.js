/**
 * @fileoverview Main Application Entry Point for Shoppio
 * @description Initializes all services and handles global functionality
 * @version 1.0.0
 */

'use strict';

/**
 * Main Application Controller
 * @namespace App
 */
const App = {
    /**
     * Initialize application
     */
    init() {
        // Initialize services
        AuthService.init();
        CartService.init();
        WishlistService.init();
        
        // Setup global event handlers
        this.setupMobileMenu();
        this.setupUserDropdown();
        this.setupSearch();
        this.setupGlobalEventDelegation();
        
        console.log('Shoppio App initialized');
    },
    
    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                mobileMenuBtn.setAttribute('aria-expanded', 
                    mobileMenu.classList.contains('active'));
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    },
    
    /**
     * Setup user dropdown menu
     */
    setupUserDropdown() {
        const userBtn = document.getElementById('user-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }
    },
    
    /**
     * Setup search functionality
     */
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const searchForm = document.getElementById('search-form');
        
        const performSearch = () => {
            const query = searchInput?.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        };
        
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
        
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                performSearch();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    },
    
    /**
     * Setup global event delegation for common actions
     */
    setupGlobalEventDelegation() {
        document.addEventListener('click', (e) => {
            // Add to Cart button
            if (e.target.closest('[data-action="add-to-cart"]')) {
                const btn = e.target.closest('[data-action="add-to-cart"]');
                const productId = parseInt(btn.dataset.productId);
                this.handleAddToCart(productId, btn);
            }
            
            // Wishlist toggle button
            if (e.target.closest('[data-action="toggle-wishlist"]')) {
                const btn = e.target.closest('[data-action="toggle-wishlist"]');
                const productId = parseInt(btn.dataset.productId);
                this.handleWishlistToggle(productId, btn);
            }
            
            // Logout button
            if (e.target.closest('[data-action="logout"]')) {
                e.preventDefault();
                AuthService.logout();
                showToast('Logged out successfully', 'success');
            }
            
            // FAQ accordion
            if (e.target.closest('.faq-question')) {
                const faqItem = e.target.closest('.faq-item');
                faqItem.classList.toggle('active');
            }
        });
    },
    
    /**
     * Handle add to cart action
     * @param {number} productId - Product ID
     * @param {HTMLElement} btn - Button element
     */
    handleAddToCart(productId, btn) {
        const result = CartService.addItem(productId);
        
        if (result.success) {
            showToast('Added to cart!', 'success');
            
            // Add animation to button
            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 1000);
        } else if (result.requiresLogin) {
            // Redirect handled by CartService
        } else {
            showToast(result.error || 'Failed to add to cart', 'error');
        }
    },
    
    /**
     * Handle wishlist toggle action
     * @param {number} productId - Product ID
     * @param {HTMLElement} btn - Button element
     */
    handleWishlistToggle(productId, btn) {
        const result = WishlistService.toggleItem(productId);
        
        if (result.success) {
            const icon = btn.querySelector('i');
            if (result.added) {
                btn.classList.add('active');
                if (icon) icon.className = 'fas fa-heart';
                showToast('Added to wishlist!', 'success');
            } else {
                btn.classList.remove('active');
                if (icon) icon.className = 'far fa-heart';
                showToast('Removed from wishlist', 'info');
            }
        }
    }
};

/**
 * Create product card HTML
 * @param {Object} product - Product object
 * @returns {string} HTML string
 */
function createProductCard(product) {
    const isInWishlist = WishlistService.hasItem(product.id);
    const discount = calculateDiscount(product.originalPrice, product.price);
    const deliveryDate = getDeliveryDate(product.deliveryDays || 3);
    
    return `
        <article class="product-card" data-product-id="${product.id}" data-testid="product-card">
            <div class="product-image">
                <a href="product-detail.html?id=${product.id}" data-testid="product-link">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
                ${product.isNew ? '<span class="product-badge badge-new">New</span>' : ''}
                ${discount > 0 ? `<span class="product-badge badge-sale">${discount}% off</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn ${isInWishlist ? 'active' : ''}" 
                            data-action="toggle-wishlist"
                            data-product-id="${product.id}" 
                            data-testid="wishlist-btn"
                            title="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                            aria-label="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <a href="product-detail.html?id=${product.id}" class="action-btn" title="Quick View" aria-label="Quick View">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-rating" data-testid="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-count">(${formatNumber(product.reviews)})</span>
                </div>
                <div class="product-price" data-testid="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                    ${discount > 0 ? `<span class="discount-percent">${discount}% off</span>` : ''}
                </div>
                <p class="delivery-info">
                    <i class="fas fa-truck"></i> Free delivery by ${deliveryDate}
                </p>
                <button class="add-to-cart-btn" 
                        data-action="add-to-cart" 
                        data-product-id="${product.id}"
                        data-testid="add-to-cart-btn"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : '<i class="fas fa-shopping-cart"></i> Add to Cart'}
                </button>
            </div>
        </article>
    `;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, createProductCard };
}
