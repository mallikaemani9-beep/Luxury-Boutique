import React from 'react';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function MobileBottomNav({ activePage, onNavigate }) {
  const { summary } = useCart();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistCount },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: summary.item_count },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div 
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '66px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 99,
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)'
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              flex: 1,
              height: '100%',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              position: 'relative',
              transition: 'color 0.2s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={21} strokeWidth={isActive ? 2.4 : 1.8} />
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-8px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.02em'
            }}>
              {item.label}
            </span>
            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                width: '28px',
                height: '3px',
                background: 'var(--color-primary)',
                borderRadius: '0 0 3px 3px'
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
