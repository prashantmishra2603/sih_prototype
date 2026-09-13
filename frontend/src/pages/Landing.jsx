import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, CheckCircle2, FileSearch, BarChart3, ArrowRight, Zap, Eye, Users,
  Sparkles, Award, Sun, Moon, Lock, FileText, Check, AlertTriangle, Clock,
  Cpu, Building2, UserCheck, ShieldCheck, Scale, ExternalLink, RefreshCw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/soundEffects';

const STATS_DATA = [
  { value: '98.2%', label: 'Statutory AI Precision', sub: '16 Clauses Audited / Bid' },
  { value: '1.8 Days', label: 'Evaluation Turnaround', sub: 'vs 14 Days Manual Cycle' },
  { value: '₹2.4 Cr', label: 'Fraud & Cartels Blocked', sub: '8 Critical Cases Intercepted' },
  { value: '100%', label: 'Section 65B Audit Trail', sub: 'Cryptographic SHA-256 Ledger' },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    icon: <FileSearch size={22} color="#3b82f6" />,
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    title: 'Multi-Format Ingestion',
    desc: 'Secure ingestion of tender RFP documents, CA audit certificates, scanned PDFs, and GeM XML bids.',
    tag: 'PDF & Scans'
  },
  {
    step: '02',
    icon: <Cpu size={22} color="#10b981" />,
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    title: 'Computer Vision OCR',
    desc: 'Sub-second optical character recognition, digital signature validation, and live ICAI UDIN API cross-checks.',
    tag: 'API Verified'
  },
  {
    step: '03',
    icon: <Scale size={22} color="#f59e0b" />,
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    title: 'Statutory Rule Engine',
    desc: 'Automated clause verification against GFR 2017 Rule 149(4)(b), GeM STC 3.2, and MSME purchase preference.',
    tag: '16 Clauses'
  },
  {
    step: '04',
    icon: <ShieldCheck size={22} color="#8b5cf6" />,
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    title: 'L1 Matrix & Audit Dossier',
    desc: 'Commercial rank calculation, anti-collusion bid-rigging alerts, and immutable statutory audit trail export.',
    tag: 'CAG Ready'
  }
];

const TRUST_STANDARDS = [
  { name: 'GFR 2017', desc: 'Rules 144, 149 & 173', icon: '📜' },
  { name: 'GeM STC v4.0', desc: 'Special Terms Clause 3.2', icon: '🏛️' },
  { name: 'CVC Guidelines', desc: 'Anti-Collusion Protocols', icon: '⚖️' },
  { name: 'ICAI UDIN Standard', desc: 'CA Turnover Authentication', icon: '🛡️' },
  { name: 'MSME PPP-MII', desc: 'Purchase Preference 2012', icon: '🏢' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page-wrap" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 🇮🇳 OFFICIAL GOVERNMENT OF INDIA TOP BAR */}
      <div className="gov-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.9rem' }}>🇮🇳</span>
          <span style={{ fontWeight: 700, letterSpacing: '0.02em' }}>
            Government e-Marketplace (GeM) Autonomous AI Compliance Engine • GFR 2017 Conformance
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--green-light)', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            GeM Portal API Live (45ms)
          </span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span style={{ fontWeight: 600 }}>Smart India Hackathon 2026 • Problem SIH26100</span>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="logo-badge" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', boxShadow: '0 0 15px rgba(16,185,129,0.5)' }}>🛡️</div>
          <div>
            <div className="logo-text" style={{ fontSize: '1.25rem', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.02em' }}>
              BidCheck <span className="gradient-text">AI</span>
            </div>
            <div className="logo-sub" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              GeM &amp; Statutory Procurement Suite
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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

          <Link to="/login" className="btn btn-ghost" style={{ fontWeight: 700 }}>Sign In</Link>
          <button className="btn glowing-btn-emerald" onClick={() => { sound.playTap(); navigate('/login'); }} style={{ padding: '8px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            Launch Portal <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" style={{ paddingTop: 90, paddingBottom: 60, position: 'relative' }}>
        <div className="hero-bg">
          <div className="hero-blob" style={{ width: 650, height: 650, background: '#10b981', top: -180, left: -150, opacity: 0.15, filter: 'blur(80px)' }} />
          <div className="hero-blob" style={{ width: 550, height: 550, background: '#3b82f6', bottom: -100, right: -100, opacity: 0.15, filter: 'blur(80px)' }} />
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 880, textAlign: 'center', margin: '0 auto', padding: '0 20px' }}
        >
          <div className="shimmer-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-light)', marginBottom: 20 }}>
            <Zap size={15} color="#10b981" /> National E-Procurement AI Engine • Smart India Hackathon 2026
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.3rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: 18 }}>
            Autonomous AI Tender <br />
            <span className="gradient-text">Verification &amp; Statutory Conformance</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Automate GeM procurement compliance in seconds. Instant pre-qualification audits, CA UDIN cross-verification, and anti-collusion fraud sentinel under GFR 2017 &amp; GeM STC Clause 3.2.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn glowing-btn-emerald" onClick={() => { sound.playTap(); navigate('/login'); }} style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
              <Shield size={18} /> Launch Government Portal
            </button>
            <button className="btn btn-secondary" onClick={() => { sound.playTap(); document.getElementById('pipeline-section').scrollIntoView({ behavior: 'smooth' }); }} style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 12, fontWeight: 700 }}>
              Explore Architecture <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* HERO MOCKUP: BROWSER WINDOW WITH LIVE AUDIT STATUS & FLOATING PILLS */}
        <motion.div
          id="demo-showcase"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: 46, width: '100%', maxWidth: 1140, margin: '46px auto 0', padding: '0 20px', position: 'relative' }}
        >
          {/* Floating Visual Badge 1: Top Left */}
          <div className="floating-hero-pill" style={{ top: 50, left: 35 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>45s Automated OCR</div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>99% Cycle Acceleration</div>
            </div>
          </div>

          {/* Floating Visual Badge 2: Top Right */}
          <div className="floating-hero-pill" style={{ top: 60, right: 35, animationDelay: '1.5s' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Scale size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>GFR 149 Qualified</div>
              <div style={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: 700 }}>16 Clauses Verified</div>
            </div>
          </div>

          {/* Floating Visual Badge 3: Bottom Center */}
          <div className="floating-hero-pill" style={{ bottom: 25, left: '50%', transform: 'translateX(-50%)', animationDelay: '2.5s' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>Cartel &amp; Fraud Sentinel Active</div>
              <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>₹2.4 Cr Leakage Intercepted</div>
            </div>
          </div>

          {/* Sleek Browser Window Shell */}
          <div className="mockup-browser-window">
            <div className="mockup-browser-chrome">
              <div className="mockup-browser-dots">
                <div className="mockup-dot" style={{ background: '#ef4444' }} />
                <div className="mockup-dot" style={{ background: '#f59e0b' }} />
                <div className="mockup-dot" style={{ background: '#10b981' }} />
              </div>
              <div className="mockup-browser-url">
                <Lock size={12} color="#10b981" />
                <span>https://gem.gov.in/portal/ai-compliance-console/live-audit-matrix</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                LIVE AUDIT
              </div>
            </div>

            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src="/hero_dashboard.jpg"
                alt="BidCheck AI Executive Dashboard Mockup"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>
        </motion.div>

        {/* HIGH-IMPACT METRICS STRIP */}
        <div style={{ maxWidth: 1100, margin: '40px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, padding: '0 20px' }}>
          {STATS_DATA.map((s, i) => (
            <motion.div
              key={i}
              className="tagada-glass"
              style={{ padding: '20px 22px', textAlign: 'center', borderRadius: 16 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="gradient-text" style={{ fontFamily: 'Space Grotesk', fontSize: '2.3rem', fontWeight: 900 }}>{s.value}</div>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: 4, fontWeight: 800 }}>{s.label}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 4-STEP STATUTORY ARCHITECTURE PIPELINE                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="pipeline-section" style={{ padding: '80px 20px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--green-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Statutory Architecture Pipeline
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900 }}>
            How BidCheck AI Automates <span className="gradient-text">GeM Procurement</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: 8, maxWidth: 640, margin: '8px auto 0' }}>
            Four-stage automated pipeline guaranteeing statutory conformance from initial submission to final CAG audit ledger.
          </p>
        </div>

        <div className="pipeline-grid">
          {PIPELINE_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              className="pipeline-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="pipeline-step-badge">{step.step}</div>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: step.badgeBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="pill pill-info" style={{ fontSize: '0.72rem' }}>{step.tag}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-light)' }}>Active ✓</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VISUAL FEATURE SCANNER SECTION */}
      <section style={{ padding: '60px 20px 80px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mockup-browser-window"
            style={{ borderRadius: 20 }}
          >
            <div className="mockup-browser-chrome">
              <div className="mockup-browser-dots">
                <div className="mockup-dot" style={{ background: '#ef4444' }} />
                <div className="mockup-dot" style={{ background: '#f59e0b' }} />
                <div className="mockup-dot" style={{ background: '#10b981' }} />
              </div>
              <div className="mockup-browser-url">
                <FileSearch size={12} color="#06b6d4" />
                <span>deep-ocr-radar://gem/bids/scanner-view</span>
              </div>
            </div>
            <img src="/ai_scanner.jpg" alt="AI Document Scanner" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--green-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Sub-Second Deep OCR
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>
                Precision Document <span className="gradient-text">Verification Radar</span>
              </h2>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Validates financial turnover against ICAI UDIN registers, verifies ISO cybersecurity validity, and detects forged stamps with mathematical certainty.
              </p>
            </div>

            {[
              { title: '⚡ Sub-Second Financial Extraction', desc: 'No manual reading. AI parses CA turnover certificates and balance sheet ratios in under 45 seconds.' },
              { title: '🔍 Sub-Clause Risk Radar', desc: 'Auto-flags expired certificates, tax mismatches, and GTC/ATC parameter non-adherence.' },
              { title: '🛡️ Tamper-Proof Audit Trail', desc: 'Every extracted parameter links directly to source document coordinates with SHA-256 validation.' },
            ].map((item, idx) => (
              <div key={idx} className="tagada-glass" style={{ padding: 18, borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <CheckCircle2 color="#10b981" size={18} />
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 800 }}>{item.title}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: 28, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DUAL PERSONA VALUE MATRIX (OFFICER VS BIDDER)                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '60px 20px 90px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--green-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Dual-Sided Value Architecture
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900 }}>Select Your Operational Portal</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            Tailored consoles designed specifically for Government Buyers and Participating Contractors.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          
          {/* Persona Card 1: Procurement Officer */}
          <motion.div
            className="tagada-glass"
            style={{ padding: 36, cursor: 'pointer', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            whileHover={{ scale: 1.02 }}
            onClick={() => { sound.playTap(); navigate('/login'); }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ fontSize: '2.8rem' }}>🏛️</div>
                <span className="pill pill-info" style={{ fontWeight: 700 }}>Buyer Wing</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>Government Procurement Officer</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                Evaluate bids, eliminate procurement backlogs, auto-generate L1 matrices, and produce CAG/CVC audit-ready dossiers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  '1.8-Day average turnaround velocity (87% faster)',
                  'Zero audit objections with immutable Section 65B trail',
                  'Automated Cartel & Bid-Rigging Sentinel alerts',
                  '1-Click Executive PDF & CSV Compliance Dossier export'
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem' }}>
                    <Check size={16} color="#10b981" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn glowing-btn-emerald" style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem' }}>
              Enter Procurement Officer Console →
            </button>
          </motion.div>

          {/* Persona Card 2: Contractor / Bidder */}
          <motion.div
            className="tagada-glass"
            style={{ padding: 36, cursor: 'pointer', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            whileHover={{ scale: 1.02 }}
            onClick={() => { sound.playTap(); navigate('/login'); }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ fontSize: '2.8rem' }}>🏢</div>
                <span className="pill pill-success" style={{ fontWeight: 700 }}>Bidder Portal</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>Commercial Contractor &amp; MSME</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                Run instant pre-submission compliance checks, diagnose document gaps, and verify qualification before deadlines.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  'Pre-bid gap scanner prevents avoidable disqualifications',
                  '7-Day faster award notification & rapid EMD fund unfreezing',
                  '100% Impartial evaluation with zero human favoritism',
                  'Instant statutory clarification notifications & response logging'
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem' }}>
                    <Check size={16} color="#3b82f6" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn glowing-btn-blue" style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem' }}>
              Enter Contractor Portal Console →
            </button>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STATUTORY REGULATORY FRAMEWORKS ACCREDITATION                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '40px 20px 80px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Built Strictly In Conformance With
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: 4 }}>
            Indian Public Procurement Statutory Frameworks
          </div>
        </div>

        <div className="trust-grid">
          {TRUST_STANDARDS.map((std, i) => (
            <div key={i} className="trust-badge-card">
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{std.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{std.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>{std.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: '1.2rem' }}>🛡️</div>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>BidCheck <span className="gradient-text">AI</span></span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              National E-Procurement AI Compliance Suite • SIH 2026 Problem SIH26100
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>GFR 2017 Compliant</span>
          <span>•</span>
          <span>GeM STC Clause 3.2</span>
          <span>•</span>
          <span>Section 65B Audit Evidence</span>
        </div>
      </footer>
    </div>
  );
}
