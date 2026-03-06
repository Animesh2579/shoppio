import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://animesh2579.github.io/shoppio/';

test.describe('Shoppio E-commerce Website Comprehensive Tests', () => {

    // Before each test, navigate to the base URL and clear local storage
    // to ensure a clean state for cart/wishlist functionalities.
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.evaluate(() => localStorage.clear()); // Clear client-side storage
        await page.reload(); // Reload the page after clearing local storage
    });

    test('should load the homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Shoppio/);
        await expect(page.locator('.navbar-brand')).toHaveText('Shoppio');
        await expect(page.locator('.product-card')).toBeVisible();
    });

    test.describe('1. Authentication Tests', () => {
        test('should navigate to login page and display form', async ({ page }) => {
            await page.click('text=Login');
            await expect(page).toHaveURL(/.*login/);
            await expect(page.locator('h2')).toHaveText('Login');
            await expect(page.locator('input[type="email"]')).toBeVisible();
            await expect(page.locator('input[type="password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toBeVisible();
        });

        test('should attempt to login with invalid credentials (simulated)', async ({ page }) => {
            await page.click('text=Login');
            await page.fill('input[type="email"]', 'invalid@example.com');
            await page.fill('input[type="password"]', 'wrongpassword');
            await page.click('button[type="submit"]');
            // On a static site, this typically won't log in. We verify UI behavior.
            await expect(page).toHaveURL(/.*login/); // Should remain on the login page
            await expect(page.locator('input[type="email"]')).toBeEmpty(); // Fields are often cleared
        });

        test('should navigate to register page and display form', async ({ page }) => {
            await page.click('text=Login');
            await page.click('text=Register here');
            await expect(page).toHaveURL(/.*register/);
            await expect(page.locator('h2')).toHaveText('Register');
            await expect(page.locator('input[placeholder="Enter your name"]')).toBeVisible();
            await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();
            await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toBeVisible();
        });
    });

    test.describe('2. Product Browsing Tests', () => {
        test('should display product cards on the homepage', async ({ page }) => {
            const productCards = page.locator('.product-card');
            await expect(productCards).toHaveCount(6); // Based on current site content
            await expect(productCards.first().locator('.card-title')).toBeVisible();
            await expect(productCards.first().locator('.card-text')).toBeVisible(); // Price
        });

        test('should navigate to product detail page', async ({ page }) => {
            await page.locator('.product-card').first().click();
            await expect(page).toHaveURL(/.*product-details/);
            await expect(page.locator('.product-details-container h2')).toBeVisible(); // Product name
            await expect(page.locator('.product-details-container .price')).toBeVisible(); // Product price
            await expect(page.locator('.product-details-container .description')).toBeVisible(); // Product description
            await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
        });

        test('should search for a product and filter results', async ({ page }) => {
            await page.fill('input[placeholder="Search for products..."]', 'Shirt');
            await page.press('input[placeholder="Search for products..."]', 'Enter');
            const productCards = page.locator('.product-card');
            await expect(productCards.first().locator('.card-title')).toContainText('Shirt');
            await expect(productCards).toHaveCount(1); // Only one shirt product currently
        });

        test('should filter products by category (e.g., Men)', async ({ page }) => {
            await page.click('text=Categories');
            await page.click('a:has-text("Men")');
            const productCards = page.locator('.product-card');
            await expect(productCards).toHaveCount(3); // Based on current site content for Men
            await expect(productCards.first().locator('.card-title')).toContainText('Men');
        });
    });

    test.describe('3. Cart Management Tests', () => {
        test('should add a product to the cart from homepage', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Cart")').click();
            await page.click('text=Cart');
            await expect(page).toHaveURL(/.*cart/);
            await expect(page.locator('.cart-item')).toHaveCount(1);
            await expect(page.locator('.cart-item-name')).toBeVisible();
            await expect(page.locator('.cart-item-price')).toBeVisible();
            await expect(page.locator('.cart-total-price')).toBeVisible();
        });

        test('should add multiple products to the cart and verify count', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Cart")').click();
            await page.locator('.product-card').nth(1).locator('button:has-text("Add to Cart")').click();
            await page.click('text=Cart');
            await expect(page.locator('.cart-item')).toHaveCount(2);
        });

        test('should update product quantity in cart and verify total price', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Cart")').click();
            await page.click('text=Cart');
            await expect(page.locator('.cart-item-quantity')).toHaveValue('1');
            const initialPriceText = await page.locator('.cart-item-price').first().textContent();
            const initialPrice = parseFloat(initialPriceText!.replace('$', ''));

            await page.locator('.cart-item-quantity').fill('3');
            await page.waitForTimeout(500); // Give UI a moment to update total

            const totalPriceText = await page.locator('.cart-total-price').textContent();
            const totalPrice = parseFloat(totalPriceText!.replace('Total: $', ''));
            expect(totalPrice).toBeCloseTo(initialPrice * 3);
        });

        test('should remove a product from the cart', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Cart")').click();
            await page.click('text=Cart');
            await expect(page.locator('.cart-item')).toHaveCount(1);
            await page.locator('.remove-from-cart-btn').click();
            await expect(page.locator('.cart-item')).toHaveCount(0);
            await expect(page.locator('text=Your cart is empty.')).toBeVisible();
        });

        test('should display empty cart message when cart is empty', async ({ page }) => {
            await page.click('text=Cart');
            await expect(page).toHaveURL(/.*cart/);
            await expect(page.locator('text=Your cart is empty.')).toBeVisible();
            await expect(page.locator('.cart-item')).toHaveCount(0);
        });
    });

    test.describe('4. Checkout Process Tests', () => {
        test('should proceed to checkout with items in cart', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Cart")').click();
            await page.click('text=Cart');
            await page.click('text=Proceed to Checkout');
            await expect(page).toHaveURL(/.*checkout/);
            await expect(page.locator('h2')).toHaveText('Checkout');
            await expect(page.locator('input[placeholder="Full Name"]')).toBeVisible();
            await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
            await expect(page.locator('input[placeholder="Address"]')).toBeVisible();
            await expect(page.locator('button:has-text("Place Order")')).toBeVisible();
        });

        test('should prevent checkout with an empty cart', async ({ page }) => {
            await page.click('text=Cart');
            await page.click('text=Proceed to Checkout');
            await expect(page).toHaveURL(/.*cart/); // Should remain on the cart page
            await expect(page.locator('text=Your cart is empty.')).toBeVisible();
        });

        test('should fill checkout form and place order (simulated)', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Cart")').click();
            await page.click('text=Cart');
            await page.click('text=Proceed to Checkout');

            await page.fill('input[placeholder="Full Name"]', 'John Doe');
            await page.fill('input[placeholder="Email"]', 'john.doe@example.com');
            await page.fill('input[placeholder="Address"]', '123 Test St');
            await page.fill('input[placeholder="City"]', 'Testville');
            await page.fill('input[placeholder="Zip Code"]', '12345');
            // Assuming these select options are present
            await page.selectOption('select[aria-label="State"]', { label: 'California' });
            await page.selectOption('select[aria-label="Country"]', { label: 'United States' });

            await page.click('button:has-text("Place Order")');

            // On this static site, placing an order redirects to the homepage and clears the cart.
            await expect(page).toHaveURL(BASE_URL);
            await expect(page.locator('.navbar-brand')).toBeVisible(); // Verify back on homepage
            // Verify cart is empty after simulated checkout
            await page.click('text=Cart');
            await expect(page.locator('text=Your cart is empty.')).toBeVisible();
        });
    });

    test.describe('5. Wishlist Functionality Tests', () => {
        test('should add a product to the wishlist', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Wishlist")').click();
            await page.click('text=Wishlist');
            await expect(page).toHaveURL(/.*wishlist/);
            await expect(page.locator('.wishlist-item')).toHaveCount(1);
            await expect(page.locator('.wishlist-item-name')).toBeVisible();
        });

        test('should remove a product from the wishlist', async ({ page }) => {
            await page.locator('.product-card').first().locator('button:has-text("Add to Wishlist")').click();
            await page.click('text=Wishlist');
            await expect(page.locator('.wishlist-item')).toHaveCount(1);
            await page.locator('.remove-from-wishlist-btn').click();
            await expect(page.locator('.wishlist-item')).toHaveCount(0);
            await expect(page.locator('text=Your wishlist is empty.')).toBeVisible();
        });

        test('should display empty wishlist message when wishlist is empty', async ({ page }) => {
            await page.click('text=Wishlist');
            await expect(page).toHaveURL(/.*wishlist/);
            await expect(page.locator('text=Your wishlist is empty.')).toBeVisible();
            await expect(page.locator('.wishlist-item')).toHaveCount(0);
        });
    });
});