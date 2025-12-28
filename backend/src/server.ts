import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Data models
interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this would be hashed
  createdAt: string;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[]; // CartItem[]
  printOrders: any[]; // PrintOrder[]
  subtotal: number;
  tax: number;
  total: number;
  status: 'new' | 'in_progress' | 'ready' | 'completed';
  orderDate: string;
  paymentStatus: 'pending' | 'paid';
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

// In-memory storage (in production, use a database)
const users: User[] = [];
const orders: Order[] = [];

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Sample products data (in a real app, this would come from a database)
const products = [
  {
    id: 'p1',
    name: 'Veggie Burger',
    description: 'Delicious plant-based patty with fresh vegetables and special sauce',
    price: 249,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 50,
    category: 'Burgers'
  },
  {
    id: 'p2',
    name: 'Paneer Burger',
    description: 'Grilled paneer patty with cheese and vegetables',
    price: 279,
    image: 'https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 30,
    category: 'Burgers'
  },
  {
    id: 'p3',
    name: 'Mushroom Burger',
    description: 'Crispy mushroom patty with mayo and fresh lettuce',
    price: 269,
    image: 'https://images.pexels.com/photos/15832879/pexels-photo-15832879.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 25,
    category: 'Burgers'
  },
  {
    id: 'p4',
    name: 'Coca Cola',
    description: 'Chilled Coca Cola 500ml',
    price: 60,
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 100,
    category: 'Beverages'
  },
  {
    id: 'p5',
    name: 'French Fries',
    description: 'Crispy golden french fries with seasoning',
    price: 99,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 80,
    category: 'Sides'
  },
  {
    id: 'p6',
    name: 'Pepsi',
    description: 'Chilled Pepsi 500ml',
    price: 60,
    image: 'https://images.pexels.com/photos/8166287/pexels-photo-8166287.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 100,
    category: 'Beverages'
  },
  {
    id: 'p7',
    name: 'Paneer Tikka',
    description: '6 pieces spicy grilled paneer tikka',
    price: 229,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 45,
    category: 'Sides'
  },
  {
    id: 'p8',
    name: 'Veggie Pizza',
    description: 'Fresh vegetables with cheese on crispy crust',
    price: 399,
    image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 35,
    category: 'Pizza'
  },
  {
    id: 'p9',
    name: 'Orange Juice',
    description: 'Fresh squeezed orange juice 300ml',
    price: 80,
    image: 'https://images.pexels.com/photos/1546163/pexels-photo-1546163.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 60,
    category: 'Beverages'
  },
  {
    id: 'p10',
    name: 'Veg Nuggets',
    description: '10 pieces crispy vegetable nuggets',
    price: 159,
    image: 'https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 70,
    category: 'Sides'
  },
  {
    id: 'p11',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce with mozzarella cheese',
    price: 349,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 40,
    category: 'Pizza'
  },
  {
    id: 'p12',
    name: 'Iced Coffee',
    description: 'Cold brew coffee with ice 400ml',
    price: 120,
    image: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=400',
    stock: 50,
    category: 'Beverages'
  }
];

// API endpoints
// Authentication endpoints
app.post('/api/auth/register', (req: Request, res: Response) => {
  console.log('POST /api/auth/register - Request received');
  const { email, password, name } = req.body;
  console.log('Request body:', { email, password: password ? '***' : undefined, name });

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    password, // In production, hash this password
    createdAt: new Date().toISOString()
  };

  users.push(user);
  console.log('User registered:', user.email);

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  console.log('User logged in:', user.email);
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  });
});

// Products endpoints
app.get('/api/products', (req: Request, res: Response) => {
  console.log('GET /api/products - Returning products');
  res.json(products);
});

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the URL where the image can be accessed
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    console.log('Image uploaded:', imageUrl);
    
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

app.post('/api/products', (req: Request, res: Response) => {
  const { name, description, price, image, stock, category } = req.body;

  if (!name || !description || !price || !image || !stock || !category) {
    return res.status(400).json({ message: 'All product fields are required' });
  }

  const newProduct: Product = {
    id: `p${Date.now()}`,
    name,
    description,
    price: Number(price),
    image,
    stock: Number(stock),
    category
  };

  products.push(newProduct);
  console.log('Product added:', newProduct.name);

  res.status(201).json(newProduct);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Order endpoints
app.get('/api/orders', (req: Request, res: Response) => {
  console.log('GET /api/orders - Returning all orders');
  res.json(orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { userId, customerName, customerEmail, customerPhone, items, printOrders, subtotal, tax, total } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !items) {
    return res.status(400).json({ message: 'Missing required order information' });
  }

  const order: Order = {
    id: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    userId: userId || null,
    customerName,
    customerEmail,
    customerPhone,
    items,
    printOrders: printOrders || [],
    subtotal,
    tax,
    total,
    status: 'new',
    orderDate: new Date().toISOString(),
    paymentStatus: 'pending'
  };

  orders.push(order);
  console.log('Order created:', order.id);

  res.status(201).json(order);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const order = orders.find(o => o.id === id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

app.get('/api/orders/user/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userOrders = orders.filter(o => o.userId === userId);
  res.json(userOrders);
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const id = req.params.id;
  const { status } = req.body;

  const validStatuses = ['new', 'in_progress', 'ready', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  orders[orderIndex].status = status;
  console.log('Order status updated:', id, '->', status);

  res.json(orders[orderIndex]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});