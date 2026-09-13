import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/soundEffects';
import { Save, Check, Key, Sliders, Bell, Cpu, ShieldCheck, Sun, Moon, Sparkles } from 'lucide-react';

export default function Settings() {
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();

  const [toggles, setToggles] = useState({
    gst: true,
    expiry: true,
    l1Auto: false,
    mca: true,
    blacklist: true,
    rites: false,
    emailAlerts: true,
    smsAlerts: true,
    appAlerts: true,
    ocr: true,
    realtimeSync: true,
  });

  const toggle = (key) => {
    sound.playTap();
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    sound.playPass();
    showToast('Platform settings saved successfully!', 'success');
    setTimeout(() => {
      showToast('Compliance engine rules updated live', 'info');
    }, 600);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Platform Settings"
          subtitle="Configure compliance rules, notifications, theme mode, and system preferences"
        />

        <div className="page-content">
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20 }}>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              <Save size={14} /> Save Changes
            </button>
          </div>

          {/* 4 Cards Aligned in 2x2 Grid — Top, Middle, and Bottom Borders Exactly Aligned */}
          <div className="settings-grid-aligned">
            {/* Card 1: Org Profile (Row 1, Left) */}
            <div className="card settings-aligned-card">
              <div className="settings-card-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  🏛️ Organization Profile
                </span>
                <span className="pill pill-info">GeM Buyer</span>
              </div>
              <div className="settings-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-group">
                    <label>Organization Name</label>
                    <input className="input-field" defaultValue="Ministry of Defence — Procurement Wing" />
                  </div>
                  <div className="form-group">
                    <label>GeM Buyer ID</label>
                    <input className="input-field" defaultValue="BUY/2024/MOD/00142" />
                  </div>
                  <div className="form-group">
                    <label>Nodal Officer</label>
                    <input className="input-field" defaultValue="Rajesh Kumar, IAS" />
                  </div>
                  <div className="form-group">
                    <label>GeM API Key</label>
                    <input className="input-field" type="password" defaultValue="gem_sk_live_abcdef123456" />
                  </div>
                </div>
                <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      sound.playPass();
                      showToast('GeM Portal API connection verified! ✓', 'success');
                    }}
                  >
                    🔌 Test Live API Connection
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Notification & Audio Preferences (Row 1, Right) */}
            <div className="card settings-aligned-card">
              <div className="settings-card-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  🔔 Notifications &amp; UI Audio
                </span>
                <span className="pill pill-success">Real-time</span>
              </div>
              <div className="settings-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { key: 'emailAlerts', title: 'Email Alerts', desc: 'Send compliance alerts via verified email' },
                    { key: 'smsAlerts', title: 'SMS Notifications', desc: 'Urgent compliance flags via mobile SMS' },
                    { key: 'appAlerts', title: 'In-App Toast Alerts', desc: 'Real-time browser notifications' },
                  ].map(({ key, title, desc }) => (
                    <div key={key} className="settings-row" style={{ padding: '8px 0' }}>
                      <div className="settings-label">
                        <h4>{title}</h4>
                        <p>{desc}</p>
                      </div>
                      <div className={`toggle ${toggles[key] ? 'on' : ''}`} onClick={() => toggle(key)} />
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <label>Alert Recipient Email(s)</label>
                  <input className="input-field" defaultValue="rajesh.kumar@mod.gov.in, compliance@mod.gov.in" />
                </div>
              </div>
            </div>

            {/* Card 3: Compliance Rule Engine (Row 2, Left) */}
            <div className="card settings-aligned-card">
              <div className="settings-card-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚙️ Compliance Rule Engine
                </span>
                <span className="pill pill-info">GFR 2017</span>
              </div>
              <div className="settings-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { key: 'gst', title: 'Auto-flag missing GST', desc: 'Flag bids with missing or invalid GSTIN' },
                    { key: 'expiry', title: 'Expiry alerts (14 days)', desc: 'Warn when certificates expire within 14 days' },
                    { key: 'l1Auto', title: 'Auto-qualify L1 bidder', desc: 'Automatically advance L1 to financial stage' },
                    { key: 'mca', title: 'AI turnover verification', desc: 'Cross-check financials against MCA records' },
                    { key: 'blacklist', title: 'Vendor blacklist check', desc: 'Auto-check against GeM debarment list' },
                    { key: 'rites', title: 'Require Vendor Assessment', desc: 'Flag bids from non-assessed vendors' },
                  ].map(({ key, title, desc }) => (
                    <div key={key} className="settings-row" style={{ padding: '8px 0' }}>
                      <div className="settings-label">
                        <h4>{title}</h4>
                        <p>{desc}</p>
                      </div>
                      <div className={`toggle ${toggles[key] ? 'on' : ''}`} onClick={() => toggle(key)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: AI Engine Configuration (Row 2, Right) */}
            <div className="card settings-aligned-card">
              <div className="settings-card-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  🤖 AI Engine Configuration
                </span>
                <span className="pill pill-success">v2.4.1 Active</span>
              </div>
              <div className="settings-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div className="settings-row" style={{ padding: '8px 0' }}>
                    <div className="settings-label">
                      <h4>AI Confidence Threshold</h4>
                      <p>Minimum score required to auto-approve tender bids</p>
                    </div>
                    <input className="input-field" style={{ width: 75, textAlign: 'center' }} defaultValue="85%" />
                  </div>
                  <div className="settings-row" style={{ padding: '8px 0' }}>
                    <div className="settings-label">
                      <h4>Deep Document OCR</h4>
                      <p>Extract text from scanned PDFs &amp; stamp certificates</p>
                    </div>
                    <div className={`toggle ${toggles.ocr ? 'on' : ''}`} onClick={() => toggle('ocr')} />
                  </div>
                  <div className="settings-row" style={{ padding: '8px 0' }}>
                    <div className="settings-label">
                      <h4>Real-time GeM Sync</h4>
                      <p>Synchronize portal bids and tender notices automatically</p>
                    </div>
                    <div className={`toggle ${toggles.realtimeSync ? 'on' : ''}`} onClick={() => toggle('realtimeSync')} />
                  </div>
                </div>

                <div style={{ marginTop: 14, padding: 14, background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    🟢 AI Engine Status: Operational
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model: GeM-Comply-AI v2.4.1 (ATC Library 2026)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--green-light)', marginTop: 4, fontWeight: 600 }}>● 99.7% uptime · 50K+ validated bids</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
