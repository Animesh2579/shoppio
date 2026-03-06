// Authentication Pages JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (Auth.isLoggedIn() && (window.location.pathname.includes('login') || window.location.pathname.includes('register'))) {
        const redirect = localStorage.getItem('shoppio_redirect') || 'index.html';
        localStorage.removeItem('shoppio_redirect');
        window.location.href = redirect;
        return;
    }
    
    initLoginForm();
    initRegisterForm();
    initPasswordToggle();
    initPasswordStrength();
});

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value.trim();
            const password = document.getElementById('login-password')?.value;
            const remember = document.getElementById('remember-me')?.checked;
            
            // Validate
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (!Auth.validateEmail(email)) {
                showToast('Please enter a valid email', 'error');
                return;
            }
            
            // Attempt login
            const result = Auth.login(email, password);
            
            if (result.success) {
                showToast('Login successful!', 'success');
                
                // Handle redirect
                const redirect = localStorage.getItem('shoppio_redirect') || 'index.html';
                localStorage.removeItem('shoppio_redirect');
                
                setTimeout(() => {
                    window.location.href = redirect;
                }, 500);
            } else {
                showToast(result.error, 'error');
                
                // Show error on form
                const errorEl = document.getElementById('login-error');
                if (errorEl) {
                    errorEl.textContent = result.error;
                    errorEl.style.display = 'block';
                }
            }
        });
    }
}

function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('register-firstname')?.value.trim();
            const lastName = document.getElementById('register-lastname')?.value.trim();
            const email = document.getElementById('register-email')?.value.trim();
            const password = document.getElementById('register-password')?.value;
            const confirmPassword = document.getElementById('register-confirm-password')?.value;
            const terms = document.getElementById('terms')?.checked;
            
            // Validate
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (!Auth.validateEmail(email)) {
                showToast('Please enter a valid email', 'error');
                return;
            }
            
            if (!Auth.validatePassword(password)) {
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
            
            // Attempt registration
            const result = Auth.register({
                firstName,
                lastName,
                email,
                password
            });
            
            if (result.success) {
                showToast('Registration successful!', 'success');
                
                // Handle redirect
                const redirect = localStorage.getItem('shoppio_redirect') || 'index.html';
                localStorage.removeItem('shoppio_redirect');
                
                setTimeout(() => {
                    window.location.href = redirect;
                }, 500);
            } else {
                showToast(result.error, 'error');
            }
        });
    }
}

function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            if (input && input.type === 'password') {
                input.type = 'text';
                toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else if (input) {
                input.type = 'password';
                toggle.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

function initPasswordStrength() {
    const passwordInput = document.getElementById('register-password');
    const strengthIndicator = document.getElementById('password-strength');
    const strengthText = document.getElementById('strength-text');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = Auth.getPasswordStrength(password);
            
            strengthIndicator.className = 'password-strength ' + strength;
            
            if (strengthText) {
                const texts = {
                    weak: 'Weak password',
                    medium: 'Medium strength',
                    strong: 'Strong password'
                };
                strengthText.textContent = password ? texts[strength] : '';
            }
        });
    }
}

// Demo credentials autofill
const demoLoginBtn = document.getElementById('demo-login-btn');
if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        if (emailInput) emailInput.value = 'demo@shoppio.com';
        if (passwordInput) passwordInput.value = 'demo123';
        
        showToast('Demo credentials filled!', 'success');
    });
}

// Social login (demo)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Social login is not available in demo mode', 'info');
    });
});
