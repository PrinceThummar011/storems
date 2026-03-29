/**
 * Dashboard Logic
 * Displays real-time metrics and store overview
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize app (authentication, header, mobile menu)
    initializeApp();

    // Get data from localStorage
    const storeProducts = getLocalData('storeProducts', []);
    const storeSales = getLocalData('storeSales', []);

    // 1. Total Products
    const dashTotalProducts = document.getElementById('dashboardTotalProducts');
    if (dashTotalProducts) {
        dashTotalProducts.textContent = storeProducts.length;
    }

    // 2. Low Stock Items (< 5)
    let lowStockCount = 0;
    storeProducts.forEach(product => {
        if (parseInt(product.quantity) < 5) {
            lowStockCount++;
        }
    });
    const dashLowStock = document.getElementById('dashboardLowStock');
    if (dashLowStock) {
        dashLowStock.textContent = lowStockCount;
    }

    // 3. Today's Sales and Revenue
    let todaySalesCount = 0;
    let todayRevenue = 0;
    const today = new Date();
    const todayStr = today.toDateString();

    storeSales.forEach(sale => {
        try {
            const saleDate = new Date(sale.date);
            if (saleDate.toDateString() === todayStr) {
                todaySalesCount++;
                todayRevenue += parseFloat(sale.totalAmount) || 0;
            }
        } catch (error) {
            console.error('Error processing sale date:', error);
        }
    });

    const dashTodaySales = document.getElementById('dashboardTodaySales');
    if (dashTodaySales) {
        dashTodaySales.textContent = todaySalesCount;
    }

    const dashTotalRevenue = document.getElementById('dashboardTotalRevenue');
    if (dashTotalRevenue) {
        dashTotalRevenue.textContent = formatCurrency(todayRevenue);
    }
});
