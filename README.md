# StoreEase - Store Management System 🏪

A **professional-grade, production-ready** Store Management System built with vanilla **HTML5, CSS3, and JavaScript** (no backend required). Perfect for small to medium retail businesses.

## 📋 Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technical Stack](#technical-stack)
- [Development](#development)
- [Deployment](#deployment)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## ✨ Features

### Core Features
- **🔐 Secure Login** — username/password authentication (admin / admin123)
- **📊 Dashboard** — Real-time summary cards with sales, revenue, products count, and low stock alerts
- **📦 Products Management** — Add, edit, delete products with categories, pricing, and inventory tracking
- **💳 Billing & POS** — Lightning-fast search, add-to-bill functionality, and printable invoices
- **🏭 Stock Management** — Color-coded inventory levels (Critical/Warning/Adequate) with CSV export
- **📈 Sales Reports** — Complete sales history with Chart.js visualization for last 7 days
- **📱 Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices
- **📴 Offline-First** — All data stored in browser's localStorage - works without internet

### Data Persistence
- All data stored securely in browser's localStorage
- No external server or database required
- Automatic data synchronization across tabs
- Option to export/backup data as CSV

## 📁 Project Structure

```
storems/
├── index.html                 # Landing page & login
├── dashboard.html             # Main dashboard
├── products.html              # Product management
├── new-sale.html              # Billing & POS
├── stock.html                 # Inventory management
├── reports.html               # Sales analytics
│
├── js/                        # JavaScript files
│   ├── utils.js               # Shared utilities & functions
│   ├── landing.js             # Landing page logic
│   ├── dashboard.js           # Dashboard functionality
│   ├── products.js            # Products management
│   ├── new-sale.js            # Billing logic
│   ├── stock.js               # Stock management
│   └── reports.js             # Reports & analytics
│
├── css/                       # Stylesheets
│   ├── landing.css            # Landing page styles
│   └── style.css              # App styles
│
├── assets/                    # Images, icons, etc
│
├── package.json               # Dependencies & scripts
├── .eslintrc.json             # ESLint configuration
├── .prettierrc.json           # Code formatter config
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required
- No database installation needed
- Optional: Node.js (for development tools)

### Quick Start

#### Option 1: Direct Browser Access
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

#### Option 2: Local Server (Recommended for Development)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if installed)
npx http-server

# Then visit: http://localhost:8000
```

#### Option 3: Using npm Scripts
```bash
# Install dependencies (optional, for development)
npm install

# Start development server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

## 💡 Usage

### First-Time Setup
1. **Add Products** - Navigate to Products → Add New Product
2. **Configure Inventory** - Set quantities and prices
3. **Create Sales** - Go to New Sale → Search products → Generate bills

### Daily Operations
- **Dashboard** - Monitor today's sales, revenue, and stock levels
- **Billing** - Fast product search and bill generation
- **Stock Checking** - View low-stock alerts and manage inventory
- **Reports** - Analyze sales trends and revenue

### Data Management
- All data auto-saves to localStorage
- Export stock data as CSV from Stock Management page
- Data persists across browser sessions and tabs
- Clear data via browser developer tools if needed

## 🛠️ Technical Stack

### Frontend
- **HTML5** - Semantic markup & forms
- **CSS3** - Flexbox, Grid, CSS Variables, Responsive Design
- **Vanilla JavaScript** - ES6+, no frameworks/libraries
- **Chart.js 4.4** - For sales analytics charts

### Data Storage
- **Browser localStorage** - Client-side data persistence
- **JSON** - Data serialization format

### Development Tools
- **ESLint** - Code quality & consistency
- **Prettier** - Code formatting
- **Git** - Version control

## 👨‍💻 Development

### Code Quality Standards

#### ESLint Rules
- 4-space indentation
- Single quotes for strings
- Semicolon enforcement
- No unused variables (warnings)
- Strict equality (===, !==)
- Consistent code style

#### File Organization
- One responsibility per file
- Shared utilities in `js/utils.js`
- Clear naming conventions
- JSDoc comments for functions
- No inline styles in HTML

#### Best Practices
✅ Always use `utils.js` functions:
```javascript
// Initialize app in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp(); // Handles auth, header, mobile menu
    // Your page-specific code
});

// Use utility functions
const products = getLocalData('storeProducts', []);
saveLocalData('storeProducts', updatedProducts);
showSuccessMessage('Product added!');
showErrorMessage('Invalid input!');
```

✅ Error handling:
```javascript
try {
    // Your code
} catch (error) {
    console.error('Operation failed:', error);
    showErrorMessage('Something went wrong');
}
```

✅ Validation:
```javascript
if (!validatePrice(price)) {
    showErrorMessage('Invalid price');
    return;
}

if (!validateQuantity(quantity)) {
    showErrorMessage('Invalid quantity');
    return;
}
```

### Making Changes

1. **Setup Environment**
```bash
# Install dev dependencies
npm install
```

2. **Make Changes**
```bash
# Edit files in js/ or css/
vim js/utils.js
```

3. **Check Quality**
```bash
# Lint JavaScript
npm run lint

# Format code
npm run format
```

4. **Test Changes**
- Test in browser at http://localhost:8000
- Verify all features work
- Test on mobile (Chrome DevTools)

5. **Commit Changes**
```bash
git add .
git commit -m "feat: Add new feature"
git push origin main
```

## 📦 Deployment

### Static Hosting (Recommended)
Perfect for static hosting platforms:
- **GitHub Pages** - Free, easy to set up
- **Netlify** - Automatic deployments
- **Vercel** - Excellent performance
- **AWS S3 + CloudFront** - Enterprise-grade
- **Firebase Hosting** - Google's solution

### GitHub Pages Deployment
```bash
# Create gh-pages branch
git checkout -b gh-pages

# Push to GitHub Pages
git push origin gh-pages

# Enable Pages in repository settings
# Your app will be at: https://username.github.io/storems/
```

### Self-Hosted (VPS/Dedicated Server)
```bash
# Copy files to web server
scp -r storems/ user@server:/var/www/

# Configure web server (Nginx example)
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/storems;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📚 API Reference

### Utils.js Functions

#### Authentication & Setup
```javascript
checkAuth()                    // Check if user logged in
initializeApp()               // Initialize all common functions
initializeHeader()            // Setup username & date
initializeLogout()            // Setup logout button
initializeMobileMenu()        // Setup mobile menu
```

#### Data Management
```javascript
getLocalData(key, defaultValue)     // Get from localStorage
saveLocalData(key, value)           // Save to localStorage
clearAllAppData()                   // Clear all app data
```

#### Validation
```javascript
validatePrice(price)          // Validate price
validateQuantity(quantity)    // Validate quantity
```

#### Formatting
```javascript
formatCurrency(amount)        // Format as currency
formatDate(date)              // Format date
generateUniqueId(prefix)      // Generate unique ID
```

#### User Feedback
```javascript
showSuccessMessage(message, duration)    // Show success toast
showErrorMessage(message, duration)      // Show error toast
```

## 🔒 Security Considerations

### Current Implementation
- Credentials stored in code (for demo)
- All data in browser localStorage (client-side only)
- No external API calls
- No sensitive data transmission

### Production Recommendations
When deploying to production:
1. **Add Backend Authentication**
   - Implement proper user authentication
   - Use secure password hashing (bcrypt, Argon2)
   - Implement JWT tokens

2. **Database**
   - Move from localStorage to server database
   - Use PostgreSQL, MongoDB, or Firebase

3. **HTTPS**
   - Use SSL/TLS certificates
   - Force HTTPS connections

4. **Security Headers**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Content-Security-Policy headers

5. **Input Validation**
   - Server-side validation (not just client-side)
   - Sanitize all user inputs
   - Prevent SQL injection & XSS attacks

## 📝 Code Examples

### Adding a New Feature

**1. Create HTML (new-sale.html)**
```html
<div id="myFeature" class="content-card">
    <h2>Feature Name</h2>
    <form id="myForm">
        <div class="input-group">
            <label for="myInput">Label</label>
            <input type="text" id="myInput" required>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</div>
```

**2. Add JavaScript (js/new-sale.js)**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    const form = document.getElementById('myForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        try {
            const input = document.getElementById('myInput').value;
            
            if (!input) {
                showErrorMessage('Please fill all fields');
                return;
            }
            
            // Process data
            let data = getLocalData('myData', []);
            data.push({ id: generateUniqueId(), value: input });
            saveLocalData('myData', data);
            
            showSuccessMessage('Data saved successfully!');
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('An error occurred');
        }
    });
});
```

### Adding Validation

```javascript
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
}
```

## 🐛 Troubleshooting

### Data Not Persisting
- Check if localStorage is enabled in browser
- Clear browser cache and try again
- Check browser console for errors (F12 → Console)

### Styles Not Loading
- Verify CSS file paths are correct
- Clear browser cache (Ctrl+Shift+Del)
- Check Network tab in DevTools for 404 errors

### Login Not Working
- Verify credentials (admin / admin123)
- Check browser console for JavaScript errors
- Ensure localStorage is not full

### Mobile Layout Issues
- Check viewport meta tag is present
- Test with different devices using DevTools
- Ensure CSS media queries are applied

### Performance Issues
- Clear localStorage data if too much
- Check for localStorage quota errors
- Reduce number of items in tables
- Optimize Chart.js rendering

### Common Errors & Solutions
```
localStorage is not defined
→ Browser doesn't support localStorage (use older browser)

Uncaught TypeError: Cannot read property 'value'
→ Element ID doesn't exist, check HTML IDs match JavaScript

CORS Error
→ Use local server, not file:// protocol

Charts not rendering
→ Chart.js library not loaded, check CDN URL
```

## 📈 Future Enhancements

- [ ] Backend API integration (Node.js/Express)
- [ ] Multi-user support with role-based access
- [ ] Cloud synchronization (Firebase/AWS)
- [ ] Advanced reporting & analytics
- [ ] Barcode scanning support
- [ ] Multi-currency support
- [ ] Invoice email delivery
- [ ] Mobile app (React Native/Flutter)
- [ ] Dark mode
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 👤 Author

StoreEase - Built for shop owners, by developers

## 📞 Support

For issues, questions, or suggestions:
- Check the Troubleshooting section
- Review code comments and documentation
- Check browser console for error messages

---

**Last Updated:** March 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
