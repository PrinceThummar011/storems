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
    <div className="bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-900">
      <div className="aspect-square overflow-hidden bg-gray-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">₹{product.price}</span>
          <span className="text-sm text-gray-400">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {quantity > 0 ? (
          <div className="flex items-center justify-between bg-gray-900 rounded-lg p-2 border border-gray-800">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <Minus className="h-4 w-4 text-white" />
            </button>
            <span className="font-semibold text-white">{quantity} in cart</span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
