async (page) => {
    const baseURL = 'https://animesh2579.github.io/shoppio/';

    // Test ID: PROD-002 - Electronics Category Browsing
    console.log('Starting Test ID PROD-002: Electronics Category Browsing');
    await page.goto(baseURL + 'products?category=electronics');
    await page.waitForLoadState('networkidle'); // Wait for the page to be fully loaded

    // Verify URL
    if (!page.url().includes('products?category=electronics')) {
        throw new Error(`PROD-002 Failed: Expected URL to contain 'products?category=electronics', but got ${page.url()}`);
    }

    // Count the number of product items. Assuming each product is within an 'article' tag.
    const electronicsProductsCount = await page.locator('article').count();
    const expectedElectronicsProducts = 15; // From memory context

    if (electronicsProductsCount !== expectedElectronicsProducts) {
        throw new Error(`PROD-002 Failed: Expected ${expectedElectronicsProducts} electronics products, but found ${electronicsProductsCount}`);
    }
    console.log(`PROD-002 Passed: Found ${electronicsProductsCount} electronics products.`);

    // Test ID: PROD-003 - Product Search for 'headphones'
    console.log('Starting Test ID PROD-003: Product Search for "headphones"');
    await page.goto(baseURL + 'search?q=headphones');
    await page.waitForLoadState('networkidle'); // Wait for the page to be fully loaded

    // Verify URL
    if (!page.url().includes('search?q=headphones')) {
        throw new Error(`PROD-003 Failed: Expected URL to contain 'search?q=headphones', but got ${page.url()}`);
    }

    // Count the number of search results. Assuming each result is within an 'article' tag.
    const searchResultsCount = await page.locator('article').count();
    const expectedSearchResults = 5; // From memory context

    if (searchResultsCount !== expectedSearchResults) {
        throw new Error(`PROD-003 Failed: Expected ${expectedSearchResults} search results for "headphones", but found ${searchResultsCount}`);
    }
    console.log(`PROD-003 Passed: Found ${searchResultsCount} search results for "headphones".`);

    return 'All product browsing tests completed successfully.';
}