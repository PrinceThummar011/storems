document.addEventListener('DOMContentLoaded', () => {
    // Common auth/header/sidebar handling
    if (typeof initializeApp === 'function') initializeApp();

    // REPORTS LOGIC
    let storeSales = [];
    const token = localStorage.getItem('storems_token');

    async function loadSales() {
        try {
            const res = await fetch('/api/sales/history', { headers: { 'Authorization': 'Bearer ' + token } });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('storems_loggedin');
                localStorage.removeItem('storems_token');
                localStorage.removeItem('storems_username');
                window.location.href = 'login.html';
                return;
            }
            if (res.ok) {
                storeSales = await res.json();
            } else {
                storeSales = [];
            }
        } catch (err) {
            console.error('Failed to load sales', err);
            storeSales = [];
        }
    }
    
    const salesTableBody = document.querySelector('#salesTable tbody');
    const emptyState = document.getElementById('emptyState');
    const historyDateFilter = document.getElementById('historyDateFilter');
    const showTodayBtn = document.getElementById('showTodayBtn');
    const summaryDateLabel = document.getElementById('summaryDateLabel');
    const summaryRevenueDateLabel = document.getElementById('summaryRevenueDateLabel');

    function toLocalDateInputValue(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getSelectedDateValue() {
        if (!historyDateFilter || !historyDateFilter.value) {
            return toLocalDateInputValue(new Date());
        }
        return historyDateFilter.value;
    }

    function getFilteredSales() {
        const selectedDate = getSelectedDateValue();
        return (storeSales || []).filter((sale) => {
            const saleDate = new Date(sale.created_at);
            return toLocalDateInputValue(saleDate) === selectedDate;
        });
    }

    function updateSummaryLabels() {
        const selectedDate = getSelectedDateValue();
        const today = toLocalDateInputValue(new Date());
        const label = selectedDate === today ? 'Today' : selectedDate;
        if (summaryDateLabel) summaryDateLabel.textContent = label;
        if (summaryRevenueDateLabel) summaryRevenueDateLabel.textContent = label;
    }
    
    // Top summary computations
    function computeSummary() {
        const filteredSales = getFilteredSales();
        let todaySalesCount = 0;
        let todayRevenue = 0;

        filteredSales.forEach(sale => {
            todaySalesCount++;
            todayRevenue += parseFloat(sale.total || 0);
        });

        document.getElementById('todaySalesCount').textContent = todaySalesCount;
        document.getElementById('todayRevenue').textContent = '₹' + todayRevenue.toFixed(2);
        updateSummaryLabels();
    }

    function renderTable() {
        salesTableBody.innerHTML = '';
        const filteredSales = getFilteredSales();

        if (filteredSales.length === 0) {
            emptyState.style.display = 'block';
            document.getElementById('salesTable').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            document.getElementById('salesTable').style.display = 'table';
            
            // Render from newest to oldest
            const sortedSales = [...filteredSales].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
            
            sortedSales.forEach(sale => {
                const saleDate = new Date(sale.created_at);
                const hourSlot = saleDate.toLocaleTimeString([], { hour: '2-digit' });
                const itemDetails = Array.isArray(sale.items) ? sale.items : [];
                const productsText = itemDetails.length
                    ? itemDetails.map(item => `${item.product_name} x ${item.quantity}`).join(', ')
                    : 'No item details';
                const tr = document.createElement('tr');

                const billTd = document.createElement('td');
                billTd.style.fontWeight = '500';
                billTd.textContent = `INV-${sale.id}`;

                const dateTd = document.createElement('td');
                dateTd.textContent = saleDate.toLocaleDateString();

                const timeTd = document.createElement('td');
                timeTd.textContent = saleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const hourTd = document.createElement('td');
                hourTd.textContent = hourSlot;

                const productsTd = document.createElement('td');
                productsTd.textContent = productsText;

                const qtyTd = document.createElement('td');
                qtyTd.textContent = sale.total_quantity || 0;

                const totalTd = document.createElement('td');
                totalTd.style.fontWeight = '600';
                totalTd.textContent = `₹${parseFloat(sale.total || 0).toFixed(2)}`;

                tr.appendChild(billTd);
                tr.appendChild(dateTd);
                tr.appendChild(timeTd);
                tr.appendChild(hourTd);
                tr.appendChild(productsTd);
                tr.appendChild(qtyTd);
                tr.appendChild(totalTd);
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
            const saleDate = new Date(sale.created_at);
            const dateStr = saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            // Only aggregate if it falls within the mapped last 7 days
            if (dataMap.hasOwnProperty(dateStr)) {
                dataMap[dateStr] += parseFloat(sale.total || 0);
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

    loadSales().then(() => {
        if (historyDateFilter && !historyDateFilter.value) {
            historyDateFilter.value = toLocalDateInputValue(new Date());
        }
        computeSummary();
        renderTable();
        renderChart();
    });

    if (historyDateFilter) {
        historyDateFilter.addEventListener('change', () => {
            computeSummary();
            renderTable();
        });
    }

    if (showTodayBtn) {
        showTodayBtn.addEventListener('click', () => {
            if (historyDateFilter) {
                historyDateFilter.value = toLocalDateInputValue(new Date());
            }
            computeSummary();
            renderTable();
        });
    }

});
