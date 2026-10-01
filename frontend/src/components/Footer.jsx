import React, { useState } from 'react';
import { Mail, Phone, MapPin, Sparkles, ShieldCheck, Truck, RefreshCw, Award, Send } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{
      background: '#1F1412',
      color: '#E8DFD5',
      paddingTop: '60px',
      paddingBottom: '30px',
      borderTop: '1px solid #332420'
    }}>
      {/* Brand Values Highlights */}
      <div className="container" style={{ marginBottom: '48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Award size={24} color="#D4AF37" />
            </div>
            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.92rem', fontWeight: 600 }}>100% Artisan Handcrafted</h5>
              <p style={{ color: '#A39692', fontSize: '0.78rem' }}>Authentic pure Banarasi, Chanderi & Mulmul</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Truck size={24} color="#D4AF37" />
            </div>
            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.92rem', fontWeight: 600 }}>Express Pan-India Delivery</h5>
              <p style={{ color: '#A39692', fontSize: '0.78rem' }}>Complimentary luxury packaging on ₹999+</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RefreshCw size={24} color="#D4AF37" />
            </div>
            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.92rem', fontWeight: 600 }}>Easy 7-Day Exchanges</h5>
              <p style={{ color: '#A39692', fontSize: '0.78rem' }}>Hassle-free doorstep pickup & sizing assistance</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} color="#D4AF37" />
            </div>
            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.92rem', fontWeight: 600 }}>100% Secure Checkout</h5>
              <p style={{ color: '#A39692', fontSize: '0.78rem' }}>Encrypted UPI, Cards, NetBanking & COD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Story */}
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '48px'
      }}>
        {/* Boutique Story */}
        <div style={{ maxWidth: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#68132C',
              border: '1.5px solid #D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              A
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#FFF', letterSpacing: '0.08em' }}>
              AURA ATELIER
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#B3A5A0', lineHeight: 1.6, marginBottom: '18px' }}>
            A boutique fashion house curated for the discerning connoisseur. From regal Banarasi weaves to breezy mulmul kurtis and celebratory bridal lehengas, each silhouette narrates a story of craftsmanship.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#D4AF37' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} /> <span>100 Feet Road, Indiranagar, Bengaluru 560038</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} /> <span>+91 98765 43210 (Mon-Sat 10am - 8pm)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} /> <span>concierge@auraboutique.com</span>
            </div>
          </div>
        </div>

        {/* Categories Links */}
        <div>
          <h4 style={{ color: '#FFF', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '18px' }}>
            Boutique Collections
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'sarees' })} style={{ color: '#B3A5A0', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#B3A5A0'}>
                Pure Silk Sarees
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'kurtis' })} style={{ color: '#B3A5A0', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#B3A5A0'}>
                Anarkali & Chikankari Kurtis
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'lehengas' })} style={{ color: '#B3A5A0', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#B3A5A0'}>
                Bridal & Festive Lehengas
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'dresses' })} style={{ color: '#B3A5A0', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#B3A5A0'}>
                Cocktail & Maxi Dresses
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'salwar-suits' })} style={{ color: '#B3A5A0', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#B3A5A0'}>
                Sharara & Salwar Suits
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'accessories' })} style={{ color: '#B3A5A0', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#B3A5A0'}>
                Potli Bags & Kundan Jewelry
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Experience */}
        <div>
          <h4 style={{ color: '#FFF', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '18px' }}>
            Customer Experience
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li>
              <button onClick={() => onNavigate('orders')} style={{ color: '#B3A5A0' }}>
                Track Order Status
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('help')} style={{ color: '#B3A5A0' }}>
                Delivery & Shipping Details
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('help')} style={{ color: '#B3A5A0' }}>
                Size & Measurement Guide
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('help')} style={{ color: '#B3A5A0' }}>
                Returns & Exchange Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('help')} style={{ color: '#B3A5A0' }}>
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} style={{ color: '#D4AF37', fontWeight: 600 }}>
                Boutique Owner / Admin Portal
              </button>
            </li>
          </ul>
        </div>

        {/* VIP Newsletter */}
        <div>
          <h4 style={{ color: '#FFF', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '14px' }}>
            Atelier Privé
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#B3A5A0', lineHeight: 1.5, marginBottom: '14px' }}>
            Subscribe to receive private invitations to runway previews, festive trunk shows, and secret boutique offers.
          </p>
          {subscribed ? (
            <div style={{
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid #D4AF37',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              color: '#D4AF37',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              ✨ Welcome to Atelier Privé! Use code <strong>WELCOME100</strong> on your first order.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #4A3A35',
                    background: '#2B1C19',
                    color: '#FFF',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#D4AF37',
                    padding: '4px'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#8F7D78' }}>
                We respect your privacy. Unsubscribe anytime.
              </span>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment icons */}
      <div className="container" style={{
        paddingTop: '24px',
        borderTop: '1px solid #332420',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontSize: '0.78rem',
        color: '#8F7D78'
      }}>
        <div>
          © {new Date().getFullYear()} Aura Atelier Couture LLP. All rights reserved. Handcrafted with passion in India.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ color: '#D4AF37', fontWeight: 600 }}>Secured by:</span>
          <span>UPI / Google Pay</span>
          <span>•</span>
          <span>PhonePe</span>
          <span>•</span>
          <span>RuPay</span>
          <span>•</span>
          <span>Visa & MasterCard</span>
          <span>•</span>
          <span>Net Banking</span>
          <span>•</span>
          <span>Cash On Delivery</span>
        </div>
      </div>
    </footer>
  );
}
