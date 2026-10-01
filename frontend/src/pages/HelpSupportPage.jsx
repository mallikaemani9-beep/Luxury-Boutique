import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, MessageSquare, 
  Phone, Mail, MapPin, Send, CheckCircle2 
} from 'lucide-react';

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "How do I track my boutique order in real time?",
      a: "Once your order is placed, you will receive a Bluedart tracking number via SMS and email. You can also visit 'My Orders' -> 'Track Timeline' anytime to see real-time updates as your parcel moves through our Mumbai fulfillment center to your doorstep."
    },
    {
      q: "What is your 7-Day Exchange & Return Policy?",
      a: "We offer complimentary 7-day doorstep exchanges for size adjustments or defects. Items must be unworn, with boutique security tags intact and in original luxury box packaging. Unstitched fabrics and bespoke custom bridal outfits are non-returnable."
    },
    {
      q: "Are the sarees and fabrics 100% authentic handlooms?",
      a: "Yes! Every Banarasi, Kanjeevaram, and Chanderi weave comes with an authentic artisan hallmark tag. We source directly from master weaving clusters across Varanasi, Kanchipuram, and Sanganer."
    },
    {
      q: "Can I customize the blouse stitching or sizing?",
      a: "Yes! All sarees arrive with an unstitched matching blouse piece with 2-inch margins for tailoring. If you require made-to-measure tailoring before dispatch, contact our concierge via WhatsApp with your order reference."
    },
    {
      q: "What payment methods are supported?",
      a: "We accept all Indian UPI apps (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, MasterCard, Net Banking across all major banks, and Cash/QR on Delivery."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="help-support-page container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <span className="badge-gold">Boutique Concierge</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-espresso)', marginTop: '8px' }}>
          How May We Assist You?
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '560px', margin: '8px auto 0' }}>
          Find instant answers to orders, shipping, and styling queries, or connect directly with our atelier stylists.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        {/* FAQs Accordion */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-espresso)', marginBottom: '20px' }}>
            Frequently Asked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      color: isOpen ? 'var(--color-primary)' : 'var(--color-text)',
                      background: isOpen ? 'var(--color-primary-light)' : '#FFF'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--color-border-light)' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Concierge Form */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
            Contact Our Stylist Concierge
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Have a custom order requirement or styling inquiry? Send us a message and our stylist will respond within 4 business hours.
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
              <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Message Dispatched</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Thank you! Our concierge team will reach out to your registered email promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Order query, Sizing advice, Bespoke tailoring"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Message Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem', resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                <Send size={16} /> Send to Atelier Concierge
              </button>
            </form>
          )}

          {/* Quick WhatsApp Support Link */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>Prefer Instant Messaging?</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Chat with our stylists on WhatsApp</span>
            </div>
            <button
              onClick={() => alert("Direct WhatsApp Concierge simulation: Connected to +91 98765 43210 (Aura Atelier Support)")}
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={14} /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
