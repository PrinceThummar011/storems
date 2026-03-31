/**
 * Products Management
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    if(typeof initializeApp === 'function') initializeApp();

    const productForm = document.getElementById('productForm');
    const productsTableBody = document.querySelector('#productsTable tbody');
    const emptyState = document.getElementById('emptyState');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');

    let products = [];
    
    async function loadProductsFromDB() {
        try {
            const token = localStorage.getItem('storems_token');
            console.log("🔍 Attempting to load products...");
            console.log("📋 Token exists:", !!token);
            console.log("🔑 Token:", token ? token.substring(0, 30) + "..." : "NONE");
            
            if (!token) {
                console.error("❌ No token found! User not logged in.");
                if(typeof showErrorMessage === 'function') showErrorMessage('❌ Not logged in. Refresh the page and login again.');
                return;
            }
            
            console.log("⏳ Fetching from /api/products...");
            const res = await fetch('/api/products', {
                method: 'GET',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("📡 Response received. Status:", res.status, res.statusText);
            
            if (res.ok) {
                const data = await res.json();
                products = Array.isArray(data) ? data : [];
                console.log("✅ Products loaded successfully!");
                console.log("📊 Total products:", products.length);
                products.forEach((p, i) => {
                    console.log(`   ${i+1}. ${p.name} (ID: ${p.id}, Price: ${p.price}, Stock: ${p.stock})`);
                });
                renderProducts();
            } else {
                const errorText = await res.text();
                console.error("❌ Failed to load products");
                console.error("   Status:", res.status);
                console.error("   Response:", errorText.substring(0, 200));
                if(typeof showErrorMessage === 'function') showErrorMessage('❌ Error loading products. Status: ' + res.status);
            }
        } catch (e) { 
            console.error("❌ Network error fetching products:", e.message); 
            console.error("   Full error:", e);
            if(typeof showErrorMessage === 'function') showErrorMessage('❌ Network error: ' + e.message);
        }
    }
    
    console.log("⏳ Page loaded - Loading products...");
    loadProductsFromDB();

    function renderProducts() {
        try {
            console.log("🎨 Starting renderProducts()");
            console.log("📌 productsTableBody element:", productsTableBody);
            
            if (!productsTableBody) {
                console.error("❌ productsTableBody not found!");
                return;
            }
            
            productsTableBody.innerHTML = '';
            console.log("📊 Products to render:", products.length);
            
            if (products.length === 0) {
                console.log("⚠️ No products found - showing empty state");
                if(emptyState) emptyState.style.display = 'block';
                const tbl = document.getElementById('productsTable');
                if(tbl) tbl.style.display = 'none';
            } else {
                console.log("✅ Showing products table with", products.length, "items");
                if(emptyState) emptyState.style.display = 'none';
                const tbl = document.getElementById('productsTable');
                if(tbl) tbl.style.display = 'table';
                
                products.forEach((product, index) => {
                    console.log(`  📦 Rendering product ${index + 1}:`, product.name);
                    const priceDisp = typeof formatCurrency === 'function' ? formatCurrency(product.price) : '₹' + parseFloat(product.price).toFixed(2);
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${product.id}</td>
                        <td style="font-weight: 500;">${product.name}</td>
                        <td><span class="badge badge-light">${product.category}</span></td>
                        <td>${priceDisp}</td>
                        <td>${product.stock} Units</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editProduct('${product.id}')" style="margin-right: 5px;">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                        </td>
                    `;
                    productsTableBody.appendChild(tr);
                });
                console.log("✅ All products rendered successfully!");
            }
        } catch (error) {
            console.error('❌ Error rendering products:', error);
            if(typeof showErrorMessage === 'function') showErrorMessage('Error rendering products: ' + error.message);
        }
    }

    function resetForm() {
        if(productForm) productForm.reset();
        const pid = document.getElementById('productId');
        if(pid) pid.value = '';
        if(formTitle) formTitle.textContent = 'Add New Product';
        if(submitBtn) submitBtn.textContent = 'Save Product';
        if(cancelEditBtn) cancelEditBtn.style.display = 'none';
    }

    if(cancelEditBtn) {
        cancelEditBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm();
        });
    }

    if(productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                console.log("📝 Form submitted - adding product");
                
                const pidField = document.getElementById('productId');
                const nameT = document.getElementById('productName');
                const categoryT = document.getElementById('productCategory');
                const priceT = document.getElementById('productPrice');
                const quantityT = document.getElementById('productQuantity');
                
                const pid = pidField ? pidField.value : '';
                const name = nameT ? nameT.value.trim() : '';
                const category = categoryT ? categoryT.value.trim() : '';
                const price = parseFloat(priceT ? priceT.value : 0);
                const quantity = parseInt(quantityT ? quantityT.value : 0);
                
                console.log("📊 Form data:", { name, category, price, quantity });

                if (!name || !category || !price || !quantity) {
                    console.error("❌ Missing fields:", { name, category, price, quantity });
                    if(typeof showErrorMessage === 'function') showErrorMessage('❌ Please fill all fields');
                    return;
                }

                if (pid) {
                    // Update existing product
                    console.log("✏️ Updating product ID:", pid);
                    const res = await fetch('/api/products/' + pid, {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('storems_token') 
                        },
                        body: JSON.stringify({ name, category, price, stock: quantity })
                    });
                    console.log("📡 Update response status:", res.status);
                    
                    if (res.ok) {
                        console.log("✅ Product updated successfully");
                        if(typeof showSuccessMessage === 'function') showSuccessMessage('✅ Product updated successfully!');
                        resetForm();
                        loadProductsFromDB();
                    } else {
                        const errData = await res.text();
                        console.error("❌ Error updating:", errData);
                        if(typeof showErrorMessage === 'function') showErrorMessage('❌ Error updating product');
                    }
                } else {
                    // Add new product
                    console.log("➕ Adding new product");
                    const payload = { name, category, price, stock: quantity };
                    console.log("📤 Sending to API:", payload);
                    
                    const res = await fetch('/api/products', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('storems_token') 
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    console.log("📡 Add response status:", res.status);
                    
                    if (res.ok) {
                        const data = await res.json();
                        console.log("✅ Product added successfully:", data);
                        if(typeof showSuccessMessage === 'function') showSuccessMessage('✅ Product added successfully!');
                        resetForm();
                        await loadProductsFromDB();
                    } else {
                        const errData = await res.text();
                        console.error("❌ Error adding product:", res.status, errData);
                        if(typeof showErrorMessage === 'function') showErrorMessage('❌ Error: ' + (errData || 'Could not add product'));
                    }
                }
            } catch (error) {
                console.error('❌ Error in form submission:', error);
                if(typeof showErrorMessage === 'function') showErrorMessage('❌ Error: ' + error.message);
            }
        });
    }

    window.editProduct = (id) => {
        try {
            const product = products.find(p => p.id == id);
            if (product) {
                const pidField = document.getElementById('productId');
                const nameT = document.getElementById('productName');
                const categoryT = document.getElementById('productCategory');
                const priceT = document.getElementById('productPrice');
                const quantityT = document.getElementById('productQuantity');
                
                if (pidField) pidField.value = product.id;
                if (nameT) nameT.value = product.name;
                if (categoryT) categoryT.value = product.category;
                if (priceT) priceT.value = product.price;
                if (quantityT) quantityT.value = product.stock;
                
                if (formTitle) formTitle.textContent = 'Edit Product';
                if (submitBtn) submitBtn.textContent = 'Update Product';
                if (cancelEditBtn) cancelEditBtn.style.display = 'inline-block';
                
                const hdr = document.querySelector('.page-header');
                if(hdr) hdr.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch('/api/products/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('storems_token') }
                });
                if (res.ok) {
                    if(typeof showSuccessMessage === 'function') showSuccessMessage('Product deleted successfully!');
                    loadProductsFromDB();
                } else {
                    if(typeof showErrorMessage === 'function') showErrorMessage('Error deleting product');
                }
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
    };
});
