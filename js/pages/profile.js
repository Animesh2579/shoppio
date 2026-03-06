// Profile Pages JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    initProfilePage();
    initOrdersPage();
    initWishlistPage();
    initOrderConfirmation();
});

function initProfilePage() {
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('password-form');
    
    // Populate profile data
    if (Auth.currentUser) {
        const firstNameInput = document.getElementById('profile-firstname');
        const lastNameInput = document.getElementById('profile-lastname');
        const emailInput = document.getElementById('profile-email');
        const phoneInput = document.getElementById('profile-phone');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email-display');
        
        if (firstNameInput) firstNameInput.value = Auth.currentUser.firstName || '';
        if (lastNameInput) lastNameInput.value = Auth.currentUser.lastName || '';
        if (emailInput) emailInput.value = Auth.currentUser.email || '';
        if (phoneInput) phoneInput.value = Auth.currentUser.phone || '';
        if (profileName) profileName.textContent = `${Auth.currentUser.firstName} ${Auth.currentUser.lastName}`;
        if (profileEmail) profileEmail.textContent = Auth.currentUser.email;
    }
    
    // Profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('profile-firstname')?.value.trim();
            const lastName = document.getElementById('profile-lastname')?.value.trim();
            const phone = document.getElementById('profile-phone')?.value.trim();
            
            if (!firstName || !lastName) {
                showToast('Please fill in required fields', 'error');
                return;
            }
            
            const result = Auth.updateProfile({ firstName, lastName, phone });
            
            if (result.success) {
                showToast('Profile updated successfully!', 'success');
                
                // Update display
                const profileName = document.getElementById('profile-name');
                if (profileName) {
                    profileName.textContent = `${firstName} ${lastName}`;
                }
            } else {
                showToast(result.error, 'error');
            }
        });
    }
    
    // Password form submission
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password')?.value;
            const newPassword = document.getElementById('new-password')?.value;
            const confirmPassword = document.getElementById('confirm-new-password')?.value;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match', 'error');
                return;
            }
            
            if (!Auth.validatePassword(newPassword)) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            // In a real app, verify current password
            showToast('Password updated successfully!', 'success');
            passwordForm.reset();
        });
    }
}

function initOrdersPage() {
    const ordersContainer = document.getElementById('orders-list');
    if (!ordersContainer) return;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('shoppio_orders') || '[]');
    
    // Add sample orders for demo
    const allOrders = [...sampleOrders, ...orders].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    if (allOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-box-open"></i>
                <h2>No orders yet</h2>
                <p>When you place orders, they will appear here.</p>
                <a href="products.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = allOrders.map(order => {
        const orderItems = order.items.map(item => {
            const product = getProductById(item.productId);
            return product ? { ...item, product } : null;
        }).filter(Boolean);
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <span>Order #</span>
                        <strong>${order.id}</strong>
                    </div>
                    <div class="order-info">
                        <span>Date</span>
                        <strong>${new Date(order.date).toLocaleDateString()}</strong>
                    </div>
                    <span class="order-status status-${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${orderItems.map(item => `
                        <div class="order-item">
                            <div class="order-item-image">
                                <img src="${item.product.image}" alt="${item.product.name}">
                            </div>
                            <div class="order-item-details">
                                <h4>${item.product.name}</h4>
                                <p>Qty: ${item.quantity} × ${formatPrice(item.price)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <span class="order-total">Total: ${formatPrice(order.total)}</span>
                    <a href="#" class="btn btn-outline btn-sm">View Details</a>
                </div>
            </div>
        `;
    }).join('');
    
    // Order filter
    const orderFilter = document.getElementById('order-filter');
    if (orderFilter) {
        orderFilter.addEventListener('change', () => {
            const status = orderFilter.value;
            document.querySelectorAll('.order-card').forEach(card => {
                const cardStatus = card.querySelector('.order-status').textContent;
                card.style.display = status === 'all' || cardStatus === status ? 'block' : 'none';
            });
        });
    }
}

function initWishlistPage() {
    const wishlistContainer = document.getElementById('wishlist-grid');
    if (!wishlistContainer) return;
    
    const wishlistItems = Wishlist.getItems();
    
    if (wishlistItems.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist" style="grid-column: 1 / -1;">
                <i class="fas fa-heart"></i>
                <h2>Your wishlist is empty</h2>
                <p>Save items you love by clicking the heart icon.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }
    
    wishlistContainer.innerHTML = wishlistItems.map(product => createProductCard(product)).join('');
}

function initOrderConfirmation() {
    const confirmationCard = document.getElementById('confirmation-card');
    if (!confirmationCard) return;
    
    const lastOrder = JSON.parse(localStorage.getItem('shoppio_last_order'));
    
    if (!lastOrder) {
        window.location.href = 'index.html';
        return;
    }
    
    // Populate order details
    const orderNumberEl = document.getElementById('order-number');
    const orderDateEl = document.getElementById('order-date');
    const shippingAddressEl = document.getElementById('shipping-address');
    const paymentMethodEl = document.getElementById('payment-method');
    const orderItemsEl = document.getElementById('confirmation-items');
    const subtotalEl = document.getElementById('confirmation-subtotal');
    const shippingEl = document.getElementById('confirmation-shipping');
    const taxEl = document.getElementById('confirmation-tax');
    const totalEl = document.getElementById('confirmation-total');
    
    if (orderNumberEl) orderNumberEl.textContent = lastOrder.id;
    if (orderDateEl) orderDateEl.textContent = new Date(lastOrder.date).toLocaleDateString();
    
    if (shippingAddressEl && lastOrder.shipping) {
        shippingAddressEl.innerHTML = `
            ${lastOrder.shipping.firstName} ${lastOrder.shipping.lastName}<br>
            ${lastOrder.shipping.address}<br>
            ${lastOrder.shipping.city}, ${lastOrder.shipping.state} ${lastOrder.shipping.zip}
        `;
    }
    
    if (paymentMethodEl && lastOrder.payment) {
        const methods = {
            card: 'Credit Card',
            paypal: 'PayPal',
            applepay: 'Apple Pay'
        };
        paymentMethodEl.textContent = methods[lastOrder.payment.method] || lastOrder.payment.method;
    }
    
    if (orderItemsEl) {
        orderItemsEl.innerHTML = lastOrder.items.map(item => {
            const product = getProductById(item.productId);
            if (!product) return '';
            return `
                <div class="summary-item">
                    <div class="summary-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="summary-item-details">
                        <h4>${product.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                    <span class="summary-item-price">${formatPrice(item.price * item.quantity)}</span>
                </div>
            `;
        }).join('');
    }
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(lastOrder.subtotal);
    if (shippingEl) shippingEl.textContent = lastOrder.shippingCost === 0 ? 'FREE' : formatPrice(lastOrder.shippingCost);
    if (taxEl) taxEl.textContent = formatPrice(lastOrder.tax);
    if (totalEl) totalEl.textContent = formatPrice(lastOrder.total);
    
    // Clear the last order after displaying
    // localStorage.removeItem('shoppio_last_order');
}
