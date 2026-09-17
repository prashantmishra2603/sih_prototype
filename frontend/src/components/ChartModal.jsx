import { useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function ChartModal({ isOpen, onClose, title = 'Chart Full View', subtitle = '', children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        sound.playTap();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="chart-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(30, 58, 138, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--blue)'
              }}
            >
              <Maximize2 size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{title}</h3>
              {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>}
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm chart-modal-close"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            style={{ padding: '6px 12px', gap: 6 }}
            aria-label="Close"
          >
            <X size={16} /><span className="chart-modal-close-text">Close Full View</span>
          </button>
        </div>
        <div className="chart-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
