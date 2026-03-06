/**
 * @fileoverview Product Detail Page Controller for Shoppio
 * @description Handles product detail view, gallery, reviews, and add to cart
 * @version 1.0.0
 */

'use strict';

/**
 * Product Detail Page Controller
 * @namespace ProductDetailPage
 */
const ProductDetailPage = {
    /** @type {Object|null} Current product */
    product: null,
    
    /** @type {number} Selected quantity */
    quantity: 1,
    
    /** @type {string|null} Selected size */
    selectedSize: null,
    
    /** @type {string|null} Selected color */
    selectedColor: null,
    
    /**
     * Initialize product detail page
     */
    init() {
        const productId = getUrlParam('id');
        if (!productId) {
            window.location.href = 'products.html';
            return;
        }
        
        this.product = ProductService.getById(productId);
        if (!this.product) {
            window.location.href = 'products.html';
            return;
        }
        
        this.renderProduct();
        this.setupGallery();
        this.setupQuantity();
        this.setupOptions();
        this.setupTabs();
        this.loadReviews();
        this.loadRelatedProducts();
        this.setupAddToCart();
    },
    
    /**
     * Render product details
     */
    renderProduct() {
        const p = this.product;
        const discount = calculateDiscount(p.originalPrice, p.price);
        const deliveryDate = getDeliveryDate(p.deliveryDays || 3);
        
        // Update page title
        document.title = `${p.name} - Shoppio`;
        
        // Breadcrumb
        const breadcrumbProduct = document.getElementById('breadcrumb-product');
        if (breadcrumbProduct) {
            breadcrumbProduct.textContent = p.name;
        }
        
        // Main image
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = p.image;
            mainImage.alt = p.name;
        }
        
        // Thumbnails
        const thumbnails = document.getElementById('product-thumbnails');
        if (thumbnails && p.images) {
            thumbnails.innerHTML = p.images.map((img, i) => `
                <div class="thumbnail ${i === 0 ? 'active' : ''}" data-image="${img}" data-testid="thumbnail-${i}">
                    <img src="${img}" alt="${p.name}">
                </div>
            `).join('');
        }
        
        // Product info
        this.setTextContent('product-title', p.name);
        this.setTextContent('product-sku', `SKU: SHP${String(p.id).padStart(6, '0')}`);
        
        // Stock status
        const stockEl = document.getElementById('product-stock');
        if (stockEl) {
            if (p.stock > 10) {
                stockEl.innerHTML = '<i class="fas fa-check-circle"></i> In Stock';
                stockEl.className = 'stock-status in-stock';
            } else if (p.stock > 0) {
                stockEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> Only ${p.stock} left`;
                stockEl.className = 'stock-status low-stock';
            } else {
                stockEl.innerHTML = '<i class="fas fa-times-circle"></i> Out of Stock';
                stockEl.className = 'stock-status out-of-stock';
            }
        }
        
        // Rating
        const ratingEl = document.getElementById('product-rating');
        if (ratingEl) {
            ratingEl.innerHTML = `
                ${generateStars(p.rating)}
                <span class="rating-value">${p.rating}</span>
                <span class="rating-count">(${formatNumber(p.reviews)} ratings)</span>
            `;
        }
        
        // Price
        const priceEl = document.getElementById('product-price-section');
        if (priceEl) {
            priceEl.innerHTML = `
                <span class="current-price" data-testid="current-price">${formatPrice(p.price)}</span>
                ${p.originalPrice ? `
                    <span class="original-price">${formatPrice(p.originalPrice)}</span>
                    <span class="discount-badge">${discount}% off</span>
                ` : ''}
            `;
        }
        
        // Description
        this.setTextContent('product-description', p.description);
        
        // Delivery info
        const deliveryEl = document.getElementById('delivery-info');
        if (deliveryEl) {
            deliveryEl.innerHTML = `
                <div class="delivery-item">
                    <i class="fas fa-truck"></i>
                    <div>
                        <strong>Free Delivery</strong>
                        <span>by ${deliveryDate}</span>
                    </div>
                </div>
                <div class="delivery-item">
                    <i class="fas fa-undo"></i>
                    <div>
                        <strong>7 Days Return</strong>
                        <span>Easy returns</span>
                    </div>
                </div>
                <div class="delivery-item">
                    <i class="fas fa-shield-alt"></i>
                    <div>
                        <strong>Secure Payment</strong>
                        <span>100% secure</span>
                    </div>
                </div>
            `;
        }
        
        // Seller info
        const sellerEl = document.getElementById('seller-info');
        if (sellerEl && p.seller) {
            sellerEl.innerHTML = `Sold by: <strong>${p.seller}</strong>`;
        }
        
        // Size options
        this.renderSizeOptions();
        
        // Color options
        this.renderColorOptions();
        
        // Wishlist button state
        const wishlistBtn = document.getElementById('wishlist-btn');
        if (wishlistBtn) {
            const isInWishlist = WishlistService.hasItem(p.id);
            wishlistBtn.innerHTML = `<i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>`;
            wishlistBtn.classList.toggle('active', isInWishlist);
        }
        
        // Features in description tab
        const featuresEl = document.getElementById('product-features');
        if (featuresEl && p.features) {
            featuresEl.innerHTML = `
                <h4>Key Features</h4>
                <ul>
                    ${p.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                </ul>
            `;
        }
        
        // Specifications tab
        const specsEl = document.getElementById('product-specs');
        if (specsEl && p.specs) {
            specsEl.innerHTML = `
                <table class="specs-table">
                    <tbody>
                        ${Object.entries(p.specs).map(([key, value]) => `
                            <tr>
                                <th>${key}</th>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    },
    
    /**
     * Helper to set text content
     */
    setTextContent(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    },
    
    /**
     * Render size options
     */
    renderSizeOptions() {
        const container = document.getElementById('size-options');
        const wrapper = document.getElementById('size-wrapper');
        
        if (!container || !this.product.sizes) {
            if (wrapper) wrapper.style.display = 'none';
            return;
        }
        
        if (wrapper) wrapper.style.display = 'block';
        container.innerHTML = this.product.sizes.map(size => `
            <button class="size-btn" data-size="${size}" data-testid="size-${size}">${size}</button>
        `).join('');
    },
    
    /**
     * Render color options
     */
    renderColorOptions() {
        const container = document.getElementById('color-options');
        const wrapper = document.getElementById('color-wrapper');
        
        if (!container || !this.product.colors) {
            if (wrapper) wrapper.style.display = 'none';
            return;
        }
        
        if (wrapper) wrapper.style.display = 'block';
        container.innerHTML = this.product.colors.map(color => `
            <button class="color-btn" data-color="${color}" title="${color}" data-testid="color-${color}">
                ${color}
            </button>
        `).join('');
    },
    
    /**
     * Setup image gallery
     */
    setupGallery() {
        const thumbnails = document.getElementById('product-thumbnails');
        const mainImage = document.getElementById('main-product-image');
        
        if (thumbnails && mainImage) {
            thumbnails.addEventListener('click', (e) => {
                const thumb = e.target.closest('.thumbnail');
                if (thumb) {
                    thumbnails.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    mainImage.src = thumb.dataset.image;
                }
            });
        }
    },
    
    /**
     * Setup quantity controls
     */
    setupQuantity() {
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const quantityInput = document.getElementById('quantity-input');
        
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    quantityInput.value = this.quantity;
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                if (this.quantity < this.product.stock) {
                    this.quantity++;
                    quantityInput.value = this.quantity;
                }
            });
            
            quantityInput.addEventListener('change', () => {
                let value = parseInt(quantityInput.value);
                if (isNaN(value) || value < 1) value = 1;
                if (value > this.product.stock) value = this.product.stock;
                this.quantity = value;
                quantityInput.value = this.quantity;
            });
        }
    },
    
    /**
     * Setup size and color options
     */
    setupOptions() {
        document.addEventListener('click', (e) => {
            // Size selection
            if (e.target.closest('.size-btn')) {
                const btn = e.target.closest('.size-btn');
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedSize = btn.dataset.size;
            }
            
            // Color selection
            if (e.target.closest('.color-btn')) {
                const btn = e.target.closest('.color-btn');
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedColor = btn.dataset.color;
            }
        });
    },
    
    /**
     * Setup tabs
     */
    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tabId)?.classList.add('active');
            });
        });
    },
    
    /**
     * Load product reviews
     */
    loadReviews() {
        const container = document.getElementById('reviews-list');
        if (!container) return;
        
        const reviews = ProductService.getReviews(this.product.id);
        
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <p>No reviews yet. Be the first to review this product!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = reviews.map(review => `
            <div class="review-item" data-testid="review-item">
                <div class="review-header">
                    <span class="reviewer-name">${review.userName}</span>
                    ${review.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Purchase</span>' : ''}
                    <span class="review-date">${formatDate(review.date)}</span>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
                <h4 class="review-title">${review.title}</h4>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    },
    
    /**
     * Load related products
     */
    loadRelatedProducts() {
        const container = document.getElementById('related-products');
        if (!container) return;
        
        const related = ProductService.getRelated(this.product.id, 4);
        container.innerHTML = related.map(p => createProductCard(p)).join('');
    },
    
    /**
     * Setup add to cart functionality
     */
    setupAddToCart() {
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const buyNowBtn = document.getElementById('buy-now-btn');
        const wishlistBtn = document.getElementById('wishlist-btn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(false);
            });
        }
        
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.addToCart(true);
            });
        }
        
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                const result = WishlistService.toggleItem(this.product.id);
                if (result.success) {
                    wishlistBtn.innerHTML = `<i class="${result.added ? 'fas' : 'far'} fa-heart"></i>`;
                    wishlistBtn.classList.toggle('active', result.added);
                    showToast(result.added ? 'Added to wishlist!' : 'Removed from wishlist', 'success');
                }
            });
        }
    },
    
    /**
     * Add product to cart
     * @param {boolean} buyNow - Redirect to checkout after adding
     */
    addToCart(buyNow = false) {
        // Validate options if required
        if (this.product.sizes && !this.selectedSize) {
            showToast('Please select a size', 'warning');
            return;
        }
        
        if (this.product.colors && !this.selectedColor) {
            showToast('Please select a color', 'warning');
            return;
        }
        
        const options = {};
        if (this.selectedSize) options.size = this.selectedSize;
        if (this.selectedColor) options.color = this.selectedColor;
        
        const result = CartService.addItem(this.product.id, this.quantity, options);
        
        if (result.success) {
            showToast('Added to cart!', 'success');
            if (buyNow) {
                window.location.href = 'checkout.html';
            }
        } else if (!result.requiresLogin) {
            showToast(result.error || 'Failed to add to cart', 'error');
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'product-detail' || document.getElementById('main-product-image')) {
        ProductDetailPage.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductDetailPage;
}
