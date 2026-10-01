import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function CategoriesPage({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const cats = await api.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="categories-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge-gold">Atelier Categories</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-espresso)', marginTop: '8px' }}>
          Explore Our Heritage Collections
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>
          From timeless heirloom Banarasi weaves to modern festive co-ords and bespoke bridal ensembles.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-shimmer" style={{ height: '320px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.slug })}
              style={{
                position: 'relative',
                height: '340px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(28, 8, 14, 0.88) 100%)'
              }} />

              {/* Category Info */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px',
                color: '#FFFFFF'
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  fontWeight: 700
                }}>
                  {cat.product_count} Exclusive Pieces
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  margin: '4px 0 6px'
                }}>
                  {cat.name}
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#E8DFD5',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  {cat.description}
                </p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#D4AF37'
                }}>
                  <span>Shop Collection</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
