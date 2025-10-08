import { useState } from 'react';
import { CartItem, Product } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ShopSection from './components/ShopSection';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderTracking from './components/OrderTracking';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    customerName: string;
    customerEmail: string;
  } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (orderId: string, customerInfo: any) => {
    setOrderConfirmation({
      orderId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email
    });
    setIsCheckoutOpen(false);
    setCartItems([]);
  };

  const handleCloseOrderConfirmation = () => {
    setOrderConfirmation(null);
    setCurrentSection('home');
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (email: string, name: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(name);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        <Header
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        />

        <main className="flex-1">
          {currentSection === 'home' && <Hero onNavigate={handleNavigate} />}
          {currentSection === 'shop' && (
            <ShopSection
              cart={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
          {currentSection === 'track' && <OrderTracking />}
        </main>

        <Footer />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          printOrders={[]}
          onUpdateQuantity={handleUpdateQuantity}
          onRemovePrintOrder={() => {}}
          onCheckout={handleCheckout}
        />

        <Checkout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          printOrders={[]}
          onOrderComplete={handleOrderComplete}
        />

        {orderConfirmation && (
          <OrderConfirmation
            orderId={orderConfirmation.orderId}
            customerName={orderConfirmation.customerName}
            customerEmail={orderConfirmation.customerEmail}
            onClose={handleCloseOrderConfirmation}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </div>
  );
}

export default App;
