import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import AuthModal from './components/AuthModal';
import NotificationsModal from './components/NotificationsModal';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import HelpSupportPage from './pages/HelpSupportPage';
import AdminPortal from './pages/AdminPortal';

import { api } from './services/api';

function MainApp() {
  const { isAuthenticated, user } = useAuth();

  // Navigation State
  const [currentPage, setCurrentPage] = useState('home');
  const [navigationParams, setNavigationParams] = useState({});

  // Splash Screen State (show once per session)
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('aura_splash_shown');
  });

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load Notifications
  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch (err) {
      console.error("Notifications fetch error:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated]);

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setNavigationParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequireAuth = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleOrderSuccess = (orderData) => {
    handleNavigate('order-confirmation', { orderData });
    loadNotifications();
  };

  const dismissSplash = () => {
    sessionStorage.setItem('aura_splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <div className="aura-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Splash Screen */}
      {showSplash && <SplashScreen onEnter={dismissSplash} />}

      {/* 2. Top Navbar */}
      <Navbar
        activePage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenNotifications={() => {
          if (!isAuthenticated) {
            handleRequireAuth();
          } else {
            setNotificationsOpen(true);
          }
        }}
        unreadNotifications={unreadCount}
      />

      {/* 3. Main Page Routing */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} onRequireAuth={handleRequireAuth} />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            key={JSON.stringify(navigationParams)}
            onNavigate={handleNavigate}
            initialFilters={navigationParams}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {currentPage === 'categories' && (
          <CategoriesPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            productId={navigationParams.id}
            onNavigate={handleNavigate}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'order-confirmation' && (
          <OrderConfirmationPage
            orderData={navigationParams.orderData}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'orders' && (
          <MyOrdersPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'track-order' && (
          <OrderTrackingPage
            orderId={navigationParams.id}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage
            onNavigate={handleNavigate}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'help' && (
          <HelpSupportPage />
        )}

        {currentPage === 'admin' && (
          <AdminPortal
            onNavigate={handleNavigate}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode);
              setAuthModalOpen(true);
            }}
          />
        )}
      </main>

      {/* 4. Boutique Luxury Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 5. Mobile Bottom Navigation */}
      <MobileBottomNav activePage={currentPage} onNavigate={handleNavigate} />

      {/* 6. Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          loadNotifications();
        }}
      />

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onRefresh={loadNotifications}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
