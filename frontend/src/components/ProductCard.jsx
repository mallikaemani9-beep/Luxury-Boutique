import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onSelect, onRequireAuth }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(
    product.available_sizes && product.available_sizes.length > 0 
      ? product.available_sizes[0] 
      : 'Standard'
  );
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      if (err.message === "PLEASE_LOGIN") {
        onRequireAuth && onRequireAuth();
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product.id, selectedSize, 'Default', 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1800);
    } catch (err) {
      if (err.message === "PLEASE_LOGIN") {
        onRequireAuth && onRequireAuth();
      }
    } finally {
      setAdding(false);
    }
  };

  const primaryImage = product.primary_image || (product.images && product.images[0]?.image_url) || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

  return (
    <div 
      onClick={() => onSelect(product.id)}
      className="product-card"
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-gold)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '125%', // 4:5 aspect ratio for fashion
        background: 'var(--color-surface-soft)',
        overflow: 'hidden'
      }}>
        <img 
          src={primaryImage} 
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
        />

        {/* Badges in Top Left */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
          {product.discount_percent > 0 && (
            <span className="badge-discount">
              {product.discount_percent}% OFF
            </span>
          )}
          {product.is_bestseller ? (
            <span className="badge-burgundy" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
              Best Seller
            </span>
          ) : product.is_new ? (
            <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
              New In
            </span>
          ) : null}
        </div>

        {/* Wishlist Button in Top Right */}
        <button
          onClick={handleWishlistToggle}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 2,
            transition: 'transform 0.2s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            size={18} 
            color={wishlisted ? "var(--color-primary)" : "var(--color-text-muted)"} 
            fill={wishlisted ? "var(--color-primary)" : "none"} 
          />
        </button>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
        {/* Rating and Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            background: '#FDF7E7',
            color: '#9E7D3B',
            padding: '2px 6px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.72rem',
            fontWeight: 700
          }}>
            <Star size={11} fill="#D4AF37" color="#D4AF37" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            ({product.reviews_count || 12} reviews)
          </span>
        </div>

        {/* Product Name */}
        <h4 style={{
          fontSize: '0.92rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.4em'
        }}>
          {product.name}
        </h4>

        {/* Price Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--color-primary)'
          }}>
            ₹{product.discounted_price?.toLocaleString('en-IN')}
          </span>
          {product.original_price > product.discounted_price && (
            <span style={{
              fontSize: '0.82rem',
              color: 'var(--color-text-light)',
              textDecoration: 'line-through'
            }}>
              ₹{product.original_price?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Available Sizes selector */}
        {product.available_sizes && product.available_sizes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginRight: '2px' }}>Sizes:</span>
            {product.available_sizes.slice(0, 4).map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: `1px solid ${selectedSize === size ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: selectedSize === size ? 'var(--color-primary-light)' : '#FFF',
                  color: selectedSize === size ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: selectedSize === size ? 700 : 500
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Add to Cart CTA Button */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={addedSuccess ? "btn-secondary" : "btn-primary"}
          style={{
            width: '100%',
            padding: '9px 12px',
            fontSize: '0.82rem',
            marginTop: '8px',
            borderRadius: 'var(--radius-sm)',
            background: addedSuccess ? 'var(--color-success-bg)' : undefined,
            color: addedSuccess ? 'var(--color-success)' : undefined,
            borderColor: addedSuccess ? 'var(--color-success)' : undefined
          }}
        >
          {addedSuccess ? (
            <>
              <Check size={15} /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingBag size={15} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
