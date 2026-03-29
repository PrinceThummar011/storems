document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
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
        window.location.href = 'index.html';
    });

    const sidebar = document.getElementById('sidebar');
    document.getElementById('openMenuBtn').addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeMenuBtn').addEventListener('click', () => sidebar.classList.remove('open'));

    // REPORTS LOGIC
    let storeSales = JSON.parse(localStorage.getItem('storeSales')) || [];
    
    const salesTableBody = document.querySelector('#salesTable tbody');
    const emptyState = document.getElementById('emptyState');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // Top summary computations
    function computeSummary() {
        let todaySalesCount = 0;
        let todayRevenue = 0;
        
        const todayStr = new Date().toDateString();
        
        storeSales.forEach(sale => {
            const saleDate = new Date(sale.date);
            if (saleDate.toDateString() === todayStr) {
                todaySalesCount++;
                todayRevenue += parseFloat(sale.totalAmount);
            }
        });

        document.getElementById('todaySalesCount').textContent = todaySalesCount;
        document.getElementById('todayRevenue').textContent = '₹' + todayRevenue.toFixed(2);
    }

    function renderTable() {
        salesTableBody.innerHTML = '';
        if (storeSales.length === 0) {
            emptyState.style.display = 'block';
            document.getElementById('salesTable').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            document.getElementById('salesTable').style.display = 'table';
            
            // Render from newest to oldest
            const sortedSales = [...storeSales].sort((a,b) => new Date(b.date) - new Date(a.date));
            
            sortedSales.forEach(sale => {
                const saleDate = new Date(sale.date);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight: 500;">${sale.billNumber}</td>
                    <td>${saleDate.toLocaleDateString()}</td>
                    <td>${saleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>${sale.totalItems}</td>
                    <td style="font-weight: 600;">₹${parseFloat(sale.totalAmount).toFixed(2)}</td>
                `;
                salesTableBody.appendChild(tr);
            });
        }
    }

    function renderChart() {
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        // Prepare last 7 days labels and initial empty data
        const labels = [];
        const dataMap = {};
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            labels.push(dateStr);
            dataMap[dateStr] = 0;
        }

        // Aggregate revenue per day
        storeSales.forEach(sale => {
            const saleDate = new Date(sale.date);
            const dateStr = saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            // Only aggregate if it falls within the mapped last 7 days
            if (dataMap.hasOwnProperty(dateStr)) {
                dataMap[dateStr] += parseFloat(sale.totalAmount);
            }
        });

        const dataArray = labels.map(label => dataMap[label]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Revenue (₹)',
                    data: dataArray,
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    computeSummary();
    renderTable();
    renderChart();

    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        if (storeSales.length === 0) return;
        
        if(confirm('Are you absolutely sure you want to clear ALL sales history? This cannot be undone.')) {
            storeSales = [];
            localStorage.setItem('storeSales', JSON.stringify(storeSales));
            window.location.reload(); 
        }
    });

});
