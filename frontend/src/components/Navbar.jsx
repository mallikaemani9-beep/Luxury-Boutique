import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, User, Bell, Shield, 
  Menu, X, Sparkles, ChevronDown, LogOut, Package, 
  MapPin, HelpCircle, Layers, Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';

export default function Navbar({ 
  onNavigate, 
  activePage, 
  onOpenAuth, 
  onOpenNotifications,
  unreadNotifications = 0
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { summary } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories in navbar:", err);
      }
    }
    loadCats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery.trim() });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navbar-wrapper" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Luxury Announcement Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #500E22 0%, #68132C 50%, #500E22 100%)',
        color: '#FFFFFF',
        fontSize: '0.8rem',
        padding: '6px 16px',
        textAlign: 'center',
        fontWeight: 500,
        letterSpacing: '0.04em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <Sparkles size={14} color="#D4AF37" />
        <span>Festive Atelier Edit: Enjoy Flat 20% OFF with code <strong>FESTIVE20</strong> | Free Luxury Delivery on ₹999+</span>
        <Sparkles size={14} color="#D4AF37" />
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
          gap: '20px'
        }}>
          {/* Mobile Menu Button & Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only-btn"
              style={{ padding: '6px', color: 'var(--color-espresso)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div 
              onClick={() => onNavigate('home')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #68132C 0%, #400B1A 100%)',
                border: '1.5px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(104, 19, 44, 0.25)'
              }}>
                A
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--color-primary)',
                  lineHeight: 1.1
                }}>
                  AURA ATELIER
                </div>
                <div style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-dark)',
                  fontWeight: 600
                }}>
                  Luxury Boutique
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button 
              onClick={() => onNavigate('home')} 
              style={{ 
                fontWeight: activePage === 'home' ? 700 : 500,
                color: activePage === 'home' ? 'var(--color-primary)' : 'var(--color-text)',
                fontSize: '0.92rem',
                position: 'relative',
                padding: '6px 0'
              }}
            >
              Home
              {activePage === 'home' && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--color-primary)', borderRadius: '2px' }} />}
            </button>

            <button 
              onClick={() => onNavigate('categories')} 
              style={{ 
                fontWeight: activePage === 'categories' ? 700 : 500,
                color: activePage === 'categories' ? 'var(--color-primary)' : 'var(--color-text)',
                fontSize: '0.92rem',
                position: 'relative',
                padding: '6px 0'
              }}
            >
              Categories
              {activePage === 'categories' && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--color-primary)', borderRadius: '2px' }} />}
            </button>

            <button 
              onClick={() => onNavigate('shop', { filter: 'is_new' })} 
              style={{ 
                fontWeight: 500,
                color: 'var(--color-text)',
                fontSize: '0.92rem'
              }}
            >
              New Arrivals
            </button>

            <button 
              onClick={() => onNavigate('shop', { filter: 'is_bestseller' })} 
              style={{ 
                fontWeight: 500,
                color: 'var(--color-text)',
                fontSize: '0.92rem'
              }}
            >
              Best Sellers
            </button>

            <button 
              onClick={() => onNavigate('shop', { sort_by: 'rating' })} 
              style={{ 
                fontWeight: 500,
                color: 'var(--color-text)',
                fontSize: '0.92rem'
              }}
            >
              Festive Edit
            </button>

            <button 
              onClick={() => onNavigate('help')} 
              style={{ 
                fontWeight: activePage === 'help' ? 700 : 500,
                color: activePage === 'help' ? 'var(--color-primary)' : 'var(--color-text)',
                fontSize: '0.92rem'
              }}
            >
              Help & Support
            </button>
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="navbar-search-form"
            style={{
              flex: '1',
              maxWidth: '320px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <input 
              type="text"
              placeholder="Search sarees, kurtis, lehengas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-soft)',
                fontSize: '0.85rem',
                outline: 'none',
                color: 'var(--color-text)',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
            <Search 
              size={17} 
              color="var(--color-text-muted)" 
              style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} 
            />
          </form>

          {/* Actions: Admin Button, Notifications, Wishlist, Cart, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick Admin Portal Button */}
            <button
              onClick={() => onNavigate('admin')}
              className="admin-badge-btn"
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: isAdmin ? 'var(--color-primary)' : 'var(--color-surface-soft)',
                color: isAdmin ? '#FFF' : 'var(--color-primary)',
                border: '1px solid var(--color-gold)',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Admin Dashboard Portal"
            >
              <Shield size={14} color={isAdmin ? '#D4AF37' : 'var(--color-gold-dark)'} />
              <span>{isAdmin ? "Admin Portal" : "Admin Demo"}</span>
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '50%',
                color: 'var(--color-espresso)',
                background: 'var(--color-surface-soft)'
              }}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'var(--color-danger)',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFF'
                }}>
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '50%',
                color: 'var(--color-espresso)',
                background: 'var(--color-surface-soft)'
              }}
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'var(--color-primary)',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFF'
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              style={{
                position: 'relative',
                padding: '8px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
              title="Shopping Cart"
            >
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={20} color="var(--color-primary)" />
                {summary.item_count > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    background: 'var(--color-primary)',
                    color: '#FFF',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFF'
                  }}>
                    {summary.item_count}
                  </span>
                )}
              </div>
              <span className="cart-total-badge" style={{ color: 'var(--color-primary)' }}>
                ₹{summary.total.toLocaleString('en-IN')}
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-surface-soft)',
                  color: 'var(--color-espresso)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-gold-soft)',
                  border: '1px solid var(--color-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={16} color="var(--color-gold-dark)" />
                  )}
                </div>
                <ChevronDown size={14} color="var(--color-text-muted)" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '240px',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                    animation: 'fadeIn 0.2s ease'
                  }}
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  {isAuthenticated ? (
                    <>
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-espresso)' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {user.email}
                        </div>
                        <span className={user.role === 'admin' ? 'badge-burgundy' : 'badge-gold'} style={{ marginTop: '6px', display: 'inline-block' }}>
                          {user.role === 'admin' ? '👑 Boutique Admin' : '✨ Patron Member'}
                        </span>
                      </div>

                      <div style={{ padding: '4px 0' }}>
                        <button
                          onClick={() => { onNavigate('profile'); setProfileDropdownOpen(false); }}
                          style={{ width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-sm)' }}
                        >
                          <User size={16} color="var(--color-primary)" /> Customer Profile
                        </button>
                        <button
                          onClick={() => { onNavigate('orders'); setProfileDropdownOpen(false); }}
                          style={{ width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-sm)' }}
                        >
                          <Package size={16} color="var(--color-primary)" /> My Orders & Tracking
                        </button>
                        <button
                          onClick={() => { onNavigate('wishlist'); setProfileDropdownOpen(false); }}
                          style={{ width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-sm)' }}
                        >
                          <Heart size={16} color="var(--color-primary)" /> My Wishlist ({wishlistCount})
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => { onNavigate('admin'); setProfileDropdownOpen(false); }}
                            style={{ width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary)', fontWeight: 600 }}
                          >
                            <Shield size={16} color="var(--color-primary)" /> Admin Portal Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => { onNavigate('help'); setProfileDropdownOpen(false); }}
                          style={{ width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-sm)' }}
                        >
                          <HelpCircle size={16} color="var(--color-text-muted)" /> Help & Support
                        </button>
                      </div>

                      <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '4px' }}>
                        <button
                          onClick={() => { logout(); setProfileDropdownOpen(false); }}
                          style={{ width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)' }}
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '12px' }}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                        Sign in for personalized boutique couture, saved addresses, and express checkout.
                      </p>
                      <button
                        onClick={() => { onOpenAuth('login'); setProfileDropdownOpen(false); }}
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem', marginBottom: '8px' }}
                      >
                        Sign In / Register
                      </button>
                      <button
                        onClick={() => { onOpenAuth('admin'); setProfileDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          fontSize: '0.8rem',
                          color: 'var(--color-gold-dark)',
                          background: 'var(--color-gold-soft)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-gold)'
                        }}
                      >
                        Login as Admin Demo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: '#FFFFFF',
            borderTop: '1px solid var(--color-border-light)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text" 
                placeholder="Search boutique products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 18px' }}>
                <Search size={18} />
              </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', padding: '10px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => { onNavigate('categories'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', padding: '10px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
              >
                👗 Categories
              </button>
              <button 
                onClick={() => { onNavigate('shop', { filter: 'is_new' }); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', padding: '10px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
              >
                ✨ New Arrivals
              </button>
              <button 
                onClick={() => { onNavigate('shop', { filter: 'is_bestseller' }); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', padding: '10px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
              >
                🔥 Best Sellers
              </button>
              <button 
                onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', padding: '10px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
              >
                📦 My Orders
              </button>
              <button 
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', padding: '10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
              >
                🛡️ Admin Portal
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
