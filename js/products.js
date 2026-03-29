/**
 * Products Management
 * Add, edit, delete, and manage store products
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    initializeApp();

    // DOM Elements
    const productForm = document.getElementById('productForm');
    const productsTableBody = document.querySelector('#productsTable tbody');
    const emptyState = document.getElementById('emptyState');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');

    // Get products from localStorage
    let products = getLocalData('storeProducts', []);

    /**
     * Render products table
     */
    function renderProducts() {
        try {
            productsTableBody.innerHTML = '';
            if (products.length === 0) {
                emptyState.style.display = 'block';
                document.getElementById('productsTable').style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                document.getElementById('productsTable').style.display = 'table';
                products.forEach((product) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${product.id}</td>
                        <td style="font-weight: 500;">${product.name}</td>
                        <td><span class="badge badge-light">${product.category}</span></td>
                        <td>${formatCurrency(product.price)}</td>
                        <td>${product.quantity} ${product.unit}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editProduct('${product.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                        </td>
                    `;
                    productsTableBody.appendChild(tr);
                });
            }
        } catch (error) {
            console.error('Error rendering products:', error);
            showErrorMessage('Error loading products');
        }
    }

    /**
     * Reset form to initial state
     */
    function resetForm() {
        productForm.reset();
        document.getElementById('productId').value = '';
        formTitle.textContent = 'Add New Product';
        submitBtn.textContent = 'Save Product';
        cancelEditBtn.style.display = 'none';
    }

    // Save product (Add or Update)
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            const productIdField = document.getElementById('productId').value;
            const name = document.getElementById('productName').value.trim();
            const category = document.getElementById('productCategory').value.trim();
            const price = document.getElementById('productPrice').value;
            const quantity = document.getElementById('productQuantity').value;
            const unit = document.getElementById('productUnit').value;

            // Validation
            if (!name || !category || !price || !quantity || !unit) {
                showErrorMessage('Please fill all fields');
                return;
            }

            if (!validatePrice(price)) {
                showErrorMessage('Invalid price');
                return;
            }

            if (!validateQuantity(quantity)) {
                showErrorMessage('Invalid quantity');
                return;
            }

            const newProduct = {
                id: productIdField ? productIdField : generateUniqueId('PRD'),
                name: name,
                category: category,
                price: price,
                quantity: quantity,
                unit: unit,
            };

            if (productIdField) {
                // Update existing product
                const index = products.findIndex(p => p.id === productIdField);
                if (index !== -1) {
                    products[index] = newProduct;
                    showSuccessMessage('Product updated successfully!');
                }
            } else {
                // Add new product
                products.push(newProduct);
                showSuccessMessage('Product added successfully!');
            }

            // Save to localStorage
            saveLocalData('storeProducts', products);

            // Reset and re-render
            resetForm();
            renderProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            showErrorMessage('An error occurred while saving product');
        }
    });

    /**
     * Edit product
     * @param {string} id - Product ID
     */
    window.editProduct = (id) => {
        try {
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

                document.querySelector('.page-header').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error editing product:', error);
            showErrorMessage('Error loading product for editing');
        }
    };

    /**
     * Delete product
     * @param {string} id - Product ID
     */
    window.deleteProduct = (id) => {
        try {
            if (confirm('Are you sure you want to delete this product?')) {
                products = products.filter(p => p.id !== id);
                saveLocalData('storeProducts', products);
                renderProducts();
                showSuccessMessage('Product deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showErrorMessage('Error deleting product');
        }
    };

    // Cancel edit button
    cancelEditBtn.addEventListener('click', resetForm);

    // Initial render
    renderProducts();
});
