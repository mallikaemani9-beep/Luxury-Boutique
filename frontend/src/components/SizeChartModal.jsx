import React, { useState } from 'react';
import { X, Ruler, Info } from 'lucide-react';

export default function SizeChartModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'

  if (!isOpen) return null;

  const chartData = [
    { size: 'XS', bust: unit === 'in' ? '32 - 34' : '81 - 86', waist: unit === 'in' ? '26 - 28' : '66 - 71', hip: unit === 'in' ? '35 - 37' : '89 - 94', length: unit === 'in' ? '46' : '117' },
    { size: 'S', bust: unit === 'in' ? '34 - 36' : '86 - 91', waist: unit === 'in' ? '28 - 30' : '71 - 76', hip: unit === 'in' ? '37 - 39' : '94 - 99', length: unit === 'in' ? '46.5' : '118' },
    { size: 'M', bust: unit === 'in' ? '36 - 38' : '91 - 96', waist: unit === 'in' ? '30 - 32' : '76 - 81', hip: unit === 'in' ? '39 - 41' : '99 - 104', length: unit === 'in' ? '47' : '119' },
    { size: 'L', bust: unit === 'in' ? '38 - 40' : '96 - 101', waist: unit === 'in' ? '32 - 34' : '81 - 86', hip: unit === 'in' ? '41 - 43' : '104 - 109', length: unit === 'in' ? '47.5' : '120' },
    { size: 'XL', bust: unit === 'in' ? '40 - 42' : '101 - 107', waist: unit === 'in' ? '34 - 36' : '86 - 91', hip: unit === 'in' ? '43 - 45' : '109 - 114', length: unit === 'in' ? '48' : '122' },
    { size: 'XXL', bust: unit === 'in' ? '42 - 44' : '107 - 112', waist: unit === 'in' ? '36 - 38' : '91 - 96', hip: unit === 'in' ? '45 - 47' : '114 - 119', length: unit === 'in' ? '48.5' : '123' },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(21, 14, 12, 0.6)',
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
          maxWidth: '560px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ruler size={20} color="var(--color-primary)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
              Boutique Sizing & Measurement Guide
            </h3>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Unit Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex',
              background: 'var(--color-surface-soft)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <button
                onClick={() => setUnit('in')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: unit === 'in' ? 'var(--color-primary)' : 'transparent',
                  color: unit === 'in' ? '#FFF' : 'var(--color-text-muted)'
                }}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: unit === 'cm' ? 'var(--color-primary)' : 'transparent',
                  color: unit === 'cm' ? '#FFF' : 'var(--color-text-muted)'
                }}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-soft)', borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700 }}>Size</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Bust ({unit})</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Waist ({unit})</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Hip ({unit})</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Length ({unit})</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, idx) => (
                  <tr key={row.size} style={{ borderBottom: '1px solid var(--color-border)', background: idx % 2 === 0 ? '#FFF' : '#FCF9F5' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-primary)' }}>{row.size}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.bust}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.waist}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.hip}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Guidance note */}
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '12px 14px',
            background: 'var(--color-surface-soft)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)'
          }}>
            <Info size={18} color="var(--color-gold-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Tailoring Tip:</strong> Sarees come with unstitched blouse material with 2-inch margin. For Anarkalis and Kurtis, choose a size 1-2 inches larger than your snug body measurement for the perfect graceful drape.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
