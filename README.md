# StoreMS - Food Ordering & Print Services

A modern web application for food ordering and print services with full-stack functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install frontend dependencies**
```bash
git clone <repository-url>
cd storems
npm install
```

2. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

### Running the Application

1. **Start the backend server** (Terminal 1)
```bash
npm run dev-backend
```
Backend runs on: `http://localhost:3001`

2. **Start the customer frontend** (Terminal 2)
```bash
npm run dev
```
Customer app runs on: `http://localhost:5173`

3. **Start the admin panel** (Terminal 3 - Optional)
```bash
npm run dev-admin
```
Admin panel runs on: `http://localhost:5174`

4. **Open your browser**
- Customer app: `http://localhost:5173`
- Admin panel: `http://localhost:5174`

## 👨‍💼 Admin Panel Features

### Admin Login
- **Email**: `bqueen@gmail.com`
- **Password**: `1234`

### Dashboard
- **Order Management**: View all customer orders with real-time updates
- **Status Updates**: Mark orders as "ready" for pickup
- **Revenue Tracking**: Total revenue and order statistics
- **Menu Management**: Add new food items to the menu

### Admin API Endpoints
```
GET  /api/orders          # Get all orders
POST /api/products        # Add new menu item
PUT  /api/orders/:id/status # Update order status
```

## 📋 Features

- 🍔 Food ordering system
- 🖨️ Print services
- 🔐 User authentication
- 📦 Order tracking
- 🛒 Shopping cart
- 💳 Checkout system
- 👨‍💼 Admin panel for order management
- 📊 Real-time dashboard
- ➕ Dynamic menu management

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Admin Panel**: Separate React app
- **Database**: In-memory storage