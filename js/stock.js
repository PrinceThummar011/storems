document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (localStorage.getItem('storems_loggedin') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Header logic
    const username = localStorage.getItem('storems_username');
    if (username) {
        document.getElementById('displayUsername').textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }
    document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('storems_loggedin');
        localStorage.removeItem('storems_username');
        localStorage.removeItem('storems_token');
        window.location.href = 'login.html';
    });

    const sidebar = document.getElementById('sidebar');
    const openMenuBtn = document.getElementById('openMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    if(openMenuBtn) openMenuBtn.addEventListener('click', () => sidebar.classList.add('open'));
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', () => sidebar.classList.remove('open'));

    // STOCK LOGIC
    let storeProducts = [];
    try {
        const res = await fetch('/api/products', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('storems_token') } });
        if(res.ok) storeProducts = await res.json();
    } catch (e) {
        console.error("Failed to load products", e);
    }
    
    const stockTableBody = document.querySelector('#stockTable tbody');
    const emptyState = document.getElementById('emptyState');
    const stockAlert = document.getElementById('stockAlert');
    const lowStockCountEl = document.getElementById('lowStockCount');
    
    const renderStock = () => {
        if (!stockTableBody) return;
        stockTableBody.innerHTML = '';
        let lowStockCount = 0;
        
        if (storeProducts.length === 0) {
            if(emptyState) emptyState.style.display = 'block';
            document.getElementById('stockTable').style.display = 'none';
        } else {
            if(emptyState) emptyState.style.display = 'none';
            document.getElementById('stockTable').style.display = 'table';
            
            storeProducts.forEach(product => {
                const stock = parseInt(product.stock);
                if (stock < 5) lowStockCount++;
                
                let statusHtml = '';
                if (stock <= 0) {
                    statusHtml = '<span class="status-out">Out of Stock</span>';
                } else if (stock < 5) {
                    statusHtml = '<span class="status-low">Low Stock</span>';
                } else {
                    statusHtml = '<span class="status-ok">In Stock</span>';
                }
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.id}</td>
                    <td style="font-weight: 500;">${product.name}</td>
                    <td>${product.category}</td>
                    <td style="font-weight: 600;">${stock} units</td>
                    <td>${statusHtml}</td>
                `;
                stockTableBody.appendChild(tr);
            });
        }
        
        if (stockAlert && lowStockCountEl) {
            if (lowStockCount > 0) {
                lowStockCountEl.textContent = lowStockCount;
                stockAlert.style.display = 'block';
            } else {
                stockAlert.style.display = 'none';
            }
        }
    };
    
    renderStock();
});