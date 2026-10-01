import React, { useState } from 'react';
import { X, Star, Upload, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ReviewModal({ isOpen, onClose, productId, productName, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const images = imageUrl.trim() ? [imageUrl.trim()] : [];
      await api.addReview({
        product_id: productId,
        rating,
        comment,
        images
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onReviewSubmitted && onReviewSubmitted();
      }, 1000);
    } catch (err) {
      alert("Error submitting review: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '460px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-surface-soft)'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
              Write a Review
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {productName}
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={54} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>Review Published!</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Thank you for sharing your experience with our atelier.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Star Rating Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>
                Your Overall Rating
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ padding: '4px', cursor: 'pointer' }}
                  >
                    <Star
                      size={28}
                      fill={(hoverRating || rating) >= star ? '#D4AF37' : 'none'}
                      color={(hoverRating || rating) >= star ? '#D4AF37' : '#D1C7BD'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Your Feedback & Experience
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe fabric softness, fitting, embroidery quality, and styling compliments received..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                  resize: 'none'
                }}
              />
            </div>

            {/* Optional Customer Photo URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Customer Photo (Optional Image URL)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem'
                  }}
                />
                <Upload size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px' }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
