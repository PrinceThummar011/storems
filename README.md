### Installation & Setup

Follow these steps to set up the development environment.

1. **Clone the repository**

Replace `<repository-url>` with the actual URL of your Git repository.

```sh
git clone <repository-url>
cd storems
```

2. **Install dependencies**

This command will install all the required npm packages for the frontend.

```sh
npm install
```

3. **Set up the backend**

Navigate to the backend directory and install dependencies.

```sh
cd backend
npm install
cd ..
```

4. **Start the backend server**

This will run the backend API server.

```sh
npm run dev-backend
```

The backend will be available at `http://localhost:3001`.

5. **Start the frontend development server**

In a separate terminal, run the frontend.

```sh
npm run dev
```

6. **Open your browser**

Navigate to `http://localhost:5173` to view the application. The page will reload if you make edits.

## Backend API

The application includes a complete backend API with the following features:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with existing credentials

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product by ID

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details by ID
- `GET /api/orders/user/:userId` - Get all orders for a user
- `PUT /api/orders/:id/status` - Update order status

### Features
- User registration and authentication
- Product catalog management
- Order creation and tracking
- Real-time order status updates
- In-memory data storage (easily replaceable with a database)

## Technology Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: In-memory storage (ready for database integration)