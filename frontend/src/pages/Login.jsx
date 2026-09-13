import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Eye, EyeOff, ArrowLeft, Loader, Sun, Moon, Lock, CheckCircle2,
  AlertTriangle, FileText, Scale, Key, ShieldCheck, Zap, Building2, UserCheck
} from 'lucide-react';
import { login as apiLogin } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/soundEffects';

export default function Login() {
  const [role, setRole] = useState('provider');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const DEMO_CREDS = {
    provider: { email: 'officer@gem.gov.in', password: 'officer123', label: 'Government Procurement Officer (Ministry of Defence)' },
    contractor: { email: 'abc@techcorp.com', password: 'contractor123', label: 'Registered GeM Vendor (Infosys BPM Ltd)' },
  };

  const fillDemo = () => {
    sound.playImport();
    const d = DEMO_CREDS[role];
    setEmail(d.email);
    setPassword(d.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playTap();
    setLoading(true);
    setError('');
    try {
      const user = await apiLogin(email, password);
      sound.playPass();
      login(user);
      navigate(user.role === 'provider' ? '/provider/dashboard' : '/contractor/dashboard');
    } catch (err) {
      sound.playFail();
      setError(err?.response?.data?.detail || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh', position: 'relative' }}>
      
      {/* Floating Theme Controls */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'cream' ? 'Switch to Midnight Dark Theme' : 'Switch to White Cream Theme'}
          style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {theme === 'cream' ? (
            <>
              <Moon size={14} />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun size={14} />
              <span>White Cream</span>
            </>
          )}
        </button>
      </div>

      {/* Ambient background glows */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 550, height: 550, background: '#10b981', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.12, top: -200, left: -100 }} />
        <div style={{ position: 'absolute', width: 450, height: 450, background: '#3b82f6', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.12, bottom: -100, right: -100 }} />
      </div>

      {/* Left Panel — Statutory Gateway Branding & Security Sentinel */}
      <div className="login-left" style={{ flex: 1.15, padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" className="btn btn-ghost btn-sm" style={{ width: 'fit-content', marginBottom: 32, gap: 6 }}>
            <ArrowLeft size={14} /> Return to Home
          </Link>

          <div className="logo-badge" style={{ marginBottom: 28 }}>
            <div className="logo-icon" style={{ width: 48, height: 48, fontSize: 24, borderRadius: 14 }}>🛡️</div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                BidCheck <span className="gradient-text">AI</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--green-light)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                National GeM Statutory Gateway • Govt of India
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
            Autonomous AI-Powered<br />
            <span className="gradient-text-green">Bid Compliance &amp; Verification</span>
          </h2>

          <p style={{ maxWidth: 440, lineHeight: 1.65, fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 26 }}>
            Transform hours of manual tender scrutiny into instant, evidence-backed statutory compliance decisions under GFR 2017 &amp; GeM STC Clause 3.2.
          </p>

          {/* Federal Security & Integrity Sentinel Card */}
          <div className="login-sentinel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                Federal Procurement Gateway • Active
              </span>
              <span className="pill pill-success" style={{ fontSize: '0.7rem' }}>256-Bit TLS</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
              <div style={{ background: 'var(--bg-secondary)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>AUDIT COVERAGE</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981' }}>100%</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>TURNAROUND</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#3b82f6' }}>1.8 Days</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>FRAUD SHIELD</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ef4444' }}>₹2.4 Cr</div>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Section 65B Indian Evidence Act Admissible Audit Trail</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
            {[
              { icon: <CheckCircle2 size={16} color="#10b981" />, text: 'GFR 2017 Rule 149(4)(b) Pre-Qualification Automation' },
              { icon: <Zap size={16} color="#3b82f6" />, text: 'Live ICAI UDIN & MCA21 CA Turnover Cross-Check' },
              { icon: <Scale size={16} color="#f59e0b" />, text: 'Automated Cartel & Bid-Rigging Algorithmic Sentinel' },
              { icon: <FileText size={16} color="#8b5cf6" />, text: '1-Click Multi-Bidder L1 Evaluation Matrix Export' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span>{item.icon}</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, padding: '12px 18px', background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Smart India Hackathon 2026
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--green-light)', fontWeight: 700, marginTop: 2 }}>
            Problem SIH26100 • GeM Portal Statutory Compliance Engine
          </div>
        </div>
      </div>

      {/* Right Panel — Executive Login Form */}
      <div className="login-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 460 }}
        >
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 4, fontSize: '1.5rem', fontWeight: 800 }}>Welcome back</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Select your role and authenticate to access the statutory console
            </p>
          </div>

          {/* Role Selector with Visual Badges */}
          <div className="role-selector" style={{ marginBottom: 18 }}>
            {[
              { key: 'provider', icon: '🏛️', name: 'Officer', desc: 'Procurement Wing' },
              { key: 'contractor', icon: '🏢', name: 'Contractor', desc: 'Bidder Portal' },
            ].map(r => (
              <div
                key={r.key}
                className={`role-card ${role === r.key ? 'selected' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setRole(r.key);
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
              >
                <div className="role-icon-large">{r.icon}</div>
                <div className="role-name" style={{ fontWeight: 800 }}>{r.name}</div>
                <div className="role-desc" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{r.desc}</div>
              </div>
            ))}
          </div>

          {/* Quick Demo Credentials Autofill Button */}
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 12,
              marginBottom: 20,
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(16,185,129,0.1)',
              transition: 'all 0.2s ease'
            }}
            onClick={fillDemo}
            title="Click to automatically populate demo login details"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--green-light)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Key size={13} /> Demo Credentials — Click to autofill
              </span>
              <span className="pill pill-success" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>1-Click Fill</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              {DEMO_CREDS[role].email}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Role: {DEMO_CREDS[role].label}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={`Enter ${role === 'provider' ? 'government officer' : 'bidder'} email`}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter authorized password"
                  required
                  className="input-field"
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
                  title={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" style={{ fontSize: '0.82rem', borderRadius: 8 }}>
                ⚠️ {error}
              </div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 4, fontWeight: 800, fontSize: '0.95rem' }}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="spinner" /> Authenticating...
                </>
              ) : (
                <>
                  <Shield size={16} /> Authenticate &amp; Access Portal
                </>
              )}
            </motion.button>
          </form>

          <div style={{ marginTop: 22, textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            🔒 Authorized government procurement personnel and registered GeM vendors only.<br />
            System monitored under the Information Technology Act 2000.
          </div>
        </motion.div>
      </div>

    </div>
  );
}
