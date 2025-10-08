import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <div className="flex flex-col">
                <div className="text-xl font-bold leading-tight tracking-tight">
                  <span className="text-red-500">B</span>
                  <span className="text-orange-500">u</span>
                  <span className="text-yellow-500">r</span>
                  <span className="text-green-500">g</span>
                  <span className="text-blue-500">e</span>
                  <span className="text-purple-500">r</span>
                  <span className="text-pink-500"> </span>
                  <span className="text-red-600">Q</span>
                  <span className="text-orange-600">u</span>
                  <span className="text-yellow-600">e</span>
                  <span className="text-green-600">e</span>
                  <span className="text-blue-600">n</span>
                </div>
                <div className="text-[9px] text-gray-500 -mt-0.5">Fast Food Ordering</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Your favorite food ordering destination. Fresh, delicious, and fast!
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Menu</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Offers</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Delivery Info</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Main Street, Mumbai 400001</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@burgerqueen.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2025 Burger Queen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
