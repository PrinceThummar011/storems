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
    const today = new Date();
    document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });

    const sidebar = document.getElementById('sidebar');
    document.getElementById('openMenuBtn').addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeMenuBtn').addEventListener('click', () => sidebar.classList.remove('open'));


    // POST LOGIC / BILLING
    let storeProducts = JSON.parse(localStorage.getItem('storeProducts')) || [];
    let currentBill = [];
    
    const productSearch = document.getElementById('productSearch');
    const searchResults = document.getElementById('searchResults');
    const selectedProductCard = document.getElementById('selectedProductCard');
    const spName = document.getElementById('spName');
    const spPrice = document.getElementById('spPrice');
    const spStock = document.getElementById('spStock');
    const spUnit = document.getElementById('spUnit');
    const spId = document.getElementById('spId');
    const spQuantity = document.getElementById('spQuantity');
    const addToBillForm = document.getElementById('addToBillForm');
    
    const billTableBody = document.querySelector('#billTable tbody');
    const emptyBill = document.getElementById('emptyBill');
    const billSummaryBox = document.getElementById('billSummaryBox');
    const billSubtotal = document.getElementById('billSubtotal');

    // Search input listener
    productSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        
        if (query === '') {
            searchResults.style.display = 'none';
            return;
        }
        
        const matches = storeProducts.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
        
        if (matches.length > 0) {
            searchResults.style.display = 'block';
            matches.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `${product.name} (Stock: ${product.quantity} ${product.unit})`;
                li.addEventListener('click', () => selectProduct(product));
                searchResults.appendChild(li);
            });
        } else {
            searchResults.style.display = 'block';
            searchResults.innerHTML = '<li style="color:#6b7280; padding:10px;">No products found</li>';
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== productSearch && e.target !== searchResults) {
            searchResults.style.display = 'none';
        }
    });

    function selectProduct(product) {
        productSearch.value = product.name;
        searchResults.style.display = 'none';
        
        spId.value = product.id;
        spName.textContent = product.name;
        spPrice.textContent = parseFloat(product.price).toFixed(2);
        spStock.textContent = product.quantity;
        spUnit.textContent = product.unit;
        
        spQuantity.max = product.quantity; // Limit to available stock
        spQuantity.value = 1;

        selectedProductCard.style.display = 'block';
    }

    addToBillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = spId.value;
        const qty = parseInt(spQuantity.value);
        
        const product = storeProducts.find(p => p.id === id);
        if (!product) return;

        if (qty > parseInt(product.quantity)) {
            alert('Cannot add more than available stock!');
            return;
        }

        // Check if already in bill
        const existingItem = currentBill.find(item => item.id === id);
        if (existingItem) {
            if (existingItem.qty + qty > parseInt(product.quantity)) {
                alert('Total quantity exceeds available stock!');
                return;
            }
            existingItem.qty += qty;
            existingItem.total = existingItem.qty * parseFloat(product.price);
        } else {
            currentBill.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                qty: qty,
                total: parseFloat(product.price) * qty
            });
        }

        // Reset search area
        productSearch.value = '';
        selectedProductCard.style.display = 'none';
        
        renderBill();
    });

    function renderBill() {
        billTableBody.innerHTML = '';
        if (currentBill.length === 0) {
            emptyBill.style.display = 'block';
            billSummaryBox.style.display = 'none';
            document.getElementById('billTable').style.display = 'none';
        } else {
            emptyBill.style.display = 'none';
            billSummaryBox.style.display = 'block';
            document.getElementById('billTable').style.display = 'table';
            
            let total = 0;
            currentBill.forEach((item, index) => {
                total += item.total;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight:500;">${item.name}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>${item.qty}</td>
                    <td>₹${item.total.toFixed(2)}</td>
                    <td><button class="btn btn-sm btn-danger no-print" onclick="removeItem(${index})">Remove</button></td>
                `;
                billTableBody.appendChild(tr);
            });
            billSubtotal.textContent = total.toFixed(2);
        }
    }

    window.removeItem = (index) => {
        currentBill.splice(index, 1);
        renderBill();
    };

    // Invoice Logic
    const generateBillBtn = document.getElementById('generateBillBtn');
    const invoiceModal = document.getElementById('invoiceModal');
    const closeInvoiceBtn = document.getElementById('closeInvoiceBtn');

    generateBillBtn.addEventListener('click', () => {
        if(currentBill.length === 0) return;

        // Reduce stock in localStorage
        currentBill.forEach(billItem => {
            const product = storeProducts.find(p => p.id === billItem.id);
            if (product) {
                product.quantity = parseInt(product.quantity) - billItem.qty;
            }
        });
        localStorage.setItem('storeProducts', JSON.stringify(storeProducts));

        // Let User know stock was adjusted
        console.log("Stock levels updated silently in localStorage.");

        // Populate Invoice details
        const invDateObj = new Date();
        const invNumber = 'INV-' + Math.floor(100000 + Math.random() * 900000);
        
        document.getElementById('invDate').textContent = invDateObj.toLocaleString('en-US');
        document.getElementById('invNumber').textContent = invNumber;
        document.getElementById('invCashier').textContent = username.charAt(0).toUpperCase() + username.slice(1);
        
        // Save to storeSales in localStorage
        let storeSales = JSON.parse(localStorage.getItem('storeSales')) || [];
        storeSales.push({
            billNumber: invNumber,
            date: invDateObj.toISOString(),
            totalAmount: parseFloat(billSubtotal.textContent),
            totalItems: currentBill.reduce((sum, item) => sum + item.qty, 0)
        });
        localStorage.setItem('storeSales', JSON.stringify(storeSales));

        const invItems = document.getElementById('invItems');
        invItems.innerHTML = '';
        currentBill.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
            `;
            invItems.appendChild(tr);
        });
        document.getElementById('invTotal').textContent = billSubtotal.textContent;

        // Show Invoice overlay
        invoiceModal.style.display = 'flex';
    });

    closeInvoiceBtn.addEventListener('click', () => {
        invoiceModal.style.display = 'none';
        currentBill = []; // Reset bill
        renderBill();
    });

});
