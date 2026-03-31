require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-saas-storems';

// Middleware
app.use(cors());
app.use(express.json());
// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Redirect root to login.html if not already specified
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Initialize Database
const db = new sqlite3.Database('./saas_database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite Database.');
        initDatabase();
    }
});

// Database Schema
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS tenants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            store_name TEXT NOT NULL,
            owner_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            category TEXT,
            FOREIGN KEY (tenant_id) REFERENCES tenants (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id INTEGER NOT NULL,
            total REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES tenants (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sale_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            line_total REAL NOT NULL,
            FOREIGN KEY (sale_id) REFERENCES sales (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    `);

    // Insert a default demo user for offline ease of use
    bcrypt.hash('admin123', 10).then(hashedPassword => {
        db.run(`INSERT OR IGNORE INTO tenants (id, store_name, owner_name, email, password) VALUES (1, 'Offline Demo Store', 'Local Admin', 'admin', ?)`, [hashedPassword]);
    });

}

// Routes
// 1. Tenant/Shopkeeper Signup
app.post('/api/auth/signup', async (req, res) => {
    const { store_name, owner_name, email, password } = req.body;
    
    if (!store_name || !owner_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO tenants (store_name, owner_name, email, password) VALUES (?, ?, ?, ?)`;
        
        db.run(query, [store_name, owner_name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already exists!' });
                }
                return res.status(500).json({ error: 'Database error.' });
            }
            res.status(201).json({ message: 'Store registered successfully!', tenant_id: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error setup.' });
    }
});

// 2. Tenant/Shopkeeper Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM tenants WHERE email = ?`, [email], async (err, tenant) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!tenant) return res.status(400).json({ error: 'User not found.' });

        const validPassword = await bcrypt.compare(password, tenant.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password.' });

        const token = jwt.sign({ tenant_id: tenant.id, store_name: tenant.store_name }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ message: 'Login successful', token, store_name: tenant.store_name });
    });
});


// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Get Products
app.get('/api/products', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM products WHERE tenant_id = ?`, [req.user.tenant_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add Product
app.post('/api/products', authenticateToken, (req, res) => {
    const { name, price, stock, category } = req.body;
    db.run(`INSERT INTO products (tenant_id, name, price, stock, category) VALUES (?, ?, ?, ?, ?)`,
        [req.user.tenant_id, name, price, stock, category],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, price, stock, category });
        }
    );
});

// Delete Product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM products WHERE id = ? AND tenant_id = ?`, [req.params.id, req.user.tenant_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});


// Edit Product
app.put("/api/products/:id", authenticateToken, (req, res) => {
    const { name, price, stock, category } = req.body;
    db.run(`UPDATE products SET name = ?, price = ?, stock = ?, category = ? WHERE id = ? AND tenant_id = ?`,
        [name, price, stock, category, req.params.id, req.user.tenant_id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Updated" });
        }
    );
});

// Record Sale (with items) and decrement stock atomically
app.post('/api/sales', authenticateToken, (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items array is required.' });
    }

    // Compute total from payload to avoid trusting client-sent totals
    let grandTotal = 0;
    const normalizedItems = items.map((item) => {
        const qty = parseInt(item.quantity, 10) || 0;
        const price = parseFloat(item.price) || 0;
        grandTotal += qty * price;
        return {
            product_id: item.product_id || item.id,
            quantity: qty,
            price,
            line_total: qty * price
        };
    });

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(
            `INSERT INTO sales (tenant_id, total) VALUES (?, ?)`,
            [req.user.tenant_id, grandTotal],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Failed to create sale.' });
                }

                const saleId = this.lastID;
                const insertItemStmt = db.prepare(
                    `INSERT INTO sale_items (sale_id, product_id, quantity, price, line_total) VALUES (?, ?, ?, ?, ?)`
                );
                const updateStockStmt = db.prepare(
                    `UPDATE products SET stock = CASE WHEN stock - ? < 0 THEN 0 ELSE stock - ? END WHERE id = ? AND tenant_id = ?`
                );

                let hadError = false;

                normalizedItems.forEach((item) => {
                    insertItemStmt.run(
                        [saleId, item.product_id, item.quantity, item.price, item.line_total],
                        (err) => {
                            if (err) hadError = true;
                        }
                    );

                    updateStockStmt.run(
                        [item.quantity, item.quantity, item.product_id, req.user.tenant_id],
                        (err) => {
                            if (err) hadError = true;
                        }
                    );
                });

                insertItemStmt.finalize((err) => {
                    if (err) hadError = true;

                    updateStockStmt.finalize((err2) => {
                        if (err2) hadError = true;

                        if (hadError) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Failed to record sale items or update stock.' });
                        }

                        db.run('COMMIT', (commitErr) => {
                            if (commitErr) {
                                return res.status(500).json({ error: 'Failed to commit sale.' });
                            }
                            res.json({ saleId, total: grandTotal, message: 'Sale recorded successfully.' });
                        });
                    });
                });
            }
        );
    });
});

// Fetch sales list for tenant
app.get('/api/sales', authenticateToken, (req, res) => {
    const query = `
        SELECT s.id, s.total, s.created_at, COUNT(si.id) AS total_items
        FROM sales s
        LEFT JOIN sale_items si ON s.id = si.sale_id
        WHERE s.tenant_id = ?
        GROUP BY s.id
        ORDER BY s.created_at DESC
    `;

    db.all(query, [req.user.tenant_id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch sales.' });
        res.json(rows || []);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`SaaS Backend running directly at http://localhost:${PORT}`);
});
