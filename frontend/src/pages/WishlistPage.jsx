import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage({ onNavigate, onRequireAuth }) {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (item) => {
    try {
      await addToCart(item.id, 'Standard', 'Default', 1);
      await removeFromWishlist(item.id);
    } catch (err) {
      if (err.message === "PLEASE_LOGIN") {
        onRequireAuth && onRequireAuth();
      }
    }
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Heart size={38} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
          Your Wishlist is Empty
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 24px' }}>
          Save your dream lehengas, silk sarees, and festive co-ords here for easy access and price drop notifications.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="btn-primary"
          style={{ padding: '12px 28px' }}
        >
          Explore Boutique Coutures
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
        My Wishlist ({wishlistItems.length} items)
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '32px' }}>
        Curated pieces saved for your wardrobe. Move directly to bag when ready to purchase.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px'
      }}>
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Image */}
            <div 
              onClick={() => onNavigate('product-detail', { id: product.id })}
              style={{
                position: 'relative',
                paddingTop: '125%',
                cursor: 'pointer',
                background: 'var(--color-surface-soft)'
              }}
            >
              <img
                src={product.primary_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"}
                alt={product.name}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <button
                onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-danger)'
                }}
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Info */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#9E7D3B', fontWeight: 700 }}>
                <Star size={12} fill="#D4AF37" color="#D4AF37" />
                <span>{product.rating?.toFixed(1) || '4.8'}</span>
              </div>

              <h4 
                onClick={() => onNavigate('product-detail', { id: product.id })}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {product.name}
              </h4>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  ₹{product.discounted_price?.toLocaleString('en-IN')}
                </span>
                {product.original_price > product.discounted_price && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                    ₹{product.original_price?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                {product.stock > 0 ? "✓ In Stock" : "Out of Stock"}
              </div>

              {/* Move to Cart Button */}
              <button
                onClick={() => handleMoveToCart(product)}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '0.82rem', marginTop: '6px' }}
              >
                <ShoppingBag size={15} /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
