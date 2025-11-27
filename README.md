# Burger Queen - Fast Food Ordering System

A complete fast food ordering system with separate customer and admin interfaces.

## Project Structure

```
storems/
├── backend/          # Backend API server
├── src/              # Customer frontend (React app)
└── admin/            # Admin frontend (React app)
```

## How to Run

### 1. Install Dependencies

**Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

**Install customer frontend dependencies:**
```bash
npm install
```

**Install admin frontend dependencies:**
```bash
cd admin
npm install
cd ..
```

### 2. Start the Backend Server

From the root directory (`storems/`):
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Start the Customer Frontend

Open a **new terminal** and from the root directory:
```bash
npm run dev
```

The customer app will run on `http://localhost:5173`

### 4. Start the Admin Frontend

Open **another terminal** and:
```bash
cd admin
npm run dev
```

The admin app will run on `http://localhost:5174` (or next available port)

## Admin Login

- **Email:** `bqueen@gmail.com`
- **Password:** `1234`

## Features

- **Customer Side:** Browse menu, add to cart, place orders, track order status
- **Admin Side:** View all orders, mark orders as ready, add new menu items

## Notes

- Make sure the backend is running before starting the frontend apps
- All three servers need to run simultaneously for the full system to work
- Data is stored in-memory (will reset when backend restarts)
