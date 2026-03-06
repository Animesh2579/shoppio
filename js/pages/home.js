// Home Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadNewArrivals();
    initCountdown();
});

function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featuredProducts = getFeaturedProducts(8);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadNewArrivals() {
    const container = document.getElementById('new-arrivals');
    if (!container) return;
    
    const newProducts = getNewArrivals(4);
    container.innerHTML = newProducts.map(product => createProductCard(product)).join('');
}

function initCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    if (countdownElements.length === 0) return;
    
    // Set end time to 24 hours from now
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            // Reset countdown
            endTime.setHours(endTime.getHours() + 24);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElements.forEach(countdown => {
            const hoursEl = countdown.querySelector('[data-hours]');
            const minutesEl = countdown.querySelector('[data-minutes]');
            const secondsEl = countdown.querySelector('[data-seconds]');
            
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        });
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Newsletter Form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            showToast('Thank you for subscribing!', 'success');
            newsletterForm.reset();
        }
    });
}
