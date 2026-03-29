// Navbar scroll effect
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
document.getElementById('mobileToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('show');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('navLinks').classList.remove('show'));
});

// FAQ Accordion
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        document.querySelectorAll('.faq-item').forEach(i => { if (i !== item) i.classList.remove('open'); });
        item.classList.toggle('open');
    });
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const err = document.getElementById('loginError');
    
    if (u.toLowerCase() === 'admin' && p === 'admin123') {
        err.style.color = '#22c55e';
        err.textContent = '✓ Login successful! Redirecting to Dashboard...';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', u);
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    } else {
        err.style.color = '#ef4444';
        err.textContent = 'Invalid username or password. Try admin / admin123';
    }
});
