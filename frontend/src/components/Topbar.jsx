import { useNavigate } from 'react-router-dom';
import { RefreshCw, Zap } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { useToast } from './Toast';

export function Topbar({ title = 'Dashboard', subtitle = 'GeM Procurement Compliance Overview — Ministry of Defence' }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const syncGem = () => {
    showToast('Connecting to GeM portal API...', 'info');
    setTimeout(() => {
      showToast('✓ 8 bids synced, 3 new alerts detected', 'success');
    }, 1800);
  };

  return (
    <div id="topbar" className="topbar">
      <div className="topbar-title">
        <h1 id="page-title">{title}</h1>
        <p id="page-subtitle">{subtitle}</p>
      </div>

      <div className="topbar-actions-center">
        <button className="topbar-btn" onClick={syncGem}>
          <RefreshCw size={14} /> Sync GeM
        </button>
        <button className="topbar-btn primary" onClick={() => navigate('/provider/create-tender')}>
          <Zap size={14} /> New Scan
        </button>
      </div>

      <div className="topbar-actions-right">
        <NotificationPanel />
      </div>
    </div>
  );
}
