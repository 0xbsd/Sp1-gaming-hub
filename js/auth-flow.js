// js/auth-flow.js - Complete Authentication Flow Management

class AuthFlow {
    constructor() {
        this.init();
    }

    init() {
        // Check authentication status on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePageLoad();
        });
    }

    handlePageLoad() {
        const currentPath = window.location.pathname;
        const isAuthenticated = this.isAuthenticated();
        const hasCompletedOnboarding = this.hasCompletedOnboarding();

        console.log('Auth Flow Check:', {
            currentPath,
            isAuthenticated,
            hasCompletedOnboarding
        });

        // Route logic based on current page and auth status
        if (currentPath === '/' || currentPath === '/index.html') {
            // Root should go to login if not authenticated
            if (!isAuthenticated) {
                this.redirectTo('/login');
                return;
            }
            if (!hasCompletedOnboarding) {
                this.redirectTo('/onboarding');
                return;
            }
            // If authenticated and onboarded, go to games
            this.redirectTo('/games');
            return;
        } else if (currentPath === '/onboarding' || currentPath === '/onboarding.html') {
            if (!isAuthenticated) {
                this.redirectTo('/login');
                return;
            }
            if (hasCompletedOnboarding) {
                this.redirectTo('/games');
                return;
            }
            // Stay on onboarding page
        } else if (currentPath === '/login' || currentPath === '/login.html') {
            if (isAuthenticated && hasCompletedOnboarding) {
                this.redirectTo('/games');
                return;
            }
            if (isAuthenticated && !hasCompletedOnboarding) {
                this.redirectTo('/onboarding');
                return;
            }
            // Stay on login page
        } else if (this.isProtectedPage(currentPath)) {
            // For all protected pages, require authentication
            if (!isAuthenticated) {
                this.redirectTo('/login');
                return;
            }
            if (!hasCompletedOnboarding) {
                this.redirectTo('/onboarding');
                return;
            }
            // Stay on current page
        }
    }

    isProtectedPage(path) {
        const protectedPages = [
            '/games', '/games.html',
            '/home', '/home.html',
            '/hub', '/hub.html',
            '/proof-puzzle', '/proof-puzzle.html',
            '/zk-sudoku', '/sudoku-game.html',
            '/memory-matrix', '/memory-matrix.html',
            '/proof-racing', '/proof-racing.html',
            '/coming-soon', '/coming-soon.html'
        ];
        return protectedPages.includes(path);
    }

    isAuthenticated() {
        const token = localStorage.getItem('zkGamingToken');
        const verified = localStorage.getItem('succinctVerified');
        return token !== null && verified === 'true';
    }

    hasCompletedOnboarding() {
        return localStorage.getItem('zkOnboardingComplete') === 'true';
    }

    redirectTo(path) {
        // Remove .html extension for cleaner URLs
        const cleanPath = path.replace('.html', '');
        
        // Prevent redirect loops
        if (window.location.pathname !== cleanPath) {
            console.log('Redirecting to:', cleanPath);
            window.location.href = cleanPath;
        }
    }

    login(token, userData = {}) {
        localStorage.setItem('zkGamingToken', token);
        localStorage.setItem('succinctVerified', 'true');
        
        if (userData) {
            localStorage.setItem('zkUser', JSON.stringify(userData));
        }
        
        if (this.hasCompletedOnboarding()) {
            this.redirectTo('/games');
        } else {
            this.redirectTo('/onboarding');
        }
    }

    completeOnboarding(userData = {}) {
        localStorage.setItem('zkOnboardingComplete', 'true');
        
        if (userData) {
            const existingUser = JSON.parse(localStorage.getItem('zkUser') || '{}');
            const updatedUser = { ...existingUser, ...userData };
            localStorage.setItem('zkUser', JSON.stringify(updatedUser));
        }
        
        this.redirectTo('/games');
    }

    logout() {
        // Clear all authentication data
        localStorage.removeItem('zkGamingToken');
        localStorage.removeItem('zkUser');
        localStorage.removeItem('succinctVerified');
        localStorage.removeItem('zkOnboardingComplete');
        
        // Clear any game data if needed
        // localStorage.clear(); // Uncomment if you want to clear everything
        
        this.redirectTo('/login');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('zkUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    updateUser(userData) {
        const currentUser = this.getCurrentUser() || {};
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('zkUser', JSON.stringify(updatedUser));
        return updatedUser;
    }

    // Check if user needs to be redirected from current page
    requireAuth(redirectPath = '/login') {
        if (!this.isAuthenticated()) {
            this.redirectTo(redirectPath);
            return false;
        }
        return true;
    }

    requireOnboarding(redirectPath = '/onboarding') {
        if (!this.hasCompletedOnboarding()) {
            this.redirectTo(redirectPath);
            return false;
        }
        return true;
    }
}

// Initialize auth flow
const authFlow = new AuthFlow();

// Global functions for easy access
function logout() {
    authFlow.logout();
}

function getCurrentUser() {
    return authFlow.getCurrentUser();
}

function checkAuth() {
    return authFlow.requireAuth();
}

function requireOnboarding() {
    return authFlow.requireOnboarding();
}

// Export for use in other scripts
window.authFlow = authFlow;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.checkAuth = checkAuth;