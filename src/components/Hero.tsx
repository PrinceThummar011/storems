import { UtensilsCrossed, Zap, CheckCircle, Clock, Shield, Award, Coffee } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Burger Queen
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your favorite food, ordered fresh and delivered fast. Self-service ordering made easy!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <UtensilsCrossed className="h-7 w-7 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Order Food</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Browse our menu of burgers, pizzas, beverages, and more!
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="text-red-600 dark:text-red-400 font-medium hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              View Menu →
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-orange-100 dark:bg-orange-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-7 w-7 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Track Your Order</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Real-time updates on your order status and estimated delivery
            </p>
            <button
              onClick={() => onNavigate('track')}
              className="text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Track Order →
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 rounded-xl p-8 text-center text-white mb-16 transition-colors duration-300">
          <h3 className="text-2xl font-bold mb-2">First Order Special!</h3>
          <p className="text-red-50 mb-4">
            Get 20% off on your first order. Use code: FIRST20
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Why Choose Burger Queen?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quality Assured</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Premium quality products guaranteed</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Service</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Quick turnaround time for all orders</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Payments</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Safe and encrypted payment processing</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Best Prices</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Competitive pricing on all products</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-16 transition-colors duration-300">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Delicious Menu Selection</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                From juicy burgers to crispy pizzas, fresh beverages to tasty sides.
                Everything you crave, available at your fingertips with our easy self-order terminal.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Fresh burgers made to order</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Hot pizzas with variety of toppings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Chilled beverages and fresh juices</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Crispy sides and tasty snacks</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate('shop')}
                className="bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors w-fit"
              >
                View Full Menu
              </button>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/20 dark:to-orange-800/20 p-4 flex items-center justify-center transition-colors duration-300">
              <img 
                src="/public/menu.jpg" 
                alt="Delicious food selection at Burger Queen" 
                className="w-full h-full object-cover rounded-lg shadow-lg max-w-md max-h-80"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-xl p-12 text-center text-white transition-colors duration-300">
          <h3 className="text-3xl font-bold mb-4">Hungry? Order Now!</h3>
          <p className="text-lg mb-6 text-orange-50">
            Join thousands of satisfied customers who enjoy fresh, delicious food at Burger Queen
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Order Now
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
