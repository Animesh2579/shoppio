// Product Detail Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initProductDetail();
});

let currentProduct = null;
let selectedQuantity = 1;
let selectedSize = null;
let selectedColor = null;

function initProductDetail() {
    const productId = getUrlParam('id');
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    currentProduct = getProductById(productId);
    if (!currentProduct) {
        window.location.href = 'products.html';
        return;
    }
    
    renderProductDetail();
    initTabs();
    loadRelatedProducts();
    initQuantityControls();
    initProductOptions();
    initAddToCart();
}

function renderProductDetail() {
    // Update page title
    document.title = `${currentProduct.name} - Shoppio`;
    
    // Update breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = currentProduct.name;
    }
    
    // Main image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = currentProduct.image;
        mainImage.alt = currentProduct.name;
    }
    
    // Thumbnails
    const thumbnailsContainer = document.getElementById('product-thumbnails');
    if (thumbnailsContainer && currentProduct.images) {
        thumbnailsContainer.innerHTML = currentProduct.images.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                <img src="${img}" alt="${currentProduct.name}">
            </div>
        `).join('');
        
        // Thumbnail click handler
        thumbnailsContainer.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImage.src = thumb.dataset.image;
            });
        });
    }
    
    // Product title
    const productTitle = document.getElementById('product-title');
    if (productTitle) {
        productTitle.textContent = currentProduct.name;
    }
    
    // Product meta
    const productSku = document.getElementById('product-sku');
    if (productSku) {
        productSku.textContent = `SKU: PRD-${String(currentProduct.id).padStart(5, '0')}`;
    }
    
    const productStock = document.getElementById('product-stock');
    if (productStock) {
        productStock.textContent = currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock';
        productStock.style.color = currentProduct.stock > 0 ? '#10b981' : '#ef4444';
    }
    
    // Rating
    const productRating = document.getElementById('product-rating');
    if (productRating) {
        productRating.innerHTML = `
            ${generateStars(currentProduct.rating)}
            <span>${currentProduct.rating} (${currentProduct.reviews} reviews)</span>
        `;
    }
    
    // Price
    const currentPrice = document.getElementById('current-price');
    const originalPrice = document.getElementById('original-price');
    if (currentPrice) {
        currentPrice.textContent = formatPrice(currentProduct.price);
    }
    if (originalPrice) {
        if (currentProduct.originalPrice) {
            originalPrice.textContent = formatPrice(currentProduct.originalPrice);
            originalPrice.style.display = 'inline';
        } else {
            originalPrice.style.display = 'none';
        }
    }
    
    // Description
    const productDescription = document.getElementById('product-description');
    if (productDescription) {
        productDescription.textContent = currentProduct.description;
    }
    
    // Size options
    const sizeOptions = document.getElementById('size-options');
    if (sizeOptions) {
        if (currentProduct.sizes && currentProduct.sizes.length > 0) {
            sizeOptions.parentElement.style.display = 'block';
            sizeOptions.innerHTML = currentProduct.sizes.map(size => `
                <button class="size-btn" data-size="${size}">${size}</button>
            `).join('');
        } else {
            sizeOptions.parentElement.style.display = 'none';
        }
    }
    
    // Color options
    const colorOptions = document.getElementById('color-options');
    if (colorOptions) {
        if (currentProduct.colors && currentProduct.colors.length > 0) {
            colorOptions.parentElement.style.display = 'block';
            colorOptions.innerHTML = currentProduct.colors.map(color => `
                <button class="color-btn" data-color="${color}" style="background-color: ${color}"></button>
            `).join('');
        } else {
            colorOptions.parentElement.style.display = 'none';
        }
    }
    
    // Wishlist button
    const wishlistBtn = document.getElementById('wishlist-btn');
    if (wishlistBtn) {
        const isInWishlist = Wishlist.hasItem(currentProduct.id);
        wishlistBtn.innerHTML = `<i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>`;
        wishlistBtn.classList.toggle('active', isInWishlist);
    }
    
    // Description tab content
    const descriptionTab = document.getElementById('description-content');
    if (descriptionTab) {
        descriptionTab.innerHTML = `
            <p>${currentProduct.description}</p>
            ${currentProduct.features ? `
                <h4>Key Features:</h4>
                <ul>
                    ${currentProduct.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            ` : ''}
        `;
    }
    
    // Specifications tab content
    const specsTab = document.getElementById('specifications-content');
    if (specsTab && currentProduct.specs) {
        specsTab.innerHTML = `
            <table class="specs-table">
                ${Object.entries(currentProduct.specs).map(([key, value]) => `
                    <tr>
                        <td>${key}</td>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    }
    
    // Reviews tab content
    loadReviews();
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });
}

function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-list');
    if (!reviewsContainer) return;
    
    const reviews = getProductReviews(currentProduct.id);
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="reviewer-name">${review.userName}</span>
                <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div class="product-rating">
                ${generateStars(review.rating)}
            </div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

function loadRelatedProducts() {
    const container = document.getElementById('related-products');
    if (!container) return;
    
    const relatedProducts = getRelatedProducts(currentProduct.id, 4);
    container.innerHTML = relatedProducts.map(product => createProductCard(product)).join('');
}

function initQuantityControls() {
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity-input');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => {
            if (selectedQuantity > 1) {
                selectedQuantity--;
                quantityInput.value = selectedQuantity;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            if (selectedQuantity < currentProduct.stock) {
                selectedQuantity++;
                quantityInput.value = selectedQuantity;
            }
        });
        
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > currentProduct.stock) value = currentProduct.stock;
            selectedQuantity = value;
            quantityInput.value = selectedQuantity;
        });
    }
}

function initProductOptions() {
    // Size selection
    document.addEventListener('click', (e) => {
        if (e.target.closest('.size-btn')) {
            const btn = e.target.closest('.size-btn');
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
        }
        
        if (e.target.closest('.color-btn')) {
            const btn = e.target.closest('.color-btn');
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = btn.dataset.color;
        }
    });
}

function initAddToCart() {
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    const buyNowBtn = document.getElementById('buy-now-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const options = {};
            if (selectedSize) options.size = selectedSize;
            if (selectedColor) options.color = selectedColor;
            
            Cart.addItem(currentProduct.id, selectedQuantity, options);
            showToast('Added to cart!', 'success');
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            const options = {};
            if (selectedSize) options.size = selectedSize;
            if (selectedColor) options.color = selectedColor;
            
            Cart.addItem(currentProduct.id, selectedQuantity, options);
            window.location.href = 'checkout.html';
        });
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const added = Wishlist.toggleItem(currentProduct.id);
            wishlistBtn.innerHTML = `<i class="${added ? 'fas' : 'far'} fa-heart"></i>`;
            wishlistBtn.classList.toggle('active', added);
            showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', 'success');
        });
    }
}

// Review form
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you for your review!', 'success');
        reviewForm.reset();
    });
}

// Rating input
document.addEventListener('click', (e) => {
    if (e.target.closest('.rating-input i')) {
        const star = e.target.closest('.rating-input i');
        const ratingInput = star.closest('.rating-input');
        const rating = parseInt(star.dataset.rating);
        
        ratingInput.querySelectorAll('i').forEach((s, index) => {
            s.classList.toggle('active', index < rating);
            s.classList.toggle('fas', index < rating);
            s.classList.toggle('far', index >= rating);
        });
    }
});
