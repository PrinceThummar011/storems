document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Check if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();
        
        // Clear previous errors
        errorMessage.textContent = '';
        
        // Validate credentials (admin / admin123 as requested)
        if (usernameInput.toLowerCase() === 'admin' && passwordInput === 'admin123') {
            // Success
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', usernameInput);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Failed
            errorMessage.textContent = 'Invalid username or password. Please try again.';
        }
    });
});
