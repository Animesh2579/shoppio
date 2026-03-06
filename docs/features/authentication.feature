@authentication
Feature: User Authentication
  As a user of Shoppio
  I want to be able to register, login, and manage my account
  So that I can access personalized features and make purchases

  Background:
    Given I am on the Shoppio website
    And I am not logged in

  # ============================================
  # USER REGISTRATION
  # ============================================

  @registration @smoke
  Scenario: Successful user registration
    Given I am on the registration page
    When I fill in the registration form with valid details:
      | Field            | Value              |
      | First Name       | Rahul              |
      | Last Name        | Sharma             |
      | Email            | rahul@example.com  |
      | Phone            | 9876543210         |
      | Password         | Test@123           |
      | Confirm Password | Test@123           |
    And I accept the terms and conditions
    And I click the "Create Account" button
    Then I should see a success message "Account created successfully!"
    And I should be logged in as "Rahul"
    And I should be redirected to the home page

  @registration @validation
  Scenario: Registration with missing required fields
    Given I am on the registration page
    When I leave the "First Name" field empty
    And I fill in other required fields
    And I click the "Create Account" button
    Then I should see an error message "Please fill in all required fields"
    And I should remain on the registration page

  @registration @validation
  Scenario: Registration with invalid email format
    Given I am on the registration page
    When I fill in "Email" with "invalid-email"
    And I fill in other required fields
    And I click the "Create Account" button
    Then I should see an error message "Please enter a valid email"

  @registration @validation
  Scenario: Registration with invalid phone number
    Given I am on the registration page
    When I fill in "Phone" with "12345"
    And I fill in other required fields
    And I click the "Create Account" button
    Then I should see an error message "Please enter a valid 10-digit phone number"

  @registration @validation
  Scenario: Registration with weak password
    Given I am on the registration page
    When I fill in "Password" with "123"
    And I fill in other required fields
    And I click the "Create Account" button
    Then I should see an error message "Password must be at least 6 characters"

  @registration @validation
  Scenario: Registration with mismatched passwords
    Given I am on the registration page
    When I fill in "Password" with "Test@123"
    And I fill in "Confirm Password" with "Test@456"
    And I fill in other required fields
    And I click the "Create Account" button
    Then I should see an error message "Passwords do not match"

  @registration @validation
  Scenario: Registration without accepting terms
    Given I am on the registration page
    When I fill in all required fields
    And I do not accept the terms and conditions
    And I click the "Create Account" button
    Then I should see an error message "Please accept the terms and conditions"

  @registration @duplicate
  Scenario: Registration with existing email
    Given a user with email "existing@example.com" already exists
    And I am on the registration page
    When I fill in "Email" with "existing@example.com"
    And I fill in other required fields
    And I click the "Create Account" button
    Then I should see an error message "Email already registered"

  # ============================================
  # USER LOGIN
  # ============================================

  @login @smoke
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I fill in "Email" with "demo@shoppio.com"
    And I fill in "Password" with "demo123"
    And I click the "Sign In" button
    Then I should see a success message "Welcome back, Demo!"
    And I should be logged in as "Demo"
    And I should be redirected to the home page

  @login @demo
  Scenario: Login using demo credentials button
    Given I am on the login page
    When I click the "Fill Demo Credentials" button
    Then the email field should contain "demo@shoppio.com"
    And the password field should contain "demo123"
    When I click the "Sign In" button
    Then I should be logged in as "Demo"

  @login @validation
  Scenario: Login with empty fields
    Given I am on the login page
    When I leave the "Email" field empty
    And I leave the "Password" field empty
    And I click the "Sign In" button
    Then I should see an error message "Please fill in all fields"

  @login @validation
  Scenario: Login with invalid email format
    Given I am on the login page
    When I fill in "Email" with "invalid-email"
    And I fill in "Password" with "password123"
    And I click the "Sign In" button
    Then I should see an error message "Please enter a valid email"

  @login @validation
  Scenario: Login with incorrect password
    Given I am on the login page
    When I fill in "Email" with "demo@shoppio.com"
    And I fill in "Password" with "wrongpassword"
    And I click the "Sign In" button
    Then I should see an error message "Invalid email or password"

  @login @validation
  Scenario: Login with non-existent email
    Given I am on the login page
    When I fill in "Email" with "nonexistent@example.com"
    And I fill in "Password" with "password123"
    And I click the "Sign In" button
    Then I should see an error message "Invalid email or password"

  # ============================================
  # PASSWORD VISIBILITY
  # ============================================

  @login @password
  Scenario: Toggle password visibility on login page
    Given I am on the login page
    When I fill in "Password" with "mypassword"
    Then the password field should be masked
    When I click the password visibility toggle
    Then the password field should show "mypassword" in plain text
    When I click the password visibility toggle again
    Then the password field should be masked

  # ============================================
  # PASSWORD STRENGTH
  # ============================================

  @registration @password-strength
  Scenario Outline: Password strength indicator
    Given I am on the registration page
    When I type "<password>" in the password field
    Then the password strength indicator should show "<strength>"

    Examples:
      | password    | strength |
      | 123         | weak     |
      | test123     | medium   |
      | Test@123    | strong   |
      | MyP@ssw0rd! | strong   |

  # ============================================
  # LOGOUT
  # ============================================

  @logout @smoke
  Scenario: Successful logout
    Given I am logged in as "Demo User"
    When I click on the user menu
    And I click "Logout"
    Then I should see a success message "Logged out successfully"
    And I should not be logged in
    And I should see the "Sign In" link in the header

  # ============================================
  # PROTECTED ROUTES
  # ============================================

  @protected @redirect
  Scenario: Accessing profile page without login
    Given I am not logged in
    When I navigate to the profile page
    Then I should be redirected to the login page
    And the redirect URL should be saved

  @protected @redirect
  Scenario: Redirect back after login
    Given I am not logged in
    And I tried to access the checkout page
    And I was redirected to the login page
    When I login with valid credentials
    Then I should be redirected to the checkout page

  @protected @redirect
  Scenario: Accessing wishlist without login
    Given I am not logged in
    When I navigate to the wishlist page
    Then I should be redirected to the login page

  @protected @redirect
  Scenario: Accessing orders page without login
    Given I am not logged in
    When I navigate to the orders page
    Then I should be redirected to the login page

  # ============================================
  # SESSION PERSISTENCE
  # ============================================

  @session
  Scenario: Session persists after page refresh
    Given I am logged in as "Demo User"
    When I refresh the page
    Then I should still be logged in as "Demo User"

  @session
  Scenario: Session persists across pages
    Given I am logged in as "Demo User"
    When I navigate to the products page
    And I navigate to the cart page
    And I navigate to the home page
    Then I should still be logged in as "Demo User"
