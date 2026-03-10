// playwright.config.js (or similar configuration file)
// module.exports = {
//   use: {
//     baseURL: 'https://animesh2579.github.io/shoppio/',
//     browserName: 'chromium', // or 'firefox', 'webkit'
//     headless: true, // set to false to see the browser UI
//   },
// };

const { test, expect } = require('@playwright/test');

test.describe('Product Browsing Test Scope', () => {
  const baseURL = 'https://animesh2579.github.io/shoppio/';

  test('should load the homepage successfully', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/Shoppio/); // Adjust title regex if needed
    await expect(page.locator('h1')).toContainText('Welcome to Shoppio'); // Assuming a prominent H1 on homepage
    console.log('Homepage loaded successfully.');
  });

  test('should navigate to the Electronics category and display products', async ({ page }) => {
    await page.goto(baseURL);
    // Assuming there's a navigation link for 'Electronics'
    // You might need to adjust the selector based on the actual HTML structure
    await page.click('a[href="/shoppio/products?category=electronics"]'); // Example selector
    await expect(page).toHaveURL(/.*category=electronics/);
    await expect(page.locator('h2')).toContainText('Electronics'); // Assuming a category title
    await expect(page.locator('.product-card')).toHaveCount(15); // Based on memory context: 15 electronics products
    console.log('Navigated to Electronics category and products displayed.');
  });

  test('should perform a valid product search for "headphones" and display results', async ({ page }) => {
    await page.goto(baseURL);
    // Assuming a search input field with a specific selector
    await page.fill('input[placeholder="Search products..."]', 'headphones'); // Example selector
    await page.press('input[placeholder="Search products..."]', 'Enter'); // Submit search by pressing Enter
    await expect(page).toHaveURL(/.*search\?q=headphones/);
    await expect(page.locator('.search-results-count')).toContainText('5 results found'); // Based on memory context
    await expect(page.locator('.product-card')).toHaveCount(5); // Verify 5 relevant results
    console.log('Valid product search for "headphones" performed and results displayed.');
  });

  test('should display "no results found" for an invalid product search', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('input[placeholder="Search products..."]', 'nonexistentproduct123');
    await page.press('input[placeholder="Search products..."]', 'Enter');
    await expect(page).toHaveURL(/.*search\?q=nonexistentproduct123/);
    await expect(page.locator('.no-results-message')).toBeVisible(); // Assuming a message for no results
    await expect(page.locator('.no-results-message')).toContainText('No products found');
    console.log('Invalid product search performed and "no results found" message displayed.');
  });

  test('should navigate to a Product Detail Page (PDP) and display details', async ({ page }) => {
    await page.goto(baseURL + 'products?category=electronics'); // Go to a category page first
    // Click on the first product card to navigate to its PDP
    // Adjust selector to target a specific product link or card
    await page.locator('.product-card a').first().click();
    await expect(page).toHaveURL(/.*product\/\d+/); // Assuming PDP URLs follow a pattern like /product/ID
    await expect(page.locator('.product-name')).toBeVisible();
    await expect(page.locator('.product-image')).toBeVisible();
    await expect(page.locator('.product-description')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
    console.log('Navigated to a Product Detail Page and details displayed.');
  });

  // Optional: Add tests for filtering and sorting if the website supports it
  // test('should filter products by price range', async ({ page }) => {
  //   await page.goto(baseURL + 'products?category=electronics');
  //   // Interact with filter elements (e.g., sliders, checkboxes)
  //   await page.fill('input[aria-label="Min price"]', '100');
  //   await page.fill('input[aria-label="Max price"]', '500');
  //   await page.click('button:has-text("Apply Filter")');
  //   // Assert that the number of products or their prices are within the range
  //   await expect(page.locator('.product-card')).toHaveCount(5); // Example assertion
  // });

  // test('should sort products by price from low to high', async ({ page }) => {
  //   await page.goto(baseURL + 'products?category=electronics');
  //   // Select sorting option
  //   await page.selectOption('select[aria-label="Sort by"]', 'price-asc');
  //   // Assert that products are sorted correctly (e.g., by checking the first and last product prices)
  //   const firstProductPrice = await page.locator('.product-card .product-price').first().innerText();
  //   const lastProductPrice = await page.locator('.product-card .product-price').last().innerText();
  //   expect(parseFloat(firstProductPrice.replace(/[^0-9.-]+/g,""))).toBeLessThan(parseFloat(lastProductPrice.replace(/[^0-9.-]+/g,"")));
  // });
});