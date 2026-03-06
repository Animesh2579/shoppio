# Shoppio - API/Service Specification

## Overview

Shoppio uses a client-side service architecture. While there's no backend API, the JavaScript services provide a consistent interface that mirrors RESTful API patterns. This document serves as a specification for the service layer.

---

## Base Configuration

```javascript
// src/js/config/constants.js

APP_CONFIG = {
    name: 'Shoppio',
    version: '1.0.0',
    currency: {
        code: 'INR',
        symbol: '₹',
        locale: 'en-IN'
    },
    tax: {
        rate: 0.18,      // 18% GST
        name: 'GST'
    },
    shipping: {
        freeThreshold: 499,
        standardRate: 40,
        expressRate: 99,
        overnightRate: 199
    }
}
```

---

## Authentication Service

### POST /auth/login
**Service Method:** `AuthService.login(email, password)`

**Request:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response (Success):**
```json
{
    "success": true,
    "user": {
        "id": "user_1234567890",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+91 9876543210",
        "address": {
            "street": "123 MG Road",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001",
            "country": "India"
        },
        "isLoggedIn": true,
        "loginTime": "2024-01-15T10:30:00.000Z"
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Invalid email or password"
}
```

---

### POST /auth/register
**Service Method:** `AuthService.register(userData)`

**Request:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "password": "password123"
}
```

**Response (Success):**
```json
{
    "success": true,
    "user": {
        "id": "user_1234567890",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "isLoggedIn": true
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Email already registered"
}
```

---

### POST /auth/logout
**Service Method:** `AuthService.logout()`

**Response:**
```json
{
    "success": true
}
```

---

### GET /auth/me
**Service Method:** `AuthService.currentUser`

**Response:**
```json
{
    "id": "user_1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+91 9876543210",
    "isLoggedIn": true
}
```

---

### PUT /auth/profile
**Service Method:** `AuthService.updateProfile(profileData)`

**Request:**
```json
{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "9876543210"
}
```

**Response:**
```json
{
    "success": true
}
```

---

## Product Service

### GET /products
**Service Method:** `ProductService.getAll()`

**Response:**
```json
{
    "products": [
        {
            "id": 1,
            "name": "boAt Rockerz 450 Bluetooth Headphones",
            "category": "electronics",
            "price": 1299,
            "originalPrice": 2990,
            "image": "https://images.unsplash.com/...",
            "rating": 4.5,
            "reviews": 12847,
            "stock": 150,
            "isNew": false,
            "isSale": true
        }
    ],
    "total": 20
}
```

---

### GET /products/:id
**Service Method:** `ProductService.getById(id)`

**Response:**
```json
{
    "id": 1,
    "name": "boAt Rockerz 450 Bluetooth Headphones",
    "category": "electronics",
    "price": 1299,
    "originalPrice": 2990,
    "image": "https://images.unsplash.com/...",
    "images": ["url1", "url2"],
    "rating": 4.5,
    "reviews": 12847,
    "description": "Experience powerful sound...",
    "features": ["40mm Dynamic Drivers", "15-hour Battery"],
    "specs": {
        "Brand": "boAt",
        "Model": "Rockerz 450",
        "Color": "Luscious Black"
    },
    "stock": 150,
    "isNew": false,
    "isSale": true,
    "seller": "Boat India Official",
    "deliveryDays": 3
}
```

---

### GET /products/search
**Service Method:** `ProductService.search(query)`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query |

**Response:**
```json
{
    "products": [...],
    "total": 5,
    "query": "headphones"
}
```

---

### GET /products/filter
**Service Method:** `ProductService.filter(filters)`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Category ID |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| minRating | number | Minimum rating |
| inStock | boolean | Only in-stock items |
| onSale | boolean | Only sale items |

**Response:**
```json
{
    "products": [...],
    "total": 10,
    "filters": {
        "category": "electronics",
        "maxPrice": 5000
    }
}
```

---

### GET /products/featured
**Service Method:** `ProductService.getFeatured(limit)`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 8 | Number of products |

---

### GET /products/:id/related
**Service Method:** `ProductService.getRelated(productId, limit)`

**Response:**
```json
{
    "products": [...],
    "total": 4
}
```

---

## Cart Service

### GET /cart
**Service Method:** `CartService.getItems()`

**Response:**
```json
{
    "items": [
        {
            "productId": 1,
            "quantity": 2,
            "options": {
                "size": "M",
                "color": "Black"
            },
            "product": {
                "id": 1,
                "name": "Product Name",
                "price": 1299,
                "image": "url"
            }
        }
    ],
    "itemCount": 2
}
```

---

### POST /cart/add
**Service Method:** `CartService.addItem(productId, quantity, options)`

**Request:**
```json
{
    "productId": 1,
    "quantity": 1,
    "options": {
        "size": "M",
        "color": "Black"
    }
}
```

**Response (Success):**
```json
{
    "success": true
}
```

**Response (Not Logged In):**
```json
{
    "success": false,
    "requiresLogin": true
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Insufficient stock"
}
```

---

### PUT /cart/update
**Service Method:** `CartService.updateQuantity(productId, quantity, options)`

**Request:**
```json
{
    "productId": 1,
    "quantity": 3,
    "options": {}
}
```

**Response:**
```json
{
    "success": true
}
```

---

### DELETE /cart/remove
**Service Method:** `CartService.removeItem(productId, options)`

**Request:**
```json
{
    "productId": 1,
    "options": {}
}
```

**Response:**
```json
{
    "success": true
}
```

---

### GET /cart/totals
**Service Method:** `CartService.getTotals(promoCode, shippingMethod)`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| promoCode | string | Applied promo code |
| shippingMethod | string | standard/express/overnight |

**Response:**
```json
{
    "subtotal": 2598,
    "shipping": 0,
    "tax": 468,
    "discount": 260,
    "total": 2806
}
```

---

### POST /cart/promo
**Service Method:** `CartService.applyPromoCode(code)`

**Request:**
```json
{
    "code": "SAVE10"
}
```

**Response (Success):**
```json
{
    "success": true,
    "promo": {
        "discount": 10,
        "type": "percent",
        "description": "10% off on your order"
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Invalid promo code"
}
```

---

## Order Service

### POST /orders
**Service Method:** `OrderService.createOrder(orderData)`

**Request:**
```json
{
    "items": [
        {
            "productId": 1,
            "quantity": 2,
            "price": 1299,
            "options": {}
        }
    ],
    "shipping": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "address": "123 MG Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "method": "standard"
    },
    "payment": {
        "method": "upi"
    },
    "subtotal": 2598,
    "shippingCost": 0,
    "tax": 468,
    "discount": 0,
    "total": 3066
}
```

**Response:**
```json
{
    "id": "SHP24010012345",
    "date": "2024-01-15T10:30:00.000Z",
    "status": "confirmed",
    "total": 3066
}
```

---

### GET /orders
**Service Method:** `OrderService.getOrders()`

**Response:**
```json
{
    "orders": [
        {
            "id": "SHP24010012345",
            "date": "2024-01-15T10:30:00.000Z",
            "status": "delivered",
            "total": 3066,
            "items": [...]
        }
    ],
    "total": 5
}
```

---

### GET /orders/:id
**Service Method:** `OrderService.getOrderById(orderId)`

**Response:**
```json
{
    "id": "SHP24010012345",
    "date": "2024-01-15T10:30:00.000Z",
    "status": "delivered",
    "items": [...],
    "shipping": {...},
    "payment": {...},
    "subtotal": 2598,
    "shippingCost": 0,
    "tax": 468,
    "discount": 0,
    "total": 3066
}
```

---

### PUT /orders/:id/cancel
**Service Method:** `OrderService.cancelOrder(orderId)`

**Response (Success):**
```json
{
    "success": true
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Order cannot be cancelled"
}
```

---

## Wishlist Service

### GET /wishlist
**Service Method:** `WishlistService.getItems()`

**Response:**
```json
{
    "items": [
        {
            "id": 1,
            "name": "Product Name",
            "price": 1299,
            "image": "url"
        }
    ],
    "total": 3
}
```

---

### POST /wishlist/add
**Service Method:** `WishlistService.addItem(productId)`

**Request:**
```json
{
    "productId": 1
}
```

**Response:**
```json
{
    "success": true,
    "added": true
}
```

---

### DELETE /wishlist/remove
**Service Method:** `WishlistService.removeItem(productId)`

**Request:**
```json
{
    "productId": 1
}
```

**Response:**
```json
{
    "success": true
}
```

---

### POST /wishlist/toggle
**Service Method:** `WishlistService.toggleItem(productId)`

**Request:**
```json
{
    "productId": 1
}
```

**Response:**
```json
{
    "success": true,
    "added": true  // or false if removed
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid email or password |
| `EMAIL_EXISTS` | Email already registered |
| `NOT_LOGGED_IN` | Authentication required |
| `PRODUCT_NOT_FOUND` | Product does not exist |
| `INSUFFICIENT_STOCK` | Not enough stock available |
| `INVALID_PROMO` | Invalid promo code |
| `ORDER_NOT_FOUND` | Order does not exist |
| `CANNOT_CANCEL` | Order cannot be cancelled |

---

## Rate Limits (Production Recommendations)

| Endpoint | Limit |
|----------|-------|
| /auth/login | 5 requests/minute |
| /auth/register | 3 requests/minute |
| /cart/* | 30 requests/minute |
| /orders | 10 requests/minute |
| /products/* | 100 requests/minute |
