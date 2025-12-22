import { useState } from 'react';
import { Search, Package, Clock, CheckCircle, Truck } from 'lucide-react';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setSearchedOrder(null);

    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId.toUpperCase()}`);
      if (response.ok) {
        const order = await response.json();
        setSearchedOrder(order);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new':
        return { text: 'Order Received', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Package };
      case 'in_progress':
        return { text: 'Processing', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock };
      case 'ready':
        return { text: 'Ready for Pickup', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
      case 'completed':
        return { text: 'Completed', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Truck };
      default:
        return { text: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Package };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h2>
      <p className="text-gray-600 mb-8">Enter your order ID to check the status</p>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD-20250103-1234)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Track Order
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-3">
          Enter your order ID to track your order
        </p>
      </div>

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-medium">Searching for order...</p>
        </div>
      )}

      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Order not found</p>
          <p className="text-red-600 text-sm mt-1">
            Please check your order ID and try again
          </p>
        </div>
      )}

      {searchedOrder && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Order Details</h3>
            <p className="text-blue-100">Order ID: {searchedOrder.id}</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              {(() => {
                const statusInfo = getStatusInfo(searchedOrder.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div className={`${statusInfo.bgColor} rounded-lg p-4 flex items-center space-x-3`}>
                    <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <p className={`text-lg font-semibold ${statusInfo.color}`}>
                        {statusInfo.text}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                <p className="font-medium text-gray-900">{searchedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(searchedOrder.orderDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
              <ul className="space-y-2">
                {searchedOrder.items?.map((item: any, index: number) => (
                  <li key={index} className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>{item.product?.name || item.name || 'Unknown Item'} x {item.quantity || 1}</span>
                    </div>
                    <span className="text-gray-600">₹{item.product?.price * item.quantity || item.price || 0}</span>
                  </li>
                ))}
                {searchedOrder.printOrders && searchedOrder.printOrders.length > 0 && (
                  <li className="flex items-center space-x-2 text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>{searchedOrder.printOrders.length} Print Order(s)</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{searchedOrder.total}
              </span>
            </div>

            {searchedOrder.status === 'ready' && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium text-center">
                  Your order is ready for pickup! Please visit our store with your Order ID.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
