@checkout
Feature: Checkout Process
  As a logged-in user of Shoppio
  I want to complete the checkout process
  So that I can purchase products in my cart

  Background:
    Given I am logged in as "Demo User"
    And I have items in my cart

  # ============================================
  # CHECKOUT ACCESS
  # ============================================

  @access @smoke
  Scenario: Access checkout page with items in cart
    When I navigate to the checkout page
    Then I should see the checkout page
    And I should see the order summary with my cart items

  @access @authentication
  Scenario: Checkout requires authentication
    Given I am not logged in
    When I try to access the checkout page
    Then I should be redirected to the login page
    And the redirect URL should be saved as checkout page

  @access @empty-cart
  Scenario: Cannot access checkout with empty cart
    Given my cart is empty
    When I try to access the checkout page
    Then I should be redirected to the cart page

  # ============================================
  # STEP 1: SHIPPING INFORMATION
  # ============================================

  @shipping @smoke
  Scenario: Fill shipping information
    Given I am on the checkout page
    And I am on step 1 (Shipping)
    When I fill in the shipping form:
      | Field      | Value           |
      | First Name | Rahul           |
      | Last Name  | Sharma          |
      | Email      | rahul@test.com  |
      | Phone      | 9876543210      |
      | Address    | 123 MG Road     |
      | City       | Mumbai          |
      | State      | Maharashtra     |
      | PIN Code   | 400001          |
    And I click "Continue to Payment"
    Then I should proceed to step 2 (Payment)

  @shipping @prefill
  Scenario: Shipping form prefilled with user data
    Given I am on the checkout page
    Then the shipping form should be prefilled with:
      | Field      | Value              |
      | First Name | Demo               |
      | Last Name  | User               |
      | Email      | demo@shoppio.com   |
      | Phone      | +91 9876543210     |

  @shipping @validation
  Scenario: Shipping form validation - missing required fields
    Given I am on the checkout page
    When I leave the "First Name" field empty
    And I click "Continue to Payment"
    Then I should see an error message "Please fill in all required fields"
    And I should remain on step 1

  @shipping @validation
  Scenario: Shipping form validation - invalid phone number
    Given I am on the checkout page
    When I fill in "Phone" with "12345"
    And I fill in other required fields
    And I click "Continue to Payment"
    Then I should see an error message "Please enter a valid 10-digit phone number"

  @shipping @validation
  Scenario: Shipping form validation - invalid PIN code
    Given I am on the checkout page
    When I fill in "PIN Code" with "123"
    And I fill in other required fields
    And I click "Continue to Payment"
    Then I should see an error message "Please enter a valid 6-digit PIN code"

  @shipping @validation
  Scenario: Shipping form validation - invalid email
    Given I am on the checkout page
    When I fill in "Email" with "invalid-email"
    And I fill in other required fields
    And I click "Continue to Payment"
    Then I should see an error message "Please enter a valid email address"

  @shipping @states
  Scenario: Indian states dropdown
    Given I am on the checkout page
    When I click on the "State" dropdown
    Then I should see all Indian states including:
      | Maharashtra      |
      | Karnataka        |
      | Tamil Nadu       |
      | Delhi            |
      | Gujarat          |

  @shipping @method
  Scenario: Select shipping method
    Given I am on the checkout page
    When I select "Express Delivery" shipping method
    Then the shipping cost should update to ₹99
    And the order total should update accordingly

  @shipping @method
  Scenario Outline: Shipping method options
    Given I am on the checkout page
    When I select "<method>" shipping method
    Then the shipping cost should be "<cost>"

    Examples:
      | method            | cost  |
      | Standard Delivery | ₹40   |
      | Express Delivery  | ₹99   |
      | Overnight         | ₹199  |

  # ============================================
  # STEP 2: PAYMENT INFORMATION
  # ============================================

  @payment @smoke
  Scenario: Select UPI payment method
    Given I am on step 2 (Payment)
    When I select "UPI" as payment method
    Then I should see the UPI ID input field
    When I fill in "UPI ID" with "rahul@upi"
    And I click "Continue to Review"
    Then I should proceed to step 3 (Review)

  @payment @card
  Scenario: Select Card payment method
    Given I am on step 2 (Payment)
    When I select "Credit/Debit Card" as payment method
    Then I should see the card details form
    When I fill in the card details:
      | Field       | Value            |
      | Card Number | 4111111111111111 |
      | Expiry      | 12/25            |
      | CVV         | 123              |
    And I click "Continue to Review"
    Then I should proceed to step 3 (Review)

  @payment @cod
  Scenario: Select Cash on Delivery
    Given I am on step 2 (Payment)
    When I select "Cash on Delivery" as payment method
    And I click "Continue to Review"
    Then I should proceed to step 3 (Review)

  @payment @validation
  Scenario: Payment validation - no method selected
    Given I am on step 2 (Payment)
    When I do not select any payment method
    And I click "Continue to Review"
    Then I should see an error message "Please select a payment method"

  @payment @validation
  Scenario: Payment validation - missing card details
    Given I am on step 2 (Payment)
    When I select "Credit/Debit Card" as payment method
    And I leave the card number empty
    And I click "Continue to Review"
    Then I should see an error message "Please fill in all card details"

  @payment @validation
  Scenario: Payment validation - missing UPI ID
    Given I am on step 2 (Payment)
    When I select "UPI" as payment method
    And I leave the UPI ID empty
    And I click "Continue to Review"
    Then I should see an error message "Please enter your UPI ID"

  @payment @back
  Scenario: Go back to shipping step
    Given I am on step 2 (Payment)
    When I click "Back to Shipping"
    Then I should go back to step 1 (Shipping)
    And my shipping information should be preserved

  # ============================================
  # STEP 3: ORDER REVIEW
  # ============================================

  @review @smoke
  Scenario: Review order before placing
    Given I have completed shipping and payment steps
    And I am on step 3 (Review)
    Then I should see my shipping address
    And I should see my payment method
    And I should see all items in my order
    And I should see the order totals

  @review @edit
  Scenario: Edit shipping information from review
    Given I am on step 3 (Review)
    When I click "Edit" on the shipping section
    Then I should go back to step 1 (Shipping)

  @review @edit
  Scenario: Edit payment information from review
    Given I am on step 3 (Review)
    When I click "Edit" on the payment section
    Then I should go back to step 2 (Payment)

  # ============================================
  # PLACE ORDER
  # ============================================

  @place-order @smoke
  Scenario: Successfully place order
    Given I have completed all checkout steps
    And I am on step 3 (Review)
    When I click "Place Order"
    Then I should see a success message "Order placed successfully!"
    And I should be redirected to the order confirmation page
    And my cart should be empty

  @place-order @confirmation
  Scenario: Order confirmation page details
    Given I have successfully placed an order
    When I am on the order confirmation page
    Then I should see the order ID
    And I should see the order date
    And I should see my shipping address
    And I should see my payment method
    And I should see all ordered items
    And I should see the order total
    And I should see the estimated delivery date

  # ============================================
  # ORDER SUMMARY SIDEBAR
  # ============================================

  @order-summary
  Scenario: Order summary displays cart items
    Given I am on the checkout page
    Then I should see all my cart items in the order summary
    And each item should show:
      | Image    |
      | Name     |
      | Quantity |
      | Price    |

  @order-summary @totals
  Scenario: Order summary totals
    Given I have items worth ₹2,598 in my cart
    And I am on the checkout page
    Then the order summary should show:
      | Subtotal | ₹2,598 |
      | Shipping | FREE   |
      | GST      | ₹468   |
      | Total    | ₹3,066 |

  @order-summary @discount
  Scenario: Order summary with discount
    Given I have applied promo code "SAVE10"
    And I am on the checkout page
    Then the order summary should show the discount
    And the total should reflect the discounted amount

  # ============================================
  # STEP NAVIGATION
  # ============================================

  @navigation
  Scenario: Step indicators show progress
    Given I am on the checkout page
    Then step 1 should be marked as "active"
    And steps 2 and 3 should be marked as "pending"
    When I complete step 1
    Then step 1 should be marked as "completed"
    And step 2 should be marked as "active"

  @navigation
  Scenario: Cannot skip steps
    Given I am on step 1 (Shipping)
    When I try to directly access step 3 (Review)
    Then I should remain on step 1
