import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [roleMode, setRoleMode] = useState('customer'); // 'customer' or 'admin'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFillDemoCustomer = () => {
    setFormData({
      ...formData,
      email: 'customer@auraboutique.com',
      password: 'Customer@123'
    });
    setRoleMode('customer');
  };

  const handleFillDemoAdmin = () => {
    setFormData({
      ...formData,
      email: 'admin@auraboutique.com',
      password: 'Admin@123'
    });
    setRoleMode('admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const loggedUser = await login({
          email: formData.email,
          password: formData.password
        });
        setSuccessMsg(`Welcome back, ${loggedUser.name}!`);
        setTimeout(() => {
          onClose();
          onSuccess && onSuccess(loggedUser);
        }, 600);
      } else if (mode === 'register') {
        const newUser = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'customer'
        });
        setSuccessMsg(`Account created successfully! Welcome, ${newUser.name}.`);
        setTimeout(() => {
          onClose();
          onSuccess && onSuccess(newUser);
        }, 600);
      } else if (mode === 'forgot') {
        const res = await api.forgotPassword({
          email: formData.email,
          new_password: formData.newPassword
        });
        setSuccessMsg(res.message);
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(21, 14, 12, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div 
        className="glass-panel"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '440px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        {/* Top Header Decor */}
        <div style={{
          background: 'linear-gradient(135deg, #68132C 0%, #4A0E1F 100%)',
          color: '#FFFFFF',
          padding: '24px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: '#FFFFFF',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Sparkles size={14} /> Aura Atelier Privé
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Your Account' : 'Reset Password'}
          </h3>
          <p style={{ color: '#E8C4C8', fontSize: '0.82rem', marginTop: '2px' }}>
            {mode === 'login' ? 'Sign in to access your orders, wishlist & boutique perks' : mode === 'register' ? 'Join our luxury circle and enjoy exclusive festive benefits' : 'Enter your registered email and choose a new password'}
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Role toggle (Customer vs Admin Login) if on Login mode */}
          {mode === 'login' && (
            <div style={{
              display: 'flex',
              background: 'var(--color-surface-soft)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px',
              marginBottom: '16px'
            }}>
              <button
                type="button"
                onClick={() => setRoleMode('customer')}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: roleMode === 'customer' ? '#FFF' : 'transparent',
                  color: roleMode === 'customer' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  boxShadow: roleMode === 'customer' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Customer Sign In
              </button>
              <button
                type="button"
                onClick={() => setRoleMode('admin')}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: roleMode === 'admin' ? 'var(--color-primary)' : 'transparent',
                  color: roleMode === 'admin' ? '#FFF' : 'var(--color-text-muted)',
                  boxShadow: roleMode === 'admin' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                🛡️ Admin Sign In
              </button>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          {mode === 'login' && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <button
                type="button"
                onClick={handleFillDemoCustomer}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  background: '#FDFBF7',
                  border: '1px dashed var(--color-gold)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.74rem',
                  color: 'var(--color-gold-dark)',
                  fontWeight: 600
                }}
              >
                ⚡ 1-Click Customer Demo
              </button>
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  background: '#FDFBF7',
                  border: '1px dashed var(--color-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.74rem',
                  color: 'var(--color-primary)',
                  fontWeight: 600
                }}
              >
                👑 1-Click Admin Demo
              </button>
            </div>
          )}

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <CheckCircle size={16} flexShrink={0} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <User size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem'
                  }}
                />
                <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98123 45678"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Phone size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: 600 }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            )}

            {mode === 'forgot' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    name="newPassword"
                    required
                    placeholder="Enter at least 6 characters"
                    value={formData.newPassword}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '4px' }}
            >
              {loading ? "Authenticating..." : mode === 'login' ? "Sign In to Boutique" : mode === 'register' ? "Create My Account" : "Update Password"}
            </button>
          </form>

          {/* Mode Switcher Footer */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            {mode === 'login' ? (
              <span>
                New to Aura Atelier?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                >
                  Create an Account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
