import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowLeft, Loader } from 'lucide-react';
import { login as apiLogin } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('provider');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const DEMO_CREDS = {
    provider: { email: 'officer@gem.gov.in', password: 'officer123' },
    contractor: { email: 'abc@techcorp.com', password: 'contractor123' },
  };

  const fillDemo = () => {
    const d = DEMO_CREDS[role];
    setEmail(d.email);
    setPassword(d.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await apiLogin(email, password);
      login(user);
      navigate(user.role === 'provider' ? '/provider/dashboard' : '/contractor/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: '#10b981', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.12, top: -200, left: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, background: '#6366f1', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.12, bottom: -100, right: -100 }} />
      </div>

      {/* Left Panel — Branding */}
      <div className="login-left" style={{ flex: 1.1 }}>
        <Link to="/" className="btn btn-ghost btn-sm" style={{ width: 'fit-content', marginBottom: 40 }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="logo-badge" style={{ marginBottom: 32 }}>
          <div className="logo-icon" style={{ width: 48, height: 48, fontSize: 24, borderRadius: 14 }}>🛡️</div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>BidCheck AI</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--green-light)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>GeM Compliance Platform</div>
          </div>
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>
          AI-Powered<br /><span className="gradient-text-green">Bid Compliance</span><br />Verification
        </h2>
        <p style={{ maxWidth: 380, lineHeight: 1.7, marginBottom: 40 }}>
          BidCheck AI transforms hours of manual document review into
          instant, evidence-backed compliance decisions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '✅', text: 'Every decision backed by exact evidence & page number' },
            { icon: '⚠️', text: 'Risk detection: missing docs, expired certs, conflicts' },
            { icon: '📊', text: 'Multi-bidder comparison dashboard' },
            { icon: '🔍', text: 'Pre-bid check for contractors before submission' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '16px 20px', background: 'rgba(16,185,129,0.06)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>SIH 2026 — Problem Statement</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--green-light)', fontWeight: 600 }}>SIH26100 • GeM Portal Compliance Automation</div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="login-right">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={{ marginBottom: 6, fontSize: '1.4rem' }}>Welcome back</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: 28 }}>Select your role and sign in to continue</p>

          {/* Role Selector */}
          <div className="role-selector">
            {[
              { key: 'provider', icon: '🏛️', name: 'Officer', desc: 'Procurement Officer' },
              { key: 'contractor', icon: '🏢', name: 'Contractor', desc: 'Bidder / Vendor' },
            ].map(r => (
              <div
                key={r.key}
                className={`role-card ${role === r.key ? 'selected' : ''}`}
                onClick={() => { setRole(r.key); setEmail(''); setPassword(''); setError(''); }}
              >
                <div className="role-icon-large">{r.icon}</div>
                <div className="role-name">{r.name}</div>
                <div className="role-desc">{r.desc}</div>
              </div>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 10,
              marginBottom: 20,
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(16,185,129,0.12)'
            }}
            onClick={fillDemo}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--green-light)', fontWeight: 600, marginBottom: 2 }}>
              🔑 Demo credentials — click to fill
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {DEMO_CREDS[role].email}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={`Enter ${role} email`}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    padding: 4,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" style={{ fontSize: '0.82rem' }}>
                ⚠️ {error}
              </div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 4 }}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? <><div className="spinner" /> Authenticating...</> : <><Shield size={16} /> Sign In</>}
            </motion.button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            AI assists officers. Authorized officers make final procurement decisions.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
