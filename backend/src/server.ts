import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err: any) => console.error('MongoDB connection error:', err));

// Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }, // Not hashed for testing context
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: { type: Array, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['new', 'in_progress', 'ready', 'completed'], default: 'new' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Initial Database Seeding (So you don't lose the dummy products)
const seedDatabase = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const starterProducts = [
      { name: 'Veggie Burger', description: 'Delicious plant-based patty', price: 249, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 50, category: 'Burgers' },
      { name: 'Paneer Burger', description: 'Grilled paneer patty with cheese', price: 279, image: 'https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 30, category: 'Burgers' },
      { name: 'Coca Cola', description: 'Chilled Coca Cola 500ml', price: 60, image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 100, category: 'Beverages' },
      { name: 'French Fries', description: 'Crispy golden french fries', price: 99, image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400', stock: 80, category: 'Sides' }
    ];
    await Product.insertMany(starterProducts);
    console.log("Database seeded with starter products!");
  }
};
mongoose.connection.once('open', seedDatabase);

// --- API ENDPOINTS ---

// Auth
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be 6+ chars' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ email, name, password });
    res.status(201).json({ id: newUser._id, email: newUser.email, name: newUser.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    // Map _id to id so frontend doesn't break
    const formatted = products.map((p: any) => ({ ...p.toObject(), id: p._id.toString() }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, stock, category } = req.body;
    if (!name || !description || !price || !image || !stock || !category) {
      return res.status(400).json({ message: 'All product fields are required' });
    }
    const newProduct = await Product.create({ name, description, price, image, stock, category });
    res.status(201).json({ ...newProduct.toObject(), id: newProduct._id.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ ...product.toObject(), id: product._id.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const formatted = orders.map((o: any) => ({ ...o.toObject(), id: o._id.toString(), orderDate: o.createdAt }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { userId, customerName, customerEmail, customerPhone, items, subtotal, tax, total } = req.body;
    if (!customerName || !customerEmail || !customerPhone || !items) {
      return res.status(400).json({ message: 'Missing required order information' });
    }

    // CREATE ORDER
    const newOrder = await Order.create({
      userId, customerName, customerEmail, customerPhone, items, subtotal, tax, total
    });

    // UPDATE INVENTORY STOCK
    for (const item of items) {
      const productId = item.product.id || item.product._id;
      // Reduce stock by quantity ordered
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -item.quantity } 
      });
    }

    res.status(201).json({ ...newOrder.toObject(), id: newOrder._id.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json({ ...order.toObject(), id: order._id.toString(), orderDate: order.createdAt });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json({ ...order.toObject(), id: order._id.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));