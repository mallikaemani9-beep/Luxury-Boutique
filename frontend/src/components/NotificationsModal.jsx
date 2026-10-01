import React from 'react';
import { X, Bell, Package, Sparkles, CheckCheck, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function NotificationsModal({ isOpen, onClose, notifications = [], onRefresh, onNavigate }) {
  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      onRefresh && onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    try {
      if (!notif.is_read) {
        await api.markNotificationRead(notif.id);
        onRefresh && onRefresh();
      }
      onClose();
      if (notif.link) {
        if (notif.link.startsWith('/orders')) {
          onNavigate('orders');
        } else if (notif.link.startsWith('/shop')) {
          onNavigate('shop');
        } else if (notif.link.startsWith('/profile')) {
          onNavigate('profile');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(21, 14, 12, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          background: '#FFFFFF',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-surface-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--color-primary)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600 }}>
              Notifications
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notifications.some(n => !n.is_read) && (
              <button 
                onClick={handleMarkAllRead}
                style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Mark all as read"
              >
                <CheckCheck size={15} /> Mark Read
              </button>
            )}
            <button 
              onClick={onClose}
              style={{ padding: '6px', color: 'var(--color-text-muted)', borderRadius: '50%' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Bell size={40} color="var(--color-border)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No notifications yet</p>
              <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>You will see order tracking and festive boutique discounts here.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '8px',
                  background: notif.is_read ? '#FFFFFF' : 'var(--color-primary-light)',
                  border: `1px solid ${notif.is_read ? 'var(--color-border)' : 'rgba(104, 19, 44, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: notif.type === 'order' ? 'var(--color-primary-light)' : '#FEF3C7',
                  color: notif.type === 'order' ? 'var(--color-primary)' : 'var(--color-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {notif.type === 'order' ? <Package size={18} /> : <Sparkles size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: notif.is_read ? 600 : 700, color: 'var(--color-espresso)' }}>
                      {notif.title}
                    </h5>
                    {!notif.is_read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-light)', marginTop: '6px', display: 'inline-block' }}>
                    {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
