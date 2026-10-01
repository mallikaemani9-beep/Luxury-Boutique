import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, Star, ChevronLeft, ChevronRight, 
  Tag, Percent, ShieldCheck, Truck, RefreshCw, Award, Copy, Check 
} from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage({ onNavigate, onRequireAuth }) {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState({
    new_arrivals: [],
    trending: [],
    bestsellers: [],
    special_offers: []
  });
  const [loading, setLoading] = useState(true);

  // Hero carousel slides
  const heroSlides = [
    {
      title: "Royal Banarasi & Zari Weaves",
      tagline: "The Grand Festive Edit 2026",
      desc: "Handcrafted pure katan silks adorned with heirloom gold zari bootas. Draped for celebrations of a lifetime.",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85",
      cta: "Explore Silk Sarees",
      category: "sarees"
    },
    {
      title: "Opulent Bridal & Sangeet Lehengas",
      tagline: "Couture Masterpieces",
      desc: "Cascades of delicate micro-sequins, rose gold shimmer, and artisanal zardozi embroidery.",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=85",
      cta: "View Lehenga Collection",
      category: "lehengas"
    },
    {
      title: "Breezy Mulmul & Anarkali Sets",
      tagline: "Everyday Luxury",
      desc: "Featherlight breathable pure cottons with handblock prints and authentic gota patti artistry.",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85",
      cta: "Discover Kurti Sets",
      category: "kurtis"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, secs] = await Promise.all([
          api.getCategories(),
          api.getFeaturedSections()
        ]);
        setCategories(cats || []);
        setSections(secs || {});
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Slide autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2000);
  };

  return (
    <div className="home-page animate-fade-in">
      {/* 1. HERO CAROUSEL BANNER */}
      <section style={{ position: 'relative', width: '100%', minHeight: '520px', overflow: 'hidden', background: '#251318' }}>
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: currentSlide === idx ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentSlide === idx ? 1 : 0
            }}
          >
            {/* Background Image with Dark Gradient Overlay */}
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(28, 8, 14, 0.85) 0%, rgba(28, 8, 14, 0.55) 50%, rgba(28, 8, 14, 0.25) 100%)'
            }} />

            {/* Slide Content */}
            <div className="container" style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 2,
              paddingTop: '60px',
              paddingBottom: '60px',
              color: '#FFFFFF',
              maxWidth: '680px'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#D4AF37',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                <Sparkles size={16} /> {slide.tagline}
              </div>

              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                lineHeight: 1.15,
                fontWeight: 700,
                marginBottom: '16px',
                textShadow: '0 2px 10px rgba(0,0,0,0.4)'
              }}>
                {slide.title}
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: '#F2E3E5',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '540px'
              }}>
                {slide.desc}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('shop', { category: slide.category })}
                  className="btn-gold"
                  style={{ padding: '14px 30px', fontSize: '0.95rem' }}
                >
                  <span>{slide.cta}</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onNavigate('categories')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFF',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    padding: '14px 26px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                >
                  Browse All Collections
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Slide Indicators & Arrows */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          zIndex: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: currentSlide === i ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentSlide === i ? '#D4AF37' : 'rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORY PILLS & CIRCLES */}
      <section style={{ padding: '48px 0', background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge-gold">Curated Coutures</span>
            <h2 style={{ fontSize: '2rem', marginTop: '8px', color: 'var(--color-espresso)' }}>
              Explore by Boutique Category
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '540px', margin: '6px auto 0' }}>
              Handpicked categories spanning heritage looms, festive ensembles, and modern evening silhouettes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
            gap: '16px',
            textAlign: 'center'
          }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate('shop', { category: cat.slug })}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-primary) 100%)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {cat.product_count} items
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section style={{ padding: '40px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <span className="badge-burgundy">Just In This Week</span>
              <h2 style={{ fontSize: '1.9rem', marginTop: '6px', color: 'var(--color-espresso)' }}>
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', { filter: 'is_new' })}
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View All New</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {sections.new_arrivals?.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => onNavigate('product-detail', { id })}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FESTIVE SPECIAL OFFERS BANNER */}
      <section style={{ padding: '36px 0', background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #500E22 0%, #68132C 60%, #380816 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 40px',
            color: '#FFFFFF',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            boxShadow: 'var(--shadow-lg)',
            border: '1.5px solid var(--color-gold)'
          }}>
            <div style={{ maxWidth: '480px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Percent size={16} /> Exclusive Coupon Privileges
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
                Festive Season Celebrations
              </h3>
              <p style={{ color: '#E8C4C8', fontSize: '0.92rem', marginTop: '8px', lineHeight: 1.5 }}>
                Use verified boutique coupons at checkout for instant order deductions. Free luxury gifting box on all orders.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Coupon Card 1 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px dashed #D4AF37',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                minWidth: '200px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600 }}>FIRST ORDER OFFER</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.08em', margin: '4px 0' }}>
                  WELCOME100
                </div>
                <div style={{ fontSize: '0.78rem', color: '#E8DFD5', marginBottom: '10px' }}>Flat ₹100 OFF on ₹499+</div>
                <button
                  onClick={() => copyCoupon('WELCOME100')}
                  style={{
                    background: copiedCoupon === 'WELCOME100' ? 'var(--color-success)' : '#D4AF37',
                    color: copiedCoupon === 'WELCOME100' ? '#FFF' : '#1A040A',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedCoupon === 'WELCOME100' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCoupon === 'WELCOME100' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Coupon Card 2 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px dashed #D4AF37',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                minWidth: '200px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600 }}>ROYAL FESTIVE SPECIAL</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.08em', margin: '4px 0' }}>
                  FESTIVE20
                </div>
                <div style={{ fontSize: '0.78rem', color: '#E8DFD5', marginBottom: '10px' }}>20% OFF up to ₹800 on ₹1,499+</div>
                <button
                  onClick={() => copyCoupon('FESTIVE20')}
                  style={{
                    background: copiedCoupon === 'FESTIVE20' ? 'var(--color-success)' : '#D4AF37',
                    color: copiedCoupon === 'FESTIVE20' ? '#FFF' : '#1A040A',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedCoupon === 'FESTIVE20' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCoupon === 'FESTIVE20' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRENDING & BEST SELLERS */}
      <section style={{ padding: '48px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <span className="badge-gold">Most Adored Pieces</span>
              <h2 style={{ fontSize: '1.9rem', marginTop: '6px', color: 'var(--color-espresso)' }}>
                Trending & Best Sellers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', { filter: 'is_bestseller' })}
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Explore All</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {sections.bestsellers?.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => onNavigate('product-detail', { id })}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. RECOMMENDED FOR YOU */}
      <section style={{ padding: '48px 0', background: 'var(--color-surface-soft)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge-burgundy">Handpicked Recommendations</span>
            <h2 style={{ fontSize: '1.9rem', marginTop: '6px', color: 'var(--color-espresso)' }}>
              Stylist Curations for You
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Complimentary matching potli bags, pure tissue organza dupattas, and handcrafted jewelry pairings.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {sections.trending?.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => onNavigate('product-detail', { id })}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section style={{ padding: '56px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge-gold">Voices of Patronage</span>
            <h2 style={{ fontSize: '2rem', marginTop: '8px', color: 'var(--color-espresso)' }}>
              Cherished Customer Reviews
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Hear from patrons who adorned Aura Atelier for their dream weddings, festivities, and soirees.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                name: "Ananya Sengupta",
                city: "Kolkata",
                rating: 5,
                product: "Zari Embroidered Banarasi Silk Saree",
                text: "The pure silk drape is simply majestic! The zari has an antique champagne tone that looks extraordinarily rich under evening lights. Received endless compliments."
              },
              {
                name: "Kavita Reddy",
                city: "Hyderabad",
                rating: 5,
                product: "Rose Gold Sequin Heavy Bridal Lehenga",
                text: "Wore this for my Sangeet and danced all night comfortably! The inner satin lining is super soft and the sequins glimmered under the chandelier lights like diamonds."
              },
              {
                name: "Divya Patel",
                city: "Ahmedabad",
                rating: 5,
                product: "Floral Anarkali Pure Mulmul Kurti Set",
                text: "The breathability of this cotton mulmul kurti is unmatched. The silhouette gives such an elongated, flattering look. Already ordered another color!"
              }
            ].map((rev, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.6, flex: 1 }}>
                  "{rev.text}"
                </p>
                <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-espresso)' }}>
                    {rev.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-gold-dark)' }}>
                    Verified Buyer • {rev.city}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Purchased: {rev.product}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
