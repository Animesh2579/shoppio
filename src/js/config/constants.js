/**
 * @fileoverview Application constants and configuration
 * @description Central configuration file for Shoppio e-commerce application
 * @version 1.0.0
 */

'use strict';

/**
 * Application Configuration
 * @constant {Object}
 */
const APP_CONFIG = {
    name: 'Shoppio',
    version: '1.0.0',
    currency: {
        code: 'INR',
        symbol: '₹',
        locale: 'en-IN'
    },
    tax: {
        rate: 0.18, // 18% GST
        name: 'GST'
    },
    shipping: {
        freeThreshold: 499, // Free shipping above ₹499
        standardRate: 40,
        expressRate: 99,
        overnightRate: 199
    }
};

/**
 * Local Storage Keys
 * @constant {Object}
 */
const STORAGE_KEYS = {
    USER: 'shoppio_user',
    CART: 'shoppio_cart',
    WISHLIST: 'shoppio_wishlist',
    ORDERS: 'shoppio_orders',
    REGISTERED_USERS: 'shoppio_registered_users',
    PROMO_CODE: 'shoppio_promo',
    LAST_ORDER: 'shoppio_last_order',
    REDIRECT_URL: 'shoppio_redirect'
};

/**
 * Demo User Credentials
 * @constant {Object}
 */
const DEMO_USER = {
    email: 'demo@shoppio.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    phone: '+91 9876543210',
    address: {
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
    }
};

/**
 * Available Promo Codes
 * @constant {Object}
 */
const PROMO_CODES = {
    'SAVE10': { discount: 10, type: 'percent', description: '10% off on your order' },
    'SAVE20': { discount: 20, type: 'percent', description: '20% off on your order' },
    'FLAT100': { discount: 100, type: 'fixed', description: '₹100 off on your order' },
    'FLAT200': { discount: 200, type: 'fixed', description: '₹200 off on your order' },
    'NEWUSER': { discount: 15, type: 'percent', description: '15% off for new users' },
    'FREESHIP': { discount: 0, type: 'freeshipping', description: 'Free shipping on your order' }
};

/**
 * Product Categories
 * @constant {Array}
 */
const CATEGORIES = [
    { id: 'electronics', name: 'Electronics', icon: 'fas fa-laptop' },
    { id: 'fashion', name: 'Fashion', icon: 'fas fa-tshirt' },
    { id: 'home', name: 'Home & Kitchen', icon: 'fas fa-home' },
    { id: 'sports', name: 'Sports & Fitness', icon: 'fas fa-running' },
    { id: 'beauty', name: 'Beauty & Health', icon: 'fas fa-spa' },
    { id: 'books', name: 'Books', icon: 'fas fa-book' }
];

/**
 * Order Status Types
 * @constant {Object}
 */
const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
};

/**
 * Payment Methods
 * @constant {Array}
 */
const PAYMENT_METHODS = [
    { id: 'upi', name: 'UPI', icon: 'fas fa-mobile-alt' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'fas fa-credit-card' },
    { id: 'netbanking', name: 'Net Banking', icon: 'fas fa-university' },
    { id: 'cod', name: 'Cash on Delivery', icon: 'fas fa-money-bill-wave' },
    { id: 'wallet', name: 'Wallet', icon: 'fas fa-wallet' }
];

/**
 * Indian States for Address Form
 * @constant {Array}
 */
const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

// Export for module usage (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP_CONFIG,
        STORAGE_KEYS,
        DEMO_USER,
        PROMO_CODES,
        CATEGORIES,
        ORDER_STATUS,
        PAYMENT_METHODS,
        INDIAN_STATES
    };
}
