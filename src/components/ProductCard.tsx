import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function ProductCard({ product, quantity, onAddToCart, onUpdateQuantity }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
          <span className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {quantity > 0 ? (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
            >
              <Minus className="h-4 w-4 text-blue-600" />
            </button>
            <span className="font-semibold text-blue-600">{quantity} in cart</span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4 text-blue-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
