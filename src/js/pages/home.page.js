/**
 * @fileoverview Home Page Controller for Shoppio
 * @description Handles home page functionality including featured products and deals
 * @version 1.0.0
 */

'use strict';

/**
 * Home Page Controller
 * @namespace HomePage
 */
const HomePage = {
    /**
     * Initialize home page
     */
    init() {
        this.loadFeaturedProducts();
        this.loadDealsOfTheDay();
        this.loadNewArrivals();
        this.loadCategories();
        this.initCountdown();
        this.initNewsletter();
    },
    
    /**
     * Load featured products section
     */
    loadFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;
        
        const products = ProductService.getFeatured(8);
        container.innerHTML = products.map(p => createProductCard(p)).join('');
    },
    
    /**
     * Load deals of the day section
     */
    loadDealsOfTheDay() {
        const container = document.getElementById('deals-products');
        if (!container) return;
        
        const products = ProductService.getOnSale(4);
        container.innerHTML = products.map(p => createProductCard(p)).join('');
    },
    
    /**
     * Load new arrivals section
     */
    loadNewArrivals() {
        const container = document.getElementById('new-arrivals');
        if (!container) return;
        
        const products = ProductService.getNewArrivals(4);
        container.innerHTML = products.map(p => createProductCard(p)).join('');
    },
    
    /**
     * Load categories with counts
     */
    loadCategories() {
        const container = document.getElementById('categories-grid');
        if (!container) return;
        
        const categories = ProductService.getCategoriesWithCounts();
        container.innerHTML = categories.map(cat => `
            <a href="products.html?category=${cat.id}" class="category-card" data-testid="category-card">
                <div class="category-icon">
                    <i class="${cat.icon}"></i>
                </div>
                <h3>${cat.name}</h3>
                <span class="category-count">${cat.count} Products</span>
            </a>
        `).join('');
    },
    
    /**
     * Initialize countdown timer for deals
     */
    initCountdown() {
        const countdownEl = document.getElementById('deal-countdown');
        if (!countdownEl) return;
        
        // Set end time to midnight
        const now = new Date();
        const endTime = new Date(now);
        endTime.setHours(23, 59, 59, 999);
        
        const updateCountdown = () => {
            const now = new Date();
            let diff = endTime - now;
            
            if (diff <= 0) {
                // Reset to next day
                endTime.setDate(endTime.getDate() + 1);
                diff = endTime - now;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownEl.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${String(hours).padStart(2, '0')}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-separator">:</div>
                <div class="countdown-item">
                    <span class="countdown-value">${String(minutes).padStart(2, '0')}</span>
                    <span class="countdown-label">Mins</span>
                </div>
                <div class="countdown-separator">:</div>
                <div class="countdown-item">
                    <span class="countdown-value">${String(seconds).padStart(2, '0')}</span>
                    <span class="countdown-label">Secs</span>
                </div>
            `;
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    },
    
    /**
     * Initialize newsletter form
     */
    initNewsletter() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            if (email && validateEmail(email)) {
                showToast('Thank you for subscribing!', 'success');
                form.reset();
            } else {
                showToast('Please enter a valid email', 'error');
            }
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'home' || document.getElementById('featured-products')) {
        HomePage.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomePage;
}
