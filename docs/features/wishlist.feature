@wishlist
Feature: Wishlist Management
  As a logged-in user of Shoppio
  I want to manage my wishlist
  So that I can save products for later purchase

  Background:
    Given I am on the Shoppio website

  # ============================================
  # WISHLIST ACCESS
  # ============================================

  @access @authentication
  Scenario: Wishlist page requires login
    Given I am not logged in
    When I navigate to the wishlist page
    Then I should be redirected to the login page

  @access @smoke
  Scenario: Access wishlist page when logged in
    Given I am logged in as "Demo User"
    When I navigate to the wishlist page
    Then I should see my wishlist

  # ============================================
  # ADD TO WISHLIST
  # ============================================

  @add @smoke
  Scenario: Add product to wishlist from product listing
    Given I am logged in as "Demo User"
    And I am on the products page
    When I click the heart icon on product ID 1
    Then I should see a success message "Added to wishlist!"
    And the heart icon should become filled/active
    And product ID 1 should be in my wishlist

  @add
  Scenario: Add product to wishlist from product detail
    Given I am logged in as "Demo User"
    And I am on the product detail page for product ID 2
    When I click the wishlist button
    Then I should see a success message "Added to wishlist!"
    And the wishlist button should show filled heart

  @add @authentication
  Scenario: Add to wishlist requires login
    Given I am not logged in
    And I am on the products page
    When I click the heart icon on a product
    Then I should see a warning message "Please login to add to wishlist"
    And the product should not be added to wishlist

  # ============================================
  # REMOVE FROM WISHLIST
  # ============================================

  @remove @smoke
  Scenario: Remove product from wishlist via toggle
    Given I am logged in as "Demo User"
    And product ID 1 is in my wishlist
    And I am on the products page
    When I click the heart icon on product ID 1
    Then I should see a message "Removed from wishlist"
    And the heart icon should become empty/inactive
    And product ID 1 should not be in my wishlist

  @remove
  Scenario: Remove product from wishlist page
    Given I am logged in as "Demo User"
    And I have products in my wishlist
    And I am on the wishlist page
    When I click "Remove" on a product
    Then the product should be removed from my wishlist
    And the wishlist should update

  # ============================================
  # VIEW WISHLIST
  # ============================================

  @view @smoke
  Scenario: View wishlist with items
    Given I am logged in as "Demo User"
    And I have the following products in my wishlist:
      | Product ID |
      | 1          |
      | 3          |
      | 5          |
    When I navigate to the wishlist page
    Then I should see 3 products in my wishlist
    And each product should display:
      | Image       |
      | Name        |
      | Price       |
      | Add to Cart |

  @view @empty
  Scenario: View empty wishlist
    Given I am logged in as "Demo User"
    And my wishlist is empty
    When I navigate to the wishlist page
    Then I should see "Your wishlist is empty"
    And I should see a "Browse Products" link

  # ============================================
  # MOVE TO CART
  # ============================================

  @move-to-cart @smoke
  Scenario: Add wishlist item to cart
    Given I am logged in as "Demo User"
    And product ID 1 is in my wishlist
    And I am on the wishlist page
    When I click "Add to Cart" on product ID 1
    Then product ID 1 should be added to my cart
    And I should see a success message "Added to cart!"

  # ============================================
  # WISHLIST PERSISTENCE
  # ============================================

  @persistence
  Scenario: Wishlist persists after page refresh
    Given I am logged in as "Demo User"
    And I have 3 products in my wishlist
    When I refresh the page
    Then I should still have 3 products in my wishlist

  @persistence
  Scenario: Wishlist icon state persists across pages
    Given I am logged in as "Demo User"
    And product ID 1 is in my wishlist
    When I navigate to the products page
    Then the heart icon for product ID 1 should be filled/active
