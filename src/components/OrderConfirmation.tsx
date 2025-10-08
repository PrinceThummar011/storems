import { CheckCircle, Copy, MapPin, Phone, Clock } from 'lucide-react';
import { useState } from 'react';

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  onClose: () => void;
}

export default function OrderConfirmation({ orderId, customerName, customerEmail, onClose }: OrderConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Order Confirmed!</h2>
          <p className="text-sm text-gray-600 mb-5">
            Thank you for your order, {customerName}!
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Your Order ID</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-bold text-blue-600">{orderId}</span>
              <button
                onClick={copyOrderId}
                className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                title="Copy Order ID"
              >
                <Copy className="h-4 w-4 text-blue-600" />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
            <div className="flex items-start space-x-2 text-left">
              <Clock className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Ready Time</p>
                <p className="text-xs text-gray-600">30-45 minutes</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-left">
              <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                <p className="text-xs text-gray-600">
                  StoreMS Shop, 123 Main Street<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-left">
              <Phone className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Contact</p>
                <p className="text-xs text-gray-600">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-800">
              <strong>Important:</strong> Please show this Order ID when picking up your order.
              A confirmation has been sent to {customerEmail}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
