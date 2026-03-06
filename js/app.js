// Main Application JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initUserDropdown();
    initSearch();
    initToast();
});

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// User Dropdown
function initUserDropdown() {
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
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Toast Notifications
let toastTimeout;

function initToast() {
    // Toast is initialized, ready to use
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        // Clear any existing timeout
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        
        // Remove existing classes
        toast.classList.remove('show', 'success', 'error');
        
        // Set message and type
        toastMessage.textContent = message;
        if (type === 'success') toast.classList.add('success');
        if (type === 'error') toast.classList.add('error');
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Product Card HTML Generator
function createProductCard(product) {
    const isInWishlist = Wishlist.hasItem(product.id);
    const discount = product.originalPrice ? 
        Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
                ${product.isNew ? '<span class="product-badge badge-new">New</span>' : ''}
                ${product.isSale && discount > 0 ? `<span class="product-badge badge-sale">-${discount}%</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn wishlist-toggle ${isInWishlist ? 'active' : ''}" 
                            data-product-id="${product.id}" 
                            title="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view" data-product-id="${product.id}" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Generate Star Rating HTML
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Event Delegation for Product Cards
document.addEventListener('click', (e) => {
    // Add to Cart
    if (e.target.closest('.add-to-cart-btn')) {
        const btn = e.target.closest('.add-to-cart-btn');
        const productId = parseInt(btn.dataset.productId);
        
        if (Cart.addItem(productId)) {
            showToast('Added to cart!', 'success');
        }
    }
    
    // Wishlist Toggle
    if (e.target.closest('.wishlist-toggle')) {
        const btn = e.target.closest('.wishlist-toggle');
        const productId = parseInt(btn.dataset.productId);
        
        const added = Wishlist.toggleItem(productId);
        btn.classList.toggle('active', added);
        
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = added ? 'fas fa-heart' : 'far fa-heart';
        }
        
        showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', 'success');
    }
});

// FAQ Accordion
document.addEventListener('click', (e) => {
    if (e.target.closest('.faq-question')) {
        const faqItem = e.target.closest('.faq-item');
        faqItem.classList.toggle('active');
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setUrlParam(param, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(param, value);
    } else {
        url.searchParams.delete(param);
    }
    window.history.pushState({}, '', url);
}
