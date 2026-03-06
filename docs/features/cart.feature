@cart
Feature: Shopping Cart Management
  As a logged-in user of Shoppio
  I want to manage items in my shopping cart
  So that I can purchase products I want

  Background:
    Given I am on the Shoppio website

  # ============================================
  # ADD TO CART - AUTHENTICATION REQUIRED
  # ============================================

  @add-to-cart @authentication @smoke
  Scenario: Add to cart requires login
    Given I am not logged in
    And I am on the products page
    When I click "Add to Cart" on a product
    Then I should see a warning message "Please login to add items to cart"
    And I should be redirected to the login page after 1.5 seconds

  @add-to-cart @authentication
  Scenario: Add to cart after login redirect
    Given I am not logged in
    And I am on the product detail page for "boAt Rockerz 450"
    When I click "Add to Cart"
    And I am redirected to the login page
    And I login with valid credentials
    Then I should be redirected back to the product detail page
    When I click "Add to Cart" again
    Then the product should be added to my cart
    And I should see a success message "Added to cart!"

  # ============================================
  # ADD TO CART - LOGGED IN
  # ============================================

  @add-to-cart @smoke
  Scenario: Successfully add product to cart from product listing
    Given I am logged in as "Demo User"
    And I am on the products page
    When I click "Add to Cart" on the first product
    Then I should see a success message "Added to cart!"
    And the cart count should increase by 1

  @add-to-cart @smoke
  Scenario: Successfully add product to cart from product detail page
    Given I am logged in as "Demo User"
    And I am on the product detail page for product ID 1
    When I click "Add to Cart"
    Then I should see a success message "Added to cart!"
    And the cart count should show "1"

  @add-to-cart @quantity
  Scenario: Add product with specific quantity
    Given I am logged in as "Demo User"
    And I am on the product detail page for product ID 1
    When I set the quantity to 3
    And I click "Add to Cart"
    Then the cart should contain 3 units of the product
    And the cart count should show "3"

  @add-to-cart @options
  Scenario: Add product with size and color options
    Given I am logged in as "Demo User"
    And I am on the product detail page for "Nike Revolution 6 Running Shoes"
    When I select size "UK 9"
    And I select color "Black"
    And I click "Add to Cart"
    Then the cart should contain the product with:
      | Size  | UK 9  |
      | Color | Black |

  @add-to-cart @validation
  Scenario: Cannot add product without selecting required size
    Given I am logged in as "Demo User"
    And I am on the product detail page for a product with sizes
    When I do not select a size
    And I click "Add to Cart"
    Then I should see a warning message "Please select a size"
    And the product should not be added to cart

  @add-to-cart @validation
  Scenario: Cannot add product without selecting required color
    Given I am logged in as "Demo User"
    And I am on the product detail page for a product with colors
    When I do not select a color
    And I click "Add to Cart"
    Then I should see a warning message "Please select a color"

  @add-to-cart @stock
  Scenario: Cannot add more than available stock
    Given I am logged in as "Demo User"
    And I am on the product detail page for a product with stock of 5
    When I set the quantity to 10
    And I click "Add to Cart"
    Then I should see an error message "Cannot add more than available stock"

  @add-to-cart @duplicate
  Scenario: Adding same product increases quantity
    Given I am logged in as "Demo User"
    And I have 2 units of product ID 1 in my cart
    When I add 1 more unit of product ID 1 to cart
    Then the cart should contain 3 units of product ID 1
    And the cart count should show "3"

  # ============================================
  # BUY NOW
  # ============================================

  @buy-now @smoke
  Scenario: Buy Now adds to cart and redirects to checkout
    Given I am logged in as "Demo User"
    And I am on the product detail page for product ID 1
    When I click "Buy Now"
    Then the product should be added to my cart
    And I should be redirected to the checkout page

  # ============================================
  # VIEW CART
  # ============================================

  @view-cart @smoke
  Scenario: View cart with items
    Given I am logged in as "Demo User"
    And I have the following items in my cart:
      | Product ID | Quantity |
      | 1          | 2        |
      | 3          | 1        |
    When I navigate to the cart page
    Then I should see 2 different products in my cart
    And the cart count should show "3"

  @view-cart @empty
  Scenario: View empty cart
    Given I am logged in as "Demo User"
    And my cart is empty
    When I navigate to the cart page
    Then I should see the empty cart message
    And I should see a "Continue Shopping" link

  # ============================================
  # UPDATE QUANTITY
  # ============================================

  @update-quantity @smoke
  Scenario: Increase item quantity in cart
    Given I am logged in as "Demo User"
    And I have 1 unit of product ID 1 in my cart
    And I am on the cart page
    When I click the increase quantity button for product ID 1
    Then the quantity should be 2
    And the item total should update accordingly

  @update-quantity
  Scenario: Decrease item quantity in cart
    Given I am logged in as "Demo User"
    And I have 3 units of product ID 1 in my cart
    And I am on the cart page
    When I click the decrease quantity button for product ID 1
    Then the quantity should be 2

  @update-quantity
  Scenario: Cannot decrease quantity below 1
    Given I am logged in as "Demo User"
    And I have 1 unit of product ID 1 in my cart
    And I am on the cart page
    When I click the decrease quantity button for product ID 1
    Then the quantity should remain 1

  @update-quantity @input
  Scenario: Update quantity via input field
    Given I am logged in as "Demo User"
    And I have 1 unit of product ID 1 in my cart
    And I am on the cart page
    When I change the quantity input to 5
    Then the quantity should be 5
    And the cart totals should update

  # ============================================
  # REMOVE FROM CART
  # ============================================

  @remove-item @smoke
  Scenario: Remove item from cart
    Given I am logged in as "Demo User"
    And I have 2 items in my cart
    And I am on the cart page
    When I click the remove button for the first item
    Then I should see a success message "Item removed from cart"
    And I should have 1 item in my cart

  @remove-item
  Scenario: Remove last item from cart
    Given I am logged in as "Demo User"
    And I have 1 item in my cart
    And I am on the cart page
    When I click the remove button for the item
    Then I should see the empty cart message

  # ============================================
  # MOVE TO WISHLIST
  # ============================================

  @move-to-wishlist
  Scenario: Move item from cart to wishlist
    Given I am logged in as "Demo User"
    And I have product ID 1 in my cart
    And I am on the cart page
    When I click "Move to Wishlist" for product ID 1
    Then I should see a success message "Moved to wishlist"
    And product ID 1 should be removed from cart
    And product ID 1 should be in my wishlist

  # ============================================
  # PROMO CODES
  # ============================================

  @promo-code @smoke
  Scenario: Apply valid percentage promo code
    Given I am logged in as "Demo User"
    And I have items worth ₹2,000 in my cart
    And I am on the cart page
    When I enter promo code "SAVE10"
    And I click "Apply"
    Then I should see a success message "Promo code applied!"
    And I should see "10% off on your order"
    And the discount should be ₹200

  @promo-code
  Scenario: Apply valid fixed amount promo code
    Given I am logged in as "Demo User"
    And I have items in my cart
    And I am on the cart page
    When I enter promo code "FLAT100"
    And I click "Apply"
    Then I should see a success message "Promo code applied!"
    And the discount should be ₹100

  @promo-code
  Scenario: Apply free shipping promo code
    Given I am logged in as "Demo User"
    And I have items worth ₹300 in my cart
    And I am on the cart page
    When I enter promo code "FREESHIP"
    And I click "Apply"
    Then the shipping cost should be ₹0

  @promo-code @validation
  Scenario: Apply invalid promo code
    Given I am logged in as "Demo User"
    And I am on the cart page
    When I enter promo code "INVALIDCODE"
    And I click "Apply"
    Then I should see an error message "Invalid promo code"

  @promo-code
  Scenario: Remove applied promo code
    Given I am logged in as "Demo User"
    And I have applied promo code "SAVE10"
    And I am on the cart page
    When I click "Remove" on the promo code
    Then the promo code should be removed
    And the discount should be ₹0

  # ============================================
  # CART TOTALS
  # ============================================

  @cart-totals @smoke
  Scenario: Cart totals calculation
    Given I am logged in as "Demo User"
    And I have the following items in my cart:
      | Product ID | Price | Quantity |
      | 1          | 1299  | 2        |
      | 3          | 899   | 1        |
    And I am on the cart page
    Then the subtotal should be ₹3,497
    And the GST (18%) should be ₹629
    And the shipping should be "FREE" (above ₹499)
    And the total should be ₹4,126

  @cart-totals @shipping
  Scenario: Free shipping threshold message
    Given I am logged in as "Demo User"
    And I have items worth ₹300 in my cart
    And I am on the cart page
    Then I should see "Add ₹199 more for FREE delivery"

  @cart-totals @shipping
  Scenario: Free shipping achieved
    Given I am logged in as "Demo User"
    And I have items worth ₹500 in my cart
    And I am on the cart page
    Then I should see "You qualify for FREE delivery!"
    And the shipping should be ₹0

  # ============================================
  # PROCEED TO CHECKOUT
  # ============================================

  @checkout @smoke
  Scenario: Proceed to checkout from cart
    Given I am logged in as "Demo User"
    And I have items in my cart
    And I am on the cart page
    When I click "Proceed to Checkout"
    Then I should be redirected to the checkout page

  @checkout @empty
  Scenario: Cannot checkout with empty cart
    Given I am logged in as "Demo User"
    And my cart is empty
    And I am on the cart page
    When I click "Proceed to Checkout"
    Then I should see an error message "Your cart is empty"

  @checkout @authentication
  Scenario: Checkout requires login
    Given I am not logged in
    And I have items in my cart (from previous session)
    When I navigate to the checkout page directly
    Then I should be redirected to the login page

  # ============================================
  # CART PERSISTENCE
  # ============================================

  @persistence
  Scenario: Cart persists after page refresh
    Given I am logged in as "Demo User"
    And I have 2 items in my cart
    When I refresh the page
    Then I should still have 2 items in my cart

  @persistence
  Scenario: Cart persists after logout and login
    Given I am logged in as "Demo User"
    And I have 2 items in my cart
    When I logout
    And I login again as "Demo User"
    Then I should still have 2 items in my cart
