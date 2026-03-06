// Products Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initProductsPage();
});

let currentFilters = {
    category: 'all',
    maxPrice: 500,
    minRating: 0,
    inStock: false,
    onSale: false
};

let currentSort = 'featured';
let currentPage = 1;
const productsPerPage = 12;

function initProductsPage() {
    // Check for URL parameters
    const searchQuery = getUrlParam('search');
    const categoryParam = getUrlParam('category');
    
    if (categoryParam) {
        currentFilters.category = categoryParam;
        updateFilterUI();
    }
    
    if (searchQuery) {
        document.getElementById('search-input').value = searchQuery;
    }
    
    loadProducts();
    initFilters();
    initSort();
    initPriceRange();
}

function loadProducts() {
    const container = document.getElementById('products-grid');
    const resultsCount = document.getElementById('results-count');
    if (!container) return;
    
    // Get search query
    const searchQuery = getUrlParam('search');
    
    // Get filtered products
    let filteredProducts;
    if (searchQuery) {
        filteredProducts = searchProducts(searchQuery);
        // Apply additional filters
        filteredProducts = applyFilters(filteredProducts);
    } else {
        filteredProducts = filterProducts(currentFilters);
    }
    
    // Sort products
    filteredProducts = sortProducts(filteredProducts, currentSort);
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filteredProducts.length} products`;
    }
    
    // Paginate
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
    
    // Render products
    if (paginatedProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
    } else {
        container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    }
    
    // Update pagination
    updatePagination(totalPages);
}

function applyFilters(products) {
    let filtered = [...products];
    
    if (currentFilters.category && currentFilters.category !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilters.category);
    }
    
    if (currentFilters.maxPrice) {
        filtered = filtered.filter(p => p.price <= currentFilters.maxPrice);
    }
    
    if (currentFilters.minRating) {
        filtered = filtered.filter(p => p.rating >= currentFilters.minRating);
    }
    
    if (currentFilters.inStock) {
        filtered = filtered.filter(p => p.stock > 0);
    }
    
    if (currentFilters.onSale) {
        filtered = filtered.filter(p => p.isSale);
    }
    
    return filtered;
}

function initFilters() {
    // Category filters
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            currentFilters.category = filter.value;
            currentPage = 1;
            loadProducts();
        });
    });
    
    // Rating filters
    const ratingFilters = document.querySelectorAll('input[name="rating"]');
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            currentFilters.minRating = parseFloat(filter.value);
            currentPage = 1;
            loadProducts();
        });
    });
    
    // Stock filter
    const stockFilter = document.getElementById('filter-stock');
    if (stockFilter) {
        stockFilter.addEventListener('change', () => {
            currentFilters.inStock = stockFilter.checked;
            currentPage = 1;
            loadProducts();
        });
    }
    
    // Sale filter
    const saleFilter = document.getElementById('filter-sale');
    if (saleFilter) {
        saleFilter.addEventListener('change', () => {
            currentFilters.onSale = saleFilter.checked;
            currentPage = 1;
            loadProducts();
        });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            currentFilters = {
                category: 'all',
                maxPrice: 500,
                minRating: 0,
                inStock: false,
                onSale: false
            };
            currentPage = 1;
            updateFilterUI();
            loadProducts();
        });
    }
}

function initSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            currentPage = 1;
            loadProducts();
        });
    }
}

function initPriceRange() {
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = `$${priceRange.value}`;
        });
        
        priceRange.addEventListener('change', () => {
            currentFilters.maxPrice = parseInt(priceRange.value);
            currentPage = 1;
            loadProducts();
        });
    }
}

function updateFilterUI() {
    // Update category radio
    const categoryRadio = document.querySelector(`input[name="category"][value="${currentFilters.category}"]`);
    if (categoryRadio) categoryRadio.checked = true;
    
    // Update price range
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    if (priceRange && priceValue) {
        priceRange.value = currentFilters.maxPrice;
        priceValue.textContent = `$${currentFilters.maxPrice}`;
    }
    
    // Update checkboxes
    const stockFilter = document.getElementById('filter-stock');
    if (stockFilter) stockFilter.checked = currentFilters.inStock;
    
    const saleFilter = document.getElementById('filter-sale');
    if (saleFilter) saleFilter.checked = currentFilters.onSale;
}

function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<button disabled>...</button>';
        }
    }
    
    paginationHTML += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// View toggle
document.addEventListener('click', (e) => {
    if (e.target.closest('.view-btn')) {
        const btn = e.target.closest('.view-btn');
        const view = btn.dataset.view;
        const grid = document.getElementById('products-grid');
        
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (grid) {
            grid.classList.toggle('list-view', view === 'list');
        }
    }
});
