import { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/soundEffects';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const active = sessionStorage.getItem('bidcheck_theme_active');
      if (active === 'dark') return 'dark';
      // Always default to 'cream' (White Cream Theme) whenever website is opened
      sessionStorage.setItem('bidcheck_theme_active', 'cream');
      localStorage.setItem('bidcheck_theme', 'cream');
      return 'cream';
    }
    return 'cream';
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    return sound.isEnabled();
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'cream') {
        document.documentElement.setAttribute('data-theme', 'cream');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('bidcheck_theme', theme);
      sessionStorage.setItem('bidcheck_theme_active', theme);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    sound.playTap();
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    sound.playTap();
    setThemeState(prev => (prev === 'cream' ? 'dark' : 'cream'));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    sound.setEnabled(next);
    if (next) {
      sound.playNotification();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, soundEnabled, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
