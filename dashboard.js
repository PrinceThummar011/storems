document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Set username
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('displayUsername').textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }

    // Set today's date
    const dateElement = document.getElementById('todayDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });

    // Mobile menu toggle
    const sidebar = document.getElementById('sidebar');
    const openMenuBtn = document.getElementById('openMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    openMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    closeMenuBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // Populate Dashboard Data
    const storeProducts = JSON.parse(localStorage.getItem('storeProducts')) || [];
    const storeSales = JSON.parse(localStorage.getItem('storeSales')) || [];

    // 1. Total Products
    const dashTotalProducts = document.getElementById('dashboardTotalProducts');
    if (dashTotalProducts) dashTotalProducts.textContent = storeProducts.length;

    // 2. Low Stock Items (< 5)
    let lowStockCount = 0;
    storeProducts.forEach(product => {
        if (parseInt(product.quantity) < 5) lowStockCount++;
    });
    const dashLowStock = document.getElementById('dashboardLowStock');
    if (dashLowStock) dashLowStock.textContent = lowStockCount;

    // 3. Today's Sales and Revenue
    let todaySalesCount = 0;
    let todayRevenue = 0;
    const todayStr = today.toDateString();

    storeSales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate.toDateString() === todayStr) {
            todaySalesCount++;
            todayRevenue += parseFloat(sale.totalAmount);
        }
    });

    const dashTodaySales = document.getElementById('dashboardTodaySales');
    if (dashTodaySales) dashTodaySales.textContent = todaySalesCount;
    
    const dashTotalRevenue = document.getElementById('dashboardTotalRevenue');
    if (dashTotalRevenue) dashTotalRevenue.textContent = '₹' + todayRevenue.toFixed(2);
});
