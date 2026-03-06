# Shoppio - E-commerce Demo Website

A fully functional e-commerce website built with vanilla HTML, CSS, and JavaScript. Perfect for demonstrating QA automation, Playwright testing, and showcasing modern web development practices.

![Shoppio](https://img.shields.io/badge/Shoppio-E--commerce-6366f1)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Features

### Core E-commerce Functionality
- **Product Catalog**: Browse products with filtering, sorting, and search
- **Product Details**: Detailed product pages with images, descriptions, and reviews
- **Shopping Cart**: Add/remove items, update quantities, apply promo codes
- **Checkout Process**: Multi-step checkout with shipping and payment forms
- **Order Confirmation**: Order summary and confirmation page

### User Authentication
- **Sign In/Sign Up**: localStorage-based authentication
- **User Profile**: View and edit profile information
- **Order History**: View past orders
- **Wishlist**: Save favorite products

### Additional Pages
- **Categories**: Browse products by category
- **About Us**: Company information
- **Contact**: Contact form and FAQ

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI/UX**: Clean, professional design with smooth animations
- **No Backend Required**: All data stored in localStorage
- **Static Hosting Ready**: Can be hosted on GitHub Pages

## Demo Credentials

```
Email: demo@shoppio.com
Password: demo123
```

## Promo Codes (for testing)

| Code | Discount |
|------|----------|
| SAVE10 | 10% off |
| SAVE20 | 20% off |
| FLAT100 | ₹100 off |
| FLAT200 | ₹200 off |
| NEWUSER | 15% off (new users) |
| FREESHIP | Free shipping |

## Project Structure

```
shoppio/
├── index.html                    # Home page
├── products.html                 # Products listing
├── product-detail.html           # Product detail page
├── cart.html                     # Shopping cart
├── checkout.html                 # Checkout process
├── order-confirmation.html       # Order confirmation
├── login.html                    # Sign in page
├── register.html                 # Sign up page
├── profile.html                  # User profile
├── orders.html                   # Order history
├── wishlist.html                 # Wishlist
├── categories.html               # Categories page
├── about.html                    # About us
├── contact.html                  # Contact page
├── css/
│   └── style.css                 # Main stylesheet
├── src/
│   └── js/
│       ├── config/
│       │   └── constants.js      # App configuration & constants
│       ├── data/
│       │   └── products.js       # Product catalog data (INR)
│       ├── utils/
│       │   └── helpers.js        # Utility functions
│       ├── services/
│       │   ├── auth.service.js   # Authentication service
│       │   ├── cart.service.js   # Cart & wishlist service
│       │   ├── product.service.js # Product operations
│       │   └── order.service.js  # Order management
│       ├── app.js                # Main application entry
│       └── pages/
│           ├── home.page.js      # Home page controller
│           ├── products.page.js  # Products page controller
│           ├── product-detail.page.js # Product detail controller
│           ├── cart.page.js      # Cart page controller
│           ├── checkout.page.js  # Checkout controller
│           ├── auth.page.js      # Login/Register controller
│           └── profile.page.js   # Profile pages controller
└── README.md
```

## Local Development

### Option 1: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 2: Using Python

```bash
# Python 3
cd shoppio
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Option 3: Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Run the server
cd shoppio
http-server

# Then open http://localhost:8080 in your browser
```

## Hosting on GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `shoppio` or `shoppio-demo`)
5. Make it **Public** (required for free GitHub Pages)
6. Click "Create repository"

### Step 2: Push Your Code

```bash
# Navigate to your project folder
cd shoppio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit - Shoppio e-commerce website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/shoppio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (gear icon)
3. Scroll down to **Pages** in the left sidebar
4. Under "Source", select **Deploy from a branch**
5. Under "Branch", select **main** and **/ (root)**
6. Click **Save**

### Step 4: Access Your Website

After a few minutes, your website will be available at:
```
https://YOUR_USERNAME.github.io/shoppio/
```

You can find the exact URL in the GitHub Pages settings section.

## Testing with Playwright

This website is designed to be easily testable with Playwright. Here are some example test scenarios:

### Example Test Cases

```javascript
// Example Playwright test
const { test, expect } = require('@playwright/test');

test('should add product to cart', async ({ page }) => {
  await page.goto('https://YOUR_USERNAME.github.io/shoppio/');
  
  // Click on a product
  await page.click('.product-card:first-child .add-to-cart-btn');
  
  // Verify cart count updated
  await expect(page.locator('.cart-count')).toHaveText('1');
});

test('should complete checkout flow', async ({ page }) => {
  await page.goto('https://YOUR_USERNAME.github.io/shoppio/');
  
  // Add product to cart
  await page.click('.product-card:first-child .add-to-cart-btn');
  
  // Go to cart
  await page.click('a[href="cart.html"]');
  
  // Proceed to checkout
  await page.click('#checkout-btn');
  
  // Login with demo credentials
  await page.fill('#login-email', 'demo@shoppio.com');
  await page.fill('#login-password', 'demo123');
  await page.click('button[type="submit"]');
  
  // Complete checkout...
});
```

### Testable Elements

- **Product Cards**: `.product-card`, `.add-to-cart-btn`, `.wishlist-toggle`
- **Cart**: `.cart-item`, `.quantity-input`, `#checkout-btn`
- **Forms**: `#login-form`, `#register-form`, `#shipping-form`
- **Navigation**: `.nav-link`, `.header-icons a`
- **Filters**: `input[name="category"]`, `#sort-select`, `#price-range`

## Customization

### Changing Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --primary-dark: #4f46e5;     /* Darker shade */
    --secondary-color: #f59e0b;  /* Accent color */
    /* ... more variables */
}
```

### Adding Products

Edit `js/data.js` and add new products to the `products` array:

```javascript
{
    id: 21,
    name: "New Product Name",
    category: "electronics",
    price: 99.99,
    originalPrice: 129.99,
    image: "https://example.com/image.jpg",
    rating: 4.5,
    reviews: 100,
    description: "Product description...",
    features: ["Feature 1", "Feature 2"],
    stock: 50,
    isNew: true,
    isSale: true
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational and demonstration purposes.

## Contributing

Feel free to fork this repository and submit pull requests for any improvements!

---

Made with ❤️ for QA testing and demonstration purposes.
