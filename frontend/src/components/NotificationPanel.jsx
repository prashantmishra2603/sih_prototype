import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useToast } from './Toast';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api/client';

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  } catch {
    return isoString;
  }
}

function isAppAlertsEnabled() {
  if (typeof window !== 'undefined' && typeof window.appAlerts === 'boolean') {
    return window.appAlerts;
  }
  try {
    const direct = localStorage.getItem('appAlerts');
    if (direct !== null) {
      return direct === 'true' || direct === '1';
    }
    const storedSettings = localStorage.getItem('bidcheck_settings') || localStorage.getItem('settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      if (parsed && typeof parsed.appAlerts === 'boolean') {
        return parsed.appAlerts;
      }
    }
  } catch {}
  return true;
}

function mapNotification(n) {
  const isCritical = n.severity === 'HIGH' || n.type === 'critical';
  const isWarning = n.severity === 'MEDIUM' || n.type === 'warning';
  return {
    id: n.id,
    user_id: n.user_id,
    tender_id: n.tender_id,
    bid_id: n.bid_id,
    icon: isCritical ? '🚨' : (isWarning ? '⚠️' : 'ℹ️'),
    title: n.title,
    body: n.message || n.reason || '',
    time: formatTimeAgo(n.created_at),
    read: Boolean(n.read),
    unread: !n.read,
    type: n.type || (isCritical ? 'critical' : 'info'),
    severity: n.severity,
    created_at: n.created_at,
  };
}

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const panelRef = useRef(null);
  const knownIdsRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setNotifs([]);
      knownIdsRef.current = null;
      return;
    }

    let isMounted = true;

    const fetchNotifs = async () => {
      try {
        const data = await getNotifications(user.id);
        if (!isMounted || !Array.isArray(data)) return;

        setNotifs(data.map(mapNotification));

        if (knownIdsRef.current === null) {
          // Initial fetch: record existing notification IDs as known; do not toast historical items
          knownIdsRef.current = new Set(data.map((n) => n.id));
        } else {
          // Subsequent polling fetch: detect genuinely new notifications
          const newNotifs = data.filter((n) => !knownIdsRef.current.has(n.id));

          // Record new IDs immediately to prevent duplicate alerts
          for (const n of newNotifs) {
            knownIdsRef.current.add(n.id);
          }

          if (isAppAlertsEnabled() && newNotifs.length > 0) {
            for (const n of newNotifs) {
              const toastType =
                n.severity === 'HIGH' || n.type === 'critical'
                  ? 'error'
                  : n.severity === 'MEDIUM' || n.type === 'warning'
                  ? 'warning'
                  : 'info';

              const toastContent = (
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ fontWeight: 600 }}>{n.title}</strong>
                  <span style={{ fontSize: '0.78rem' }}>
                    {n.message || `Bid ${n.bid_id} for Tender ${n.tender_id}`}
                  </span>
                  {n.reason && (
                    <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>
                      {n.reason}
                    </span>
                  )}
                </span>
              );

              showToast(toastContent, toastType);
            }
          }
        }
      } catch (err) {
        // API/polling failure: keep current notifications, do not replace with fake data
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.id, showToast]);

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await markAllNotificationsRead(user.id);
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true, unread: false })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const markRead = async (id) => {
    if (!user?.id) return;
    try {
      await markNotificationRead(id, user.id);
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true, unread: false } : n)));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
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
            {notifs.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No notifications
              </div>
            ) : (
              notifs.map((n) => (
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
              ))
            )}
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
