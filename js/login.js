/**
 * Login Module
 * Handles user authentication and session management
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkExistingLogin();

    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageBox = document.getElementById('loginMessage');

    /**
     * Check if user is already logged in
     * If yes, redirect to dashboard automatically
     */
    function checkExistingLogin() {
        try {
            const isLoggedIn = localStorage.getItem('storems_loggedin');
            if (isLoggedIn === 'true') {
                // User already logged in, redirect to dashboard
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    }

    /**
     * Display message to user
     * @param {string} message - Message text
     * @param {string} type - 'error' or 'success'
     */
    function showMessage(message, type = 'error') {
        try {
            messageBox.textContent = message;
            messageBox.classList.add('show');

            if (type === 'success') {
                messageBox.classList.add('success');
                messageBox.classList.remove('error');
            } else {
                messageBox.classList.remove('success');
                messageBox.classList.add('error');
            }

            // Auto-hide after 5 seconds for success, keep error visible
            if (type === 'success') {
                setTimeout(() => {
                    messageBox.classList.remove('show');
                }, 2000);
            }
        } catch (error) {
            console.error('Error displaying message:', error);
        }
    }

    /**
     * Validate input fields
     * @returns {boolean} true if valid
     */
    function validateInputs() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showMessage('❌ Please enter both username and password', 'error');
            return false;
        }

        if (username.length < 3) {
            showMessage('❌ Username must be at least 3 characters', 'error');
            return false;
        }

        if (password.length < 6) {
            showMessage('❌ Password must be at least 6 characters', 'error');
            return false;
        }

        return true;
    }

    /**
     * Check credentials against admin credentials
     * @param {string} username - Username entered
     * @param {string} password - Password entered
     * @returns {boolean} true if credentials match
     */
    function checkCredentials(username, password) {
        // Demo credentials
        const ADMIN_USERNAME = 'admin';
        const ADMIN_PASSWORD = 'admin123';

        return username.toLowerCase() === ADMIN_USERNAME && 
               password === ADMIN_PASSWORD;
    }

    /**
     * Handle login form submission
     */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            // Get input values
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Validate inputs
            if (!validateInputs()) {
                return;
            }

            // Check credentials
            if (checkCredentials(username, password)) {
                // Credentials correct
                try {
                    // Save login status to localStorage
                    localStorage.setItem('storems_loggedin', 'true');
                    localStorage.setItem('storems_username', username);
                    localStorage.setItem('storems_login_time', new Date().toISOString());

                    // Show success message
                    showMessage('✅ Login successful! Redirecting to dashboard...', 'success');

                    // Redirect to dashboard after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);

                } catch (error) {
                    console.error('Error saving login data:', error);
                    showMessage('⚠️ Login successful but could not save session. Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            } else {
                // Credentials incorrect
                showMessage('❌ Invalid username or password. Try: admin / admin123', 'error');

                // Clear password field for security
                passwordInput.value = '';
                usernameInput.focus();
            }

        } catch (error) {
            console.error('Login error:', error);
            showMessage('❌ An error occurred during login. Please try again.', 'error');
        }
    });

    /**
     * Clear error message on input focus
     */
    usernameInput.addEventListener('focus', () => {
        messageBox.classList.remove('show');
    });

    passwordInput.addEventListener('focus', () => {
        messageBox.classList.remove('show');
    });

    /**
     * Allow Enter key to submit form
     */
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

});
