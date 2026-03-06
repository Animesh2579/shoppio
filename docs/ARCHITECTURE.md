# Shoppio - Architecture Document

## 1. Overview

Shoppio is a fully functional e-commerce web application built using static web technologies (HTML5, CSS3, JavaScript). It is designed to be hosted on GitHub Pages or any static file server without requiring a backend.

### 1.1 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Styling | Custom CSS with CSS Variables |
| Icons | Font Awesome 6.x |
| Data Storage | Browser localStorage |
| Hosting | GitHub Pages / Static Server |

### 1.2 Design Principles

- **No Backend Required**: All data persisted in browser localStorage
- **Modular Architecture**: Separation of concerns with services and page controllers
- **Mobile-First**: Responsive design with breakpoints for all devices
- **Testable**: Data attributes (`data-testid`) for Playwright/Selenium testing
- **Indian Locale**: INR currency, Indian states, GST calculations

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   HTML      │  │    CSS      │  │ JavaScript  │              │
│  │   Pages     │  │   Styles    │  │   Modules   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │                    Application Layer                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                    app.js (Main Controller)          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │         │              │              │              │     │  │
│  │  ┌──────▼─────┐ ┌──────▼─────┐ ┌──────▼─────┐ ┌─────▼───┐ │  │
│  │  │ AuthService│ │CartService │ │ProductSvc  │ │OrderSvc │ │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └─────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │                    Data Layer                              │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │  products.js    │  │      localStorage                │ │  │
│  │  │  (Static Data)  │  │  (User, Cart, Orders, Wishlist)  │ │  │
│  │  └─────────────────┘  └─────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Folder Structure

```
shoppio/
├── index.html                    # Home page
├── products.html                 # Product listing page
├── product-detail.html           # Product detail page
├── cart.html                     # Shopping cart page
├── checkout.html                 # Checkout process
├── order-confirmation.html       # Order confirmation
├── login.html                    # User login
├── register.html                 # User registration
├── profile.html                  # User profile
├── orders.html                   # Order history
├── wishlist.html                 # User wishlist
├── categories.html               # Category listing
├── about.html                    # About us
├── contact.html                  # Contact page
│
├── css/
│   └── style.css                 # Main stylesheet (2000+ lines)
│
├── src/
│   └── js/
│       ├── config/
│       │   └── constants.js      # App configuration, promo codes
│       │
│       ├── data/
│       │   └── products.js       # Product catalog (20 items)
│       │
│       ├── utils/
│       │   └── helpers.js        # Utility functions
│       │
│       ├── services/
│       │   ├── auth.service.js   # Authentication logic
│       │   ├── cart.service.js   # Cart & wishlist operations
│       │   ├── product.service.js# Product filtering/search
│       │   └── order.service.js  # Order management
│       │
│       ├── app.js                # Main application controller
│       │
│       └── pages/
│           ├── home.page.js      # Home page controller
│           ├── products.page.js  # Products page controller
│           ├── product-detail.page.js
│           ├── cart.page.js      # Cart page controller
│           ├── checkout.page.js  # Checkout controller
│           ├── auth.page.js      # Login/Register controller
│           └── profile.page.js   # Profile pages controller
│
└── docs/
    ├── ARCHITECTURE.md           # This document
    ├── API_SPECIFICATION.md      # API/Service documentation
    └── features/                 # BDD feature files
        ├── authentication.feature
        ├── cart.feature
        ├── checkout.feature
        └── products.feature
```

---

## 4. Component Details

### 4.1 Services Layer

#### AuthService (`auth.service.js`)
Handles user authentication and session management.

| Method | Description |
|--------|-------------|
| `init()` | Initialize service, load user from localStorage |
| `login(email, password)` | Authenticate user |
| `register(userData)` | Create new user account |
| `logout()` | Clear user session |
| `isLoggedIn()` | Check authentication status |
| `updateProfile(data)` | Update user profile |
| `requireLogin(redirectUrl)` | Redirect to login if not authenticated |

#### CartService (`cart.service.js`)
Manages shopping cart operations.

| Method | Description |
|--------|-------------|
| `init()` | Load cart from localStorage |
| `addItem(productId, qty, options)` | Add item (requires login) |
| `removeItem(productId, options)` | Remove item from cart |
| `updateQuantity(productId, qty)` | Update item quantity |
| `getItems()` | Get all cart items with product details |
| `getTotals(promoCode, shippingMethod)` | Calculate cart totals |
| `applyPromoCode(code)` | Validate and apply promo code |
| `clear()` | Empty the cart |

#### ProductService (`product.service.js`)
Handles product data operations.

| Method | Description |
|--------|-------------|
| `getById(id)` | Get single product |
| `getAll()` | Get all products |
| `getByCategory(category)` | Filter by category |
| `search(query)` | Search products |
| `filter(filters)` | Apply multiple filters |
| `sort(products, sortBy)` | Sort product list |
| `getFeatured(limit)` | Get featured products |
| `getRelated(productId, limit)` | Get related products |

#### OrderService (`order.service.js`)
Manages order creation and history.

| Method | Description |
|--------|-------------|
| `createOrder(orderData)` | Create new order |
| `getOrders()` | Get user's order history |
| `getOrderById(orderId)` | Get specific order |
| `getLastOrder()` | Get most recent order |
| `cancelOrder(orderId)` | Cancel pending order |

### 4.2 Page Controllers

Each page has a dedicated controller that initializes on `DOMContentLoaded`:

| Controller | Page | Responsibilities |
|------------|------|------------------|
| `HomePage` | index.html | Load featured products, deals, countdown |
| `ProductsPage` | products.html | Filtering, sorting, pagination |
| `ProductDetailPage` | product-detail.html | Gallery, options, add to cart |
| `CartPage` | cart.html | Cart management, promo codes |
| `CheckoutPage` | checkout.html | Multi-step checkout flow |
| `AuthPage` | login/register.html | Form validation, authentication |
| `ProfilePage` | profile/orders/wishlist.html | User account management |

---

## 5. Data Models

### 5.1 Product Model

```javascript
{
    id: Number,              // Unique identifier
    name: String,            // Product name
    category: String,        // Category ID
    price: Number,           // Current price (INR)
    originalPrice: Number,   // Original price for discount calc
    image: String,           // Main image URL
    images: Array<String>,   // Gallery images
    rating: Number,          // Average rating (0-5)
    reviews: Number,         // Review count
    description: String,     // Product description
    features: Array<String>, // Key features list
    specs: Object,           // Specifications key-value pairs
    stock: Number,           // Available quantity
    isNew: Boolean,          // New arrival flag
    isSale: Boolean,         // On sale flag
    seller: String,          // Seller name
    deliveryDays: Number,    // Estimated delivery days
    sizes: Array<String>,    // Available sizes (optional)
    colors: Array<String>    // Available colors (optional)
}
```

### 5.2 User Model

```javascript
{
    id: String,              // User ID
    email: String,           // Email address
    firstName: String,       // First name
    lastName: String,        // Last name
    phone: String,           // Phone number
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    isLoggedIn: Boolean,     // Session status
    loginTime: String        // ISO timestamp
}
```

### 5.3 Cart Item Model

```javascript
{
    productId: Number,       // Product ID
    quantity: Number,        // Quantity
    options: {
        size: String,        // Selected size
        color: String        // Selected color
    },
    addedAt: String          // ISO timestamp
}
```

### 5.4 Order Model

```javascript
{
    id: String,              // Order ID (SHP + YYMM + 5 digits)
    date: String,            // ISO timestamp
    status: String,          // Order status
    userId: String,          // User ID
    items: Array<{
        productId: Number,
        quantity: Number,
        price: Number,
        options: Object
    }>,
    shipping: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        method: String
    },
    payment: {
        method: String       // upi, card, netbanking, cod, wallet
    },
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    discount: Number,
    promoCode: String,
    total: Number
}
```

---

## 6. localStorage Schema

| Key | Type | Description |
|-----|------|-------------|
| `shoppio_user` | Object | Current logged-in user |
| `shoppio_cart` | Array | Cart items |
| `shoppio_wishlist` | Array | Wishlist product IDs |
| `shoppio_orders` | Array | Order history |
| `shoppio_registered_users` | Array | Registered users database |
| `shoppio_promo` | String | Applied promo code |
| `shoppio_last_order` | Object | Last placed order |
| `shoppio_redirect` | String | Redirect URL after login |

---

## 7. Security Considerations

### 7.1 Current Implementation (Demo)
- Passwords stored in plain text in localStorage (demo only)
- No server-side validation
- No HTTPS requirement for static hosting

### 7.2 Production Recommendations
- Implement proper backend with hashed passwords
- Use JWT tokens for authentication
- Enable HTTPS
- Implement CSRF protection
- Add rate limiting
- Sanitize all user inputs

---

## 8. Performance Optimizations

- **Lazy Loading**: Images use `loading="lazy"` attribute
- **Debounced Search**: Search input debounced to reduce operations
- **Pagination**: Products paginated (12 per page)
- **Minimal Dependencies**: No external JS frameworks
- **CSS Variables**: Efficient theming with CSS custom properties

---

## 9. Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

---

## 10. Future Enhancements

1. **Backend Integration**: REST API with Node.js/Python
2. **Payment Gateway**: Razorpay/PayTM integration
3. **Real-time Updates**: WebSocket for inventory updates
4. **PWA Support**: Service worker for offline access
5. **Analytics**: Google Analytics integration
6. **A/B Testing**: Feature flags for experiments
