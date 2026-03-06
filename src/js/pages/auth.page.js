/**
 * @fileoverview Authentication Pages Controller for Shoppio
 * @description Handles login, registration, and password functionality
 * @version 1.0.0
 */

'use strict';

/**
 * Auth Page Controller
 * @namespace AuthPage
 */
const AuthPage = {
    /**
     * Initialize auth page
     */
    init() {
        // Redirect if already logged in
        if (AuthService.isLoggedIn()) {
            const redirect = AuthService.getRedirectUrl();
            window.location.href = redirect;
            return;
        }
        
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupPasswordToggle();
        this.setupPasswordStrength();
        this.setupDemoLogin();
    },
    
    /**
     * Setup login form
     */
    setupLoginForm() {
        const form = document.getElementById('login-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('password')?.value;
            
            // Validate
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showToast('Please enter a valid email', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                const result = AuthService.login(email, password);
                
                if (result.success) {
                    showToast(`Welcome back, ${result.user.firstName}!`, 'success');
                    
                    const redirect = AuthService.getRedirectUrl();
                    setTimeout(() => {
                        window.location.href = redirect;
                    }, 500);
                } else {
                    showToast(result.error, 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show error message
                    const errorEl = document.getElementById('login-error');
                    if (errorEl) {
                        errorEl.textContent = result.error;
                        errorEl.style.display = 'block';
                    }
                }
            }, 800);
        });
    },
    
    /**
     * Setup register form
     */
    setupRegisterForm() {
        const form = document.getElementById('register-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('first-name')?.value.trim();
            const lastName = document.getElementById('last-name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            const terms = document.getElementById('terms')?.checked;
            
            // Validate
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showToast('Please enter a valid email', 'error');
                return;
            }
            
            if (phone && !validatePhone(phone)) {
                showToast('Please enter a valid 10-digit phone number', 'error');
                return;
            }
            
            const passwordValidation = AuthService.validatePassword(password);
            if (!passwordValidation.valid) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showToast('Please accept the terms and conditions', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                const result = AuthService.register({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password
                });
                
                if (result.success) {
                    showToast('Account created successfully!', 'success');
                    
                    const redirect = AuthService.getRedirectUrl();
                    setTimeout(() => {
                        window.location.href = redirect;
                    }, 500);
                } else {
                    showToast(result.error, 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 800);
        });
    },
    
    /**
     * Setup password visibility toggle
     */
    setupPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.closest('.input-icon')?.querySelector('input');
                if (input) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    toggle.innerHTML = `<i class="fas fa-eye${isPassword ? '-slash' : ''}"></i>`;
                }
            });
        });
    },
    
    /**
     * Setup password strength indicator
     */
    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-strength-text');
        
        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', () => {
                const password = passwordInput.value;
                const validation = AuthService.validatePassword(password);
                
                strengthBar.className = 'strength-bar ' + validation.strength;
                
                if (strengthText) {
                    const texts = {
                        weak: 'Weak - Add more characters',
                        medium: 'Medium - Add numbers or symbols',
                        strong: 'Strong password'
                    };
                    strengthText.textContent = password ? texts[validation.strength] : '';
                    strengthText.className = 'strength-text ' + validation.strength;
                }
            });
        }
    },
    
    /**
     * Setup demo login button
     */
    setupDemoLogin() {
        const demoBtn = document.getElementById('demo-login-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                
                if (emailInput) emailInput.value = DEMO_USER.email;
                if (passwordInput) passwordInput.value = DEMO_USER.password;
                
                showToast('Demo credentials filled! Click Login to continue.', 'info');
            });
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'login' || 
        document.body.dataset.page === 'register' ||
        document.getElementById('login-form') ||
        document.getElementById('register-form')) {
        AuthPage.init();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthPage;
}
