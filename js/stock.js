document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Header logic
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('displayUsername').textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }
    document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });

    const sidebar = document.getElementById('sidebar');
    document.getElementById('openMenuBtn').addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeMenuBtn').addEventListener('click', () => sidebar.classList.remove('open'));

    // STOCK LOGIC
    let storeProducts = JSON.parse(localStorage.getItem('storeProducts')) || [];
    const stockTableBody = document.querySelector('#stockTable tbody');
    const emptyState = document.getElementById('emptyState');
    const stockAlert = document.getElementById('stockAlert');
    const lowStockCountEl = document.getElementById('lowStockCount');

    function renderStock() {
        stockTableBody.innerHTML = '';
        
        if (storeProducts.length === 0) {
            emptyState.style.display = 'block';
            document.getElementById('stockTable').style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        document.getElementById('stockTable').style.display = 'table';
        
        let criticallyLowCount = 0;

        storeProducts.forEach(product => {
            const qty = parseInt(product.quantity);
            const tr = document.createElement('tr');
            
            let statusBadge = '';
            
            // Check limits securely
            if (qty < 5) {
                tr.classList.add('row-critical');
                statusBadge = '<span style="color:#b91c1c; font-weight:600;">Critical</span>';
                criticallyLowCount++;
            } else if (qty >= 5 && qty <= 10) {
                tr.classList.add('row-warning');
                statusBadge = '<span style="color:#b45309; font-weight:600;">Warning</span>';
            } else {
                statusBadge = '<span style="color:#047857; font-weight:600;">Adequate</span>';
            }

            tr.innerHTML = `
                <td>${product.id}</td>
                <td style="font-weight: 500;">${product.name}</td>
                <td>${product.category}</td>
                <td style="font-weight: 600; font-size: 15px;">${product.quantity} ${product.unit}</td>
                <td>${statusBadge}</td>
            `;
            stockTableBody.appendChild(tr);
        });

        // Toggle Alert block if critical items exist
        if (criticallyLowCount > 0) {
            lowStockCountEl.textContent = criticallyLowCount;
            stockAlert.style.display = 'block';
        } else {
            stockAlert.style.display = 'none';
        }
    }

    renderStock();

    // Export CSV functionality
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
        if (storeProducts.length === 0) {
            alert('No data to export!');
            return;
        }

        // CSV Header
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "ID,Product Name,Category,Price,Quantity,Unit,Status\n";

        storeProducts.forEach(product => {
            const qty = parseInt(product.quantity);
            let status = qty < 5 ? "Critical" : (qty <= 10 ? "Warning" : "Adequate");
            
            // Format row, escaping quotes if necessary
            const row = [
                `"${product.id}"`,
                `"${product.name}"`,
                `"${product.category}"`,
                `"${product.price}"`,
                `"${product.quantity}"`,
                `"${product.unit}"`,
                `"${status}"`
            ];
            csvContent += row.join(",") + "\n";
        });

        // Trigger download programmatically
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `stock_report_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
