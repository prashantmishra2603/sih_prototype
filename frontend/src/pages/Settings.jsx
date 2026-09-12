import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useToast } from '../components/Toast';
import { Save, Check, Key, Sliders, Bell, Cpu, ShieldCheck } from 'lucide-react';

export default function Settings() {
  const { showToast } = useToast();
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
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    showToast('Platform settings saved successfully!', 'success');
    setTimeout(() => {
      showToast('Compliance engine rules updated live', 'info');
    }, 600);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Platform Settings" subtitle="Configure compliance rules, notifications, and system preferences" />

        <div className="page-content">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Platform <span className="gradient-text-green">Settings</span>
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                System parameters, AI threshold, and rule engine configuration
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              <Save size={14} /> Save Changes
            </button>
          </div>

          <div className="grid-2">
            <div>
              {/* Org Profile */}
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  🏛️ Organization Profile
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: 'fit-content' }}
                    onClick={() => showToast('GeM Portal API connection verified! ✓', 'success')}
                  >
                    🔌 Test API Connection
                  </button>
                </div>
              </div>

              {/* Compliance Rule Engine */}
              <div className="card">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  ⚙️ Compliance Rule Engine
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { key: 'gst', title: 'Auto-flag missing GST', desc: 'Flag bids with missing or invalid GSTIN' },
                    { key: 'expiry', title: 'Expiry alerts (14 days)', desc: 'Warn when certificates expire within 14 days' },
                    { key: 'l1Auto', title: 'Auto-qualify L1 bidder', desc: 'Automatically advance L1 to financial stage' },
                    { key: 'mca', title: 'AI turnover verification', desc: 'Cross-check financials against MCA records' },
                    { key: 'blacklist', title: 'Vendor blacklist check', desc: 'Auto-check against GeM debarment list' },
                    { key: 'rites', title: 'Require Vendor Assessment', desc: 'Flag bids from non-assessed vendors' },
                  ].map(({ key, title, desc }) => (
                    <div key={key} className="settings-row">
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

            <div>
              {/* Notification Preferences */}
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  🔔 Notification Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { key: 'emailAlerts', title: 'Email Alerts', desc: 'Send compliance alerts via email' },
                    { key: 'smsAlerts', title: 'SMS Notifications', desc: 'Critical alerts via SMS' },
                    { key: 'appAlerts', title: 'In-App Alerts', desc: 'Real-time browser notifications' },
                  ].map(({ key, title, desc }) => (
                    <div key={key} className="settings-row">
                      <div className="settings-label">
                        <h4>{title}</h4>
                        <p>{desc}</p>
                      </div>
                      <div className={`toggle ${toggles[key] ? 'on' : ''}`} onClick={() => toggle(key)} />
                    </div>
                  ))}
                </div>
                <div className="form-group" style={{ marginTop: 14 }}>
                  <label>Alert Email(s)</label>
                  <input className="input-field" defaultValue="rajesh.kumar@mod.gov.in, compliance@mod.gov.in" />
                </div>
              </div>

              {/* AI Engine Specs */}
              <div className="card">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  🤖 AI Engine Configuration
                </h3>
                <div className="settings-row">
                  <div className="settings-label">
                    <h4>AI Confidence Threshold</h4>
                    <p>Minimum score required to auto-approve</p>
                  </div>
                  <input className="input-field" style={{ width: 80, textAlign: 'center' }} defaultValue="85%" />
                </div>
                <div className="settings-row">
                  <div className="settings-label">
                    <h4>Deep Document OCR</h4>
                    <p>Extract text from scanned PDFs</p>
                  </div>
                  <div className={`toggle ${toggles.ocr ? 'on' : ''}`} onClick={() => toggle('ocr')} />
                </div>
                <div className="settings-row">
                  <div className="settings-label">
                    <h4>Real-time GeM Sync</h4>
                    <p>Sync portal data every 5 minutes</p>
                  </div>
                  <div className={`toggle ${toggles.realtimeSync ? 'on' : ''}`} onClick={() => toggle('realtimeSync')} />
                </div>

                <div style={{ marginTop: 16, padding: 14, background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    🟢 AI Engine Status
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model: GeM-Comply-AI v2.4.1</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Training: GFR 2017, ATC Library 2026, 50K+ bid documents</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--green-light)', marginTop: 4, fontWeight: 600 }}>● Operational — 99.7% uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
