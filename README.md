# StoreEase SaaS - Complete Multi-Tenant Store Management System 🏪

A **production-ready** Store Management SaaS Application where multiple shopkeepers can register, log in, and manage their separate store databases dynamically!

## 📋 Features
- **SaaS Architecture**: A multi-tenant system meaning multiple shop owners can create independent accounts and stores without seeing each other's data.
- **Node.js & SQLite Backend**: Real persistence. If you close the app and open it the next day, memory and stock data are saved locally to a `.sqlite` database.
- **Authentication**: JWT & BCrypt secure password hashing.
- **Dynamic Frontend**: Modern Vanilla JS/CSS communicating directly with REST APIs. 

## 🚀 Getting Started

Anyone can clone this project and immediately get the complete SaaS running in just one command!

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your computer.

### Start the SaaS

We have provided an automated script so you don't even need to configure a database or install dependencies manually.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/storems.git
   cd storems
   ```

2. Run the Auto-Start Script:
   ```bash
   ./start.sh
   # On Windows, you can just run: npm install && node server.js
   ```

3. Open your browser:
   Visit **`http://localhost:3000`**

### Usage Instructions
- **Step 1:** Go to the application and click **"Create a New Store Account"**
- **Step 2:** Register your store (e.g., Ramesh Grocery) with your email and password.
- **Step 3:** You'll be redirected to Login. Enter those exact credentials.
- **Step 4:** You're in! You can restart the terminal process or close your browser, and because of SQLite, your data is never lost!
