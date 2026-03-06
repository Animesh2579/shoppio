// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        price: 79.99,
        originalPrice: 129.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
        ],
        rating: 4.5,
        reviews: 128,
        description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
        features: ["Active Noise Cancellation", "30-hour Battery", "Bluetooth 5.0", "Foldable Design"],
        specs: {
            "Brand": "AudioMax",
            "Model": "WH-1000XM4",
            "Color": "Black",
            "Connectivity": "Bluetooth 5.0",
            "Battery Life": "30 hours",
            "Weight": "254g"
        },
        stock: 50,
        isNew: false,
        isSale: true
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        category: "electronics",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
        ],
        rating: 4.7,
        reviews: 256,
        description: "Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration.",
        features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"],
        specs: {
            "Brand": "TechFit",
            "Display": "1.4\" AMOLED",
            "Battery": "7 days",
            "Water Resistance": "5ATM",
            "Compatibility": "iOS & Android"
        },
        stock: 35,
        isNew: true,
        isSale: true
    },
    {
        id: 3,
        name: "Laptop Backpack",
        category: "fashion",
        price: 49.99,
        originalPrice: 69.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
        ],
        rating: 4.3,
        reviews: 89,
        description: "Durable laptop backpack with multiple compartments, USB charging port, and ergonomic design.",
        features: ["USB Charging Port", "Water Resistant", "Fits 15.6\" Laptop", "Anti-theft Design"],
        specs: {
            "Material": "Polyester",
            "Capacity": "25L",
            "Laptop Size": "Up to 15.6\"",
            "Dimensions": "18\" x 12\" x 6\""
        },
        stock: 100,
        isNew: false,
        isSale: true
    },
    {
        id: 4,
        name: "Running Shoes Ultra",
        category: "sports",
        price: 129.99,
        originalPrice: 159.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
        ],
        rating: 4.6,
        reviews: 312,
        description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
        features: ["Responsive Cushioning", "Breathable Mesh", "Lightweight", "Durable Outsole"],
        specs: {
            "Brand": "SpeedRun",
            "Type": "Running",
            "Material": "Mesh/Synthetic",
            "Sole": "Rubber",
            "Weight": "280g"
        },
        stock: 75,
        isNew: true,
        isSale: true,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["#ff0000", "#000000", "#ffffff", "#0066cc"]
    },
    {
        id: 5,
        name: "Organic Face Cream",
        category: "beauty",
        price: 34.99,
        originalPrice: 44.99,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400"
        ],
        rating: 4.4,
        reviews: 167,
        description: "Natural organic face cream with anti-aging properties and deep hydration.",
        features: ["100% Organic", "Anti-aging", "Deep Hydration", "Paraben-free"],
        specs: {
            "Size": "50ml",
            "Skin Type": "All Skin Types",
            "Ingredients": "Organic Aloe, Vitamin E, Hyaluronic Acid"
        },
        stock: 200,
        isNew: false,
        isSale: true
    },
    {
        id: 6,
        name: "Bestseller Novel Collection",
        category: "books",
        price: 24.99,
        originalPrice: 39.99,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        images: [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
        ],
        rating: 4.8,
        reviews: 445,
        description: "Collection of 5 bestselling novels from award-winning authors.",
        features: ["5 Books", "Hardcover", "Award Winners", "Gift Box"],
        specs: {
            "Format": "Hardcover",
            "Pages": "Various",
            "Language": "English",
            "Publisher": "Penguin Books"
        },
        stock: 60,
        isNew: false,
        isSale: true
    },
    {
        id: 7,
        name: "Modern Table Lamp",
        category: "home",
        price: 59.99,
        originalPrice: 79.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"
        ],
        rating: 4.2,
        reviews: 78,
        description: "Elegant modern table lamp with adjustable brightness and minimalist design.",
        features: ["Adjustable Brightness", "LED", "Touch Control", "USB Port"],
        specs: {
            "Height": "18 inches",
            "Material": "Metal/Fabric",
            "Bulb Type": "LED (included)",
            "Power": "12W"
        },
        stock: 45,
        isNew: true,
        isSale: true
    },
    {
        id: 8,
        name: "Wireless Earbuds Pro",
        category: "electronics",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"
        ],
        rating: 4.6,
        reviews: 234,
        description: "Premium wireless earbuds with active noise cancellation and immersive sound.",
        features: ["Active Noise Cancellation", "24hr Battery", "Wireless Charging", "IPX4 Water Resistant"],
        specs: {
            "Brand": "SoundPro",
            "Driver": "11mm",
            "Battery": "6hrs (24hrs with case)",
            "Connectivity": "Bluetooth 5.2"
        },
        stock: 80,
        isNew: true,
        isSale: true
    },
    {
        id: 9,
        name: "Yoga Mat Premium",
        category: "sports",
        price: 39.99,
        originalPrice: 54.99,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
        images: [
            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"
        ],
        rating: 4.5,
        reviews: 156,
        description: "Extra thick yoga mat with non-slip surface and carrying strap.",
        features: ["6mm Thick", "Non-slip", "Eco-friendly", "Carrying Strap"],
        specs: {
            "Dimensions": "72\" x 24\"",
            "Thickness": "6mm",
            "Material": "TPE",
            "Weight": "2.5 lbs"
        },
        stock: 120,
        isNew: false,
        isSale: true
    },
    {
        id: 10,
        name: "Denim Jacket Classic",
        category: "fashion",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400",
        images: [
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400"
        ],
        rating: 4.4,
        reviews: 198,
        description: "Classic denim jacket with vintage wash and comfortable fit.",
        features: ["100% Cotton", "Vintage Wash", "Button Closure", "Multiple Pockets"],
        specs: {
            "Material": "100% Cotton Denim",
            "Fit": "Regular",
            "Care": "Machine Washable"
        },
        stock: 65,
        isNew: false,
        isSale: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["#1e3a5f", "#000000"]
    },
    {
        id: 11,
        name: "Coffee Maker Deluxe",
        category: "home",
        price: 129.99,
        originalPrice: 169.99,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
        images: [
            "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400"
        ],
        rating: 4.7,
        reviews: 289,
        description: "Programmable coffee maker with built-in grinder and thermal carafe.",
        features: ["Built-in Grinder", "Programmable", "Thermal Carafe", "12-cup Capacity"],
        specs: {
            "Capacity": "12 cups",
            "Power": "1100W",
            "Features": "Auto-shutoff, Programmable",
            "Carafe": "Thermal Stainless Steel"
        },
        stock: 40,
        isNew: true,
        isSale: true
    },
    {
        id: 12,
        name: "Vitamin C Serum",
        category: "beauty",
        price: 29.99,
        originalPrice: 39.99,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"
        ],
        rating: 4.6,
        reviews: 312,
        description: "Brightening vitamin C serum for radiant and youthful skin.",
        features: ["20% Vitamin C", "Brightening", "Anti-oxidant", "Cruelty-free"],
        specs: {
            "Size": "30ml",
            "Key Ingredient": "20% Vitamin C",
            "Skin Type": "All Skin Types"
        },
        stock: 150,
        isNew: true,
        isSale: false
    },
    {
        id: 13,
        name: "Portable Bluetooth Speaker",
        category: "electronics",
        price: 59.99,
        originalPrice: 79.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"
        ],
        rating: 4.3,
        reviews: 178,
        description: "Waterproof portable speaker with 360° sound and 12-hour battery.",
        features: ["Waterproof IPX7", "360° Sound", "12hr Battery", "Built-in Mic"],
        specs: {
            "Power": "20W",
            "Battery": "12 hours",
            "Connectivity": "Bluetooth 5.0",
            "Water Resistance": "IPX7"
        },
        stock: 90,
        isNew: false,
        isSale: true
    },
    {
        id: 14,
        name: "Leather Wallet",
        category: "fashion",
        price: 44.99,
        originalPrice: 59.99,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
        images: [
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400"
        ],
        rating: 4.5,
        reviews: 145,
        description: "Genuine leather wallet with RFID blocking and multiple card slots.",
        features: ["Genuine Leather", "RFID Blocking", "8 Card Slots", "Slim Design"],
        specs: {
            "Material": "Genuine Leather",
            "Dimensions": "4.5\" x 3.5\"",
            "Card Slots": "8",
            "Features": "RFID Blocking"
        },
        stock: 85,
        isNew: false,
        isSale: true,
        colors: ["#8B4513", "#000000", "#654321"]
    },
    {
        id: 15,
        name: "Resistance Bands Set",
        category: "sports",
        price: 24.99,
        originalPrice: 34.99,
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400",
        images: [
            "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400"
        ],
        rating: 4.4,
        reviews: 267,
        description: "Complete resistance bands set with 5 levels and accessories.",
        features: ["5 Resistance Levels", "Door Anchor", "Handles", "Carrying Bag"],
        specs: {
            "Levels": "5 (10-50 lbs)",
            "Material": "Natural Latex",
            "Includes": "Bands, Handles, Door Anchor, Ankle Straps, Bag"
        },
        stock: 200,
        isNew: false,
        isSale: true
    },
    {
        id: 16,
        name: "Scented Candle Set",
        category: "home",
        price: 34.99,
        originalPrice: 49.99,
        image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400",
        images: [
            "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400"
        ],
        rating: 4.6,
        reviews: 189,
        description: "Luxury scented candle set with 4 different fragrances.",
        features: ["4 Scents", "Soy Wax", "40hr Burn Time", "Gift Box"],
        specs: {
            "Quantity": "4 candles",
            "Wax": "100% Soy",
            "Burn Time": "40 hours each",
            "Scents": "Lavender, Vanilla, Ocean, Rose"
        },
        stock: 70,
        isNew: true,
        isSale: true
    },
    {
        id: 17,
        name: "Mechanical Keyboard RGB",
        category: "electronics",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
        images: [
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400"
        ],
        rating: 4.7,
        reviews: 423,
        description: "Mechanical gaming keyboard with RGB backlighting and hot-swappable switches.",
        features: ["Mechanical Switches", "RGB Backlight", "Hot-swappable", "N-key Rollover"],
        specs: {
            "Switch Type": "Mechanical (Blue)",
            "Layout": "Full Size",
            "Backlight": "RGB",
            "Connection": "USB-C"
        },
        stock: 55,
        isNew: true,
        isSale: true
    },
    {
        id: 18,
        name: "Sunglasses Aviator",
        category: "fashion",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
        ],
        rating: 4.5,
        reviews: 234,
        description: "Classic aviator sunglasses with polarized lenses and UV protection.",
        features: ["Polarized", "UV400 Protection", "Metal Frame", "Case Included"],
        specs: {
            "Frame": "Metal",
            "Lens": "Polarized",
            "UV Protection": "UV400",
            "Includes": "Hard Case, Cleaning Cloth"
        },
        stock: 95,
        isNew: false,
        isSale: true
    },
    {
        id: 19,
        name: "Programming Book Bundle",
        category: "books",
        price: 59.99,
        originalPrice: 89.99,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
        images: [
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400"
        ],
        rating: 4.8,
        reviews: 567,
        description: "Complete programming book bundle covering Python, JavaScript, and Web Development.",
        features: ["3 Books", "Beginner to Advanced", "Code Examples", "Projects Included"],
        specs: {
            "Books": "3",
            "Topics": "Python, JavaScript, Web Dev",
            "Level": "Beginner to Advanced",
            "Format": "Paperback"
        },
        stock: 45,
        isNew: true,
        isSale: true
    },
    {
        id: 20,
        name: "Hair Dryer Professional",
        category: "beauty",
        price: 69.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400",
        images: [
            "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400"
        ],
        rating: 4.4,
        reviews: 198,
        description: "Professional hair dryer with ionic technology and multiple heat settings.",
        features: ["Ionic Technology", "3 Heat Settings", "2 Speed Settings", "Cool Shot"],
        specs: {
            "Power": "1875W",
            "Technology": "Ionic",
            "Settings": "3 Heat, 2 Speed",
            "Cord Length": "9 ft"
        },
        stock: 60,
        isNew: false,
        isSale: true
    }
];

// Demo user for login
const demoUser = {
    email: "demo@shoppio.com",
    password: "demo123",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567"
};

// Promo codes
const promoCodes = {
    "SAVE10": { discount: 10, type: "percent" },
    "SAVE20": { discount: 20, type: "percent" },
    "FLAT15": { discount: 15, type: "fixed" }
};

// Sample reviews
const sampleReviews = [
    {
        id: 1,
        productId: 1,
        userName: "Sarah M.",
        rating: 5,
        title: "Amazing sound quality!",
        text: "These headphones exceeded my expectations. The noise cancellation is incredible and the battery lasts forever.",
        date: "2024-01-15"
    },
    {
        id: 2,
        productId: 1,
        userName: "Mike R.",
        rating: 4,
        title: "Great but pricey",
        text: "Excellent headphones with premium features. A bit expensive but worth it for audiophiles.",
        date: "2024-01-10"
    },
    {
        id: 3,
        productId: 2,
        userName: "Emily K.",
        rating: 5,
        title: "Best smartwatch I've owned",
        text: "The health tracking features are accurate and the battery life is impressive. Highly recommend!",
        date: "2024-01-20"
    }
];

// Sample orders
const sampleOrders = [
    {
        id: "SHP-001234",
        date: "2024-01-20",
        status: "delivered",
        items: [
            { productId: 1, quantity: 1, price: 79.99 },
            { productId: 3, quantity: 1, price: 49.99 }
        ],
        subtotal: 129.98,
        shipping: 5.99,
        tax: 13.00,
        total: 148.97
    },
    {
        id: "SHP-001235",
        date: "2024-01-25",
        status: "shipped",
        items: [
            { productId: 4, quantity: 1, price: 129.99 }
        ],
        subtotal: 129.99,
        shipping: 0,
        tax: 13.00,
        total: 142.99
    },
    {
        id: "SHP-001236",
        date: "2024-01-28",
        status: "processing",
        items: [
            { productId: 8, quantity: 1, price: 149.99 },
            { productId: 9, quantity: 2, price: 39.99 }
        ],
        subtotal: 229.97,
        shipping: 0,
        tax: 23.00,
        total: 252.97
    }
];

// Helper functions
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
}

function getFeaturedProducts(count = 8) {
    return products.filter(p => p.rating >= 4.4).slice(0, count);
}

function getNewArrivals(count = 4) {
    return products.filter(p => p.isNew).slice(0, count);
}

function getSaleProducts(count = 8) {
    return products.filter(p => p.isSale).slice(0, count);
}

function getRelatedProducts(productId, count = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    return products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, count);
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
}

function filterProducts(filters) {
    let filtered = [...products];
    
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.minRating) {
        filtered = filtered.filter(p => p.rating >= filters.minRating);
    }
    
    if (filters.inStock) {
        filtered = filtered.filter(p => p.stock > 0);
    }
    
    if (filters.onSale) {
        filtered = filtered.filter(p => p.isSale);
    }
    
    return filtered;
}

function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        default:
            return sorted;
    }
}

function getProductReviews(productId) {
    return sampleReviews.filter(r => r.productId === parseInt(productId));
}

function formatPrice(price) {
    return '$' + price.toFixed(2);
}

function generateOrderId() {
    return 'SHP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}
