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
    await expect(page).toHaveTitle(/Shoppio/);
    await expect(page.locator('h1')).toContainText('Welcome to Shoppio');
    console.log('Homepage loaded successfully.');
  });

  test('should navigate to the Electronics category and display products', async ({ page }) => {
    await page.goto(baseURL);
    await page.click('a[href="/shoppio/products?category=electronics"]');
    await expect(page).toHaveURL(/.*category=electronics/);
    await expect(page.locator('h2')).toContainText('Electronics');
    await expect(page.locator('.product-card')).toHaveCount(15);
    console.log('Navigated to Electronics category and products displayed.');
  });

  test('should perform a valid product search for "headphones" and display results', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('input[placeholder="Search products..."]', 'headphones');
    await page.press('input[placeholder="Search products..."]', 'Enter');
    await expect(page).toHaveURL(/.*search\?q=headphones/);
    await expect(page.locator('.search-results-count')).toContainText('5 results found');
    await expect(page.locator('.product-card')).toHaveCount(5);
    console.log('Valid product search for "headphones" performed and results displayed.');
  });

  test('should display "no results found" for an invalid product search', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('input[placeholder="Search products..."]', 'nonexistentproduct123');
    await page.press('input[placeholder="Search products..."]', 'Enter');
    await expect(page).toHaveURL(/.*search\?q=nonexistentproduct123/);
    await expect(page.locator('.no-results-message')).toBeVisible();
    await expect(page.locator('.no-results-message')).toContainText('No products found');
    console.log('Invalid product search performed and "no results found" message displayed.');
  });

  test('should navigate to a Product Detail Page (PDP) and display details', async ({ page }) => {
    await page.goto(baseURL + 'products?category=electronics');
    await page.locator('.product-card a').first().click();
    await expect(page).toHaveURL(/.*product\/\d+/);
    await expect(page.locator('.product-name')).toBeVisible();
    await expect(page.locator('.product-image')).toBeVisible();
    await expect(page.locator('.product-description')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
    console.log('Navigated to a Product Detail Page and details displayed.');
  });
});