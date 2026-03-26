import { FormEvent, useEffect, useState } from 'react';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: string;
  orderDate: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
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

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:3001/api/orders'),
          fetch('http://localhost:3001/api/products')
        ]);

        if (!ordersRes.ok || !productsRes.ok) {
          throw new Error('Failed to load data');
        }

        const [ordersDataRaw, productsData] = await Promise.all([
          ordersRes.json(),
          productsRes.json()
        ]);

        const ordersData: Order[] = Array.isArray(ordersDataRaw)
          ? [...ordersDataRaw].sort(
              (a, b) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            )
          : [];

        if (!isMounted) return;
        setOrders(ordersData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get unique categories from existing products
  const existingCategories = Array.from(new Set(products.map(p => p.category))).sort();

  const handleAddProduct = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      let imageUrl = formData.image;

      // If using file upload, upload the image first
      if (uploadMethod === 'upload' && imageFile) {
        const formDataToUpload = new FormData();
        formDataToUpload.append('image', imageFile);

        const uploadRes = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formDataToUpload
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }

      // Use newCategory if user selected "__new__"
      const categoryToUse = formData.category === '__new__' ? newCategory : formData.category;

      if (!categoryToUse) {
        throw new Error('Please enter a category');
      }

      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: categoryToUse,
          image: imageUrl,
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
      setImageFile(null);
      setImagePreview(null);
      setNewCategory('');
      setMessage('Product added successfully');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const visibleProductsForStats = products.filter(p => {
    const name = p.name.toLowerCase();
    const category = p.category.toLowerCase();
    return !name.includes('pasta') && !category.includes('pasta');
  });

  const handleMarkReady = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const updated = await res.json();
      setOrders(prev =>
        prev.map(order => (order.id === updated.id ? { ...order, status: updated.status } : order))
      );
    } catch (err) {
      console.error('Error updating status', err);
      setError('Failed to update order status');
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <div className="top-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Burger Queen Admin</h1>
              <span className="badge">v1</span>
            </div>
            <p className="muted">View orders and add menu items.</p>
          </div>
          <div className="top-right">
            <span className="muted">Signed in as admin</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        {loading && <p className="muted">Loading data...</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-3" style={{ marginBottom: '1.25rem' }}>
              <div className="stat">
                <p className="stat-label">Total orders</p>
                <p className="stat-value">{orders.length}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Menu items</p>
                <p className="stat-value">{visibleProductsForStats.length}</p>
              </div>
              <div className="stat">
                <p className="stat-label">Total revenue</p>
                <p className="stat-value">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="two-col">
              <div className="panel">
                <h2 className="panel-title">Recent orders</h2>
                <div className="order-list">
                  {orders.length === 0 && (
                    <p className="muted">No orders yet. When customers place orders, they appear here.</p>
                  )}
                  {orders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-top">
                        <span className="order-name">{order.customerName}</span>
                        <span className="order-time">
                          {new Date(order.orderDate).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="order-email">
                        {order.customerEmail}
                        <br />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {order.id}</span>
                      </div>
                      
                      {/* Display ordered items */}
                      {order.items && order.items.length > 0 && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Items:</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.75rem', color: '#374151', marginLeft: '0.5rem' }}>
                              • {item.product.name} × {item.quantity} - ₹{(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="order-bottom">
                        <span style={{ fontWeight: 600 }}>₹{order.total.toFixed(2)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="order-status">{order.status}</span>
                          <button
                            type="button"
                            onClick={() => handleMarkReady(order.id)}
                            disabled={order.status === 'ready' || order.status === 'completed'}
                            className="button"
                            style={{
                              padding: '0.15rem 0.55rem',
                              fontSize: '0.75rem',
                              borderRadius: '999px'
                            }}
                          >
                            ✓ Ready
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h2 className="panel-title">Add menu item</h2>
                <form className="form" onSubmit={handleAddProduct}>
                  <div className="field">
                    <label className="label">Name</label>
                    <input
                      name="name"
                      className="input"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="label">Description</label>
                    <textarea
                      name="description"
                      className="textarea"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="label">Price</label>
                      <input
                        name="price"
                        className="input"
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="field">
                      <label className="label">Stock</label>
                      <input
                        name="stock"
                        className="input"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Category</label>
                    <select
                      name="category"
                      className="input"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Select a category</option>
                      {existingCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__new__">+ Add New Category</option>
                    </select>
                    {formData.category === '__new__' && (
                      <input
                        type="text"
                        className="input"
                        placeholder="Enter new category name"
                        style={{ marginTop: '0.5rem' }}
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                      />
                    )}
                  </div>
                  <div className="field">
                    <label className="label">Image</label>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          value="url"
                          checked={uploadMethod === 'url'}
                          onChange={() => {
                            setUploadMethod('url');
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        />
                        <span>Image URL</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          value="upload"
                          checked={uploadMethod === 'upload'}
                          onChange={() => {
                            setUploadMethod('upload');
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                        />
                        <span>Upload Image</span>
                      </label>
                    </div>
                    {uploadMethod === 'url' ? (
                      <input
                        name="image"
                        className="input"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={handleInputChange}
                        required={uploadMethod === 'url'}
                      />
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          className="input"
                          onChange={handleImageFileChange}
                          required={uploadMethod === 'upload'}
                          style={{ padding: '0.5rem' }}
                        />
                        {imagePreview && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              style={{ 
                                width: '100%', 
                                maxHeight: '200px', 
                                objectFit: 'cover', 
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb'
                              }} 
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {message && <div className="success">{message}</div>}
                  <button type="submit" className="button" disabled={submitting}>
                    {submitting ? 'Adding…' : 'Add item'}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


