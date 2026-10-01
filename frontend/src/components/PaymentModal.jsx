import React, { useState } from 'react';
import { 
  X, QrCode, CreditCard, Building2, Wallet, 
  Banknote, ShieldCheck, CheckCircle2, Loader2, Lock 
} from 'lucide-react';
import { api } from '../services/api';

export default function PaymentModal({ isOpen, onClose, orderData, onPaymentSuccess }) {
  const [method, setMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING', 'COD'
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Card Simulator State
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8912',
    name: orderData?.customer_name || 'Priya Sharma',
    expiry: '09/28',
    cvv: '•••'
  });

  // Selected Bank for NetBanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen || !orderData) return null;

  const totalAmount = orderData.net_amount || 0;

  const handleSimulatePayment = async () => {
    setProcessing(true);
    try {
      // Simulate realistic payment gateway roundtrip delay
      await new Promise(r => setTimeout(r, 1600));

      const res = await api.processPaymentSimulation({
        order_id: orderData.order_id,
        method: method,
        amount: totalAmount,
        status: method === 'COD' ? 'Pending' : 'Paid',
        transaction_ref: `TXN_${Date.now()}`
      });

      setProcessing(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
        onPaymentSuccess && onPaymentSuccess(res);
      }, 1200);
    } catch (err) {
      alert("Payment processing error: " + err.message);
      setProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(21, 14, 12, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '540px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        {/* Gateway Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2A1016 0%, #4D0C1E 100%)',
          color: '#FFFFFF',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <Lock size={13} /> 256-Bit Encrypted Boutique Gateway
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600, marginTop: '2px' }}>
              Pay ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#E8C4C8' }}>
              Order #{orderData.order_number}
            </span>
          </div>

          <button 
            onClick={onClose} 
            disabled={processing}
            style={{ color: '#FFF', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {success ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={64} color="var(--color-success)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
              Payment Verified!
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
              Your boutique order is confirmed. Preparing your celebration box...
            </p>
          </div>
        ) : processing ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Loader2 size={54} color="var(--color-primary)" className="animate-spin" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso)', marginBottom: '6px' }}>
              Contacting Payment Network...
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
              Do not refresh or press back. Encrypting transmission.
            </p>
            <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
              .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
          </div>
        ) : (
          <div style={{ padding: '20px 24px' }}>
            {/* Method Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'CARD', label: 'Cards', icon: CreditCard },
                { id: 'NETBANKING', label: 'NetBanking', icon: Building2 },
                { id: 'COD', label: 'Pay on Delivery', icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '12px 6px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? 'var(--color-primary-light)' : '#FFF',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.74rem'
                    }}
                  >
                    <Icon size={20} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Details */}
            {method === 'UPI' && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  Scan UPI QR code or pay with any UPI App
                </p>

                {/* Simulated QR Code */}
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 16px',
                  padding: '10px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--color-gold)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <QrCode size={110} color="var(--color-espresso)" />
                  <span style={{ fontSize: '0.62rem', color: 'var(--color-gold-dark)', fontWeight: 700 }}>
                    BHIM • GPay • Paytm
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'Cred'].map((app) => (
                    <span
                      key={app}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        background: 'var(--color-surface-soft)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {method === 'CARD' && (
              <div>
                {/* Simulated Card Graphic */}
                <div style={{
                  background: 'linear-gradient(135deg, #1F1412 0%, #4D0C1E 100%)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-gold)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: '#D4AF37', letterSpacing: '0.1em' }}>
                      AURA LUXE PRIVÉ
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                      RuPay / VISA
                    </span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', letterSpacing: '0.18em', marginBottom: '14px' }}>
                    {cardDetails.number}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', textTransform: 'uppercase', color: '#E8DFD5' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#A39692' }}>Cardholder</div>
                      <div style={{ fontWeight: 600 }}>{cardDetails.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#A39692' }}>Expires</div>
                      <div style={{ fontWeight: 600 }}>{cardDetails.expiry}</div>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  🔒 Simulated secure sandbox mode. No real card number is collected or stored.
                </p>
              </div>
            )}

            {method === 'NETBANKING' && (
              <div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                  Select your bank:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBank(b)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${selectedBank === b ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: selectedBank === b ? 'var(--color-primary-light)' : '#FFF',
                        fontSize: '0.8rem',
                        fontWeight: selectedBank === b ? 700 : 500,
                        textAlign: 'left'
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {method === 'COD' && (
              <div style={{
                background: 'var(--color-surface-soft)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                margin: '10px 0'
              }}>
                <Banknote size={36} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                  Pay on Delivery (Cash / UPI)
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  You can pay with cash or scan the courier's dynamic QR code upon doorstep delivery.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handleSimulatePayment}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '12px',
                fontSize: '0.95rem'
              }}
            >
              <ShieldCheck size={18} />
              {method === 'COD' ? "Confirm Cash On Delivery Order" : `Complete Payment of ₹${totalAmount.toLocaleString('en-IN')}`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-text-light)', marginTop: '10px' }}>
              <ShieldCheck size={14} color="var(--color-success)" />
              <span>PCI-DSS Level 1 Compliant • Powered by Razorpay Standard Simulation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
