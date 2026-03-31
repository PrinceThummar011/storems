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
        window.location.href = 'login.html';
    });

    const sidebar = document.getElementById('sidebar');
    document.getElementById('openMenuBtn').addEventListener('click', () => sidebar.classList.add('open'));
    document.getElementById('closeMenuBtn').addEventListener('click', () => sidebar.classList.remove('open'));


    // POST LOGIC / BILLING
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
    const loadingStatus = document.getElementById('loadingStatus');
    
    // Verify elements exist
    console.log("🔍 Checking if DOM elements exist:");
    console.log("   productSearch:", productSearch ? "✅" : "❌");
    console.log("   searchResults:", searchResults ? "✅" : "❌");
    console.log("   selectedProductCard:", selectedProductCard ? "✅" : "❌");
    console.log("   loadingStatus:", loadingStatus ? "✅" : "❌");
    
    // Add test button handler
    const testApiBtn = document.getElementById('testApiBtn');
    if (testApiBtn) {
        testApiBtn.addEventListener('click', async () => {
            console.log("🧪 TEST API CLICKED");
            const token = localStorage.getItem('storems_token');
            console.log("Token:", token ? token.substring(0, 30) + '...' : 'NO TOKEN');
            
            try {
                const res = await fetch('/api/products', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("API Response Status:", res.status);
                const data = await res.json();
                console.log("API Response Data:", data);
                alert('API Response: ' + (res.ok ? 'SUCCESS - ' + data.length + ' products' : 'FAILED - Status ' + res.status));
            } catch (e) {
                console.error("Test API Error:", e);
                alert('API Error: ' + e.message);
            }
        });
    }

    // Load products from API (real-time)
    let retryCount = 0;
    const MAX_RETRIES = 3;
    
    async function loadProducts() {
        try {
            if (loadingStatus) loadingStatus.style.display = 'block';
            
            const token = localStorage.getItem('storems_token');
            console.log("📦 Loading products for billing... (Attempt " + (retryCount + 1) + ")");
            console.log("🔑 Token exists:", token ? "YES (" + token.substring(0, 30) + "...)" : "NO");
            
            if (!token) {
                console.error("❌ NO TOKEN FOUND - Redirecting to login");
                setTimeout(() => window.location.href = 'login.html', 1000);
                return;
            }
            
            console.log("🚀 Sending fetch request to /api/products");
            const res = await fetch('/api/products', {
                method: 'GET',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'  // Prevent caching
            });
            
            console.log("📡 Response received - Status:", res.status);
            
            if (res.ok) {
                const data = await res.json();
                console.log("📥 API returned:", data.length, "products");
                
                storeProducts = data.map(p => ({
                    id: String(p.id),
                    name: p.name,
                    price: parseFloat(p.price),
                    quantity: parseInt(p.stock),
                    unit: p.unit || 'piece',
                    category: p.category
                }));
                
                console.log("✅ Products successfully loaded:", storeProducts.length, "items");
                console.log("📦 Products:", storeProducts);
                
                if (loadingStatus) loadingStatus.style.display = 'none';
                
                storeProducts.forEach((p, i) => {
                    console.log(`   ${i+1}. ${p.name} - ₹${p.price} (${p.quantity} available)`);
                });
                
                retryCount = 0; // Reset retry counter on success
            } else {
                const errorText = await res.text();
                console.error("❌ API Error - Status:", res.status);
                console.error("❌ Response:", errorText.substring(0, 200));
                
                // Retry on network error
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log("🔄 Retrying... (" + retryCount + "/" + MAX_RETRIES + ")");
                    setTimeout(() => loadProducts(), 1000);
                } else {
                    if (loadingStatus) {
                        loadingStatus.innerHTML = '❌ Failed to load products (Status ' + res.status + '). <button onclick="location.reload()" style="background:none; border:none; color:#3b82f6; text-decoration:underline; cursor:pointer; font-weight:600;">Retry</button>';
                        loadingStatus.style.color = '#ef4444';
                        loadingStatus.style.display = 'block';
                    }
                }
                
                if (res.status === 401 || res.status === 403) {
                    console.error("🔴 Authentication failed");
                    localStorage.removeItem('storems_token');
                    localStorage.removeItem('storems_loggedin');
                    setTimeout(() => window.location.href = 'login.html', 1000);
                }
            }
        } catch (e) {
            console.error("❌ FETCH ERROR:", e.message);
            
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                console.log("🔄 Retrying on network error... (" + retryCount + "/" + MAX_RETRIES + ")");
                setTimeout(() => loadProducts(), 1000);
            } else {
                if (loadingStatus) {
                    loadingStatus.innerHTML = '❌ Network error: ' + e.message + '. <button onclick="location.reload()" style="background:none; border:none; color:#3b82f6; text-decoration:underline; cursor:pointer; font-weight:600;">Retry</button>';
                    loadingStatus.style.color = '#ef4444';
                    loadingStatus.style.display = 'block';
                }
            }
        }
    }
    
    // Load products on page load
    console.log("⏳ New Sale page loaded - Loading products...");
    console.log("🔑 Current token:", localStorage.getItem('storems_token') ? localStorage.getItem('storems_token').substring(0, 20) + '...' : 'NONE');
    console.log("🔐 Auth status:", localStorage.getItem('storems_loggedin'));
    console.log("🔍 Calling loadProducts function now...");
    loadProducts();
    console.log("✅ loadProducts function called, waiting for response...");
    
    // If products don't load after 3 seconds, show error and offer retry
    setTimeout(() => {
        console.log("🔍 Products status after 3s:", {
            productsLoaded: storeProducts.length,
            firstProduct: storeProducts[0]
        });
        if (storeProducts.length === 0) {
            console.error("⚠️ CRITICAL: Products still not loaded after 3 seconds!");
            if (loadingStatus) {
                loadingStatus.innerHTML = '❌ Products failed to load. <button onclick="location.reload()" style="background:none; border:none; color:#3b82f6; text-decoration:underline; cursor:pointer; font-weight:600;">Click to Retry</button>';
                loadingStatus.style.display = 'block';
                loadingStatus.style.color = '#ef4444';
            }
        }
    }, 3000);

    // Search input listener
    productSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        console.log("🔍 Search query:", query);
        console.log("📦 Available products count:", storeProducts.length);
        console.log("📦 Available products:", storeProducts);
        
        searchResults.innerHTML = '';
        
        if (query === '') {
            console.log("⚪ Search cleared");
            searchResults.style.display = 'none';
            return;
        }
        
        if (storeProducts.length === 0) {
            console.warn("⚠️ No products loaded yet! storeProducts is empty");
            searchResults.style.display = 'block';
            searchResults.style.position = 'absolute';
            searchResults.style.zIndex = '1000';
            searchResults.innerHTML = `<li style="color:#ef4444; padding:15px; text-align:center; font-weight: 600;">
                ⏳ Loading products... Please wait or refresh the page.
                <br><br>
                <small style="color:#6b7280;">If products still don't load, check your connection and try logging in again.</small>
            </li>`;
            return;
        }
        
        const matches = storeProducts.filter(p => 
            p.name.toLowerCase().includes(query) || 
            String(p.id).includes(query)
        );
        
        console.log("✅ Matches found:", matches.length);
        matches.forEach(m => console.log(`   - ${m.name}`));
        
        if (matches.length > 0) {
            searchResults.style.display = 'block';
            searchResults.style.position = 'absolute';
            searchResults.style.zIndex = '1000';
            matches.forEach(product => {
                const li = document.createElement('li');
                li.style.cursor = 'pointer';
                li.style.padding = '10px';
                li.style.borderBottom = '1px solid #e5e7eb';
                li.style.transition = 'background-color 0.2s';
                li.textContent = `${product.name} (₹${product.price.toFixed(2)} | Stock: ${product.quantity})`;
                li.addEventListener('mouseover', () => li.style.backgroundColor = '#f3f4f6');
                li.addEventListener('mouseout', () => li.style.backgroundColor = 'transparent');
                li.addEventListener('click', () => {
                    console.log("✨ Selected product:", product.name);
                    selectProduct(product);
                });
                searchResults.appendChild(li);
            });
        } else {
            searchResults.style.display = 'block';
            searchResults.style.position = 'absolute';
            searchResults.style.zIndex = '1000';
            searchResults.innerHTML = '<li style="color:#6b7280; padding:10px; text-align:center;">❌ No products found for "' + query + '"</li>';
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== productSearch && e.target !== searchResults) {
            searchResults.style.display = 'none';
        }
    });

    function selectProduct(product) {
        console.log("🎯 selectProduct called with:", product);
        
        productSearch.value = product.name;
        searchResults.style.display = 'none';
        
        spId.value = product.id;
        spName.textContent = product.name;
        spPrice.textContent = parseFloat(product.price).toFixed(2);
        spStock.textContent = product.quantity;
        spUnit.textContent = product.unit;
        
        spQuantity.max = product.quantity;
        spQuantity.value = 1;
        
        console.log("✅ Product selected and displayed");
        selectedProductCard.style.display = 'block';
        console.log("📋 Product details displayed - Ready to add to bill");
    }

    addToBillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("📝 Add to Bill form submitted");
        
        const id = spId.value;
        const qty = parseInt(spQuantity.value);
        
        console.log("🛒 Adding to bill:", { id, qty });
        
        const product = storeProducts.find(p => String(p.id) === String(id));
        console.log("🔍 Product found:", product);
        
        if (!product) {
            console.error("❌ Product not found in storeProducts!");
            alert('Product not found!');
            return;
        }

        if (qty > parseInt(product.quantity)) {
            console.error("❌ Quantity exceeds stock!");
            alert('Cannot add more than available stock!');
            return;
        }

        // Check if already in bill
        const existingItem = currentBill.find(item => String(item.id) === String(id));
        if (existingItem) {
            console.log("📦 Product already in bill, updating quantity");
            if (existingItem.qty + qty > parseInt(product.quantity)) {
                alert('Total quantity exceeds available stock!');
                return;
            }
            existingItem.qty += qty;
            existingItem.total = existingItem.qty * parseFloat(product.price);
        } else {
            console.log("✨ Adding new product to bill");
            currentBill.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                qty: qty,
                total: parseFloat(product.price) * qty
            });
        }

        console.log("✅ Current bill:", currentBill);
        console.log("📊 Total items in bill:", currentBill.length);

        // Reset search area
        productSearch.value = '';
        selectedProductCard.style.display = 'none';
        spQuantity.value = 1;
        
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
