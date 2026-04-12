document.addEventListener('DOMContentLoaded', () => {
    checkExistingLogin();

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username'); 
    const passwordInput = document.getElementById('password');
    const messageBox = document.getElementById('loginMessage');

    function checkExistingLogin() {
        const isLoggedIn = localStorage.getItem('storems_loggedin') === 'true';
        const token = localStorage.getItem('storems_token');
        if (isLoggedIn && token) {
            window.location.href = 'index.html';
        } else if (isLoggedIn && !token) {
            // Reset stale local state
            localStorage.removeItem('storems_loggedin');
            localStorage.removeItem('storems_username');
        }
    }

    function showMessage(message, type = 'error') {
        messageBox.textContent = message;
        messageBox.className = 'error-message show';
        if (type === 'success') {
            messageBox.classList.add('success');
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 2000);
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                showMessage('❌ Please enter both email and password', 'error');
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('storems_token', data.token);
                    localStorage.setItem('storems_username', data.store_name);
                    localStorage.setItem('storems_loggedin', 'true');
                    showMessage('✅ Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showMessage('❌ ' + (data.error || 'Invalid credentials'), 'error');
                    if (passwordInput) passwordInput.value = '';
                    if (usernameInput) usernameInput.focus();
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('❌ Server connection error. Make sure backend is running.', 'error');
            }
        });
    }

});
