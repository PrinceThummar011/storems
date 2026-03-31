/**
 * StoreMS - Utility Functions
 * Shared utilities for authentication, UI, and common operations
 */

/**
 * Checks if user is authenticated
 * Redirects to login page if not
 * @returns {boolean} true if authenticated, false otherwise
 */
function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Sets up header with username and date display
 */
function initializeHeader() {
    try {
        const username = localStorage.getItem('username');
        const displayUsernameEl = document.getElementById('displayUsername');
        
        if (displayUsernameEl && username) {
            displayUsernameEl.textContent = username.charAt(0).toUpperCase() + username.slice(1);
        }
        
        const dateEl = document.getElementById('todayDate');
        if (dateEl) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = today.toLocaleDateString('en-US', options);
        }
    } catch (error) {
        console.error('Error initializing header:', error);
    }
}

/**
 * Sets up logout functionality
 */
function initializeLogout() {
    try {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                window.location.href = 'login.html';
            });
        }
    } catch (error) {
        console.error('Error initializing logout:', error);
    }
}

/**
 * Sets up mobile sidebar menu toggle
 */
function initializeMobileMenu() {
    try {
        const sidebar = document.getElementById('sidebar');
        const openMenuBtn = document.getElementById('openMenuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        
        if (openMenuBtn && sidebar) {
            openMenuBtn.addEventListener('click', () => {
                sidebar.classList.add('open');
            });
        }
        
        if (closeMenuBtn && sidebar) {
            closeMenuBtn.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }
    } catch (error) {
        console.error('Error initializing mobile menu:', error);
    }
}

/**
 * Initialize all common app functions
 * Call this in DOMContentLoaded of all dashboard pages
 */
function initializeApp() {
    if (!checkAuth()) return;
    initializeHeader();
    initializeLogout();
    initializeMobileMenu();
}

/**
 * Show a temporary success message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 3000)
 */
function showSuccessMessage(message, duration = 3000) {
    try {
        const successAlert = document.getElementById('successAlert');
        if (successAlert) {
            successAlert.textContent = message;
            successAlert.style.display = 'block';
            setTimeout(() => {
                successAlert.style.display = 'none';
            }, duration);
        }
    } catch (error) {
        console.error('Error showing success message:', error);
    }
}

/**
 * Show an error message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 3000)
 */
function showErrorMessage(message, duration = 3000) {
    try {
        const errorAlert = document.getElementById('errorAlert');
        if (errorAlert) {
            errorAlert.textContent = message;
            errorAlert.style.display = 'block';
            setTimeout(() => {
                errorAlert.style.display = 'none';
            }, duration);
        } else {
            alert(message);
        }
    } catch (error) {
        console.error('Error showing error message:', error);
    }
}

/**
 * Validates price input
 * @param {string|number} price - Price value
 * @returns {boolean} true if valid
 */
function validatePrice(price) {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
}

/**
 * Validates quantity input
 * @param {string|number} quantity - Quantity value
 * @returns {boolean} true if valid
 */
function validateQuantity(quantity) {
    const num = parseInt(quantity);
    return !isNaN(num) && num >= 0;
}

/**
 * Formats currency (₹)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

/**
 * Formats date
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Generates unique ID
 * @param {string} prefix - Prefix for ID
 * @returns {string} Unique ID
 */
function generateUniqueId(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Safely get data from localStorage
 * @param {string} key - Local storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Parsed value or default
 */
function getLocalData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Safely save data to localStorage
 * @param {string} key - Local storage key
 * @param {*} value - Value to save (will be stringified)
 * @returns {boolean} true if successful
 */
function saveLocalData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Clear all app data from localStorage
 */
function clearAllAppData() {
    try {
        localStorage.removeItem('storeProducts');
        localStorage.removeItem('storeSales');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        console.log('All app data cleared');
    } catch (error) {
        console.error('Error clearing app data:', error);
    }
}
