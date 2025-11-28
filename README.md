### Installation & Setup

Follow these steps to set up the development environment.

1. **Clone the repository**

Replace `<repository-url>` with the actual URL of your Git repository.

```sh
git clone <repository-url>
cd storems
```

**Important: Configure Git for GitHub contributions**

Before making any commits, ensure your Git configuration uses a valid email address that is verified on your GitHub account. This is required for your contributions to appear on your GitHub profile.

```sh
# Set your Git username
git config user.name "YourGitHubUsername"

# Set your Git email (use an email verified on your GitHub account)
# Option 1: Use your personal email that's verified on GitHub
git config user.email "your-email@example.com"

# Option 2: Use GitHub's noreply email (found in GitHub Settings > Emails)
git config user.email "your-username@users.noreply.github.com"
```

To verify your configuration:
```sh
git config user.name
git config user.email
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

## Troubleshooting

### GitHub Contributions Not Showing

If your commits are not appearing on your GitHub contribution graph, check the following:

1. **Verify your Git email is valid and linked to GitHub**
   
   Your Git email must be a valid email format (e.g., `user@example.com`) and must be verified on your GitHub account.
   
   ```sh
   # Check your current Git email
   git config user.email
   ```
   
   If the email is not valid (e.g., just a username without @domain), fix it with:
   ```sh
   git config user.email "your-verified-email@example.com"
   ```

2. **Verify the email is added to your GitHub account**
   
   Go to GitHub Settings > Emails and ensure the email you're using for commits is listed and verified.

3. **Use GitHub's noreply email for privacy**
   
   If you want to keep your email private, use GitHub's noreply email:
   ```sh
   git config user.email "ID+YourUsername@users.noreply.github.com"
   ```
   Replace `ID` with your GitHub user ID and `YourUsername` with your GitHub username. Find your noreply email in GitHub Settings > Emails (it will look like `12345678+username@users.noreply.github.com`).

4. **Fix existing commits (optional)**
   
   If you have commits with an incorrect email, you can amend the most recent commit:
   ```sh
   git commit --amend --reset-author
   ```
   
   **Note**: This changes the commit history. Only do this if you haven't pushed or are okay with force-pushing.