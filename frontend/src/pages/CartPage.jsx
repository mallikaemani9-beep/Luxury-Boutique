import React, { useState } from 'react';
import { 
  Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, 
  Truck, ArrowLeft, Percent, Check 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function CartPage({ onNavigate }) {
  const { 
    cartItems, summary, updateQuantity, removeFromCart, 
    appliedCoupon, finalTotal, applyCouponCode, removeCoupon, clearCart 
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    setCouponError('');
    setCouponSuccess('');
    setApplying(true);
    try {
      const res = await applyCouponCode(code.trim());
      setCouponSuccess(res.message);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleSaveForLater = async (item) => {
    try {
      await toggleWishlist(item.product_id);
      await removeFromCart(item.cart_id);
    } catch (err) {
      console.error(err);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
          Your Atelier Bag is Empty
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 24px' }}>
          Explore our handcrafted sarees, silk anarkalis, and bridal coutures to start filling your bag.
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
    <div className="cart-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
        <button
          onClick={() => onNavigate('shop')}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={16} /> Continue Shopping
        </button>
      </div>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--color-espresso)', marginBottom: '28px' }}>
        Shopping Bag ({summary.item_count} items)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '36px',
        alignItems: 'flex-start'
      }}>
        {/* Left Side: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.map((item) => (
            <div
              key={item.cart_id}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '18px',
                display: 'flex',
                gap: '18px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Product Thumbnail */}
              <div 
                onClick={() => onNavigate('product-detail', { id: item.product_id })}
                style={{
                  width: '100px',
                  height: '130px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--color-surface-soft)',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
              >
                <img
                  src={item.product_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80"}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Item Info */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 
                    onClick={() => onNavigate('product-detail', { id: item.product_id })}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      lineHeight: 1.3
                    }}
                  >
                    {item.name}
                  </h4>
                  <button
                    onClick={() => removeFromCart(item.cart_id)}
                    style={{ color: 'var(--color-text-muted)', padding: '4px' }}
                    title="Remove item"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {/* Size and Color specifications */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>Size: <strong style={{ color: 'var(--color-text)' }}>{item.size}</strong></span>
                  {item.color && item.color !== 'Default' && (
                    <span>Color: <strong style={{ color: 'var(--color-text)' }}>{item.color}</strong></span>
                  )}
                </div>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    ₹{(item.discounted_price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  {item.original_price > item.discounted_price && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                      ₹{(item.original_price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Quantity Stepper & Save for Later */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <button
                      onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                      style={{ padding: '4px 10px', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                      style={{ padding: '4px 10px', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleSaveForLater(item)}
                    style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}
                  >
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary & Coupon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Coupon Code Section */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>
              <Tag size={17} color="var(--color-primary)" />
              <span>Apply Boutique Coupon</span>
            </div>

            {appliedCoupon ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--color-success-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-success)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-success)' }}>
                    '{appliedCoupon.code}' Applied
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
                    You save ₹{appliedCoupon.discount_amount.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={applying}
                    className="btn-primary"
                    style={{ padding: '9px 18px', fontSize: '0.85rem' }}
                  >
                    {applying ? "..." : "Apply"}
                  </button>
                </div>

                {couponError && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginBottom: '8px' }}>
                    {couponError}
                  </div>
                )}
                {couponSuccess && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginBottom: '8px' }}>
                    {couponSuccess}
                  </div>
                )}

                {/* Available Quick Suggestion Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {['WELCOME100', 'FESTIVE20'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleApplyCoupon(chip)}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '4px 8px',
                        background: 'var(--color-surface-soft)',
                        border: '1px dashed var(--color-gold)',
                        color: 'var(--color-gold-dark)',
                        borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '16px' }}>
              Order Price Details
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Bag MRP Total</span>
                <span>₹{summary.original_subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                <span>Boutique Catalog Discount</span>
                <span>- ₹{summary.discount_amount?.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Coupon Savings ({appliedCoupon.code})</span>
                  <span>- ₹{appliedCoupon.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Delivery Charges</span>
                <span>
                  {summary.delivery_charge === 0 ? (
                    <strong style={{ color: 'var(--color-success)' }}>FREE</strong>
                  ) : (
                    `₹${summary.delivery_charge}`
                  )}
                </span>
              </div>
            </div>

            {/* Total Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', fontSize: '1.25rem', fontWeight: 800 }}>
              <span style={{ fontFamily: 'var(--font-serif)' }}>Total Amount</span>
              <span style={{ color: 'var(--color-primary)' }}>
                ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '14px' }}>
              <ShieldCheck size={14} color="var(--color-success)" />
              <span>Safe and Secure Payments • 100% Authentic Handloom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
