// Authentication Module
const Auth = {
    currentUser: null,
    
    init() {
        this.loadUser();
        this.updateUI();
    },
    
    loadUser() {
        const userData = localStorage.getItem('shoppio_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    },
    
    saveUser(user) {
        this.currentUser = user;
        localStorage.setItem('shoppio_user', JSON.stringify(user));
    },
    
    login(email, password) {
        // Check demo credentials
        if (email === demoUser.email && password === demoUser.password) {
            const user = {
                email: demoUser.email,
                firstName: demoUser.firstName,
                lastName: demoUser.lastName,
                phone: demoUser.phone,
                isLoggedIn: true
            };
            this.saveUser(user);
            return { success: true, user };
        }
        
        // Check registered users
        const users = this.getRegisteredUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            const user = {
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                phone: foundUser.phone || '',
                isLoggedIn: true
            };
            this.saveUser(user);
            return { success: true, user };
        }
        
        return { success: false, error: 'Invalid email or password' };
    },
    
    register(userData) {
        const users = this.getRegisteredUsers();
        
        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Email already registered' };
        }
        
        // Add new user
        users.push(userData);
        localStorage.setItem('shoppio_registered_users', JSON.stringify(users));
        
        // Auto login
        const user = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone || '',
            isLoggedIn: true
        };
        this.saveUser(user);
        
        return { success: true, user };
    },
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('shoppio_user');
        this.updateUI();
    },
    
    isLoggedIn() {
        return this.currentUser && this.currentUser.isLoggedIn;
    },
    
    getRegisteredUsers() {
        const users = localStorage.getItem('shoppio_registered_users');
        return users ? JSON.parse(users) : [];
    },
    
    updateProfile(profileData) {
        if (!this.currentUser) return { success: false, error: 'Not logged in' };
        
        this.currentUser = { ...this.currentUser, ...profileData };
        this.saveUser(this.currentUser);
        
        // Also update in registered users
        const users = this.getRegisteredUsers();
        const index = users.findIndex(u => u.email === this.currentUser.email);
        if (index !== -1) {
            users[index] = { ...users[index], ...profileData };
            localStorage.setItem('shoppio_registered_users', JSON.stringify(users));
        }
        
        return { success: true };
    },
    
    updateUI() {
        const loggedOutMenu = document.querySelector('.logged-out-menu');
        const loggedInMenu = document.querySelector('.logged-in-menu');
        const userNameDisplay = document.getElementById('user-name-display');
        
        if (this.isLoggedIn()) {
            if (loggedOutMenu) loggedOutMenu.style.display = 'none';
            if (loggedInMenu) loggedInMenu.style.display = 'block';
            if (userNameDisplay) {
                userNameDisplay.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
        } else {
            if (loggedOutMenu) loggedOutMenu.style.display = 'block';
            if (loggedInMenu) loggedInMenu.style.display = 'none';
        }
    },
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePassword(password) {
        // At least 6 characters
        return password.length >= 6;
    },
    
    getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return 'weak';
        if (strength <= 3) return 'medium';
        return 'strong';
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
            window.location.href = 'index.html';
        });
    }
    
    // Sidebar logout
    const sidebarLogout = document.getElementById('sidebar-logout');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
            window.location.href = 'index.html';
        });
    }
});
