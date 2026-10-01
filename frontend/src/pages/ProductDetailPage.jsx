import React, { useState, useEffect } from 'react';
import { 
  Star, Heart, ShoppingBag, Zap, ShieldCheck, 
  Truck, Ruler, Check, AlertCircle, Share2, Sparkles, MessageSquarePlus 
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import SizeChartModal from '../components/SizeChartModal';
import ReviewModal from '../components/ReviewModal';

export default function ProductDetailPage({ 
  productId, 
  onNavigate, 
  onRequireAuth 
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Delivery checker
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Modals
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(productId);
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedSize(data.variants[0].size);
        setSelectedColor(data.variants[0].color);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', minHeight: '70vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          <div className="animate-shimmer" style={{ height: '540px', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="animate-shimmer" style={{ height: '36px', width: '70%', borderRadius: '4px' }} />
            <div className="animate-shimmer" style={{ height: '24px', width: '40%', borderRadius: '4px' }} />
            <div className="animate-shimmer" style={{ height: '140px', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <button onClick={() => onNavigate('shop')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Collections
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, selectedSize || 'Standard', selectedColor || 'Standard', quantity);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2400);
    } catch (err) {
      if (err.message === "PLEASE_LOGIN") {
        onRequireAuth && onRequireAuth();
      }
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product.id, selectedSize || 'Standard', selectedColor || 'Standard', quantity);
      onNavigate('checkout');
    } catch (err) {
      if (err.message === "PLEASE_LOGIN") {
        onRequireAuth && onRequireAuth();
      }
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        valid: true,
        message: "Delivery available! Expected delivery by Bluedart in 3-4 business days."
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: "Please enter a valid 6-digit Indian PIN code."
      });
    }
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" }];

  return (
    <div className="product-detail-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      {/* Breadcrumbs */}
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <span onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span onClick={() => onNavigate('shop', { category: product.category_slug })} style={{ cursor: 'pointer' }}>{product.category_name}</span>
        <span>/</span>
        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main 2-Column Showcase */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '48px',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Large Display Image */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '125%', // 4:5 fashion aspect ratio
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--color-surface-soft)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)'
          }}>
            <img
              src={images[activeImageIndex]?.image_url}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {product.discount_percent > 0 && (
              <span className="badge-discount" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.82rem', padding: '4px 10px' }}>
                {product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '74px',
                    height: '92px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: `2px solid ${activeImageIndex === idx ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    padding: 0,
                    flexShrink: 0
                  }}
                >
                  <img
                    src={img.image_url}
                    alt="thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category & SKU */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge-gold">{product.category_name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              SKU: {product.sku || 'AUR-LUX-001'}
            </span>
          </div>

          {/* Product Title */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: 'var(--color-espresso)',
            lineHeight: 1.25,
            fontWeight: 700
          }}>
            {product.name}
          </h1>

          {/* Rating & Reviews Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: '#FDF7E7',
              color: '#9E7D3B',
              padding: '4px 10px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              <Star size={14} fill="#D4AF37" color="#D4AF37" />
              <span>{product.rating?.toFixed(1) || '4.8'}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Based on {product.reviews_count || 12} certified reviews
            </span>
          </div>

          {/* Pricing Box */}
          <div style={{
            padding: '16px 20px',
            background: 'var(--color-surface-soft)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '14px'
          }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              ₹{product.discounted_price?.toLocaleString('en-IN')}
            </span>
            {product.original_price > product.discounted_price && (
              <>
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                  ₹{product.original_price?.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-success)', fontWeight: 700 }}>
                  You Save ₹{(product.original_price - product.discounted_price).toLocaleString('en-IN')} ({product.discount_percent}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Color Selection */}
          {product.variants && product.variants.some(v => v.color) && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
                Color: <span style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{selectedColor}</span>
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {Array.from(new Set(product.variants.map(v => v.color))).map((colName) => {
                  const variant = product.variants.find(v => v.color === colName);
                  const isSelected = selectedColor === colName;
                  return (
                    <button
                      key={colName}
                      onClick={() => setSelectedColor(colName)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: isSelected ? 'var(--color-primary-light)' : '#FFF',
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: variant?.color_code || '#000', display: 'inline-block' }} />
                      <span>{colName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection with Size Chart trigger */}
          {product.variants && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Select Size: <span style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Array.from(new Set(product.variants.map(v => v.size))).map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        minWidth: '48px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: isSelected ? 'var(--color-primary)' : '#FFF',
                        color: isSelected ? '#FFF' : 'var(--color-text)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.82rem'
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Stock Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '8px 14px', fontSize: '1rem', fontWeight: 600 }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontSize: '0.9rem', fontWeight: 700 }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '8px 14px', fontSize: '1rem', fontWeight: 600 }}
              >
                +
              </button>
            </div>

            <div>
              {product.stock > 10 ? (
                <span style={{ color: 'var(--color-success)', fontSize: '0.82rem', fontWeight: 600 }}>
                  ✓ In Stock ({product.stock} units ready to dispatch)
                </span>
              ) : product.stock > 0 ? (
                <span style={{ color: 'var(--color-warning)', fontSize: '0.82rem', fontWeight: 700 }}>
                  ⚡ Only {product.stock} pieces left in stock!
                </span>
              ) : (
                <span style={{ color: 'var(--color-danger)', fontSize: '0.82rem', fontWeight: 700 }}>
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs: Add to Cart, Buy Now, Wishlist */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, minWidth: '160px', padding: '14px', fontSize: '0.95rem' }}
            >
              <ShoppingBag size={18} />
              <span>{cartSuccess ? "Added to Cart!" : "Add to Cart"}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="btn-gold"
              style={{ flex: 1, minWidth: '160px', padding: '14px', fontSize: '0.95rem' }}
            >
              <Zap size={18} />
              <span>Buy Now</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: wishlisted ? 'var(--color-primary)' : 'var(--color-text-muted)'
              }}
              title="Add to Wishlist"
            >
              <Heart size={20} fill={wishlisted ? 'var(--color-primary)' : 'none'} />
            </button>
          </div>

          {/* Pin code Delivery Checker */}
          <div style={{
            padding: '16px',
            background: 'var(--color-surface-soft)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
              <Truck size={16} color="var(--color-primary)" />
              <span>Estimated Delivery Date Checker</span>
            </div>
            <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN code (e.g. 560038)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                Check
              </button>
            </form>
            {pincodeStatus && (
              <div style={{
                marginTop: '8px',
                fontSize: '0.78rem',
                color: pincodeStatus.valid ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 600
              }}>
                {pincodeStatus.message}
              </div>
            )}
          </div>

          {/* Fabric, Specifications & Craftsmanship */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '8px' }}>
              Fabric & Craftsmanship Details
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
              {product.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              fontSize: '0.82rem',
              background: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Fabric / Material:</span>{' '}
                <strong>{product.fabric || 'Pure Silk Blend'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Weave Technique:</span>{' '}
                <strong>Handloom / Handcrafted</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Wash & Care:</span>{' '}
                <strong>Dry Clean Recommended</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Dispatch Hub:</span>{' '}
                <strong>Mumbai Atelier Center</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews Section */}
      <section style={{ marginTop: '64px', borderTop: '1px solid var(--color-border)', paddingTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-espresso)' }}>
              Ratings & Reviews
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Verified feedback from boutique buyers
            </p>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <MessageSquarePlus size={16} />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Breakdown Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px',
          background: 'var(--color-surface-soft)',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '36px'
        }}>
          {/* Average Rating Big Box */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '3.4rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', lineHeight: 1 }}>
              {product.rating?.toFixed(1) || '4.8'}
            </div>
            <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill="#D4AF37" color="#D4AF37" />
              ))}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              {product.reviews_count || product.reviews?.length || 0} Ratings & Customer Reviews
            </div>
          </div>

          {/* Star Distribution Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const starStat = product.rating_distribution?.[star] || { count: star >= 4 ? 8 : 1, percent: star === 5 ? 70 : star === 4 ? 20 : 5 };
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                  <span style={{ width: '40px', fontWeight: 600 }}>{star} Star</span>
                  <div style={{ flex: 1, height: '8px', background: '#E8DFD5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${starStat.percent}%`,
                      height: '100%',
                      background: star >= 4 ? 'var(--color-primary)' : '#C5A059',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{ width: '44px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                    {starStat.percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {product.reviews?.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              No reviews written yet. Be the first to share your thoughts!
            </p>
          ) : (
            product.reviews?.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: '20px',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{r.user_name}</span>
                    {r.verified_purchase && (
                      <span className="badge-gold" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        ✓ Verified Patron
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {r.comment}
                </p>

                {r.images && r.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    {r.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="customer preview"
                        style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-xs)', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {product.related_products && product.related_products.length > 0 && (
        <section style={{ marginTop: '64px', borderTop: '1px solid var(--color-border)', paddingTop: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-espresso)', marginBottom: '24px' }}>
            Complete the Look & Related Pieces
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px'
          }}>
            {product.related_products.map((rp) => (
              <ProductCard
                key={rp.id}
                product={rp}
                onSelect={(id) => onNavigate('product-detail', { id })}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <SizeChartModal isOpen={sizeChartOpen} onClose={() => setSizeChartOpen(false)} />
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={product.id}
        productName={product.name}
        onReviewSubmitted={loadProduct}
      />
    </div>
  );
}
