/**
 * @fileoverview Authentication Service for Shoppio
 * @description Handles user authentication, registration, and session management
 * @version 1.0.0
 */

'use strict';

/**
 * Authentication Service
 * @namespace AuthService
 */
const AuthService = {
    /** @type {Object|null} Current logged in user */
    currentUser: null,
    
    /**
     * Initialize authentication service
     * Loads user from localStorage if exists
     */
    init() {
        this.loadUser();
        this.updateUI();
        this.setupEventListeners();
    },
    
    /**
     * Load user from localStorage
     */
    loadUser() {
        try {
            const userData = localStorage.getItem(STORAGE_KEYS.USER);
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            this.currentUser = null;
        }
    },
    
    /**
     * Save user to localStorage
     * @param {Object} user - User object to save
     */
    saveUser(user) {
        this.currentUser = user;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} Result object with success status
     */
    login(email, password) {
        // Check demo credentials
        if (email === DEMO_USER.email && password === DEMO_USER.password) {
            const user = {
                id: 'demo_user',
                email: DEMO_USER.email,
                firstName: DEMO_USER.firstName,
                lastName: DEMO_USER.lastName,
                phone: DEMO_USER.phone,
                address: DEMO_USER.address,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            this.saveUser(user);
            this.updateUI();
            return { success: true, user };
        }
        
        // Check registered users
        const users = this.getRegisteredUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            const user = {
                id: foundUser.id,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                phone: foundUser.phone || '',
                address: foundUser.address || null,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            this.saveUser(user);
            this.updateUI();
            return { success: true, user };
        }
        
        return { success: false, error: 'Invalid email or password' };
    },
    
    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Object} Result object with success status
     */
    register(userData) {
        const users = this.getRegisteredUsers();
        
        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Email already registered' };
        }
        
        // Create new user
        const newUser = {
            id: 'user_' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        // Add to registered users
        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
        
        // Auto login after registration
        const user = {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phone: newUser.phone || '',
            address: null,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };
        this.saveUser(user);
        this.updateUI();
        
        return { success: true, user };
    },
    
    /**
     * Logout current user
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        this.updateUI();
        
        // Redirect to home page
        if (window.location.pathname.includes('profile') || 
            window.location.pathname.includes('orders') || 
            window.location.pathname.includes('wishlist') ||
            window.location.pathname.includes('checkout')) {
            window.location.href = 'index.html';
        }
    },
    
    /**
     * Check if user is logged in
     * @returns {boolean} True if logged in
     */
    isLoggedIn() {
        return this.currentUser && this.currentUser.isLoggedIn === true;
    },
    
    /**
     * Get all registered users
     * @returns {Array} Array of registered users
     */
    getRegisteredUsers() {
        try {
            const users = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error getting registered users:', error);
            return [];
        }
    },
    
    /**
     * Update user profile
     * @param {Object} profileData - Profile data to update
     * @returns {Object} Result object with success status
     */
    updateProfile(profileData) {
        if (!this.currentUser) {
            return { success: false, error: 'Not logged in' };
        }
        
        // Update current user
        this.currentUser = { ...this.currentUser, ...profileData };
        this.saveUser(this.currentUser);
        
        // Also update in registered users
        const users = this.getRegisteredUsers();
        const index = users.findIndex(u => u.email === this.currentUser.email);
        if (index !== -1) {
            users[index] = { ...users[index], ...profileData };
            localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
        }
        
        this.updateUI();
        return { success: true };
    },
    
    /**
     * Update UI based on authentication state
     */
    updateUI() {
        const loggedOutElements = document.querySelectorAll('.logged-out-only');
        const loggedInElements = document.querySelectorAll('.logged-in-only');
        const userNameDisplay = document.querySelectorAll('.user-name-display');
        
        if (this.isLoggedIn()) {
            loggedOutElements.forEach(el => el.style.display = 'none');
            loggedInElements.forEach(el => el.style.display = '');
            userNameDisplay.forEach(el => {
                el.textContent = this.currentUser.firstName;
            });
        } else {
            loggedOutElements.forEach(el => el.style.display = '');
            loggedInElements.forEach(el => el.style.display = 'none');
        }
    },
    
    /**
     * Setup event listeners for auth-related elements
     */
    setupEventListeners() {
        // Logout buttons
        document.querySelectorAll('[data-action="logout"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
                showToast('Logged out successfully', 'success');
            });
        });
    },
    
    /**
     * Require login - redirect to login if not authenticated
     * @param {string} redirectUrl - URL to redirect after login
     * @returns {boolean} True if logged in
     */
    requireLogin(redirectUrl = null) {
        if (!this.isLoggedIn()) {
            if (redirectUrl) {
                localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, redirectUrl);
            } else {
                localStorage.setItem(STORAGE_KEYS.REDIRECT_URL, window.location.href);
            }
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },
    
    /**
     * Get redirect URL after login
     * @returns {string} Redirect URL or default
     */
    getRedirectUrl() {
        const url = localStorage.getItem(STORAGE_KEYS.REDIRECT_URL);
        localStorage.removeItem(STORAGE_KEYS.REDIRECT_URL);
        return url || 'index.html';
    },
    
    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with strength level
     */
    validatePassword(password) {
        let strength = 0;
        const checks = {
            length: password.length >= 6,
            lengthStrong: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
        
        if (checks.length) strength++;
        if (checks.lengthStrong) strength++;
        if (checks.uppercase) strength++;
        if (checks.number) strength++;
        if (checks.special) strength++;
        
        let level = 'weak';
        if (strength >= 4) level = 'strong';
        else if (strength >= 2) level = 'medium';
        
        return {
            valid: checks.length,
            strength: level,
            checks
        };
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
