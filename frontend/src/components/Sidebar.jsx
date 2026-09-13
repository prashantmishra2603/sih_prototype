import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, PlusCircle, Search, ClipboardCheck,
  ShieldCheck, LogOut, Bot, BarChart3, Settings, CheckCircle2, Award
} from 'lucide-react';

const providerNav = [
  { to: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: '3', badgeClass: 'warn' },
  { to: '/provider/create-tender', icon: FileText, label: 'Create Tender', badge: 'AI', badgeClass: 'info' },
  { to: '/provider/verifier', icon: ShieldCheck, label: 'Document Verifier', badge: '2', badgeClass: '' },
  { to: '/provider/compare/tender_001', icon: Award, label: 'Bidder Comparison' },
  { to: '/chat', icon: Bot, label: 'AI Assistant' },
  { to: '/provider/analytics', icon: BarChart3, label: 'Analytics & Audit' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const contractorNav = [
  { to: '/contractor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contractor/browse', icon: Search, label: 'Browse Tenders' },
  { to: '/contractor/bids', icon: ClipboardCheck, label: 'My Bids' },
  { to: '/chat', icon: Bot, label: 'AI Assistant' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === 'provider' ? providerNav : contractorNav;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'RK';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <div className="logo-icon">🛡️</div>
          <div>
            <div className="logo-text">BidCheck AI</div>
            <div className="logo-sub">Compliance Platform</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {user?.role === 'provider' ? 'Procurement Main' : 'Bidder Portal'}
        </div>
        {navItems.map(({ to, icon: Icon, label, badge, badgeClass }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && <span className={`nav-badge ${badgeClass || ''}`}>{badge}</span>}
          </NavLink>
        ))}

        <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

        <div className="nav-section-title">System</div>
        <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <LogOut size={16} />
          <span style={{ flex: 1 }}>Sign Out</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name truncate">{user?.name || 'Rajesh Kumar'}</div>
            <div className="user-role">{user?.role === 'provider' ? '🏛️ Officer · MoD' : '🏢 Contractor'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
