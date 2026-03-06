/**
 * @fileoverview Product Service for Shoppio
 * @description Handles product data operations, filtering, and search
 * @version 1.0.0
 */

'use strict';

/**
 * Product Service
 * @namespace ProductService
 */
const ProductService = {
    /**
     * Get product by ID
     * @param {number|string} id - Product ID
     * @returns {Object|null} Product object or null
     */
    getById(id) {
        return products.find(p => p.id === parseInt(id)) || null;
    },
    
    /**
     * Get all products
     * @returns {Array} All products
     */
    getAll() {
        return [...products];
    },
    
    /**
     * Get products by category
     * @param {string} category - Category ID
     * @returns {Array} Filtered products
     */
    getByCategory(category) {
        if (!category || category === 'all') {
            return this.getAll();
        }
        return products.filter(p => p.category === category);
    },
    
    /**
     * Search products by query
     * @param {string} query - Search query
     * @returns {Array} Matching products
     */
    search(query) {
        if (!query || query.trim() === '') {
            return this.getAll();
        }
        
        const searchTerm = query.toLowerCase().trim();
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm) ||
            (p.features && p.features.some(f => f.toLowerCase().includes(searchTerm)))
        );
    },
    
    /**
     * Filter products by multiple criteria
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered products
     */
    filter(filters = {}) {
        let filtered = this.getAll();
        
        // Category filter
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === filters.category);
        }
        
        // Price range filter
        if (filters.minPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice);
        }
        
        // Rating filter
        if (filters.minRating) {
            filtered = filtered.filter(p => p.rating >= filters.minRating);
        }
        
        // Stock filter
        if (filters.inStock) {
            filtered = filtered.filter(p => p.stock > 0);
        }
        
        // Sale filter
        if (filters.onSale) {
            filtered = filtered.filter(p => p.isSale);
        }
        
        // New arrivals filter
        if (filters.isNew) {
            filtered = filtered.filter(p => p.isNew);
        }
        
        return filtered;
    },
    
    /**
     * Sort products
     * @param {Array} productList - Products to sort
     * @param {string} sortBy - Sort criteria
     * @returns {Array} Sorted products
     */
    sort(productList, sortBy = 'featured') {
        const sorted = [...productList];
        
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            case 'popularity':
                return sorted.sort((a, b) => b.reviews - a.reviews);
            case 'discount':
                return sorted.sort((a, b) => {
                    const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
                    const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
                    return discountB - discountA;
                });
            case 'featured':
            default:
                // Featured: mix of new, sale, and high-rated products
                return sorted.sort((a, b) => {
                    const scoreA = (a.isNew ? 2 : 0) + (a.isSale ? 1 : 0) + (a.rating / 5);
                    const scoreB = (b.isNew ? 2 : 0) + (b.isSale ? 1 : 0) + (b.rating / 5);
                    return scoreB - scoreA;
                });
        }
    },
    
    /**
     * Get featured products
     * @param {number} limit - Number of products
     * @returns {Array} Featured products
     */
    getFeatured(limit = 8) {
        return this.sort(this.getAll(), 'featured').slice(0, limit);
    },
    
    /**
     * Get new arrivals
     * @param {number} limit - Number of products
     * @returns {Array} New products
     */
    getNewArrivals(limit = 4) {
        return products.filter(p => p.isNew).slice(0, limit);
    },
    
    /**
     * Get products on sale
     * @param {number} limit - Number of products
     * @returns {Array} Sale products
     */
    getOnSale(limit = 8) {
        return this.sort(
            products.filter(p => p.isSale && p.originalPrice),
            'discount'
        ).slice(0, limit);
    },
    
    /**
     * Get related products
     * @param {number} productId - Current product ID
     * @param {number} limit - Number of products
     * @returns {Array} Related products
     */
    getRelated(productId, limit = 4) {
        const product = this.getById(productId);
        if (!product) return [];
        
        return products
            .filter(p => p.id !== productId && p.category === product.category)
            .slice(0, limit);
    },
    
    /**
     * Get product reviews
     * @param {number} productId - Product ID
     * @returns {Array} Product reviews
     */
    getReviews(productId) {
        const reviewData = sampleReviews.find(r => r.productId === parseInt(productId));
        return reviewData ? reviewData.reviews : [];
    },
    
    /**
     * Get categories with product counts
     * @returns {Array} Categories with counts
     */
    getCategoriesWithCounts() {
        const counts = {};
        products.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        
        return CATEGORIES.map(cat => ({
            ...cat,
            count: counts[cat.id] || 0
        }));
    },
    
    /**
     * Get price range for products
     * @returns {Object} Min and max prices
     */
    getPriceRange() {
        const prices = products.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductService;
}
