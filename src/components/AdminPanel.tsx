import { FormEvent, useEffect, useState } from 'react';
import { Product } from '../types';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: string;
  orderDate: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:3001/api/orders'),
          fetch('http://localhost:3001/api/products')
        ]);

        if (!ordersRes.ok || !productsRes.ok) {
          throw new Error('Failed to load data');
        }

        setOrders(await ordersRes.json());
        setProducts(await productsRes.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });

      if (!res.ok) {
        throw new Error('Failed to add product');
      }

      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        stock: '',
        category: ''
      });
      setMessage('Product added successfully');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Logged in as admin</p>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {loading && <p className="text-gray-300">Loading data...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Menu Items</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {orders.length === 0 && (
                  <p className="text-sm text-gray-400">No orders yet.</p>
                )}
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{order.customerName}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{order.customerEmail}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-300">₹{order.total.toFixed(2)}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-800 text-xs uppercase">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Add Menu Item</h2>
              <form className="space-y-4" onSubmit={handleAddProduct}>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm"
                  rows={3}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm"
                    required
                  />
                  <input
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Stock"
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Category"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm"
                  required
                />
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm"
                  required
                />
                {message && (
                  <p className="text-sm text-center text-gray-300">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-70"
                >
                  {submitting ? 'Adding...' : 'Add Item'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


