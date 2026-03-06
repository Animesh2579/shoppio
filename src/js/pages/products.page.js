/**
 * @fileoverview Products Page Controller for Shoppio
 * @description Handles product listing, filtering, sorting, and pagination
 * @version 1.0.0
 */

'use strict';

/**
 * Products Page Controller
 * @namespace ProductsPage
 */
const ProductsPage = {
    /** @type {Object} Current filter state */
    filters: {
        category: 'all',
        minPrice: 0,
        maxPrice: 50000,
        minRating: 0,
        inStock: false,
        onSale: false
    },
    
    /** @type {string} Current sort option */
    sortBy: 'featured',
    
    /** @type {number} Current page */
    currentPage: 1,
    
    /** @type {number} Products per page */
    perPage: 12,
    
    /** @type {string} Search query */
    searchQuery: '',
    
    /**
     * Initialize products page
     */
    init() {
        this.loadUrlParams();
        this.setupFilters();
        this.setupSort();
        this.setupPriceRange();
        this.setupViewToggle();
        this.loadProducts();
    },
    
    /**
     * Load parameters from URL
     */
    loadUrlParams() {
        this.searchQuery = getUrlParam('search') || '';
        const category = getUrlParam('category');
        
        if (category) {
            this.filters.category = category;
        }
        
        // Update search input if present
        const searchInput = document.getElementById('search-input');
        if (searchInput && this.searchQuery) {
            searchInput.value = this.searchQuery;
        }
        
        // Update page title
        if (this.searchQuery) {
            document.title = `Search: ${this.searchQuery} - Shoppio`;
        } else if (category && category !== 'all') {
            const catName = CATEGORIES.find(c => c.id === category)?.name || category;
            document.title = `${catName} - Shoppio`;
        }
    },
    
    /**
     * Load and display products
     */
    loadProducts() {
        const container = document.getElementById('products-grid');
        const resultsCount = document.getElementById('results-count');
        if (!container) return;
        
        // Get products based on search or filters
        let filteredProducts;
        if (this.searchQuery) {
            filteredProducts = ProductService.search(this.searchQuery);
            filteredProducts = this.applyFilters(filteredProducts);
        } else {
            filteredProducts = ProductService.filter(this.filters);
        }
        
        // Sort products
        filteredProducts = ProductService.sort(filteredProducts, this.sortBy);
        
        // Update results count
        if (resultsCount) {
            const countText = this.searchQuery 
                ? `${filteredProducts.length} results for "${this.searchQuery}"`
                : `Showing ${filteredProducts.length} products`;
            resultsCount.textContent = countText;
        }
        
        // Paginate
        const totalPages = Math.ceil(filteredProducts.length / this.perPage);
        const startIndex = (this.currentPage - 1) * this.perPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + this.perPage);
        
        // Render products
        if (paginatedProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products" data-testid="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <a href="products.html" class="btn btn-primary">View All Products</a>
                </div>
            `;
        } else {
            container.innerHTML = paginatedProducts.map(p => createProductCard(p)).join('');
        }
        
        // Update pagination
        this.renderPagination(totalPages);
    },
    
    /**
     * Apply filters to product list
     * @param {Array} products - Products to filter
     * @returns {Array} Filtered products
     */
    applyFilters(products) {
        let filtered = [...products];
        
        if (this.filters.category && this.filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }
        
        if (this.filters.maxPrice) {
            filtered = filtered.filter(p => p.price <= this.filters.maxPrice);
        }
        
        if (this.filters.minRating) {
            filtered = filtered.filter(p => p.rating >= this.filters.minRating);
        }
        
        if (this.filters.inStock) {
            filtered = filtered.filter(p => p.stock > 0);
        }
        
        if (this.filters.onSale) {
            filtered = filtered.filter(p => p.isSale);
        }
        
        return filtered;
    },
    
    /**
     * Setup filter event listeners
     */
    setupFilters() {
        // Category filters
        document.querySelectorAll('input[name="category"]').forEach(input => {
            // Set initial state
            if (input.value === this.filters.category) {
                input.checked = true;
            }
            
            input.addEventListener('change', () => {
                this.filters.category = input.value;
                this.currentPage = 1;
                this.loadProducts();
                setUrlParam('category', input.value === 'all' ? null : input.value);
            });
        });
        
        // Rating filters
        document.querySelectorAll('input[name="rating"]').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.minRating = parseFloat(input.value) || 0;
                this.currentPage = 1;
                this.loadProducts();
            });
        });
        
        // In stock filter
        const stockFilter = document.getElementById('filter-stock');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => {
                this.filters.inStock = stockFilter.checked;
                this.currentPage = 1;
                this.loadProducts();
            });
        }
        
        // On sale filter
        const saleFilter = document.getElementById('filter-sale');
        if (saleFilter) {
            saleFilter.addEventListener('change', () => {
                this.filters.onSale = saleFilter.checked;
                this.currentPage = 1;
                this.loadProducts();
            });
        }
        
        // Clear filters button
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    },
    
    /**
     * Reset all filters
     */
    resetFilters() {
        this.filters = {
            category: 'all',
            minPrice: 0,
            maxPrice: 50000,
            minRating: 0,
            inStock: false,
            onSale: false
        };
        this.currentPage = 1;
        this.searchQuery = '';
        
        // Reset UI
        document.querySelectorAll('input[name="category"]').forEach(input => {
            input.checked = input.value === 'all';
        });
        document.querySelectorAll('input[name="rating"]').forEach(input => {
            input.checked = false;
        });
        
        const stockFilter = document.getElementById('filter-stock');
        if (stockFilter) stockFilter.checked = false;
        
        const saleFilter = document.getElementById('filter-sale');
        if (saleFilter) saleFilter.checked = false;
        
        const priceRange = document.getElementById('price-range');
        if (priceRange) {
            priceRange.value = 50000;
            document.getElementById('price-value').textContent = '₹50,000';
        }
        
        // Clear URL params
        window.history.pushState({}, '', 'products.html');
        
        this.loadProducts();
    },
    
    /**
     * Setup sort dropdown
     */
    setupSort() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortBy = sortSelect.value;
                this.currentPage = 1;
                this.loadProducts();
            });
        }
    },
    
    /**
     * Setup price range slider
     */
    setupPriceRange() {
        const priceRange = document.getElementById('price-range');
        const priceValue = document.getElementById('price-value');
        
        if (priceRange && priceValue) {
            priceRange.addEventListener('input', () => {
                priceValue.textContent = formatPrice(parseInt(priceRange.value));
            });
            
            priceRange.addEventListener('change', () => {
                this.filters.maxPrice = parseInt(priceRange.value);
                this.currentPage = 1;
                this.loadProducts();
            });
        }
    },
    
    /**
     * Setup view toggle (grid/list)
     */
    setupViewToggle() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                const grid = document.getElementById('products-grid');
                
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (grid) {
                    grid.classList.toggle('list-view', view === 'list');
                }
            });
        });
    },
    
    /**
     * Render pagination controls
     * @param {number} totalPages - Total number of pages
     */
    renderPagination(totalPages) {
        const container = document.getElementById('pagination');
        if (!container || totalPages <= 1) {
            if (container) container.innerHTML = '';
            return;
        }
        
        let html = `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="ProductsPage.goToPage(${this.currentPage - 1})" data-testid="prev-page">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="ProductsPage.goToPage(${i})" data-testid="page-${i}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span class="pagination-ellipsis">...</span>';
            }
        }
        
        html += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="ProductsPage.goToPage(${this.currentPage + 1})" data-testid="next-page">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = html;
    },
    
    /**
     * Navigate to specific page
     * @param {number} page - Page number
     */
    goToPage(page) {
        this.currentPage = page;
        this.loadProducts();
        scrollToTop();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'products' || document.getElementById('products-grid')) {
        ProductsPage.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsPage;
}
