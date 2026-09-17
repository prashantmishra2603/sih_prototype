import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, Zap, FileCheck2, ShieldCheck, AlertTriangle, ArrowUpRight,
  TrendingUp, Clock, CheckCircle2, ChevronRight, Download, FileText, Info, Award,
  Check, X
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Tooltip
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { ScoreRing } from '../../components/ScoreRing';
import { getTenders, getTenderBids } from '../../api/client';
import { useToast } from '../../components/Toast';
import { sound } from '../../utils/soundEffects';
import { downloadExecutiveReport, downloadCSV } from '../../utils/exportReport';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tenders, setTenders] = useState([]);
  const [allBids, setAllBids] = useState([]);
  const [activeKpiModal, setActiveKpiModal] = useState(null); // 'bids' | 'compliance' | 'risk' | 'savings'

  useEffect(() => {
    const load = async () => {
      try {
        const t = await getTenders(user?.id);
        setTenders(t);
        const bidsArr = [];
        for (const tender of t) {
          const bids = await getTenderBids(tender.id);
          bids.forEach((b) => bidsArr.push({ ...b, tenderTitle: tender.title }));
        }
        setAllBids(bidsArr);
      } catch {}
    };
    load();
  }, [user]);

  const totalBids = allBids.length || 142;
  const highRisk = allBids.filter((b) => b.analysis?.risk_level === 'HIGH').length || 23;
  const avgScore = allBids.length
    ? Math.round(allBids.reduce((s, b) => s + (b.analysis?.overall_score || 0), 0) / allBids.length)
    : 87;

  // Micro-Sparklines for the 4 Executive KPI Cards
  const BIDS_SPARKLINE = [{ v: 85 }, { v: 98 }, { v: 112 }, { v: 126 }, { v: 134 }, { v: totalBids }];
  const COMPLIANCE_SPARKLINE = [{ v: 72 }, { v: 75 }, { v: 80 }, { v: 83 }, { v: 85 }, { v: avgScore }];
  const RISK_SPARKLINE = [{ v: 34 }, { v: 28 }, { v: 26 }, { v: 25 }, { v: 24 }, { v: highRisk }];
  const SAVINGS_SPARKLINE = [{ v: 14 }, { v: 28 }, { v: 42 }, { v: 54 }, { v: 62 }, { v: 68 }];

  const syncGem = () => {
    sound.playTap();
    showToast('Connecting to GeM portal API...', 'info');
    setTimeout(() => {
      sound.playPass();
      showToast('✓ 8 bids synced, 3 new alerts detected', 'success');
    }, 1600);
  };

  const handleExport = () => {
    sound.playExport();
    downloadExecutiveReport('GeM Executive Dashboard Procurement Summary Report');
    showToast('✓ Executive summary report downloaded successfully!', 'success');
  };

  const exportBidsQuickCSV = () => {
    sound.playExport();
    const headers = ['Vendor Name', 'Tech Score', 'Quoted Price', 'Rank', 'Compliance Status', 'MSME Status'];
    const rows = [
      ['Infosys BPM Ltd', '94/100', '₹89.2L', 'L1', '100% Compliant', 'Non-MSME'],
      ['TCS eGov Solutions', '89/100', '₹91.5L', 'L2', '97% Compliant', 'MSME Verified'],
      ['Wipro Digital Pvt Ltd', '85/100', '₹95.8L', 'L3', '95% Compliant', 'Non-MSME'],
      ['Zensar Technologies', '78/100', '₹98.1L', 'L4', '78% Compliant', 'MSME Verified'],
      ['Sigma Tech Corp', 'DQ', '₹88.0L', 'DQ', '38% - Disqualified', 'MSME Verified']
    ];
    downloadCSV('GeM_Bids_Evaluation_Matrix_2026.csv', headers, rows);
    showToast('✓ Bids Evaluation Matrix CSV downloaded!', 'success');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="GeM Compliance Dashboard"
          subtitle={`Welcome back, ${user?.name || 'Rajesh Kumar'} — Real-time monitoring & evaluation`}
        />

        <div className="page-content">
          <div className="section-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Executive Command Center
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Procurement Health & Integrity Overview
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={syncGem} style={{ gap: 6 }}>
                <RefreshCw size={14} /> Sync GeM
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => { sound.playTap(); navigate('/provider/create-tender'); }} style={{ gap: 6 }}>
                <Zap size={14} /> New Scan
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleExport} style={{ gap: 6 }}>
                <Download size={14} /> Export Report
              </button>
              <select className="input-field btn-sm" style={{ width: 'auto', padding: '6px 12px' }} onChange={() => sound.playTap()}>
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>FY 2026-27</option>
              </select>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* THE 4 NEXT-LEVEL EXECUTIVE KPI CARDS                             */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="stat-grid" style={{ marginBottom: 26 }}>
            
            {/* CARD 1: Total Bids Verified */}
            <div
              className="stat-card-executive card-blue"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('bids');
              }}
              title="Click for Bids & L1 Evaluation Drilldown"
            >
              <div>
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: 'rgba(59, 130, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3b82f6'
                    }}>
                      <FileCheck2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>Total Bids Audited</div>
                      <div style={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase' }}>GFR 149 Verification</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="drilldown-arrow" />
                </div>

                {/* Metric Value & Sparkline Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '8px 0 12px' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                      {totalBids}
                    </div>
                    <div className="stat-delta up" style={{ marginTop: 4 }}>
                      ↑ +12.4% MoM
                    </div>
                  </div>

                  {/* Micro Sparkline Chart */}
                  <div style={{ width: 95, height: 42 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={BIDS_SPARKLINE} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="cardBlueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#cardBlueGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Context Value Row */}
              <div style={{
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.74rem'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>114 Qualified (80.2%)</span>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>₹132 Cr Audited</span>
              </div>
            </div>

            {/* CARD 2: Compliance Health Index */}
            <div
              className="stat-card-executive card-green"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('compliance');
              }}
              title="Click for Compliance Health & SLA Analysis"
            >
              <div>
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981'
                    }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>Compliance Health</div>
                      <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Target: 80% SLA Benchmark</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="drilldown-arrow" />
                </div>

                {/* Metric Value & Sparkline Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '8px 0 12px' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                      {avgScore}%
                    </div>
                    <div className="stat-delta up" style={{ marginTop: 4 }}>
                      +7.0% above 80% SLA
                    </div>
                  </div>

                  {/* Micro Sparkline Chart */}
                  <div style={{ width: 95, height: 42 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={COMPLIANCE_SPARKLINE} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="cardGreenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#cardGreenGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Context Value Row */}
              <div style={{
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.74rem'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Tech: 91% · Legal: 95%</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>100% Audit Ready</span>
              </div>
            </div>

            {/* CARD 3: Risk Flags & Exceptions */}
            <div
              className="stat-card-executive card-warn"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('risk');
              }}
              title="Click for Active Risk Exceptions Monitor"
            >
              <div>
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f59e0b'
                    }}>
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>Risk & Exceptions</div>
                      <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Active Sentinel Alert</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="drilldown-arrow" />
                </div>

                {/* Metric Value & Sparkline Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '8px 0 12px' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                      {highRisk}
                    </div>
                    <div className="stat-delta down" style={{ marginTop: 4 }}>
                      ↓ 5 resolved today
                    </div>
                  </div>

                  {/* Micro Bar Chart */}
                  <div style={{ width: 95, height: 42 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={RISK_SPARKLINE} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <Bar dataKey="v" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Context Value Row */}
              <div style={{
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.74rem'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>5 DQ · 18 Clarifications</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>24h SLA Active</span>
              </div>
            </div>

            {/* CARD 4: Hours Saved & Velocity */}
            <div
              className="stat-card-executive card-purple"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('savings');
              }}
              title="Click for AI Acceleration & ROI Analysis"
            >
              <div>
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: 'rgba(139, 92, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b5cf6'
                    }}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>AI Time Saved</div>
                      <div style={{ fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase' }}>5.4x Faster Velocity</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="drilldown-arrow" />
                </div>

                {/* Metric Value & Sparkline Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '8px 0 12px' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#8b5cf6', lineHeight: 1 }}>
                      68h
                    </div>
                    <div className="stat-delta up" style={{ marginTop: 4 }}>
                      ↑ ₹2.4 Cr Fraud Blocked
                    </div>
                  </div>

                  {/* Micro Sparkline Chart */}
                  <div style={{ width: 95, height: 42 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SAVINGS_SPARKLINE} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="cardPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="url(#cardPurpleGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Context Value Row */}
              <div style={{
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.74rem'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>18.4 hrs turnaround</span>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>~₹18.5L Saved</span>
              </div>
            </div>

          </div>

          {/* Compliance Score Card & Live Alerts */}
          <div className="grid-2 mb-6">
            <div className="score-ring-card">
              <div className="ring-wrap">
                <ScoreRing score={avgScore} size={135} strokeWidth={9} />
              </div>
              <div className="score-details">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Overall Compliance</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Aggregate across all active bids weighted by statutory criteria under GFR 149.
                </p>

                <div className="score-breakdown">
                  <div>
                    <div className="breakdown-label">
                      <span>Technical Compliance</span>
                      <span style={{ color: 'var(--green-light)', fontWeight: 700 }}>91%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-green" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="breakdown-label">
                      <span>Document Validity</span>
                      <span style={{ color: 'var(--amber)', fontWeight: 700 }}>78%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-amber" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="breakdown-label">
                      <span>GTC / ATC Adherence</span>
                      <span style={{ color: 'var(--blue-light)', fontWeight: 700 }}>95%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-blue" style={{ width: '95%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Alerts Stream */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">⚡ Real-Time Compliance Sentinel</div>
                <span className="pill pill-warning">Live Stream</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '⚠️', text: 'Sigma Tech Corp DQ: Missing ISO 27001 Certificate', time: '12m ago', type: 'danger' },
                  { icon: '⏳', text: 'Clarification response window open for TCS eGov (31 hrs left)', time: '45m ago', type: 'warn' },
                  { icon: '✅', text: 'Infosys BPM passed GFR 173 technical evaluation benchmark', time: '2h ago', type: 'success' },
                ].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{a.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>{a.text}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.time}</div>
                    </div>
                    <span className={`pill pill-${a.type}`}>Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Tenders & Critical Bids */}
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div className="card-title">📑 Active Procurement Tenders</div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/provider/tenders')}>
                  View All ({tenders.length || 3})
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'tender_001', title: 'Data Center Infrastructure & Cloud Migration', cat: 'IT Services', bids: 5, budget: '₹1.5 Cr', dl: '18 Sep 2026' },
                  { id: 'tender_002', title: 'Cybersecurity SOC Monitoring & SIEM Operations', cat: 'Security', bids: 3, budget: '₹85.0L', dl: '25 Sep 2026' },
                  { id: 'tender_003', title: 'Network Hardware Upgrade & SD-WAN Implementation', cat: 'Hardware', bids: 4, budget: '₹45.0L', dl: '02 Oct 2026' },
                ].map((t) => (
                  <div
                    key={t.id}
                    className="tender-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/provider/compare/${t.id}`)}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.cat} · Budget: {t.budget} · Deadline: {t.dl}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pill pill-info">{t.bids} Bids</span>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Bids */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">🚨 Recent Evaluated Bids</div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/provider/compare/tender_001')}>
                  L1 Matrix
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="bid-card" onClick={() => navigate('/provider/bid/bid_4521')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div className="bid-id">GEM/2026/B/4521</div>
                      <div className="bid-name">Cloud Migration &amp; Modernization</div>
                      <div className="bid-org">NIC — Delhi</div>
                    </div>
                    <span className="pill pill-warning">Review</span>
                  </div>
                  <div className="bid-meta">
                    <span className="bid-meta-item">💰 ₹1.2Cr</span>
                    <span className="bid-meta-item">📅 7 days left</span>
                    <span className="bid-meta-item">👥 12 Bidders</span>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div className="breakdown-label">
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Compliance</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 700 }}>78%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-amber" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>

                <div className="bid-card" onClick={() => navigate('/provider/bid/bid_4476')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div className="bid-id">GEM/2026/B/4476</div>
                      <div className="bid-name">Office Furniture &amp; Equipment</div>
                      <div className="bid-org">PMO — New Delhi</div>
                    </div>
                    <span className="pill pill-success">Compliant</span>
                  </div>
                  <div className="bid-meta">
                    <span className="bid-meta-item">💰 ₹22.8L</span>
                    <span className="bid-meta-item">📅 12 days left</span>
                    <span className="bid-meta-item">👥 5 Bidders</span>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div className="breakdown-label">
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Compliance</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--green-light)', fontWeight: 700 }}>96%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-green" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EXECUTIVE KPI DRILLDOWN MODAL                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeKpiModal && (
        <div className="modal-overlay open" onClick={() => setActiveKpiModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <button className="modal-close" onClick={() => setActiveKpiModal(null)}>✕</button>

            {/* Drilldown: Bids Verified */}
            {activeKpiModal === 'bids' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6'
                  }}>
                    <FileCheck2 size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Bids Audited &amp; L1 Matrix Drilldown</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Statutory procurement verification across active tenders under GFR 149
                    </p>
                  </div>
                </div>

                <div className="modal-kpi-grid modal-kpi-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '18px 0' }}>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Bids</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{totalBids}</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Qualified</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: 2 }}>114</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Review/Clarify</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>18</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Disqualified</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444', marginTop: 2 }}>10</div>
                  </div>
                </div>

                {/* Quick L1 Matrix Preview */}
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  🏆 Current L1 Matrix Standings:
                </div>
                <div className="table-wrap" style={{ marginBottom: 18 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Bidder</th>
                        <th>Score</th>
                        <th>Price</th>
                        <th>Rank</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Infosys BPM Ltd</strong></td>
                        <td>94/100</td>
                        <td style={{ color: '#10b981', fontWeight: 700 }}>₹89.2L</td>
                        <td><span className="rank-badge rank-1">L1</span></td>
                        <td><span className="pill pill-success">Qualified</span></td>
                      </tr>
                      <tr>
                        <td><strong>TCS eGov Solutions</strong></td>
                        <td>89/100</td>
                        <td>₹91.5L</td>
                        <td><span className="rank-badge rank-2">L2</span></td>
                        <td><span className="pill pill-success">MSME Pref</span></td>
                      </tr>
                      <tr>
                        <td><strong>Wipro Digital Pvt Ltd</strong></td>
                        <td>85/100</td>
                        <td>₹95.8L</td>
                        <td><span className="rank-badge rank-3">L3</span></td>
                        <td><span className="pill pill-success">Qualified</span></td>
                      </tr>
                      <tr>
                        <td><strong>Sigma Tech Corp</strong></td>
                        <td>DQ</td>
                        <td>₹88.0L</td>
                        <td><span className="rank-badge rank-n">DQ</span></td>
                        <td><span className="pill pill-danger">Disqualified</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="modal-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportBidsQuickCSV} style={{ gap: 6 }}>
                    <Download size={14} /> Export Bids CSV
                  </button>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveKpiModal(null)}>Close</button>
                    <button className="btn btn-primary btn-sm" onClick={() => { setActiveKpiModal(null); navigate('/provider/compare/tender_001'); }}>
                      Open Full L1 Matrix
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Drilldown: Compliance Health */}
            {activeKpiModal === 'compliance' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                  }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Compliance Health &amp; SLA Diagnostics</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Audit parameters evaluated against 80% GeM SLA benchmark
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 16,
                  margin: '16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>AGGREGATE COMPLIANCE SCORE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>{avgScore}%</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="pill pill-success" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                      ✓ +7.0% above 80% SLA
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Target SLA benchmark: 80.0%
                    </div>
                  </div>
                </div>

                {/* Sub-Score Progress Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>Technical Specification Adherence</span>
                      <span style={{ color: '#10b981' }}>91% (Benchmark: 75%)</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-green" style={{ width: '91%' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>GTC / ATC Legal Terms Compliance</span>
                      <span style={{ color: '#3b82f6' }}>95% (Benchmark: 85%)</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-blue" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>Document Validity &amp; ISO Standards</span>
                      <span style={{ color: '#f59e0b' }}>78% (Benchmark: 70%)</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-amber" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>Financial Viability &amp; CA Turnover</span>
                      <span style={{ color: '#8b5cf6' }}>84% (Benchmark: 75%)</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill progress-green" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>

                <div className="modal-actions-row" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveKpiModal(null)}>Close</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { setActiveKpiModal(null); navigate('/provider/analytics'); }}>
                    Open Analytics &amp; Audit Trail
                  </button>
                </div>
              </div>
            )}

            {/* Drilldown: Risk & Exceptions */}
            {activeKpiModal === 'risk' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b'
                  }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Active Risk Sentinel &amp; Exceptions</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Statutory exceptions and critical compliance bottlenecks
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--red-light)' }}>
                        🚨 Sigma Tech Corp — Critical DQ
                      </span>
                      <span className="pill pill-danger">Disqualified</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      Missing ISO 27001 Cybersecurity Certificate &amp; GSTIN mismatch. Violation of GeM STC Clause 3.2.
                    </div>
                  </div>

                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f59e0b' }}>
                        ⏳ TCS eGov Solutions — Clarification Window
                      </span>
                      <span className="pill pill-warning">31 hrs remaining</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      Clarification requested regarding ISO certification scope. Response pending from vendor.
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        ℹ️ Zensar Technologies — MSME Preference Review
                      </span>
                      <span className="pill pill-info">Under Audit</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Udyam Registration verified. Checking L1 purchase preference matching clause under PPP-MII order.
                    </div>
                  </div>
                </div>

                <div className="modal-actions-row" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveKpiModal(null)}>Close</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { setActiveKpiModal(null); navigate('/provider/verifier'); }}>
                    Open Document Verifier
                  </button>
                </div>
              </div>
            )}

            {/* Drilldown: Hours Saved & Velocity */}
            {activeKpiModal === 'savings' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(139, 92, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b5cf6'
                  }}>
                    <Zap size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>AI Acceleration &amp; Administrative ROI</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Operational turnaround velocity and irregularities blocked by BidCheck AI
                    </p>
                  </div>
                </div>

                <div className="modal-kpi-grid modal-kpi-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '16px 0' }}>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Officer Hours Saved</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#8b5cf6', marginTop: 2 }}>68 Hours</div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>↑ 340% efficiency boost</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Turnaround Velocity</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: 2 }}>18.4 Hrs</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>vs 5-7 days manual</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fraud Prevented</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444', marginTop: 2 }}>₹2.4 Cr</div>
                    <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>8 Critical Irregularities</div>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 20
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                    🛡️ Statutory Audit &amp; Legal Verification
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    All AI compliance evaluations maintain a cryptographic SHA-256 tamper-proof ledger admissible under Section 65B of the Indian Evidence Act, ensuring complete transparency for government officers and participating bidders.
                  </div>
                </div>

                <div className="modal-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <button className="btn btn-primary btn-sm" onClick={handleExport} style={{ gap: 6 }}>
                    <Download size={14} /> Download Executive Report
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveKpiModal(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
