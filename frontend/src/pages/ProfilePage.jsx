import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Package, Heart, 
  ShieldCheck, LogOut, Plus, Trash2, Edit2, Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';

export default function ProfilePage({ onNavigate }) {
  const { user, updateUser, logout, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses'
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: user?.name || '',
    mobile_number: user?.phone || '',
    house_flat: '',
    street: '',
    area: '',
    city: '',
    district: '',
    state: '',
    pin_code: '',
    address_type: 'Home',
    is_default: false
  });

  const loadAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile(profileForm);
      updateUser(res.user);
      setEditingProfile(false);
      setProfileMsg("Profile updated successfully!");
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.createAddress(newAddress);
      await loadAddresses();
      setShowAddAddress(false);
      setNewAddress({
        full_name: user?.name || '',
        mobile_number: user?.phone || '',
        house_flat: '',
        street: '',
        area: '',
        city: '',
        district: '',
        state: '',
        pin_code: '',
        address_type: 'Home',
        is_default: false
      });
    } catch (err) {
      alert("Error adding address: " + err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Delete this saved address?")) {
      try {
        await api.deleteAddress(id);
        await loadAddresses();
      } catch (err) {
        alert("Error deleting address: " + err.message);
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await api.setDefaultAddress(id);
      await loadAddresses();
    } catch (err) {
      alert("Error setting default: " + err.message);
    }
  };

  return (
    <div className="profile-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '36px',
        alignItems: 'flex-start'
      }}>
        {/* Left Side: Patron Profile Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            border: '2px solid var(--color-gold)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={44} color="var(--color-primary)" />
            )}
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--color-espresso)' }}>
            {user?.name}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            {user?.email}
          </p>

          <span className={isAdmin ? 'badge-burgundy' : 'badge-gold'} style={{ marginBottom: '24px', display: 'inline-block' }}>
            {isAdmin ? '👑 Boutique Admin' : '✨ Patron Member'}
          </span>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            padding: '16px 0',
            borderTop: '1px solid var(--color-border-light)',
            borderBottom: '1px solid var(--color-border-light)',
            marginBottom: '20px'
          }}>
            <div 
              onClick={() => onNavigate('orders')}
              style={{ cursor: 'pointer', padding: '8px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}
            >
              <Package size={18} color="var(--color-primary)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>My Orders</div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>View All</strong>
            </div>

            <div 
              onClick={() => onNavigate('wishlist')}
              style={{ cursor: 'pointer', padding: '8px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}
            >
              <Heart size={18} color="var(--color-primary)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Wishlist</div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{wishlistCount} Saved</strong>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
                background: activeTab === 'profile' ? 'var(--color-primary-light)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                fontSize: '0.88rem'
              }}
            >
              Personal Profile Info
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
                background: activeTab === 'addresses' ? 'var(--color-primary-light)' : 'transparent',
                color: activeTab === 'addresses' ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: activeTab === 'addresses' ? 700 : 500,
                fontSize: '0.88rem'
              }}
            >
              Saved Delivery Addresses ({addresses.length})
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShieldCheck size={16} /> Open Admin Portal
              </button>
            )}

            <button
              onClick={() => { logout(); onNavigate('home'); }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
                color: 'var(--color-danger)',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px'
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {profileMsg && (
            <div style={{
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Check size={16} /> {profileMsg}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                  Personal Information
                </h3>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Edit2 size={14} /> {editingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Mobile Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Avatar Image URL</label>
                    <input
                      type="url"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                    Save Profile Changes
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem' }}>
                  <div style={{ padding: '14px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Full Name</span>
                    <strong>{user?.name}</strong>
                  </div>
                  <div style={{ padding: '14px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Email Address</span>
                    <strong>{user?.email}</strong>
                  </div>
                  <div style={{ padding: '14px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Phone Number</span>
                    <strong>{user?.phone || 'Not provided'}</strong>
                  </div>
                  <div style={{ padding: '14px', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Membership Type</span>
                    <strong>{user?.role === 'admin' ? 'Boutique Administrator' : 'Privé Patron'}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                  Saved Addresses
                </h3>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Add New Address
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} style={{
                  background: 'var(--color-surface-soft)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>New Address</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={newAddress.full_name}
                      onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number"
                      value={newAddress.mobile_number}
                      onChange={(e) => setNewAddress({ ...newAddress, mobile_number: e.target.value })}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Building Name"
                    value={newAddress.house_flat}
                    onChange={(e) => setNewAddress({ ...newAddress, house_flat: e.target.value })}
                    style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street / Area / Locality"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="PIN Code"
                      value={newAddress.pin_code}
                      onChange={(e) => setNewAddress({ ...newAddress, pin_code: e.target.value, area: e.target.value })}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '9px', fontSize: '0.82rem' }}>
                      Save Address
                    </button>
                    <button type="button" onClick={() => setShowAddAddress(false)} className="btn-secondary" style={{ flex: 1, padding: '9px', fontSize: '0.82rem' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      padding: '16px 20px',
                      background: 'var(--color-surface-soft)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong>{addr.full_name}</strong>
                        <span className="badge-gold" style={{ fontSize: '0.65rem' }}>{addr.address_type}</span>
                        {addr.is_default ? (
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 700 }}>Default Address</span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        {addr.house_flat}, {addr.street}, {addr.city}, {addr.state} - {addr.pin_code}
                      </p>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text)', marginTop: '4px' }}>
                        Phone: {addr.mobile_number}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      style={{ color: 'var(--color-danger)', padding: '6px' }}
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
