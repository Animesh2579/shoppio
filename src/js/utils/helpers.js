/**
 * @fileoverview Utility helper functions for Shoppio
 * @description Common utility functions used across the application
 * @version 1.0.0
 */

'use strict';

/**
 * Format price in Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price string
 */
function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format price without currency symbol
 * @param {number} amount - The amount to format
 * @returns {string} Formatted number string
 */
function formatNumber(amount) {
    return new Intl.NumberFormat('en-IN').format(amount);
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string for star rating
 */
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

/**
 * Generate unique order ID
 * @returns {string} Order ID in format SHP + YYMM + 5 digit number
 */
function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    return `SHP${year}${month}${random}`;
}

/**
 * Get URL parameter value
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null
 */
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Set URL parameter
 * @param {string} param - Parameter name
 * @param {string} value - Parameter value
 */
function setUrlParam(param, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(param, value);
    } else {
        url.searchParams.delete(param);
    }
    window.history.pushState({}, '', url);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
}

/**
 * Validate Indian PIN code
 * @param {string} pincode - PIN code to validate
 * @returns {boolean} True if valid
 */
function validatePincode(pincode) {
    return /^[1-9][0-9]{5}$/.test(pincode);
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current/sale price
 * @returns {number} Discount percentage
 */
function calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round((1 - currentPrice / originalPrice) * 100);
}

/**
 * Format date to Indian format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Get estimated delivery date
 * @param {number} days - Number of days for delivery
 * @returns {string} Formatted delivery date
 */
function getDeliveryDate(days = 3) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds
 */
let toastTimeout;
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) {
        console.warn('Toast elements not found');
        return;
    }
    
    // Clear existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    // Remove existing classes
    toast.classList.remove('show', 'success', 'error', 'warning', 'info');
    
    // Set message and type
    toastMessage.textContent = message;
    toast.classList.add(type);
    
    // Show toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Hide after duration
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * Check if user is on mobile device
 * @returns {boolean} True if mobile
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Scroll to top of page
 * @param {boolean} smooth - Use smooth scrolling
 */
function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPrice,
        formatNumber,
        generateStars,
        generateOrderId,
        getUrlParam,
        setUrlParam,
        debounce,
        validateEmail,
        validatePhone,
        validatePincode,
        calculateDiscount,
        formatDate,
        getDeliveryDate,
        truncateText,
        showToast,
        isMobile,
        scrollToTop
    };
}
