document.addEventListener('DOMContentLoaded', () => {
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
    const today = new Date();
    document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('storems_token');
        localStorage.removeItem('storems_loggedin');
        window.location.href = 'login.html';
    });

    const sidebar = document.getElementById('sidebar');
    document.getElementById('openMenuBtn').addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeMenuBtn').addEventListener('click', () => sidebar.classList.remove('open'));

    // POS LOGIC
    let storeProducts = [];
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
    const billTable = document.getElementById('billTable');
    const generateBillBtn = document.getElementById('generateBillBtn');
    const invoiceModal = document.getElementById('invoiceModal');

    // Load products from API
    async function loadProducts() {
        try {
            const token = localStorage.getItem('storems_token');
            console.log("Loading products...", token ? "Token OK" : "NO TOKEN");
            const res = await fetch('/api/products', {
                method: 'GET',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log("Products loaded:", data.length);
                storeProducts = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: parseFloat(p.price),
                    quantity: parseInt(p.stock),
                    unit: p.unit || 'piece'
                }));
                console.log("storeProducts:", storeProducts);
            } else {
                console.error("API Error:", res.status);
            }
        } catch (e) {
            console.error("Error loading products:", e);
        }
    }
    
    // Load products on page load - wait for it to complete
    loadProducts().then(() => {
        console.log("Products ready for search");
    });

    // Search handler
    productSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        console.log("Search query:", query, "Products available:", storeProducts.length);
        searchResults.innerHTML = '';
        
        if (query === '') {
            searchResults.style.display = 'none';
            return;
        }
        
        const matches = storeProducts.filter(p => 
            p.name.toLowerCase().includes(query)
        );
        
        console.log("Matches found:", matches.length);
        
        if (matches.length > 0) {
            searchResults.style.display = 'block';
            matches.forEach(product => {
                const li = document.createElement('li');
                li.style.padding = '10px';
                li.style.cursor = 'pointer';
                li.style.borderBottom = '1px solid #e5e7eb';

                li.textContent = `${product.name} - ₹${product.price.toFixed(2)} (Stock: ${product.quantity})`;
                li.addEventListener('click', () => {
                    productSearch.value = product.name;
                    searchResults.style.display = 'none';
                    selectProduct(product);
                });
                li.addEventListener('mouseover', () => li.style.backgroundColor = '#f3f4f6');
                li.addEventListener('mouseout', () => li.style.backgroundColor = 'transparent');
                searchResults.appendChild(li);
            });
        }
    });

    // Close search on outside click
    document.addEventListener('click', (e) => {
        if (e.target !== productSearch) {
            searchResults.style.display = 'none';
        }
    });

    // Select product
    function selectProduct(product) {
        spId.value = product.id;
        spName.textContent = product.name;
        spPrice.textContent = product.price.toFixed(2);
        spStock.textContent = product.quantity;
        spUnit.textContent = product.unit;
        spQuantity.max = product.quantity;
        spQuantity.value = 1;
        selectedProductCard.style.display = 'block';
    }

    // Add to bill
    addToBillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = spId.value;
        const qty = parseInt(spQuantity.value);
        const product = storeProducts.find(p => p.id == id);
        
        if (product && qty > 0 && qty <= product.quantity) {
            currentBill.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: qty,
                total: product.price * qty
            });
            renderBill();
            selectedProductCard.style.display = 'none';
            productSearch.value = '';
        }
    });

    // Render bill
    function renderBill() {
        billTableBody.innerHTML = '';
        
        if (currentBill.length === 0) {
            emptyBill.style.display = 'block';
            billTable.style.display = 'none';
            billSummaryBox.style.display = 'none';
            return;
        }
        
        emptyBill.style.display = 'none';
        billTable.style.display = 'table';
        billSummaryBox.style.display = 'block';
        
        let subtotal = 0;
        currentBill.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>₹${item.total.toFixed(2)}</td>
                <td><button onclick="removeBillItem(${index})" style="background:#ef4444; color:white; padding:4px 8px; border:none; border-radius:4px; cursor:pointer;">Remove</button></td>
            `;
            billTableBody.appendChild(row);
            subtotal += item.total;
        });
        
        billSubtotal.textContent = subtotal.toFixed(2);
    }

    // Remove bill item
    window.removeBillItem = (index) => {
        currentBill.splice(index, 1);
        renderBill();
    };

    // Generate invoice
    generateBillBtn.addEventListener('click', () => {
        const invDate = document.getElementById('invDate');
        const invNumber = document.getElementById('invNumber');
        const invCashier = document.getElementById('invCashier');
        const invItems = document.getElementById('invItems');
        const invTotal = document.getElementById('invTotal');
        
        invDate.textContent = new Date().toLocaleDateString();
        invNumber.textContent = 'INV-' + Date.now();
        invCashier.textContent = localStorage.getItem('storems_username') || 'Admin';
        
        invItems.innerHTML = '';
        let total = 0;
        currentBill.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
            `;
            invItems.appendChild(tr);
            total += item.total;
        });
        
        invTotal.textContent = total.toFixed(2);
        invoiceModal.style.display = 'flex';
    });

    // Close invoice
    const closeInvoiceBtn = document.getElementById('closeInvoiceBtn');
    if (closeInvoiceBtn) {
        closeInvoiceBtn.addEventListener('click', () => {
            invoiceModal.style.display = 'none';
            currentBill = [];
            renderBill();
            productSearch.value = '';
        });
    }

    // Close modal on background click
    invoiceModal.addEventListener('click', (e) => {
        if (e.target === invoiceModal) {
            invoiceModal.style.display = 'none';
        }
    });
});
