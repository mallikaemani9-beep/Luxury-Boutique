import React, { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Check, Truck, ShieldCheck, 
  CreditCard, Banknote, QrCode, ArrowLeft, Building2 
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import PaymentModal from '../components/PaymentModal';

export default function CheckoutPage({ onNavigate, onOrderSuccess }) {
  const { cartItems, summary, appliedCoupon, finalTotal } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // New Address Form State
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    mobile_number: '',
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

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const addrs = await api.getAddresses();
        setAddresses(addrs || []);
        if (addrs && addrs.length > 0) {
          const defaultAddr = addrs.find(a => a.is_default) || addrs[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadAddresses();
  }, []);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const newAddr = await api.createAddress(addressForm);
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
      setShowNewAddressModal(false);
      setAddressForm({
        full_name: '',
        mobile_number: '',
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
      alert("Error saving address: " + err.message);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddressId && addresses.length === 0) {
      alert("Please add and select a delivery address.");
      return;
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        shipping_address_id: selectedAddressId,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        delivery_charge: summary.delivery_charge || 0.0
      };

      const res = await api.placeOrder(orderPayload);
      setCreatedOrder(res);
      setPaymentModalOpen(true);
    } catch (err) {
      alert("Error initiating checkout: " + err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <button
        onClick={() => onNavigate('cart')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Return to Shopping Bag
      </button>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--color-espresso)', marginBottom: '32px' }}>
        Express Boutique Checkout
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        {/* Left Side: Address Selection & Payment Method */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* 1. Address Section */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  1
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
                  Select Delivery Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAddressModal(true)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add Address
              </button>
            </div>

            {/* Address Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? 'var(--color-primary-light)' : '#FFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{addr.full_name}</span>
                        <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{addr.address_type}</span>
                        {addr.is_default && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600 }}>Default</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                        {addr.house_flat}, {addr.street}, {addr.area}, {addr.city}, {addr.state} - <strong>{addr.pin_code}</strong>
                      </p>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text)', marginTop: '4px', fontWeight: 600 }}>
                        Mobile: {addr.mobile_number}
                      </div>
                    </div>
                  </div>
                );
              })}

              {addresses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    No saved addresses found. Please add a shipping destination.
                  </p>
                  <button onClick={() => setShowNewAddressModal(true)} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                2
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
                Choose Payment Method
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode, desc: 'Google Pay, PhonePe, Paytm' },
                { id: 'CARD', label: 'Debit / Credit Card', icon: CreditCard, desc: 'Visa, RuPay, MasterCard' },
                { id: 'NETBANKING', label: 'Net Banking', icon: Building2, desc: 'All Major Indian Banks' },
                { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay at Doorstep' }
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = paymentMethod === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? 'var(--color-primary-light)' : '#FFF',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <Icon size={20} color={isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)', marginTop: '4px' }}>
                      {p.label}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {p.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '18px' }}>
            Bag Summary ({cartItems.length} items)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto', marginBottom: '16px' }}>
            {cartItems.map((itm) => (
              <div key={itm.cart_id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src={itm.product_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80"}
                  alt={itm.name}
                  style={{ width: '48px', height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{itm.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.74rem' }}>
                    Qty: {itm.quantity} • Size: {itm.size}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                  ₹{(itm.discounted_price * itm.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
              <span>₹{summary.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                <span>Coupon ({appliedCoupon.code})</span>
                <span>- ₹{appliedCoupon.discount_amount?.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Estimated Delivery</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>FREE EXPRESS</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '14px', fontSize: '1.25rem', fontWeight: 800 }}>
              <span style={{ fontFamily: 'var(--font-serif)' }}>Final Payable</span>
              <span style={{ color: 'var(--color-primary)' }}>
                ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={placingOrder}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '20px', fontSize: '0.95rem' }}
          >
            {placingOrder ? "Securing Order..." : `Pay ₹${finalTotal.toLocaleString('en-IN')} & Confirm`}
          </button>
        </div>
      </div>

      {/* New Address Modal */}
      {showNewAddressModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(21, 14, 12, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '16px' }}>
              Add Delivery Address
            </h3>

            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={addressForm.full_name}
                    onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={addressForm.mobile_number}
                    onChange={(e) => setAddressForm({ ...addressForm, mobile_number: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Flat / House No. / Villa Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Palm Heights"
                  value={addressForm.house_flat}
                  onChange={(e) => setAddressForm({ ...addressForm, house_flat: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Street & Locality</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Feet Road, Indiranagar"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>City</label>
                  <input
                    type="text"
                    required
                    placeholder="Bengaluru"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>State</label>
                  <input
                    type="text"
                    required
                    placeholder="Karnataka"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="560038"
                    value={addressForm.pin_code}
                    onChange={(e) => setAddressForm({ ...addressForm, pin_code: e.target.value, area: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Address Type</label>
                  <select
                    value={addressForm.address_type}
                    onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  >
                    <option value="Home">Home</option>
                    <option value="Work / Office">Work / Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewAddressModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Payment Modal Simulation */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderData={createdOrder}
        onPaymentSuccess={(payRes) => {
          onOrderSuccess && onOrderSuccess(createdOrder);
        }}
      />
    </div>
  );
}
