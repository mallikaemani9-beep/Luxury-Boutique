import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SplashScreen({ onEnter }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onEnter, 600);
    }, 2400);
    return () => clearTimeout(timer);
  }, [onEnter]);

  const handleManualEnter = () => {
    setFading(true);
    setTimeout(onEnter, 400);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle at center, #68132C 0%, #2A0610 70%, #150308 100%)',
      color: '#FFFFFF',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: fading ? 'none' : 'auto',
      padding: '24px',
      textAlign: 'center'
    }}>
      {/* Golden Aura Ring */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px dashed #D4AF37',
          animation: 'spin 18s linear infinite'
        }} />
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7D1735 0%, #4D0C1E 100%)',
          border: '2px solid #D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(212, 175, 55, 0.4)'
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.8rem',
            color: '#D4AF37',
            fontWeight: 'bold',
            lineHeight: 1
          }}>
            A
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#D4AF37',
        fontSize: '0.8rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 600,
        marginBottom: '10px'
      }}>
        <Sparkles size={14} /> Haute Couture & Heritage <Sparkles size={14} />
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: '#FFFFFF',
        marginBottom: '12px',
        textShadow: '0 2px 16px rgba(0, 0, 0, 0.5)'
      }}>
        AURA ATELIER
      </h1>

      <p style={{
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        color: '#E8C4C8',
        maxWidth: '440px',
        lineHeight: 1.6,
        marginBottom: '32px'
      }}>
        "Where timeless Indian weaves meet contemporary regal silhouettes."
      </p>

      <button
        onClick={handleManualEnter}
        style={{
          background: 'linear-gradient(135deg, #D4AF37 0%, #9E7D3B 100%)',
          color: '#1A040A',
          padding: '12px 28px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: '0.06em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <span>Enter Boutique</span>
        <ArrowRight size={16} />
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
