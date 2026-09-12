import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, AlertCircle, AlertTriangle, CheckCircle2, Megaphone } from 'lucide-react';
import { useToast } from './Toast';

const INITIAL_NOTIFS = [
  { id: 1, icon: '🚨', title: 'Missing GST Certificate', body: 'Sigma Electronics — GEM/2026/B/4521. Deadline in 6 hours.', time: '2m ago', unread: true, type: 'critical' },
  { id: 2, icon: '⚠️', title: 'ISO 9001 Expiring Soon', body: 'TechCraft Solutions — Certificate expires in 14 days.', time: '15m ago', unread: true, type: 'warning' },
  { id: 3, icon: '⏰', title: '48-Hour Window Closing', body: 'GEM/2026/B/4498 representation period ends in 32 hours.', time: '1h ago', unread: true, type: 'warning' },
  { id: 4, icon: '✅', title: 'AI Scan Completed', body: '8 bids processed — 6 compliant, 2 flagged.', time: '2h ago', unread: false, type: 'info' },
  { id: 5, icon: '📢', title: 'Policy Update: GFR Amendment 2026', body: 'Rule 149 amendment effective Oct 1, 2026.', time: '5h ago', unread: false, type: 'info' },
];

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const unreadCount = notifs.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'success');
  };

  const markRead = (id) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
    <div className="notif-wrapper" ref={panelRef} style={{ position: 'relative' }}>
      <button className="notif-btn" onClick={() => setOpen(!open)} title="Notifications">
        <Bell size={18} />
        {unreadCount > 0 && <span className="notif-dot" />}
      </button>

      {open && (
        <div className="notif-panel open">
          <div className="notif-panel-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔔 Notifications</span>
              {unreadCount > 0 && (
                <span style={{ background: 'var(--red)', color: '#fff', fontSize: '0.7rem', padding: '1px 7px', borderRadius: 10 }}>
                  {unreadCount}
                </span>
              )}
            </h3>
            <span className="notif-panel-mark" onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCheck size={13} /> Mark all read
            </span>
          </div>

          <div id="notif-list" style={{ maxHeight: 340, overflowY: 'auto' }}>
            {notifs.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${n.unread ? 'unread' : ''}`}
                onClick={() => markRead(n.id)}
              >
                <div className="notif-icon">{n.icon}</div>
                <div className="notif-body" style={{ flex: 1 }}>
                  <h4>{n.title}</h4>
                  <p>{n.body}</p>
                  <div className="notif-time">{n.time}</div>
                </div>
                {n.unread && <div className="notif-unread-dot" />}
              </div>
            ))}
          </div>

          <div className="notif-panel-footer">
            <a
              onClick={() => {
                setOpen(false);
                navigate('/analytics');
              }}
            >
              View audit trail &amp; system log →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
