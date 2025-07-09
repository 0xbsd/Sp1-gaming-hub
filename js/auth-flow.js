// js/auth-flow.js - Updated with .html extensions for Vercel

class AuthFlow {
    constructor() {
        this.init();
    }

    init() {
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
            if (!isAuthenticated) {
                this.redirectTo('/login.html');
                return;
            }
            if (!hasCompletedOnboarding) {
                this.redirectTo('/onboarding.html');
                return;
            }
            this.redirectTo('/games.html');
            return;
        } else if (currentPath === '/onboarding' || currentPath === '/onboarding.html') {
            if (!isAuthenticated) {
                this.redirectTo('/login.html');
                return;
            }
            if (hasCompletedOnboarding) {
                this.redirectTo('/games.html');
                return;
            }
        } else if (currentPath === '/login' || currentPath === '/login.html') {
            if (isAuthenticated && hasCompletedOnboarding) {
                this.redirectTo('/games.html');
                return;
            }
            if (isAuthenticated && !hasCompletedOnboarding) {
                this.redirectTo('/onboarding.html');
                return;
            }
        } else if (this.isProtectedPage(currentPath)) {
            if (!isAuthenticated) {
                this.redirectTo('/login.html');
                return;
            }
            if (!hasCompletedOnboarding) {
                this.redirectTo('/onboarding.html');
                return;
            }
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
        // Use .html extensions for Vercel compatibility
        if (window.location.pathname !== path) {
            console.log('Redirecting to:', path);
            window.location.href = path;
        }
    }

    login(token, userData = {}) {
        localStorage.setItem('zkGamingToken', token);
        localStorage.setItem('succinctVerified', 'true');
        
        if (userData) {
            localStorage.setItem('zkUser', JSON.stringify(userData));
        }
        
        if (this.hasCompletedOnboarding()) {
            this.redirectTo('/games.html');
        } else {
            this.redirectTo('/onboarding.html');
        }
    }

    completeOnboarding(userData = {}) {
        localStorage.setItem('zkOnboardingComplete', 'true');
        
        if (userData) {
            const existingUser = JSON.parse(localStorage.getItem('zkUser') || '{}');
            const updatedUser = { ...existingUser, ...userData };
            localStorage.setItem('zkUser', JSON.stringify(updatedUser));
        }
        
        this.redirectTo('/games.html');
    }

    logout() {
        localStorage.removeItem('zkGamingToken');
        localStorage.removeItem('zkUser');
        localStorage.removeItem('succinctVerified');
        localStorage.removeItem('zkOnboardingComplete');
        
        this.redirectTo('/login.html');
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

    requireAuth(redirectPath = '/login.html') {
        if (!this.isAuthenticated()) {
            this.redirectTo(redirectPath);
            return false;
        }
        return true;
    }

    requireOnboarding(redirectPath = '/onboarding.html') {
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