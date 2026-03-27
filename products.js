document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Header logic (Username, Date, Mobile Menu, Logout)
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

    // Products Management Logic
    const productForm = document.getElementById('productForm');
    const productsTableBody = document.querySelector('#productsTable tbody');
    const emptyState = document.getElementById('emptyState');
    const successAlert = document.getElementById('successAlert');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');

    // Retrieve from localStorage or initialize empty array
    let products = JSON.parse(localStorage.getItem('storeProducts')) || [];

    // Render table
    function renderProducts() {
        productsTableBody.innerHTML = '';
        if (products.length === 0) {
            emptyState.style.display = 'block';
            document.getElementById('productsTable').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            document.getElementById('productsTable').style.display = 'table';
            products.forEach((product, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.id}</td>
                    <td style="font-weight: 500;">${product.name}</td>
                    <td><span style="background:var(--bg-light); padding:4px 8px; border-radius:4px; font-size:12px; font-weight:500;">${product.category}</span></td>
                    <td>₹${parseFloat(product.price).toFixed(2)}</td>
                    <td>${product.quantity} ${product.unit}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary mx-1" style="margin-right: 4px;" onclick="editProduct('${product.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                    </td>
                `;
                productsTableBody.appendChild(tr);
            });
        }
    }

    // Show success message
    function showSuccess(message) {
        successAlert.textContent = message;
        successAlert.style.display = 'block';
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 3000);
    }

    // Save product (Add or Update)
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productIdField = document.getElementById('productId').value;
        const newProduct = {
            id: productIdField ? productIdField : 'PRD-' + Math.floor(1000 + Math.random() * 9000).toString(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: document.getElementById('productPrice').value,
            quantity: document.getElementById('productQuantity').value,
            unit: document.getElementById('productUnit').value,
        };

        if (productIdField) {
            // Update an existing product
            const index = products.findIndex(p => p.id === productIdField);
            if(index !== -1) products[index] = newProduct;
            showSuccess('Product updated successfully!');
        } else {
            // Add a new product
            products.push(newProduct);
            showSuccess('Product added successfully!');
        }

        // Save to localStorage
        localStorage.setItem('storeProducts', JSON.stringify(products));
        
        // Reset the form UI and re-render the table
        resetForm();
        renderProducts();
    });

    // Make editProduct globally available for onclick inside innerHTML
    window.editProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productUnit').value = product.unit;

            formTitle.textContent = 'Edit Product';
            submitBtn.textContent = 'Update Product';
            cancelEditBtn.style.display = 'inline-block';
            
            // Scroll neatly up to the form area
            document.querySelector('.page-header').scrollIntoView({ behavior: 'smooth' });
        }
    };

    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        productForm.reset();
        document.getElementById('productId').value = '';
        formTitle.textContent = 'Add New Product';
        submitBtn.textContent = 'Save Product';
        cancelEditBtn.style.display = 'none';
    }

    // Make deleteProduct globally available
    window.deleteProduct = (id) => {
        if(confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem('storeProducts', JSON.stringify(products));
            renderProducts();
        }
    };

    // Initial render call
    renderProducts();
});
