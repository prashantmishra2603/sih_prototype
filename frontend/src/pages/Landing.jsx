import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, FileSearch, BarChart3, ArrowRight, Zap, Eye, Users, Sparkles, Award } from 'lucide-react';

const stats = [
  { value: '94%', label: 'Compliance Accuracy' },
  { value: '10×', label: 'Faster Verification' },
  { value: '100%', label: 'Audit Trail Coverage' },
  { value: '24/7', label: 'Real-time Monitoring' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
      {/* NAVBAR */}
      <nav className="landing-nav" style={{ backdropFilter: 'blur(20px)', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="logo-badge">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', boxShadow: '0 0 15px rgba(16,185,129,0.5)' }}>🛡️</div>
          <div>
            <div className="logo-text" style={{ fontSize: '1.25rem', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.02em' }}>
              BidCheck <span className="gradient-text">AI</span>
            </div>
            <div className="logo-sub" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>GeM Compliance Suite</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <Link to="/login" className="btn btn-ghost" style={{ fontWeight: 600 }}>Sign In</Link>
          <button className="btn glowing-btn-emerald" onClick={() => navigate('/login')} style={{ padding: '8px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            Launch Portal <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" style={{ paddingTop: 110, paddingBottom: 60, position: 'relative' }}>
        <div className="hero-bg">
          <div className="hero-blob" style={{ width: 650, height: 650, background: '#10b981', top: -180, left: -150, opacity: 0.15, filter: 'blur(80px)' }} />
          <div className="hero-blob" style={{ width: 550, height: 550, background: '#6366f1', bottom: -100, right: -100, opacity: 0.15, filter: 'blur(80px)' }} />
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 850, textAlign: 'center', margin: '0 auto' }}
        >
          <div className="shimmer-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 30, fontSize: '0.8rem', fontWeight: 700, color: 'var(--green-light)', marginBottom: 20 }}>
            <Zap size={14} color="#10b981" /> SIH 2026 Procurement Engine • Problem SIH26100
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 18 }}>
            Instant AI Tender <br />
            <span className="gradient-text">Verification &amp; Compliance</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Automate GeM tender checks in seconds. Extract requirements, verify evidence, and prevent procurement risks effortlessly.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn glowing-btn-emerald" onClick={() => navigate('/login')} style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Shield size={18} /> Get Started Free
            </button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('demo-showcase').scrollIntoView({ behavior: 'smooth' })} style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Explore Interface <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* HERO IMAGE SHOWCASE (REPLACED HEAVY TEXT WITH PREMIUM PICTURE) */}
        <motion.div
          id="demo-showcase"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: 50, width: '100%', maxWidth: 1100, margin: '50px auto 0', padding: '0 20px' }}
        >
          <div className="radar-container" style={{ borderRadius: 24, boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 35px rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.4)', overflow: 'hidden', position: 'relative' }}>
            <div className="radar-line" />
            <img
              src="/hero_dashboard.jpg"
              alt="BidCheck AI Dashboard Mockup"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </motion.div>

        {/* STATS STRIP */}
        <div style={{ maxWidth: 1000, margin: '40px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, padding: '0 20px' }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="tagada-glass"
              style={{ padding: '20px', textAlign: 'center', borderRadius: 16 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="gradient-text" style={{ fontFamily: 'Space Grotesk', fontSize: '2.2rem', fontWeight: 900 }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VISUAL FEATURE SCANNER SHOWCASE (MINIMAL TEXT + PICTURE) */}
      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Powered by <span className="gradient-text">Intelligent Document OCR</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Scans turnover certificates, ISO standards, and GSTIN compliance with sub-second accuracy.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="radar-container"
            style={{ borderRadius: 20, border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 15px 40px rgba(0,0,0,0.5)' }}
          >
            <img src="/ai_scanner.jpg" alt="AI Document Scanner" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {[
              { title: '⚡ Fast Automated Extraction', desc: 'No manual document checking. AI parses financial figures & cert numbers instantly.' },
              { title: '🔍 Sub-Clause Risk Radar', desc: 'Highlights missing files, expired dates, and non-compliant bid parameters.' },
              { title: '🛡️ Tamper-Proof Audit Trail', desc: 'Every verification result comes backed with original document evidence.' },
            ].map((item, idx) => (
              <div key={idx} className="tagada-glass" style={{ padding: 20, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <CheckCircle2 color="#10b981" size={20} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: 32 }}>{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* QUICK ROLE SELECTOR CARD */}
      <section style={{ padding: '60px 20px 100px', maxWidth: 950, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Choose Your Portal</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <motion.div
            className="tagada-glass"
            style={{ padding: 32, cursor: 'pointer' }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(16,185,129,0.5)' }}
            onClick={() => navigate('/login')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>🏛️</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Procurement Officer</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Publish tenders, verify bidder submissions, and run side-by-side AI comparisons.
            </p>
            <button className="btn glowing-btn-emerald" style={{ width: '100%', padding: '10px' }}>Officer Login →</button>
          </motion.div>

          <motion.div
            className="tagada-glass"
            style={{ padding: 32, cursor: 'pointer' }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(59,130,246,0.5)' }}
            onClick={() => navigate('/login')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>🏢</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Contractor / Bidder</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Browse tenders, run pre-bid compliance checks, and submit audit-ready bids.
            </p>
            <button className="btn glowing-btn-blue" style={{ width: '100%', padding: '10px' }}>Contractor Portal →</button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: '1.1rem' }}>🛡️</div>
          <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>BidCheck <span className="gradient-text">AI</span></span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          SIH 2026 • GeM Compliance &amp; Verification Platform
        </div>
      </footer>
    </div>
  );
}
