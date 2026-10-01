import React, { useEffect } from 'react';
import { CheckCircle, Package, ArrowRight, Download, Truck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage({ orderData, onNavigate }) {
  useEffect(() => {
    // Launch celebratory luxury confetti burst
    const end = Date.now() + 1500;
    const colors = ['#68132C', '#D4AF37', '#E8C4C8', '#FAF3E5'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleDownloadInvoice = () => {
    const text = `
=============================================
           AURA ATELIER COUTURE
        Official Tax Invoice Receipt
=============================================
Order Reference : ${orderData?.order_number || 'AUR-2026-9812'}
Order Date      : ${new Date().toLocaleDateString()}
Payment Status  : PAID (Verified via Secure Gateway)
Est. Delivery   : ${orderData?.estimated_delivery || 'Expected in 3-4 business days'}
Total Paid      : ₹${orderData?.net_amount?.toFixed(2) || '3,199.00'}

Thank you for choosing Aura Atelier!
For inquiries: concierge@auraboutique.com
=============================================
`;
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${orderData?.order_number || 'AUR'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="order-confirmation-page container" style={{ padding: '60px 20px', minHeight: '80vh', textAlign: 'center' }}>
      <div style={{
        maxWidth: '580px',
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-gold)',
        padding: '40px 32px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Celebration Insignia */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 24px rgba(104, 19, 44, 0.2)'
        }}>
          <CheckCircle size={44} />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
          <Sparkles size={14} /> Congratulations Patron <Sparkles size={14} />
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
          Order Successfully Placed!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          Your order has been verified and dispatched to our boutique artisans for hand-inspection and gift packaging.
        </p>

        {/* Order Details Highlight Box */}
        <div style={{
          background: 'var(--color-surface-soft)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Order ID:</span>
            <strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
              {orderData?.order_number || 'AUR-2026-9812'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Estimated Delivery:</span>
            <strong>{orderData?.estimated_delivery || 'In 3-4 Business Days'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Amount Paid:</span>
            <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
              ₹{orderData?.net_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => onNavigate('track-order', { id: orderData?.order_id })}
            className="btn-primary"
            style={{ width: '100%', padding: '13px' }}
          >
            <Truck size={18} />
            <span>Track Order Timeline</span>
          </button>

          <button
            onClick={handleDownloadInvoice}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px' }}
          >
            <Download size={16} />
            <span>Download Invoice Receipt</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '8px' }}
          >
            Return to Boutique Home
          </button>
        </div>
      </div>
    </div>
  );
}
