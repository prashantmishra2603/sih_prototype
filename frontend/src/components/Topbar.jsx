import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Menu } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/soundEffects';

export function Topbar({
  title = 'Dashboard',
  subtitle = '',
  showBack = false,
  backUrl = null,
  onBack = null,
  leftContent = null,
  rightContent = null
}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleBack = () => {
    sound.playTap();
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  const handleToggleMenu = () => {
    sound.playTap();
    window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
  };

  return (
    <header id="topbar" className="topbar">
      {/* Left Slot: Mobile Menu Toggle + Back button or custom content or empty spacer */}
      <div className="topbar-left">
        <button
          type="button"
          className="btn btn-ghost btn-sm mobile-menu-btn"
          onClick={handleToggleMenu}
          aria-label="Toggle navigation menu"
          title="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        {showBack || backUrl || onBack ? (
          <button className="btn btn-ghost btn-sm" onClick={handleBack} style={{ gap: 6 }}>
            <ArrowLeft size={14} /> Back
          </button>
        ) : leftContent ? (
          leftContent
        ) : (
          <div className="topbar-left-spacer" />
        )}
      </div>

      {/* Center Slot: Page / Section Title — Centered exactly between left & right */}
      <div className="topbar-center">
        <h1 className="topbar-center-title">{title}</h1>
        {subtitle && <p className="topbar-center-subtitle">{subtitle}</p>}
      </div>

      {/* Right Slot: Theme Switcher + Sound Toggle + Notifications + Page-specific actions */}
      <div className="topbar-right">
        {rightContent}

        {/* Theme Switcher Toggle */}
        <button
          className="topbar-pill-btn"
          onClick={toggleTheme}
          title={theme === 'cream' ? 'Switch to Midnight Dark Theme' : 'Switch to White Cream & Navy Mode'}
        >
          {theme === 'cream' ? (
            <>
              <Moon size={13} color="var(--blue)" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun size={13} color="#f59e0b" />
              <span>White Cream</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <NotificationPanel />
      </div>
    </header>
  );
}
