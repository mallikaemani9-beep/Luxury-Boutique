import React, { useState, useEffect } from 'react';
import { 
  Truck, CheckCircle, Clock, Package, MapPin, 
  ArrowLeft, ShieldCheck, Check, AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';

export default function OrderTrackingPage({ orderId, onNavigate }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracking() {
      try {
        setLoading(true);
        const data = await api.trackOrder(orderId);
        setTrackingData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) {
      loadTracking();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
        <div className="animate-shimmer" style={{ height: '380px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>Tracking Information Unavailable</h3>
        <button onClick={() => onNavigate('orders')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Orders
        </button>
      </div>
    );
  }

  const { order, timeline, standard_steps, current_step_index } = trackingData;

  return (
    <div className="order-tracking-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <button
        onClick={() => onNavigate('orders')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to My Orders
      </button>

      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: '820px',
        margin: '0 auto'
      }}>
        {/* Header Details */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '20px',
          marginBottom: '32px',
          gap: '16px'
        }}>
          <div>
            <span className="badge-gold">Live Courier Status</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-espresso)', marginTop: '4px' }}>
              Tracking Order #{order.order_number}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Carrier: <strong>{order.courier_name || 'Bluedart Express'}</strong> • Tracking ID: <strong>{order.tracking_number}</strong>
            </p>
          </div>

          <div style={{
            background: 'var(--color-surface-soft)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated Delivery</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>
              {order.estimated_delivery || 'In 3-4 Days'}
            </div>
          </div>
        </div>

        {/* Visual Stepper Progression Bar */}
        <div style={{ marginBottom: '40px', padding: '0 10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Background Track Line */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              right: '20px',
              height: '4px',
              background: '#EBE3D8',
              zIndex: 1
            }} />

            {/* Active Highlight Line */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              width: current_step_index >= 0 ? `${(current_step_index / (standard_steps.length - 1)) * 92}%` : '0%',
              height: '4px',
              background: 'var(--color-primary)',
              transition: 'width 0.6s ease',
              zIndex: 2
            }} />

            {/* Step Checkpoints */}
            {standard_steps.map((step, idx) => {
              const isPast = idx <= current_step_index;
              const isCurrent = idx === current_step_index;

              return (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    zIndex: 3,
                    flex: 1,
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--color-primary)' : isPast ? '#500E22' : '#FFF',
                    border: `2px solid ${isPast ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    color: isPast ? '#FFF' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? '0 0 12px rgba(104, 19, 44, 0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {isPast ? <Check size={16} strokeWidth={2.6} /> : <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{idx + 1}</span>}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: isCurrent ? 800 : isPast ? 600 : 500,
                    color: isCurrent ? 'var(--color-primary)' : isPast ? 'var(--color-text)' : 'var(--color-text-light)',
                    maxWidth: '80px',
                    lineHeight: 1.2
                  }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline Events */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '20px' }}>
            Tracking Updates & Milestones
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '28px' }}>
            {/* Timeline vertical connector */}
            <div style={{
              position: 'absolute',
              top: '12px',
              bottom: '12px',
              left: '9px',
              width: '2px',
              background: 'var(--color-border)'
            }} />

            {timeline.map((event, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Checkpoint Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-28px',
                  top: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: idx === timeline.length - 1 ? 'var(--color-primary)' : '#FFFFFF',
                  border: '2px solid var(--color-primary)',
                  boxShadow: idx === timeline.length - 1 ? '0 0 8px rgba(104, 19, 44, 0.4)' : 'none'
                }} />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                      {event.status}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                      {event.location}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {event.description}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', marginTop: '4px', display: 'inline-block' }}>
                    {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated Delivery Route Map */}
        <div style={{
          marginTop: '36px',
          background: 'var(--color-surface-soft)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Truck size={22} color="var(--color-primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Bluedart Air Express Delivery in Motion</h5>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Your order is packaged with weather-proof seal and tamper-evident boutique ribbon. You will receive an SMS OTP when out for delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
