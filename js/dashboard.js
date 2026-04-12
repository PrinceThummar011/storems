/**
 * Dashboard Logic
 * Displays real-time metrics and store overview
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize app (authentication, header, mobile menu)
    if(typeof initializeApp === 'function') initializeApp();

    try {
        const token = localStorage.getItem('storems_token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        // Fetch products
        let products = [];
        const prodRes = await fetch('/api/products', { headers: { 'Authorization': 'Bearer ' + token } });
        if (prodRes.status === 401 || prodRes.status === 403) {
            localStorage.removeItem('storems_loggedin');
            localStorage.removeItem('storems_token');
            localStorage.removeItem('storems_username');
            window.location.href = 'login.html';
            return;
        }
        if(prodRes.ok) products = await prodRes.json();

        // 1. Total Products
        const dashTotalProducts = document.getElementById('dashboardTotalProducts');
        if (dashTotalProducts) {
            dashTotalProducts.textContent = products.length;
        }

        // 2. Low Stock Items (< 5)
        let lowStockCount = 0;
        products.forEach(product => {
            if (parseInt(product.stock) < 5) {
                lowStockCount++;
            }
        });
        const dashLowStock = document.getElementById('dashboardLowStock');
        if (dashLowStock) {
            dashLowStock.textContent = lowStockCount;
        }

        // Sales from API
        let sales = [];
        const salesRes = await fetch('/api/sales', { headers: { 'Authorization': 'Bearer ' + token } });
        if (salesRes.ok) sales = await salesRes.json();

        // 3. Today's Sales && 4. Total Revenue
        let todaySalesCount = 0;
        let totalRevenue = 0;

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        sales.forEach(sale => {
            const saleDate = new Date(sale.created_at);
            if (saleDate >= startOfToday) {
                todaySalesCount += 1;
            }
            if (saleDate >= startOfMonth) {
                totalRevenue += parseFloat(sale.total || 0);
            }
        });

        const dashTodaySales = document.getElementById('dashboardTodaySales');
        if (dashTodaySales) {
            dashTodaySales.textContent = todaySalesCount;
        }

        const dashTotalRevenue = document.getElementById('dashboardTotalRevenue');
        if (dashTotalRevenue) {
            dashTotalRevenue.textContent = typeof formatCurrency === 'function' ? formatCurrency(totalRevenue) : '₹' + totalRevenue.toFixed(2);
        }

        // Populate Recent Activity Table (Products)
        const recentActivityTable = document.getElementById('recentActivityTable');
        if (recentActivityTable) {
            recentActivityTable.innerHTML = '';
            
            // Just display up to 5 recently fetched products
            const recentItems = products.slice(-5).reverse();
            
            if (recentItems.length === 0) {
                recentActivityTable.innerHTML = '<tr><td colspan="4" class="text-center">No recent activity</td></tr>';
            } else {
                recentItems.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name} added to stock</td>
                        <td><span class="badge badge-success">Inventory</span></td>
                        <td>Added: ${item.stock} unit(s)</td>
                    `;
                    recentActivityTable.appendChild(tr);
                });
            }
        }

    } catch (err) {
        console.error("Dashboard Load Error", err);
    }
});