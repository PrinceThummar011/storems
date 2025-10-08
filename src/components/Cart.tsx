import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem, PrintOrder } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  printOrders: PrintOrder[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemovePrintOrder: (index: number) => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  items,
  printOrders,
  onUpdateQuantity,
  onRemovePrintOrder,
  onCheckout
}: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) +
                  printOrders.reduce((sum, order) => sum + order.price, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0) + printOrders.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {totalItems === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {printOrders.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Print Orders</h3>
                  {printOrders.map((order, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{order.fileName}</p>
                          <p className="text-sm text-gray-600">
                            {order.pageCount} pages • {order.options.copies} copies
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.options.paperSize} • {order.options.colorType === 'color' ? 'Color' : 'B&W'} • {order.options.sides === 'double' ? 'Double-sided' : 'Single-sided'}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemovePrintOrder(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-right font-semibold text-blue-600">₹{order.price}</p>
                    </div>
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Products</h3>
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center space-x-4 mb-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">₹{item.product.price} each</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {totalItems > 0 && (
          <div className="border-t p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
