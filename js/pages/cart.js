// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initCartPage();
});

let appliedPromoCode = null;

function initCartPage() {
    renderCart();
    initPromoCode();
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItemsContainer) return;
    
    const cartItems = Cart.getItems();
    
    if (cartItems.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    if (cartItemsContainer) cartItemsContainer.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';
    
    // Render cart items
    const cartItemsHTML = cartItems.map(item => `
        <div class="cart-item" data-product-id="${item.productId}">
            <div class="cart-item-image">
                <a href="product-detail.html?id=${item.productId}">
                    <img src="${item.product.image}" alt="${item.product.name}">
                </a>
            </div>
            <div class="cart-item-details">
                <h3><a href="product-detail.html?id=${item.productId}">${item.product.name}</a></h3>
                <p class="cart-item-meta">
                    ${item.options.size ? `Size: ${item.options.size}` : ''}
                    ${item.options.color ? `<span style="display:inline-block;width:12px;height:12px;background:${item.options.color};border-radius:50%;margin-left:8px;"></span>` : ''}
                </p>
                <p class="cart-item-price">${formatPrice(item.product.price)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" data-product-id="${item.productId}" data-options='${JSON.stringify(item.options)}'>
                    <i class="fas fa-trash"></i>
                </button>
                <div class="quantity-input">
                    <button class="qty-decrease" data-product-id="${item.productId}" data-options='${JSON.stringify(item.options)}'>
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" value="${item.quantity}" min="1" max="${item.product.stock}" 
                           data-product-id="${item.productId}" data-options='${JSON.stringify(item.options)}'>
                    <button class="qty-increase" data-product-id="${item.productId}" data-options='${JSON.stringify(item.options)}'>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    const cartItemsList = document.getElementById('cart-items-list');
    if (cartItemsList) {
        cartItemsList.innerHTML = cartItemsHTML;
    }
    
    // Update summary
    updateCartSummary();
}

function updateCartSummary() {
    const totals = Cart.getTotal(appliedPromoCode);
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxEl = document.getElementById('cart-tax');
    const discountRow = document.getElementById('discount-row');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping);
    if (taxEl) taxEl.textContent = formatPrice(totals.tax);
    
    if (discountRow && discountEl) {
        if (totals.discount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `-${formatPrice(totals.discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    
    if (totalEl) totalEl.textContent = formatPrice(totals.total);
}

function initPromoCode() {
    const promoForm = document.getElementById('promo-form');
    const promoInput = document.getElementById('promo-input');
    const promoMessage = document.getElementById('promo-message');
    
    if (promoForm && promoInput) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = promoInput.value.trim().toUpperCase();
            
            if (!code) return;
            
            const result = Cart.applyPromoCode(code);
            
            if (result.success) {
                appliedPromoCode = code;
                if (promoMessage) {
                    promoMessage.textContent = `Promo code applied: ${result.promo.discount}${result.promo.type === 'percent' ? '%' : '$'} off`;
                    promoMessage.style.color = '#10b981';
                }
                updateCartSummary();
                showToast('Promo code applied!', 'success');
            } else {
                if (promoMessage) {
                    promoMessage.textContent = result.error;
                    promoMessage.style.color = '#ef4444';
                }
                showToast(result.error, 'error');
            }
        });
    }
}

// Event delegation for cart actions
document.addEventListener('click', (e) => {
    // Remove item
    if (e.target.closest('.remove-btn')) {
        const btn = e.target.closest('.remove-btn');
        const productId = parseInt(btn.dataset.productId);
        const options = JSON.parse(btn.dataset.options || '{}');
        
        Cart.removeItem(productId, options);
        renderCart();
        showToast('Item removed from cart', 'success');
    }
    
    // Decrease quantity
    if (e.target.closest('.qty-decrease')) {
        const btn = e.target.closest('.qty-decrease');
        const productId = parseInt(btn.dataset.productId);
        const options = JSON.parse(btn.dataset.options || '{}');
        const item = Cart.getItem(productId, options);
        
        if (item && item.quantity > 1) {
            Cart.updateQuantity(productId, item.quantity - 1, options);
            renderCart();
        }
    }
    
    // Increase quantity
    if (e.target.closest('.qty-increase')) {
        const btn = e.target.closest('.qty-increase');
        const productId = parseInt(btn.dataset.productId);
        const options = JSON.parse(btn.dataset.options || '{}');
        const item = Cart.getItem(productId, options);
        const product = getProductById(productId);
        
        if (item && product && item.quantity < product.stock) {
            Cart.updateQuantity(productId, item.quantity + 1, options);
            renderCart();
        }
    }
});

// Quantity input change
document.addEventListener('change', (e) => {
    if (e.target.matches('.cart-item .quantity-input input')) {
        const input = e.target;
        const productId = parseInt(input.dataset.productId);
        const options = JSON.parse(input.dataset.options || '{}');
        let quantity = parseInt(input.value);
        
        if (isNaN(quantity) || quantity < 1) quantity = 1;
        
        const product = getProductById(productId);
        if (product && quantity > product.stock) quantity = product.stock;
        
        Cart.updateQuantity(productId, quantity, options);
        renderCart();
    }
});

// Checkout button
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (Cart.isEmpty()) {
            showToast('Your cart is empty', 'error');
            return;
        }
        
        // Store promo code for checkout
        if (appliedPromoCode) {
            localStorage.setItem('shoppio_promo', appliedPromoCode);
        }
        
        window.location.href = 'checkout.html';
    });
}
