@products
Feature: Product Browsing and Search
  As a user of Shoppio
  I want to browse, search, and filter products
  So that I can find products I want to purchase

  Background:
    Given I am on the Shoppio website

  # ============================================
  # HOME PAGE PRODUCTS
  # ============================================

  @home @smoke
  Scenario: View featured products on home page
    Given I am on the home page
    Then I should see the "Featured Products" section
    And I should see up to 8 featured products
    And each product card should display:
      | Image          |
      | Name           |
      | Price in INR   |
      | Rating         |
      | Add to Cart    |

  @home
  Scenario: View deals of the day
    Given I am on the home page
    Then I should see the "Deals of the Day" section
    And I should see a countdown timer
    And I should see products with discounts

  @home
  Scenario: View new arrivals
    Given I am on the home page
    Then I should see the "New Arrivals" section
    And products should have "New" badge

  @home @categories
  Scenario: View category cards on home page
    Given I am on the home page
    Then I should see category cards for:
      | Electronics      |
      | Fashion          |
      | Home & Kitchen   |
      | Sports & Fitness |
      | Beauty & Health  |
      | Books            |

  # ============================================
  # PRODUCTS LISTING PAGE
  # ============================================

  @listing @smoke
  Scenario: View all products
    Given I am on the products page
    Then I should see a grid of products
    And I should see the total product count
    And I should see pagination if more than 12 products

  @listing @pagination
  Scenario: Navigate through product pages
    Given I am on the products page
    And there are more than 12 products
    When I click on page 2
    Then I should see the next set of products
    And page 2 should be highlighted in pagination

  @listing @pagination
  Scenario: Navigate using next/previous buttons
    Given I am on the products page at page 1
    When I click the "Next" button
    Then I should be on page 2
    When I click the "Previous" button
    Then I should be on page 1

  # ============================================
  # PRODUCT FILTERING
  # ============================================

  @filter @category @smoke
  Scenario: Filter products by category
    Given I am on the products page
    When I select "Electronics" category filter
    Then I should only see products in the "Electronics" category
    And the results count should update

  @filter @category
  Scenario: Filter by category from URL
    When I navigate to "/products.html?category=fashion"
    Then I should see only "Fashion" products
    And the "Fashion" category filter should be selected

  @filter @price
  Scenario: Filter products by price range
    Given I am on the products page
    When I set the maximum price to ₹5,000
    Then I should only see products priced at or below ₹5,000

  @filter @rating
  Scenario: Filter products by minimum rating
    Given I am on the products page
    When I select "4 stars & above" rating filter
    Then I should only see products with rating >= 4

  @filter @stock
  Scenario: Filter in-stock products only
    Given I am on the products page
    When I check "In Stock Only" filter
    Then I should only see products with stock > 0

  @filter @sale
  Scenario: Filter products on sale
    Given I am on the products page
    When I check "On Sale" filter
    Then I should only see products with sale badge

  @filter @multiple
  Scenario: Apply multiple filters
    Given I am on the products page
    When I select "Electronics" category
    And I set maximum price to ₹3,000
    And I select "4 stars & above"
    Then I should see products matching all criteria

  @filter @clear
  Scenario: Clear all filters
    Given I am on the products page
    And I have applied multiple filters
    When I click "Clear Filters"
    Then all filters should be reset
    And I should see all products

  @filter @no-results
  Scenario: No products match filters
    Given I am on the products page
    When I apply filters that match no products
    Then I should see "No products found" message
    And I should see a "View All Products" link

  # ============================================
  # PRODUCT SORTING
  # ============================================

  @sort @smoke
  Scenario: Sort products by price low to high
    Given I am on the products page
    When I select "Price: Low to High" from sort dropdown
    Then products should be sorted by price in ascending order

  @sort
  Scenario: Sort products by price high to low
    Given I am on the products page
    When I select "Price: High to Low" from sort dropdown
    Then products should be sorted by price in descending order

  @sort
  Scenario: Sort products by rating
    Given I am on the products page
    When I select "Rating" from sort dropdown
    Then products should be sorted by rating in descending order

  @sort
  Scenario: Sort products by popularity
    Given I am on the products page
    When I select "Popularity" from sort dropdown
    Then products should be sorted by review count in descending order

  @sort
  Scenario: Sort products by discount
    Given I am on the products page
    When I select "Discount" from sort dropdown
    Then products should be sorted by discount percentage in descending order

  # ============================================
  # PRODUCT SEARCH
  # ============================================

  @search @smoke
  Scenario: Search for products
    Given I am on the home page
    When I type "headphones" in the search box
    And I click the search button
    Then I should be on the products page
    And I should see products matching "headphones"
    And the search query should be shown in results

  @search
  Scenario: Search from header on any page
    Given I am on the about page
    When I type "shoes" in the search box
    And I press Enter
    Then I should be on the products page
    And I should see products matching "shoes"

  @search @no-results
  Scenario: Search with no matching products
    Given I am on the home page
    When I search for "xyznonexistent"
    Then I should see "No products found" message
    And I should see "0 results for 'xyznonexistent'"

  @search @partial
  Scenario: Search matches product name partially
    Given I am on the home page
    When I search for "boat"
    Then I should see "boAt Rockerz 450" in results

  @search @description
  Scenario: Search matches product description
    Given I am on the home page
    When I search for "bluetooth"
    Then I should see products with "bluetooth" in description

  # ============================================
  # PRODUCT CARD INTERACTIONS
  # ============================================

  @product-card @smoke
  Scenario: Product card displays correct information
    Given I am on the products page
    Then each product card should show:
      | Element          | Description                    |
      | Image            | Product image                  |
      | Name             | Product name (max 2 lines)     |
      | Category         | Product category               |
      | Price            | Current price in ₹             |
      | Original Price   | Strikethrough if on sale       |
      | Discount Badge   | Percentage off                 |
      | Rating           | Star rating with count         |
      | Delivery Info    | Free delivery date             |
      | Add to Cart      | Button to add to cart          |
      | Wishlist         | Heart icon to add to wishlist  |

  @product-card @click
  Scenario: Click product card to view details
    Given I am on the products page
    When I click on a product image
    Then I should be redirected to the product detail page

  @product-card @click
  Scenario: Click product name to view details
    Given I am on the products page
    When I click on a product name
    Then I should be redirected to the product detail page

  @product-card @badges
  Scenario: Product badges display correctly
    Given I am on the products page
    Then products marked as new should show "New" badge
    And products on sale should show discount percentage badge

  # ============================================
  # PRODUCT DETAIL PAGE
  # ============================================

  @detail @smoke
  Scenario: View product detail page
    Given I navigate to product detail page for product ID 1
    Then I should see the product name
    And I should see the product images gallery
    And I should see the price in INR
    And I should see the product description
    And I should see the product rating
    And I should see "Add to Cart" button
    And I should see "Buy Now" button

  @detail @gallery
  Scenario: Product image gallery
    Given I am on a product detail page with multiple images
    Then I should see thumbnail images
    When I click on a thumbnail
    Then the main image should change to that image

  @detail @stock
  Scenario: Product stock status - In Stock
    Given I am on a product detail page with stock > 10
    Then I should see "In Stock" status in green

  @detail @stock
  Scenario: Product stock status - Low Stock
    Given I am on a product detail page with stock between 1-10
    Then I should see "Only X left" warning in orange

  @detail @stock
  Scenario: Product stock status - Out of Stock
    Given I am on a product detail page with stock = 0
    Then I should see "Out of Stock" status in red
    And the "Add to Cart" button should be disabled

  @detail @quantity
  Scenario: Adjust quantity on product detail
    Given I am on a product detail page
    When I click the increase quantity button
    Then the quantity should increase by 1
    When I click the decrease quantity button
    Then the quantity should decrease by 1

  @detail @quantity
  Scenario: Cannot set quantity below 1
    Given I am on a product detail page
    And the quantity is 1
    When I click the decrease quantity button
    Then the quantity should remain 1

  @detail @options
  Scenario: Select product size
    Given I am on a product detail page with size options
    When I click on size "M"
    Then size "M" should be selected/highlighted

  @detail @options
  Scenario: Select product color
    Given I am on a product detail page with color options
    When I click on color "Black"
    Then color "Black" should be selected/highlighted

  @detail @tabs
  Scenario: Product description tab
    Given I am on a product detail page
    When I click on "Description" tab
    Then I should see the product description
    And I should see the key features list

  @detail @tabs
  Scenario: Product specifications tab
    Given I am on a product detail page
    When I click on "Specifications" tab
    Then I should see the product specifications table

  @detail @tabs
  Scenario: Product reviews tab
    Given I am on a product detail page
    When I click on "Reviews" tab
    Then I should see customer reviews
    And each review should show:
      | Reviewer name |
      | Rating        |
      | Review title  |
      | Review text   |
      | Date          |

  @detail @related
  Scenario: Related products section
    Given I am on a product detail page
    Then I should see "Related Products" section
    And related products should be from the same category

  @detail @delivery
  Scenario: Delivery information
    Given I am on a product detail page
    Then I should see estimated delivery date
    And I should see "Free Delivery" information
    And I should see "7 Days Return" policy
    And I should see "Secure Payment" badge

  @detail @seller
  Scenario: Seller information
    Given I am on a product detail page
    Then I should see "Sold by: [Seller Name]"

  # ============================================
  # WISHLIST
  # ============================================

  @wishlist @smoke
  Scenario: Add product to wishlist from product card
    Given I am logged in as "Demo User"
    And I am on the products page
    When I click the wishlist icon on a product card
    Then I should see a success message "Added to wishlist!"
    And the wishlist icon should be filled/active

  @wishlist
  Scenario: Remove product from wishlist
    Given I am logged in as "Demo User"
    And product ID 1 is in my wishlist
    When I click the wishlist icon on product ID 1
    Then I should see a message "Removed from wishlist"
    And the wishlist icon should be empty/inactive

  @wishlist @detail
  Scenario: Add to wishlist from product detail page
    Given I am logged in as "Demo User"
    And I am on a product detail page
    When I click the wishlist button
    Then the product should be added to my wishlist

  @wishlist @authentication
  Scenario: Wishlist requires login
    Given I am not logged in
    When I click the wishlist icon on a product
    Then I should see a warning "Please login to add to wishlist"

  # ============================================
  # VIEW TOGGLE
  # ============================================

  @view
  Scenario: Toggle between grid and list view
    Given I am on the products page
    And products are displayed in grid view
    When I click the list view button
    Then products should be displayed in list view
    When I click the grid view button
    Then products should be displayed in grid view
