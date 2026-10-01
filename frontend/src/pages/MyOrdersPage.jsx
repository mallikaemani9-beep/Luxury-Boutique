import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, ArrowRight, XCircle, 
  ExternalLink, Calendar, CheckCircle2, Clock, AlertTriangle 
} from 'lucide-react';
import { api } from '../services/api';

export default function MyOrdersPage({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order? Stock will be restored to boutique inventory.")) {
      try {
        await api.cancelOrder(orderId);
        await fetchOrders();
      } catch (err) {
        alert("Cannot cancel order: " + err.message);
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'active') {
      return ['Order Placed', 'Order Confirmed', 'Packed', 'Shipped', 'Out for Delivery'].includes(o.order_status);
    }
    if (activeTab === 'delivered') {
      return o.order_status === 'Delivered';
    }
    if (activeTab === 'cancelled') {
      return o.order_status === 'Cancelled';
    }
    return true;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#ECFDF5', color: '#15803D', icon: CheckCircle2 };
      case 'Cancelled':
        return { bg: '#FEF2F2', color: '#B91C1C', icon: XCircle };
      case 'Shipped':
      case 'Out for Delivery':
        return { bg: '#EFF6FF', color: '#1D4ED8', icon: Truck };
      default:
        return { bg: '#FEF3C7', color: '#B45309', icon: Clock };
    }
  };

  return (
    <div className="my-orders-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
        My Boutique Orders
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '28px' }}>
        Track your bespoke creations, order histories, and real-time delivery timelines.
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '12px',
        marginBottom: '28px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'active', label: `In Progress (${orders.filter(o => !['Delivered', 'Cancelled'].includes(o.order_status)).length})` },
          { id: 'delivered', label: `Delivered (${orders.filter(o => o.order_status === 'Delivered').length})` },
          { id: 'cancelled', label: `Cancelled (${orders.filter(o => o.order_status === 'Cancelled').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-surface-soft)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: '0.82rem',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-shimmer" style={{ height: '160px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <Package size={48} color="var(--color-border)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-espresso)' }}>
            No orders found in this view
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '6px', marginBottom: '20px' }}>
            Browse our handloom sarees, anarkalis, and lehengas to place your order.
          </p>
          <button onClick={() => onNavigate('shop')} className="btn-primary" style={{ padding: '10px 24px' }}>
            Explore Collections
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map((order) => {
            const badge = getStatusBadgeClass(order.order_status);
            const BadgeIcon = badge.icon;
            const canCancel = ['Order Placed', 'Order Confirmed', 'Packed'].includes(order.order_status);

            return (
              <div
                key={order.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Order Card Header */}
                <div style={{
                  padding: '16px 20px',
                  background: 'var(--color-surface-soft)',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Order Reference</span>
                      <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        {order.order_number}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Order Date</span>
                      <strong>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Total Paid</span>
                      <strong style={{ color: 'var(--color-primary)' }}>₹{order.net_amount?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: badge.bg,
                    color: badge.color,
                    fontWeight: 700,
                    fontSize: '0.78rem'
                  }}>
                    <BadgeIcon size={15} />
                    <span>{order.order_status}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                    {order.items?.map((item) => (
                      <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img
                          src={item.product_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80"}
                          alt={item.product_name}
                          style={{ width: '64px', height: '80px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, fontSize: '0.85rem' }}>
                          <h4 style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>{item.product_name}</h4>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginTop: '3px' }}>
                            Size: <strong>{item.size}</strong> • Qty: <strong>{item.quantity}</strong>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                            ₹{item.total_price?.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div style={{
                    borderTop: '1px solid var(--color-border-light)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      Estimated Arrival: <strong>{order.estimated_delivery || 'Expected in 3-4 days'}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-danger)',
                            color: 'var(--color-danger)',
                            fontSize: '0.78rem',
                            fontWeight: 600
                          }}
                        >
                          Cancel Order
                        </button>
                      )}

                      <button
                        onClick={() => onNavigate('track-order', { id: order.id })}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      >
                        <Truck size={15} />
                        <span>Track Timeline</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
