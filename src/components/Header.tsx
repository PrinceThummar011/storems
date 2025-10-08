import { ShoppingCart, User, LogOut, Sun, Moon, UtensilsCrossed } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  currentSection: string;
  onNavigate: (section: string) => void;
  isAuthenticated: boolean;
  userName: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({
  cartItemCount,
  onCartClick,
  currentSection,
  onNavigate,
  isAuthenticated,
  userName,
  onLoginClick,
  onLogout,
  isDarkMode,
  onToggleTheme
}: HeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex flex-col">
              <div className="text-2xl font-bold leading-tight tracking-tight">
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
              <div className="text-[10px] text-gray-600 dark:text-gray-400 -mt-1">Fast Food Ordering</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentSection === 'home' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                currentSection === 'shop' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Order Food</span>
            </button>
            <button
              onClick={() => onNavigate('track')}
              className={`text-sm font-medium transition-colors ${
                currentSection === 'track' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Track Order
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
