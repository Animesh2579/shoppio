/**
 * @fileoverview Product data for Shoppio e-commerce
 * @description Contains all product information with Indian pricing (INR)
 * @version 1.0.0
 */

'use strict';

/**
 * Product catalog with Indian pricing
 * @constant {Array<Object>}
 */
const products = [
    {
        id: 1,
        name: "boAt Rockerz 450 Bluetooth Headphones",
        category: "electronics",
        price: 1299,
        originalPrice: 2990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
        ],
        rating: 4.5,
        reviews: 12847,
        description: "Experience powerful sound with boAt Rockerz 450 wireless headphones featuring 40mm drivers, 15-hour battery life, and soft padded ear cushions for all-day comfort.",
        features: ["40mm Dynamic Drivers", "15-hour Battery", "Bluetooth 5.0", "Foldable Design", "Built-in Mic"],
        specs: {
            "Brand": "boAt",
            "Model": "Rockerz 450",
            "Color": "Luscious Black",
            "Connectivity": "Bluetooth 5.0",
            "Battery Life": "15 hours",
            "Weight": "224g"
        },
        stock: 150,
        isNew: false,
        isSale: true,
        seller: "Boat India Official",
        deliveryDays: 3
    },
    {
        id: 2,
        name: "Fire-Boltt Phoenix Smart Watch",
        category: "electronics",
        price: 1499,
        originalPrice: 7999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
        ],
        rating: 4.2,
        reviews: 45632,
        description: "Fire-Boltt Phoenix smartwatch with 1.3\" display, SpO2 monitoring, heart rate tracking, and 7-day battery life. Perfect companion for your fitness journey.",
        features: ["SpO2 Monitoring", "Heart Rate Tracker", "IP68 Water Resistant", "7-day Battery", "Multiple Sports Modes"],
        specs: {
            "Brand": "Fire-Boltt",
            "Display": "1.3\" TFT",
            "Battery": "7 days",
            "Water Resistance": "IP68",
            "Compatibility": "Android & iOS"
        },
        stock: 235,
        isNew: true,
        isSale: true,
        seller: "Fire-Boltt Official",
        deliveryDays: 2
    },
    {
        id: 3,
        name: "Safari Laptop Backpack 40L",
        category: "fashion",
        price: 899,
        originalPrice: 2499,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
        ],
        rating: 4.3,
        reviews: 8934,
        description: "Safari 40L laptop backpack with rain cover, multiple compartments, and ergonomic design. Fits laptops up to 17 inches.",
        features: ["Rain Cover Included", "USB Charging Port", "Fits 17\" Laptop", "Anti-theft Pocket", "Padded Straps"],
        specs: {
            "Brand": "Safari",
            "Material": "Polyester",
            "Capacity": "40L",
            "Laptop Size": "Up to 17\"",
            "Warranty": "2 Years"
        },
        stock: 320,
        isNew: false,
        isSale: true,
        seller: "Safari Bags Official",
        deliveryDays: 4
    },
    {
        id: 4,
        name: "Nike Revolution 6 Running Shoes",
        category: "sports",
        price: 2995,
        originalPrice: 4995,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
        ],
        rating: 4.4,
        reviews: 15678,
        description: "Nike Revolution 6 running shoes with soft foam midsole, breathable mesh upper, and durable rubber outsole for everyday running.",
        features: ["Foam Midsole", "Breathable Mesh", "Lightweight", "Rubber Outsole"],
        specs: {
            "Brand": "Nike",
            "Type": "Running",
            "Material": "Mesh/Synthetic",
            "Sole": "Rubber",
            "Closure": "Lace-up"
        },
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        stock: 175,
        isNew: false,
        isSale: true,
        seller: "Nike India",
        deliveryDays: 3
    },
    {
        id: 5,
        name: "Prestige Iris 750W Mixer Grinder",
        category: "home",
        price: 2499,
        originalPrice: 4495,
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400",
        images: [
            "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"
        ],
        rating: 4.1,
        reviews: 23456,
        description: "Prestige Iris 750W mixer grinder with 3 stainless steel jars, powerful motor, and 2-year warranty. Perfect for Indian kitchen.",
        features: ["750W Motor", "3 SS Jars", "Overload Protection", "Anti-skid Feet", "2 Year Warranty"],
        specs: {
            "Brand": "Prestige",
            "Power": "750W",
            "Jars": "3 (1.5L, 1L, 0.5L)",
            "Material": "Stainless Steel",
            "Warranty": "2 Years"
        },
        stock: 89,
        isNew: false,
        isSale: true,
        seller: "Prestige Official",
        deliveryDays: 4
    },
    {
        id: 6,
        name: "Lakme Absolute Skin Dew Serum Foundation",
        category: "beauty",
        price: 750,
        originalPrice: 950,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        images: [
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"
        ],
        rating: 4.0,
        reviews: 5678,
        description: "Lakme Absolute Skin Dew Serum Foundation with SPF 20 for a dewy, natural finish. Lightweight formula suitable for all skin types.",
        features: ["SPF 20", "Dewy Finish", "Lightweight", "12-hour Wear", "Vitamin E Enriched"],
        specs: {
            "Brand": "Lakme",
            "Type": "Serum Foundation",
            "SPF": "20",
            "Volume": "25ml",
            "Skin Type": "All"
        },
        shades: ["Warm Natural", "Rose Fair", "Soft Beige", "Warm Beige", "Golden Medium"],
        stock: 200,
        isNew: true,
        isSale: false,
        seller: "Lakme Official",
        deliveryDays: 2
    },
    {
        id: 7,
        name: "OnePlus Nord Buds 2 TWS Earbuds",
        category: "electronics",
        price: 2999,
        originalPrice: 3499,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"
        ],
        rating: 4.3,
        reviews: 34521,
        description: "OnePlus Nord Buds 2 with Active Noise Cancellation, 12.4mm titanium drivers, and up to 36 hours total playback.",
        features: ["Active Noise Cancellation", "12.4mm Titanium Drivers", "36hr Battery", "IP55 Rating", "Fast Charging"],
        specs: {
            "Brand": "OnePlus",
            "Model": "Nord Buds 2",
            "Driver": "12.4mm Titanium",
            "ANC": "Yes",
            "Battery": "36 hours total"
        },
        colors: ["Thunder Gray", "Lightning White"],
        stock: 450,
        isNew: true,
        isSale: true,
        seller: "OnePlus India",
        deliveryDays: 2
    },
    {
        id: 8,
        name: "Allen Solly Men's Formal Shirt",
        category: "fashion",
        price: 1199,
        originalPrice: 1999,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"
        ],
        rating: 4.2,
        reviews: 7845,
        description: "Allen Solly men's slim fit formal shirt in premium cotton. Perfect for office wear with wrinkle-resistant fabric.",
        features: ["100% Cotton", "Slim Fit", "Wrinkle Resistant", "Full Sleeves", "Button Down Collar"],
        specs: {
            "Brand": "Allen Solly",
            "Fit": "Slim",
            "Material": "Cotton",
            "Sleeve": "Full",
            "Pattern": "Solid"
        },
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Light Blue", "Pink", "Grey"],
        stock: 280,
        isNew: false,
        isSale: true,
        seller: "Allen Solly Official",
        deliveryDays: 3
    },
    {
        id: 9,
        name: "Pigeon by Stovekraft 12L OTG",
        category: "home",
        price: 2299,
        originalPrice: 4495,
        image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400",
        images: [
            "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400"
        ],
        rating: 4.0,
        reviews: 12345,
        description: "Pigeon 12L Oven Toaster Grill with rotisserie function, adjustable temperature, and 60-minute timer. Perfect for baking and grilling.",
        features: ["12L Capacity", "Rotisserie", "60-min Timer", "Temperature Control", "Auto Shut-off"],
        specs: {
            "Brand": "Pigeon",
            "Capacity": "12 Litres",
            "Power": "1200W",
            "Timer": "60 minutes",
            "Warranty": "1 Year"
        },
        stock: 67,
        isNew: false,
        isSale: true,
        seller: "Stovekraft Official",
        deliveryDays: 5
    },
    {
        id: 10,
        name: "Puma Men's Track Pants",
        category: "sports",
        price: 1499,
        originalPrice: 2499,
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400",
        images: [
            "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400"
        ],
        rating: 4.3,
        reviews: 9876,
        description: "Puma men's track pants with dryCELL technology for moisture-wicking comfort. Ideal for workouts and casual wear.",
        features: ["dryCELL Technology", "Elastic Waistband", "Side Pockets", "Tapered Fit", "Lightweight"],
        specs: {
            "Brand": "Puma",
            "Fit": "Tapered",
            "Material": "Polyester",
            "Technology": "dryCELL",
            "Care": "Machine Wash"
        },
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy Blue", "Grey"],
        stock: 190,
        isNew: false,
        isSale: true,
        seller: "Puma India",
        deliveryDays: 3
    },
    {
        id: 11,
        name: "Realme Narzo 60 5G Smartphone",
        category: "electronics",
        price: 15999,
        originalPrice: 17999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
        ],
        rating: 4.4,
        reviews: 28934,
        description: "Realme Narzo 60 5G with Dimensity 6100+ processor, 6GB RAM, 128GB storage, and 64MP AI camera. 5000mAh battery with 33W fast charging.",
        features: ["Dimensity 6100+", "64MP AI Camera", "5000mAh Battery", "33W Fast Charging", "5G Ready"],
        specs: {
            "Brand": "Realme",
            "Processor": "Dimensity 6100+",
            "RAM": "6GB",
            "Storage": "128GB",
            "Display": "6.72\" FHD+",
            "Battery": "5000mAh"
        },
        colors: ["Mars Orange", "Cosmic Black"],
        stock: 125,
        isNew: true,
        isSale: true,
        seller: "Realme Official",
        deliveryDays: 2
    },
    {
        id: 12,
        name: "Mamaearth Vitamin C Face Serum",
        category: "beauty",
        price: 599,
        originalPrice: 799,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"
        ],
        rating: 4.1,
        reviews: 67890,
        description: "Mamaearth Vitamin C Face Serum with turmeric for skin illumination. Reduces dark spots and gives natural glow.",
        features: ["Vitamin C", "Turmeric Extract", "Paraben Free", "Reduces Dark Spots", "Natural Glow"],
        specs: {
            "Brand": "Mamaearth",
            "Type": "Face Serum",
            "Volume": "30ml",
            "Key Ingredients": "Vitamin C, Turmeric",
            "Skin Type": "All"
        },
        stock: 500,
        isNew: false,
        isSale: true,
        seller: "Mamaearth Official",
        deliveryDays: 2
    },
    {
        id: 13,
        name: "Havells Instanio Prime Water Heater 15L",
        category: "home",
        price: 7999,
        originalPrice: 11500,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
        images: [
            "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"
        ],
        rating: 4.4,
        reviews: 5432,
        description: "Havells Instanio Prime 15L storage water heater with Incoloy heating element, Feroglas coated tank, and 5-star energy rating.",
        features: ["15L Capacity", "Incoloy Element", "5-Star Rating", "Feroglas Tank", "7 Year Warranty"],
        specs: {
            "Brand": "Havells",
            "Capacity": "15 Litres",
            "Power": "2000W",
            "Energy Rating": "5 Star",
            "Warranty": "7 Years on Tank"
        },
        stock: 45,
        isNew: false,
        isSale: true,
        seller: "Havells Official",
        deliveryDays: 5
    },
    {
        id: 14,
        name: "Wildcraft Unisex Duffle Bag 40L",
        category: "fashion",
        price: 1299,
        originalPrice: 2195,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
        ],
        rating: 4.2,
        reviews: 4567,
        description: "Wildcraft 40L duffle bag with shoe compartment, water-resistant fabric, and adjustable shoulder strap. Perfect for gym and travel.",
        features: ["40L Capacity", "Shoe Compartment", "Water Resistant", "Adjustable Strap", "Multiple Pockets"],
        specs: {
            "Brand": "Wildcraft",
            "Capacity": "40L",
            "Material": "Polyester",
            "Dimensions": "55 x 28 x 28 cm",
            "Warranty": "5 Years"
        },
        colors: ["Black", "Navy", "Red"],
        stock: 156,
        isNew: false,
        isSale: true,
        seller: "Wildcraft Official",
        deliveryDays: 4
    },
    {
        id: 15,
        name: "Yonex Badminton Racket GR 303",
        category: "sports",
        price: 599,
        originalPrice: 850,
        image: "https://images.unsplash.com/photo-1617083934551-ac1f1c240d9b?w=400",
        images: [
            "https://images.unsplash.com/photo-1617083934551-ac1f1c240d9b?w=400"
        ],
        rating: 4.0,
        reviews: 8765,
        description: "Yonex GR 303 badminton racket with aluminum frame and steel shaft. Ideal for beginners and recreational players.",
        features: ["Aluminum Frame", "Steel Shaft", "Isometric Head", "Pre-strung", "Full Cover Included"],
        specs: {
            "Brand": "Yonex",
            "Model": "GR 303",
            "Frame": "Aluminum",
            "Shaft": "Steel",
            "Weight": "95-99g"
        },
        stock: 230,
        isNew: false,
        isSale: true,
        seller: "Yonex India",
        deliveryDays: 3
    },
    {
        id: 16,
        name: "Noise ColorFit Pro 4 Smartwatch",
        category: "electronics",
        price: 3499,
        originalPrice: 5999,
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
        images: [
            "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400"
        ],
        rating: 4.1,
        reviews: 23456,
        description: "Noise ColorFit Pro 4 with 1.72\" AMOLED display, Bluetooth calling, 100+ sports modes, and 7-day battery life.",
        features: ["1.72\" AMOLED", "Bluetooth Calling", "100+ Sports Modes", "SpO2 Monitor", "7-day Battery"],
        specs: {
            "Brand": "Noise",
            "Display": "1.72\" AMOLED",
            "Battery": "7 days",
            "Water Resistance": "IP68",
            "Compatibility": "Android & iOS"
        },
        colors: ["Jet Black", "Rose Pink", "Silver Grey"],
        stock: 180,
        isNew: true,
        isSale: true,
        seller: "Noise Official",
        deliveryDays: 2
    },
    {
        id: 17,
        name: "W Women's Kurta Set",
        category: "fashion",
        price: 1799,
        originalPrice: 2999,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400",
        images: [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400"
        ],
        rating: 4.3,
        reviews: 6543,
        description: "W women's cotton kurta set with palazzo pants. Beautiful ethnic print perfect for casual and festive occasions.",
        features: ["100% Cotton", "Ethnic Print", "Comfortable Fit", "Machine Washable", "Palazzo Included"],
        specs: {
            "Brand": "W",
            "Material": "Cotton",
            "Set Contents": "Kurta + Palazzo",
            "Sleeve": "3/4th",
            "Occasion": "Casual/Festive"
        },
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        stock: 145,
        isNew: false,
        isSale: true,
        seller: "W Official",
        deliveryDays: 4
    },
    {
        id: 18,
        name: "Philips Air Fryer HD9200/90",
        category: "home",
        price: 6999,
        originalPrice: 9995,
        image: "https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=400",
        images: [
            "https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=400"
        ],
        rating: 4.5,
        reviews: 18765,
        description: "Philips Air Fryer with Rapid Air Technology for healthy frying with up to 90% less fat. 4.1L capacity perfect for family cooking.",
        features: ["Rapid Air Technology", "90% Less Fat", "4.1L Capacity", "Touch Screen", "Dishwasher Safe"],
        specs: {
            "Brand": "Philips",
            "Capacity": "4.1 Litres",
            "Power": "1400W",
            "Temperature": "80-200°C",
            "Warranty": "2 Years"
        },
        stock: 78,
        isNew: true,
        isSale: true,
        seller: "Philips India",
        deliveryDays: 4
    },
    {
        id: 19,
        name: "Decathlon Domyos Yoga Mat 8mm",
        category: "sports",
        price: 499,
        originalPrice: 699,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
        images: [
            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"
        ],
        rating: 4.4,
        reviews: 34567,
        description: "Decathlon Domyos yoga mat with 8mm thickness for superior cushioning. Non-slip surface and includes carrying strap.",
        features: ["8mm Thickness", "Non-slip Surface", "Carrying Strap", "Lightweight", "Easy to Clean"],
        specs: {
            "Brand": "Decathlon",
            "Thickness": "8mm",
            "Length": "173cm",
            "Width": "61cm",
            "Material": "TPE"
        },
        colors: ["Blue", "Purple", "Green", "Pink"],
        stock: 400,
        isNew: false,
        isSale: true,
        seller: "Decathlon India",
        deliveryDays: 3
    },
    {
        id: 20,
        name: "The Psychology of Money - Book",
        category: "books",
        price: 299,
        originalPrice: 399,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        images: [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
        ],
        rating: 4.6,
        reviews: 89012,
        description: "The Psychology of Money by Morgan Housel. Timeless lessons on wealth, greed, and happiness. Bestseller with over 3 million copies sold.",
        features: ["Paperback", "256 Pages", "English", "Bestseller", "Personal Finance"],
        specs: {
            "Author": "Morgan Housel",
            "Publisher": "Jaico Publishing",
            "Pages": "256",
            "Language": "English",
            "ISBN": "9789390166268"
        },
        stock: 500,
        isNew: false,
        isSale: true,
        seller: "Jaico Books",
        deliveryDays: 2
    }
];

/**
 * Sample Reviews Data
 * @constant {Array<Object>}
 */
const sampleReviews = [
    {
        productId: 1,
        reviews: [
            { id: 1, userName: "Rahul S.", rating: 5, title: "Excellent sound quality!", text: "Best headphones in this price range. Bass is amazing!", date: "2024-01-15", verified: true },
            { id: 2, userName: "Priya M.", rating: 4, title: "Good value for money", text: "Comfortable to wear for long hours. Battery life is great.", date: "2024-01-10", verified: true },
            { id: 3, userName: "Amit K.", rating: 4, title: "Recommended", text: "Using it for 3 months now. No complaints.", date: "2024-01-05", verified: true }
        ]
    },
    {
        productId: 2,
        reviews: [
            { id: 1, userName: "Sneha R.", rating: 5, title: "Perfect fitness companion", text: "Tracks everything accurately. Love the battery life!", date: "2024-01-18", verified: true },
            { id: 2, userName: "Vikram P.", rating: 4, title: "Good smartwatch", text: "Display is bright and clear. App works well.", date: "2024-01-12", verified: true }
        ]
    }
];

/**
 * Sample Orders Data (for demo)
 * @constant {Array<Object>}
 */
const sampleOrders = [
    {
        id: "SHP24010001",
        date: "2024-01-15T10:30:00",
        status: "delivered",
        items: [
            { productId: 1, quantity: 1, price: 1299 },
            { productId: 3, quantity: 1, price: 899 }
        ],
        subtotal: 2198,
        shipping: 0,
        tax: 396,
        total: 2594,
        deliveredDate: "2024-01-18"
    },
    {
        id: "SHP24010002",
        date: "2024-01-20T14:45:00",
        status: "shipped",
        items: [
            { productId: 4, quantity: 1, price: 2995 }
        ],
        subtotal: 2995,
        shipping: 0,
        tax: 539,
        total: 3534,
        trackingId: "DTDC123456789"
    }
];

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, sampleReviews, sampleOrders };
}
