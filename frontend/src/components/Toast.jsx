import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext({
  showToast: (msg, type = 'info') => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container">
        {toasts.map(({ id, message, type }) => (
          <div key={id} className={`toast ${type}`}>
            <span className="toast-icon">
              {type === 'success' && <CheckCircle2 size={18} color="var(--green-light)" />}
              {type === 'error' && <AlertCircle size={18} color="var(--red-light)" />}
              {type === 'warning' && <AlertTriangle size={18} color="var(--amber)" />}
              {type === 'info' && <Info size={18} color="var(--blue-light)" />}
            </span>
            <span style={{ flex: 1 }}>{message}</span>
            <button
              onClick={() => removeToast(id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
