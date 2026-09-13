import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { useToast } from '../../components/Toast';
import {
  Download, ShieldCheck, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Lock,
  FileText, Maximize2, Filter, Layers, Zap, Info, Calendar, ArrowUpRight, Check, X,
  Clock, AlertCircle, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import { ChartModal } from '../../components/ChartModal';
import { sound } from '../../utils/soundEffects';
import { downloadCSV, downloadExecutiveReport } from '../../utils/exportReport';

const TREND_DATA_6M = [
  { month: 'Apr 2026', rate: 72, issues: 34, mom: '+0.0%', slaTarget: 80, slaDelta: -8, risk: 'High', remediated: 34, notes: 'Fiscal year initiation baseline' },
  { month: 'May 2026', rate: 75, issues: 28, mom: '+3.0%', slaTarget: 80, slaDelta: -5, risk: 'Medium', remediated: 28, notes: 'GeM STC Clause 3.2 rules synced' },
  { month: 'Jun 2026', rate: 80, issues: 26, mom: '+5.0%', slaTarget: 80, slaDelta: 0, risk: 'Optimal', remediated: 26, notes: 'Target SLA benchmark attained' },
  { month: 'Jul 2026', rate: 83, issues: 25, mom: '+3.0%', slaTarget: 80, slaDelta: +3, risk: 'Optimal', remediated: 25, notes: 'Automated OCR verification rolled out' },
  { month: 'Aug 2026', rate: 85, issues: 24, mom: '+2.0%', slaTarget: 80, slaDelta: +5, risk: 'Optimal', remediated: 24, notes: 'Turnover & GSTIN API cross-checks' },
  { month: 'Sep 2026', rate: 87, issues: 23, mom: '+2.0%', slaTarget: 80, slaDelta: +7, risk: 'Optimal', remediated: 23, notes: 'Record high compliance velocity' },
];

const ISSUE_PIE_DATA = [
  {
    name: 'Missing Documents',
    value: 35,
    count: 35,
    color: '#ef4444',
    severity: 'CRITICAL',
    clause: 'GeM STC Clause 3.2',
    action: 'Issue 24-hr mandatory clarification notice or auto-disqualify',
    avgResolveHours: 18.5,
    status: 'Automated Clarification Triggered'
  },
  {
    name: 'PQ Criteria Fail',
    value: 25,
    count: 25,
    color: '#f59e0b',
    severity: 'CRITICAL',
    clause: 'GFR 2017 Rule 149(4)(b)',
    action: 'Record formal disqualification reason in statutory audit trail',
    avgResolveHours: 24.0,
    status: 'Disqualified with Audit Stamp'
  },
  {
    name: 'Expired Certs',
    value: 20,
    count: 20,
    color: '#8b5cf6',
    severity: 'HIGH',
    clause: 'GeM Vendor Undertaking & ISO 27001',
    action: 'Verify renewal application receipt & certifying body seal',
    avgResolveHours: 12.0,
    status: 'Under Vendor Verification'
  },
  {
    name: 'Spec Mismatch',
    value: 12,
    count: 12,
    color: '#06b6d4',
    severity: 'MEDIUM',
    clause: 'Schedule of Requirements (SoR)',
    action: 'Technical evaluation committee review & parameter deviation score',
    avgResolveHours: 16.0,
    status: 'Technical Evaluation Ongoing'
  },
  {
    name: 'Turnover Deficit',
    value: 8,
    count: 8,
    color: '#10b981',
    severity: 'LOW',
    clause: 'Audited CA Turnover Certificate (GFR 173)',
    action: 'CA UDIN check & MSME exemption validation',
    avgResolveHours: 8.5,
    status: 'UDIN Verified via API'
  },
];

const MONTHLY_VOLUME_DATA = [
  { month: 'Apr 2026', submitted: 18, qualified: 12, disqualified: 6, convRate: 66.7, volumeCr: '₹14.2 Cr', turnaroundDays: 3.8 },
  { month: 'May 2026', submitted: 22, qualified: 16, disqualified: 6, convRate: 72.7, volumeCr: '₹18.5 Cr', turnaroundDays: 3.1 },
  { month: 'Jun 2026', submitted: 25, qualified: 20, disqualified: 5, convRate: 80.0, volumeCr: '₹22.1 Cr', turnaroundDays: 2.6 },
  { month: 'Jul 2026', submitted: 28, qualified: 24, disqualified: 4, convRate: 85.7, volumeCr: '₹27.8 Cr', turnaroundDays: 2.2 },
  { month: 'Aug 2026', submitted: 26, qualified: 22, disqualified: 4, convRate: 84.6, volumeCr: '₹25.4 Cr', turnaroundDays: 2.1 },
  { month: 'Sep 2026', submitted: 23, qualified: 20, disqualified: 3, convRate: 87.0, volumeCr: '₹24.0 Cr', turnaroundDays: 1.8 },
];

const AUDIT_ENTRIES = [
  { color: '#10b981', action: 'AI Compliance Scan Initiated', detail: 'Bid GEM/2026/B/4521 — 16 criteria checked automatically', ts: '08 Sep 2026, 18:20:45', user: 'System AI' },
  { color: '#10b981', action: 'Vendor Qualified — Technical Stage', detail: 'Infosys BPM Ltd passed all PQ criteria. Score: 94/100', ts: '08 Sep 2026, 16:30:12', user: 'Rajesh Kumar' },
  { color: '#ef4444', action: 'Disqualification Recorded', detail: 'Sigma Tech Corp — DQ: Missing ISO 27001, Expired GSTIN', ts: '08 Sep 2026, 15:15:00', user: 'Rajesh Kumar' },
  { color: '#f59e0b', action: 'Clarification Request Sent', detail: 'Sent to TCS eGov for ISO 27001 certificate verification', ts: '08 Sep 2026, 10:30:00', user: 'Rajesh Kumar' },
  { color: '#8b5cf6', action: 'Document AI-Verified', detail: 'Infosys BPM — Experience Certificate verified by OCR engine', ts: '08 Sep 2026, 11:15:33', user: 'System AI' },
  { color: '#06b6d4', action: 'Bid GEM/2026/B/4476 Created', detail: 'Office Furniture & Equipment — PMO. Deadline: 20 Sep 2026', ts: '07 Sep 2026, 09:00:00', user: 'Priya Sharma' },
];

export default function AnalyticsAudit() {
  const { showToast } = useToast();
  const [activeChartModal, setActiveChartModal] = useState(null);

  // Full View State Controls
  const [trendMetric, setTrendMetric] = useState('combined'); // 'combined' | 'rate' | 'issues'
  const [volumeView, setVolumeView] = useState('grouped'); // 'grouped' | 'stacked' | 'rate'
  const [selectedIssueFilter, setSelectedIssueFilter] = useState('all'); // 'all' | 'critical' | 'resolvable'
  const [activeDonutIndex, setActiveDonutIndex] = useState(null);
  const [activeKpiModal, setActiveKpiModal] = useState(null); // 'bids' | 'velocity' | 'accuracy' | 'fraud'

  // Micro-Sparklines for the 4 Executive KPI Cards
  const BIDS_SPARKLINE = [{ v: 85 }, { v: 98 }, { v: 112 }, { v: 126 }, { v: 134 }, { v: 142 }];
  const VELOCITY_SPARKLINE = [{ v: 14 }, { v: 28 }, { v: 42 }, { v: 54 }, { v: 62 }, { v: 68 }];
  const ACCURACY_SPARKLINE = [{ v: 97.2 }, { v: 97.5 }, { v: 97.9 }, { v: 98.0 }, { v: 98.1 }, { v: 98.2 }];
  const FRAUD_SPARKLINE = [{ v: 0.4 }, { v: 0.8 }, { v: 1.2 }, { v: 1.7 }, { v: 2.1 }, { v: 2.4 }];

  const exportVelocityCSV = () => {
    sound.playExport();
    const headers = ['Evaluation Stage', 'Manual Process Time', 'Antigravity AI Time', 'Efficiency Gain', 'Statutory SLA Target'];
    const rows = [
      ['OCR & Entity Extraction', '2.5 Hours', '45 Seconds', '99.0% Acceleration', '15 Mins'],
      ['Technical PQ Criteria Matching', '15.0 Hours', '1.2 Hours', '92.0% Acceleration', '4 Hours'],
      ['Statutory Clauses & GTC/ATC', '8.0 Hours', '45 Minutes', '89.0% Acceleration', '2 Hours'],
      ['L1 Commercial Price Comparison', '4.0 Hours', '10 Minutes', '95.0% Acceleration', '30 Mins'],
      ['Total Procurement Cycle Time', '14.0 Days', '1.8 Days', '87.1% Overall Reduction', '5 Days']
    ];
    downloadCSV('GeM_Turnaround_Velocity_ROI_2026.csv', headers, rows);
    sound.playPass();
    showToast('✓ Velocity & ROI report exported to CSV!', 'success');
  };

  const exportAccuracyCSV = () => {
    sound.playExport();
    const headers = ['Audit Clause / Framework', 'Statutory Rule Reference', 'AI Verification Confidence (%)', 'Evaluation Committee Agreement (%)', 'False Positive Rate'];
    const rows = [
      ['Technical Spec Adherence', 'Schedule of Requirements (SoR)', '97.8%', '98.5%', '0.0%'],
      ['Pre-Qualification (PQ) Check', 'GFR 2017 Rule 149(4)(b)', '99.4%', '99.8%', '0.0%'],
      ['CA Turnover & UDIN Validation', 'ICAI UDIN & GFR Rule 173', '98.9%', '99.2%', '0.0%'],
      ['ISO & Cybersecurity Certificates', 'GeM STC Clause 3.2 & ISO 27001', '99.0%', '99.5%', '0.0%'],
      ['MSME & Make in India Exemption', 'Public Procurement Policy 2012', '98.7%', '99.0%', '0.0%'],
      ['GTC / ATC Statutory Acceptance', 'GeM General Terms & Conditions', '98.5%', '98.8%', '0.0%']
    ];
    downloadCSV('GeM_AI_Accuracy_Clause_Conformance_2026.csv', headers, rows);
    sound.playPass();
    showToast('✓ AI Accuracy & Conformance benchmark exported to CSV!', 'success');
  };

  const exportFraudCSV = () => {
    sound.playExport();
    const headers = ['Entity Name', 'Tender Reference', 'Irregularity Category', 'Tender Value (INR)', 'Statutory Infraction', 'Sentinel Action Taken'];
    const rows = [
      ['Sigma Tech Corp', 'GEM/2026/B/4521', 'Forged ISO & Expired GSTIN', '₹88,00,000', 'GeM STC Clause 3.2', 'Disqualified & Debarred'],
      ['Apex Infotech & Zenith Systems', 'GEM/2026/B/4476', 'IP/MAC Address Collusion (Cartel)', '₹64,50,000', 'Competition Act 2002', 'Bid Rigging Flagged to CVC'],
      ['Matrix Supply Chain', 'GEM/2026/B/4390', 'Forged CA UDIN Turnover Certificate', '₹45,00,000', 'GFR 2017 Rule 173', 'Disqualified & ICAI Alerted'],
      ['Delta Tech Enterprises', 'GEM/2026/B/4210', 'Non-compliant MSME Shell Entity', '₹42,50,000', 'GFR 2017 Rule 144', 'Disqualified under STC 3.2']
    ];
    downloadCSV('GeM_Fraud_Cartel_Sentinel_Log_2026.csv', headers, rows);
    sound.playPass();
    showToast('✓ Fraud & Sentinel Incident Dossier exported to CSV!', 'success');
  };

  const exportAuditCSV = () => {
    sound.playExport();
    const headers = ['Timestamp', 'Action Recorded', 'Details & Statutory Reference', 'Authorized Officer / Agent', 'System ID'];
    const rows = AUDIT_ENTRIES.map((e, idx) => [
      e.ts,
      e.action,
      e.detail,
      e.user,
      `AUDIT-EVT-${202600 + idx}`
    ]);
    downloadCSV('GeM_Compliance_Audit_Log_Sep2026.csv', headers, rows);
    sound.playPass();
    showToast('✓ Audit log CSV downloaded with full audit hashes!', 'success');
  };

  const exportTrendCSV = () => {
    sound.playExport();
    const headers = ['Month', 'Compliance Rate (%)', 'Issues Flagged', 'MoM Change', 'GeM SLA Target (%)', 'SLA Headroom (%)', 'Risk Assessment', 'Auditing Notes'];
    const rows = TREND_DATA_6M.map(d => [
      d.month,
      `${d.rate}%`,
      d.issues,
      d.mom,
      `${d.slaTarget}%`,
      `${d.slaDelta >= 0 ? '+' : ''}${d.slaDelta}%`,
      d.risk,
      d.notes
    ]);
    downloadCSV('GeM_Compliance_Trends_Analytics_2026.csv', headers, rows);
    sound.playPass();
    showToast('✓ Compliance Trend dataset exported to CSV!', 'success');
  };

  const exportVolumeCSV = () => {
    sound.playExport();
    const headers = ['Month', 'Bids Submitted', 'Bids Qualified', 'Bids Disqualified', 'Qualification Conversion (%)', 'Procurement Value', 'Avg Processing Velocity (Days)'];
    const rows = MONTHLY_VOLUME_DATA.map(d => [
      d.month,
      d.submitted,
      d.qualified,
      d.disqualified,
      `${d.convRate}%`,
      d.volumeCr,
      d.turnaroundDays
    ]);
    downloadCSV('GeM_Monthly_Bid_Volume_Velocity_2026.csv', headers, rows);
    sound.playPass();
    showToast('✓ Bid Volume & Velocity dataset exported to CSV!', 'success');
  };

  const exportIssuesCSV = () => {
    sound.playExport();
    const headers = ['Issue Category', 'Percentage Share', 'Total Incidents', 'Severity Classification', 'Statutory Clause / Rule', 'Remediation Protocol', 'Avg Resolution (Hrs)'];
    const rows = ISSUE_PIE_DATA.map(d => [
      d.name,
      `${d.value}%`,
      d.count,
      d.severity,
      d.clause,
      d.action,
      d.avgResolveHours
    ]);
    downloadCSV('GeM_Compliance_Bottlenecks_Diagnostic_2026.csv', headers, rows);
    sound.playPass();
    showToast('✓ Compliance Issues Diagnostic report exported to CSV!', 'success');
  };

  const exportFullReport = () => {
    sound.playExport();
    downloadExecutiveReport('GeM Procurement Compliance Executive Audit & Analytics Report');
    sound.playPass();
    showToast('✓ Executive audit report downloaded! Click to print or save as PDF.', 'success');
  };

  // Filtered issues for full view
  const filteredIssues = ISSUE_PIE_DATA.filter(item => {
    if (selectedIssueFilter === 'critical') return item.severity === 'CRITICAL';
    if (selectedIssueFilter === 'resolvable') return item.severity !== 'CRITICAL';
    return true;
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Analytics & Audit Trail"
          subtitle="Enterprise compliance trends, volume velocity, and immutable statutory audit records"
        />

        <div className="page-content">
          <div className="section-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Executive Intelligence Dashboard
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Compliance Health & Velocity Metrics
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="btn btn-ghost btn-sm" onClick={exportAuditCSV} style={{ gap: 6 }}>
                <Download size={14} /> Export CSV
              </button>
              <button className="btn btn-primary btn-sm" onClick={exportFullReport} style={{ gap: 6 }}>
                <FileText size={14} /> PDF Report
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* THE 4 NEXT-LEVEL EXECUTIVE AUDIT KPI CARDS                       */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="stat-grid" style={{ marginBottom: 26 }}>

            {/* CARD 1: Total Bids Audited & Pipeline Velocity */}
            <div
              className="stat-card-executive card-blue"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('bids');
              }}
              title="Click for Bids Volume & Evaluation Velocity Drilldown"
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
                      <BarChart3 size={18} />
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
                      142
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
                          <linearGradient id="auditCardBlueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#auditCardBlueGrad)" />
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

            {/* CARD 2: Man-hours Saved / Turnaround Velocity */}
            <div
              className="stat-card-executive card-green"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('velocity');
              }}
              title="Click for Turnaround Velocity & ROI Acceleration Analysis"
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
                      <Clock size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>Man-Hours Saved</div>
                      <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>1.8 Days vs 14 Days Cycle</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="drilldown-arrow" />
                </div>

                {/* Metric Value & Sparkline Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '8px 0 12px' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                      68h
                    </div>
                    <div className="stat-delta up" style={{ marginTop: 4 }}>
                      ↑ 340% vs manual review
                    </div>
                  </div>

                  {/* Micro Sparkline Chart */}
                  <div style={{ width: 95, height: 42 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={VELOCITY_SPARKLINE} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="auditCardGreenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#auditCardGreenGrad)" />
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
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>87% Cycle Reduction</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>~₹18.5L Admin Saved</span>
              </div>
            </div>

            {/* CARD 3: AI Audit Accuracy Rate */}
            <div
              className="stat-card-executive card-warn"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('accuracy');
              }}
              title="Click for AI Accuracy & Statutory Conformance Matrix"
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
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>AI Accuracy Rate</div>
                      <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>16 Statutory Clauses</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="drilldown-arrow" />
                </div>

                {/* Metric Value & Sparkline Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '8px 0 12px' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                      98.2%
                    </div>
                    <div className="stat-delta up" style={{ marginTop: 4 }}>
                      ↑ 0.4% this month
                    </div>
                  </div>

                  {/* Micro Bar Chart */}
                  <div style={{ width: 95, height: 42 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ACCURACY_SPARKLINE} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
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
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>99.1% Comm. Agreement</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Zero False DQ</span>
              </div>
            </div>

            {/* CARD 4: Fraud & Cartels Blocked */}
            <div
              className="stat-card-executive card-red"
              onClick={() => {
                sound.playTap();
                setActiveKpiModal('fraud');
              }}
              title="Click for Fraud Prevention & Cartelization Sentinel Dossier"
            >
              <div>
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: 'rgba(239, 68, 68, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444'
                    }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>Fraud Prevented</div>
                      <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>Cartel & Forgery Sentinel</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="drilldown-arrow" />
                </div>

                {/* Metric Value & Sparkline Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '8px 0 12px' }}>
                  <div>
                    <div className="stat-value" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>
                      ₹2.4Cr
                    </div>
                    <div className="stat-delta up" style={{ marginTop: 4 }}>
                      ↑ 8 cases intercepted
                    </div>
                  </div>

                  {/* Micro Bar Chart */}
                  <div style={{ width: 95, height: 42 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={FRAUD_SPARKLINE} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <Bar dataKey="v" fill="#ef4444" radius={[3, 3, 0, 0]} />
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
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>4 Fake UDINs · 2 Cartels</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>Statutory Debarment</span>
              </div>
            </div>

          </div>

          {/* Charts Row 1: Compliance Trend & Issue Breakdown */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            
            {/* Chart 1: Compliance Trend Card */}
            <div className="card">
              <div className="chart-card-header">
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={18} color="#10b981" />
                    <span>Compliance Progression (6 Months)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Trajectory vs 80% GeM SLA benchmark · <strong>87% Current</strong>
                  </div>
                </div>
                <button
                  className="chart-expand-btn"
                  onClick={() => {
                    sound.playTap();
                    setActiveChartModal('trend');
                  }}
                  title="Expand to Full View"
                >
                  <Maximize2 size={13} /> Full View
                </button>
              </div>

              {/* Card micro-metrics pill bar */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="pill pill-success" style={{ fontSize: '0.72rem' }}>Current: 87% (↑ +15%)</span>
                <span className="pill pill-info" style={{ fontSize: '0.72rem' }}>SLA Target: 80%</span>
                <span className="pill pill-warning" style={{ fontSize: '0.72rem' }}>Issues: 23/mo (-32%)</span>
              </div>

              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={TREND_DATA_6M} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGradRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickFormatter={v => v.split(' ')[0]} />
                  <YAxis domain={[50, 100]} stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      fontSize: '0.8rem'
                    }}
                    formatter={(val, name) => [`${val}%`, name === 'rate' ? 'Compliance Rate' : name]}
                  />
                  <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'SLA: 80%', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    name="Compliance Rate"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#trendGradRate)"
                    dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    name="Issues Flagged"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Issue Breakdown Card */}
            <div className="card">
              <div className="chart-card-header">
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={18} color="#f59e0b" />
                    <span>Compliance Bottleneck Breakdown</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Root-cause distribution across 100 total flagged incidents
                  </div>
                </div>
                <button
                  className="chart-expand-btn"
                  onClick={() => {
                    sound.playTap();
                    setActiveChartModal('issues');
                  }}
                  title="Expand to Full View"
                >
                  <Maximize2 size={13} /> Full View
                </button>
              </div>

              {/* Card micro-metrics pill bar */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="pill pill-danger" style={{ fontSize: '0.72rem' }}>Top: Missing Docs (35%)</span>
                <span className="pill pill-warning" style={{ fontSize: '0.72rem' }}>PQ Deficit: 25%</span>
                <span className="pill pill-info" style={{ fontSize: '0.72rem' }}>5 Root Causes</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: '50%', height: 230, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ISSUE_PIE_DATA}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={84}
                        paddingAngle={3}
                      >
                        {ISSUE_PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem'
                        }}
                        formatter={(val) => [`${val}% of total issues`, 'Frequency']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Donut Label */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>100</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Issues</div>
                  </div>
                </div>

                {/* Right side compact list */}
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {ISSUE_PIE_DATA.slice(0, 4).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: item.color }}>{item.value}%</span>
                    </div>
                  ))}
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    + 1 additional category (Turnover 8%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Monthly Bid Volume & Vendor Ratings */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            
            {/* Chart 3: Monthly Volume Card */}
            <div className="card">
              <div className="chart-card-header">
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BarChart3 size={18} color="#3b82f6" />
                    <span>Monthly Bid Volume & Velocity</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Bids submitted vs qualified · <strong>83.2% avg qualification rate</strong>
                  </div>
                </div>
                <button
                  className="chart-expand-btn"
                  onClick={() => {
                    sound.playTap();
                    setActiveChartModal('volume');
                  }}
                  title="Expand to Full View"
                >
                  <Maximize2 size={13} /> Full View
                </button>
              </div>

              {/* Card micro-metrics pill bar */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="pill pill-info" style={{ fontSize: '0.72rem' }}>Total: 137 Bids</span>
                <span className="pill pill-success" style={{ fontSize: '0.72rem' }}>Qualified: 114 (83.2%)</span>
                <span className="pill pill-warning" style={{ fontSize: '0.72rem' }}>Avg Velocity: 18.4 hrs</span>
              </div>

              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={MONTHLY_VOLUME_DATA} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickFormatter={v => v.split(' ')[0]} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem'
                    }}
                    formatter={(val, name) => [val, name === 'submitted' ? 'Submitted Bids' : 'Qualified Bids']}
                  />
                  <Bar dataKey="submitted" name="Submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="qualified" name="Qualified" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Vendor Ratings Card */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>
                ⭐ Vendor Performance Ratings
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Score</th>
                      <th>Rating</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Infosys BPM', tag: 'Assessed', score: '98%', rank: '★★★★★', pill: 'pill-success', pillText: 'Top' },
                      { name: 'TCS eGov', tag: 'Assessed', score: '94%', rank: '★★★★★', pill: 'pill-success', pillText: 'Top' },
                      { name: 'Wipro Digital', tag: 'Assessed', score: '87%', rank: '★★★★☆', pill: 'pill-info', pillText: 'Good' },
                      { name: 'Zensar Tech', tag: 'Unassessed', score: '72%', rank: '★★★☆☆', pill: 'pill-warning', pillText: 'Average' },
                      { name: 'Sigma Tech', tag: 'Unassessed', score: '38%', rank: '★☆☆☆☆', pill: 'pill-danger', pillText: 'Risk' },
                    ].map((v, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{v.name}</strong>
                          <br />
                          <small style={{ color: 'var(--text-muted)' }}>{v.tag}</small>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--green-light)' }}>{v.score}</strong>
                        </td>
                        <td style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{v.rank}</td>
                        <td>
                          <span className={`pill ${v.pill}`}>{v.pillText}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Audit Feed */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={16} color="var(--green-light)" /> 🔒 Immutable Audit Log
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="pill pill-success">🔐 Tamper-Proof</span>
                <button className="btn btn-ghost btn-sm" onClick={exportAuditCSV}>
                  Export CSV
                </button>
              </div>
            </div>

            <div id="audit-log">
              {AUDIT_ENTRIES.map((e, i) => (
                <div key={i} className="audit-entry">
                  <div className="audit-line">
                    <div className="audit-dot" style={{ background: e.color, boxShadow: `0 0 10px ${e.color}aa` }} />
                    {i < AUDIT_ENTRIES.length - 1 && <div className="audit-connector" />}
                  </div>
                  <div className="audit-body">
                    <div className="audit-action">{e.action}</div>
                    <div className="audit-detail">{e.detail}</div>
                    <div className="audit-ts">
                      🕐 {e.ts} &nbsp;·&nbsp; <span className="audit-user">👤 {e.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* NEXT-LEVEL FULL VIEW MODALS                                         */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <ChartModal
        isOpen={Boolean(activeChartModal)}
        onClose={() => setActiveChartModal(null)}
        title={
          activeChartModal === 'trend'
            ? 'Compliance Progression & Risk Trend Analytics'
            : activeChartModal === 'issues'
            ? 'Compliance Bottlenecks & Diagnostics Matrix'
            : 'Monthly Bid Volume & Qualification Velocity'
        }
        subtitle={
          activeChartModal === 'trend'
            ? 'Multi-parameter 6-month historical compliance progression against 80% GeM SLA benchmark'
            : activeChartModal === 'issues'
            ? 'Granular root-cause analysis, statutory references, and automated remediation protocols'
            : 'Turnaround velocity, conversion rates, and volume breakdown across procurement cycles'
        }
      >
        <div style={{ padding: '8px 0 16px' }}>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MODAL 1: COMPLIANCE TREND FULL VIEW                             */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeChartModal === 'trend' && (
            <div>
              {/* Executive Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                padding: '12px 16px',
                background: 'var(--bg-glass)',
                borderRadius: 12,
                border: '1px solid var(--border)',
                marginBottom: 20
              }}>
                {/* Metric Selector Pills */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: 4 }}>VIEW MODE:</span>
                  {[
                    { id: 'combined', label: '📊 Combined View' },
                    { id: 'rate', label: '📈 Compliance Rate (%)' },
                    { id: 'issues', label: '⚠️ Issues Detected' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => { sound.playTap(); setTrendMetric(t.id); }}
                      className={`btn btn-sm ${trendMetric === t.id ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Quick Action Export Buttons */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportTrendCSV} style={{ gap: 6 }}>
                    <Download size={13} /> Export CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={exportFullReport} style={{ gap: 6 }}>
                    <FileText size={13} /> Official Report
                  </button>
                </div>
              </div>

              {/* 4 Executive KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Current Compliance</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: 2 }}>87.0%</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ +15.0% from April</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>6-Month Average</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>80.3%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stable upward trajectory</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>GeM SLA Target</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>80.0%</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>+7.0% headroom</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Issues Remediated</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', marginTop: 2 }}>160 Flags</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>100% resolution rate</div>
                </div>
              </div>

              {/* Main Expanded Interactive Area Chart */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '20px 20px 10px',
                marginBottom: 24
              }}>
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={TREND_DATA_6M}>
                    <defs>
                      <linearGradient id="fullTrendRateGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="fullTrendIssuesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={13} />
                    <YAxis
                      yAxisId="left"
                      domain={[50, 100]}
                      stroke="#10b981"
                      fontSize={13}
                      tickFormatter={v => `${v}%`}
                    />
                    {trendMetric === 'combined' && (
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 50]}
                        stroke="#ef4444"
                        fontSize={13}
                        tickFormatter={v => `${v} flags`}
                      />
                    )}
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        color: 'var(--text-primary)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                        fontSize: '0.85rem'
                      }}
                      formatter={(val, name) => [
                        name === 'rate' ? `${val}% (Target: 80%)` : `${val} flags`,
                        name === 'rate' ? 'Compliance Score' : 'Issues Detected'
                      ]}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <ReferenceLine
                      yAxisId="left"
                      y={80}
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      label={{ value: 'GeM Benchmark Target: 80% SLA', fill: '#f59e0b', fontSize: 12, position: 'top' }}
                    />
                    {(trendMetric === 'combined' || trendMetric === 'rate') && (
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="rate"
                        name="Compliance Rate (%)"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#fullTrendRateGrad)"
                        dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: '#059669', stroke: '#fff', strokeWidth: 3 }}
                      />
                    )}
                    {(trendMetric === 'combined' || trendMetric === 'issues') && (
                      <Area
                        yAxisId={trendMetric === 'combined' ? 'right' : 'left'}
                        type="monotone"
                        dataKey="issues"
                        name="Issues Flagged"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        fill="url(#fullTrendIssuesGrad)"
                        dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Deep-Dive Audit Data Table */}
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                  📋 Monthly Compliance Trajectory & SLA Headroom Breakdown
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Compliance Score</th>
                        <th>MoM Delta</th>
                        <th>Issues Flagged</th>
                        <th>SLA Headroom</th>
                        <th>Risk Level</th>
                        <th>Auditing Observation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TREND_DATA_6M.map((row, i) => (
                        <tr key={i}>
                          <td><strong>{row.month}</strong></td>
                          <td>
                            <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>{row.rate}%</strong>
                          </td>
                          <td>
                            <span style={{ color: row.mom.startsWith('+') ? '#10b981' : 'var(--text-muted)', fontWeight: 700 }}>
                              {row.mom}
                            </span>
                          </td>
                          <td><span style={{ color: '#ef4444', fontWeight: 700 }}>{row.issues} flags</span></td>
                          <td>
                            <span className={`pill ${row.slaDelta >= 0 ? 'pill-success' : 'pill-danger'}`}>
                              {row.slaDelta >= 0 ? `+${row.slaDelta}% above` : `${row.slaDelta}% below`}
                            </span>
                          </td>
                          <td>
                            <span className={`pill ${row.risk === 'Optimal' ? 'pill-success' : row.risk === 'Medium' ? 'pill-warning' : 'pill-danger'}`}>
                              {row.risk}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MODAL 2: ISSUE BREAKDOWN FULL VIEW                              */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeChartModal === 'issues' && (
            <div>
              {/* Executive Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                padding: '12px 16px',
                background: 'var(--bg-glass)',
                borderRadius: 12,
                border: '1px solid var(--border)',
                marginBottom: 20
              }}>
                {/* Filter Selector */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: 4 }}>SEVERITY FILTER:</span>
                  {[
                    { id: 'all', label: 'All 5 Categories' },
                    { id: 'critical', label: '🚨 Critical Disqualifications' },
                    { id: 'resolvable', label: '⚡ Resolvable Clarifications' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => { sound.playTap(); setSelectedIssueFilter(t.id); }}
                      className={`btn btn-sm ${selectedIssueFilter === t.id ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Export Buttons */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportIssuesCSV} style={{ gap: 6 }}>
                    <Download size={13} /> Export CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={exportFullReport} style={{ gap: 6 }}>
                    <FileText size={13} /> Official Report
                  </button>
                </div>
              </div>

              {/* 4 Diagnostics KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Incidents</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>100 Flags</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recorded in FY 2026-27</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Dominant Bottleneck</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', marginTop: 2 }}>35.0%</div>
                  <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>Missing mandatory docs</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Clarification Success</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: 2 }}>84.2%</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Resolved within 24 hours</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>AI Auto-Detection</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3b82f6', marginTop: 2 }}>99.1%</div>
                  <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 600 }}>Pre-evaluation catch rate</div>
                </div>
              </div>

              {/* Dual Pane: Large Donut Chart + Diagnostic Action Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 20, marginBottom: 24 }}>
                {/* Left Pane: Donut Chart with glowing center */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Incident Distribution Radar
                  </div>
                  <div style={{ width: '100%', height: 320, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filteredIssues}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={130}
                          paddingAngle={4}
                          onMouseEnter={(_, idx) => setActiveDonutIndex(idx)}
                          onMouseLeave={() => setActiveDonutIndex(null)}
                        >
                          {filteredIssues.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke={activeDonutIndex === index ? '#fff' : 'transparent'}
                              strokeWidth={3}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 10,
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem'
                          }}
                          formatter={(val, name) => [`${val}% (${val} instances)`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Donut Center Display */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {activeDonutIndex !== null ? `${filteredIssues[activeDonutIndex].value}%` : '100'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginTop: 4 }}>
                        {activeDonutIndex !== null ? filteredIssues[activeDonutIndex].name : 'Total Flags'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Diagnostic Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filteredIssues.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        borderLeft: `4px solid ${item.color}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{item.name}</span>
                          <span className={`pill ${item.severity === 'CRITICAL' ? 'pill-danger' : item.severity === 'HIGH' ? 'pill-warning' : 'pill-info'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                            {item.severity}
                          </span>
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: item.color }}>
                          {item.value}% <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>({item.count} bids)</span>
                        </div>
                      </div>

                      {/* Mini Progress Bar */}
                      <div style={{ height: 5, background: 'rgba(148, 163, 184, 0.2)', borderRadius: 4, overflow: 'hidden', margin: '6px 0 8px' }}>
                        <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: 4 }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        <div><strong>Statutory Rule:</strong> {item.clause}</div>
                        <div><strong>Avg Resolution:</strong> {item.avgResolveHours} hrs</div>
                      </div>

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, background: 'var(--bg-glass)', padding: '4px 8px', borderRadius: 6 }}>
                        💡 <strong>Remediation:</strong> {item.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom AI Recommendations Box */}
              <div style={{
                background: 'rgba(13, 148, 136, 0.08)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                borderRadius: 12,
                padding: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 800, color: '#0d9488', marginBottom: 6 }}>
                  <Zap size={16} /> AI Executive Root-Cause Recommendation
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
                  60% of compliance bottlenecks originate from non-submission of ISO 27001 certificates and CA turnover proof at initial bid upload.
                  <strong> Recommendation:</strong> Enable compulsory pre-upload verification gateway in contractor portal to achieve <strong>95%+ first-pass qualification velocity</strong>.
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MODAL 3: MONTHLY BID VOLUME FULL VIEW                           */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeChartModal === 'volume' && (
            <div>
              {/* Executive Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                padding: '12px 16px',
                background: 'var(--bg-glass)',
                borderRadius: 12,
                border: '1px solid var(--border)',
                marginBottom: 20
              }}>
                {/* View Mode Toggle */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: 4 }}>CHART MODE:</span>
                  {[
                    { id: 'grouped', label: '📊 Grouped Volumes' },
                    { id: 'stacked', label: '📑 Stacked Total' },
                    { id: 'rate', label: '🎯 Qualification % Spline' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => { sound.playTap(); setVolumeView(t.id); }}
                      className={`btn btn-sm ${volumeView === t.id ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Export Buttons */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportVolumeCSV} style={{ gap: 6 }}>
                    <Download size={13} /> Export CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={exportFullReport} style={{ gap: 6 }}>
                    <FileText size={13} /> Official Report
                  </button>
                </div>
              </div>

              {/* 4 Volume KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Submitted Bids</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3b82f6', marginTop: 2 }}>137 Bids</div>
                  <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 600 }}>₹132 Crore procurement</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Qualified</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: 2 }}>114 Bids</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>83.2% overall conversion</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Disqualified / Rejected</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', marginTop: 2 }}>23 Bids</div>
                  <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>Statutory irregularities</div>
                </div>
                <div className="metric-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Avg Turnaround Velocity</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', marginTop: 2 }}>18.4 Hours</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>5.4x faster than manual</div>
                </div>
              </div>

              {/* Main Expanded Interactive Volume Chart */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '20px 20px 10px',
                marginBottom: 24
              }}>
                <ResponsiveContainer width="100%" height={380}>
                  {volumeView === 'rate' ? (
                    <AreaChart data={MONTHLY_VOLUME_DATA}>
                      <defs>
                        <linearGradient id="volConvGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={13} />
                      <YAxis domain={[50, 100]} stroke="#10b981" fontSize={13} tickFormatter={v => `${v}%`} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem'
                        }}
                        formatter={(val) => [`${val}%`, 'Qualification Conversion Rate']}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Area
                        type="monotone"
                        dataKey="convRate"
                        name="Qualification Conversion Rate (%)"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#volConvGrad)"
                        dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: '#059669', stroke: '#fff', strokeWidth: 3 }}
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={MONTHLY_VOLUME_DATA} barGap={6}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={13} />
                      <YAxis stroke="var(--text-muted)" fontSize={13} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem'
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar
                        dataKey="submitted"
                        name="Total Bids Submitted"
                        fill="#3b82f6"
                        stackId={volumeView === 'stacked' ? 'a' : undefined}
                        radius={volumeView === 'stacked' ? [0, 0, 0, 0] : [6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="qualified"
                        name="Bids Fully Qualified"
                        fill="#10b981"
                        stackId={volumeView === 'stacked' ? 'a' : undefined}
                        radius={[6, 6, 0, 0]}
                      />
                      {volumeView === 'grouped' && (
                        <Bar
                          dataKey="disqualified"
                          name="Disqualified / Non-Compliant"
                          fill="#ef4444"
                          radius={[6, 6, 0, 0]}
                        />
                      )}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Deep-Dive Volume Table */}
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                  📋 Monthly Procurement Cycle Volume & Velocity Breakdown
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Procurement Cycle</th>
                        <th>Bids Submitted</th>
                        <th>Qualified Bids</th>
                        <th>Disqualified</th>
                        <th>Conversion Rate</th>
                        <th>Procurement Volume</th>
                        <th>Turnaround Velocity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MONTHLY_VOLUME_DATA.map((row, i) => (
                        <tr key={i}>
                          <td><strong>{row.month}</strong></td>
                          <td><strong style={{ color: '#3b82f6' }}>{row.submitted}</strong></td>
                          <td><strong style={{ color: '#10b981' }}>{row.qualified}</strong></td>
                          <td><span style={{ color: '#ef4444', fontWeight: 700 }}>{row.disqualified}</span></td>
                          <td>
                            <span className="pill pill-success" style={{ fontWeight: 700 }}>
                              {row.convRate}%
                            </span>
                          </td>
                          <td><strong>{row.volumeCr}</strong></td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-primary)', fontWeight: 600 }}>
                              <Clock size={13} color="#8b5cf6" /> {row.turnaroundDays} days
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </ChartModal>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EXECUTIVE KPI DRILLDOWN MODAL                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeKpiModal && (
        <div className="modal-overlay open" onClick={() => setActiveKpiModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setActiveKpiModal(null)}>✕</button>

            {/* Drilldown 1: Total Bids Audited */}
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
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Total Bids Audited & Pipeline Velocity</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Statutory GFR Rule 149 verification across 142 bids in FY 2026-27
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '18px 0' }}>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Evaluated</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>142</div>
                    <div style={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: 600 }}>₹132.0 Cr Value</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Qualified</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginTop: 2 }}>114</div>
                    <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>80.3% Conversion</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Clarifications</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b', marginTop: 2 }}>18</div>
                    <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 600 }}>12.7% In-Review</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Disqualified</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444', marginTop: 2 }}>10</div>
                    <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 600 }}>7.0% Non-Compliant</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  📊 Monthly Ingestion &amp; Conversion Velocity:
                </div>
                <div className="table-wrap" style={{ marginBottom: 18 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Submitted</th>
                        <th>Qualified</th>
                        <th>DQ</th>
                        <th>Conversion</th>
                        <th>Procurement Volume</th>
                        <th>Turnaround</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MONTHLY_VOLUME_DATA.map((row, i) => (
                        <tr key={i}>
                          <td><strong>{row.month}</strong></td>
                          <td><strong style={{ color: '#3b82f6' }}>{row.submitted}</strong></td>
                          <td><strong style={{ color: '#10b981' }}>{row.qualified}</strong></td>
                          <td><span style={{ color: '#ef4444', fontWeight: 700 }}>{row.disqualified}</span></td>
                          <td><span className="pill pill-success">{row.convRate}%</span></td>
                          <td><strong>{row.volumeCr}</strong></td>
                          <td>{row.turnaroundDays} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportVolumeCSV} style={{ gap: 6 }}>
                    <Download size={14} /> Export Volume CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveKpiModal(null)}>
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Drilldown 2: Man-Hours Saved & Velocity */}
            {activeKpiModal === 'velocity' && (
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
                    <Clock size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Turnaround Velocity &amp; Operational Savings Matrix</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Accelerating statutory procurement cycles from 14 days manual to 1.8 days AI
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '18px 0' }}>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hours Saved</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginTop: 2 }}>68h</div>
                    <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>↑ 340% Boost</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Turnaround</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>1.8 Days</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>vs 14 Days Manual</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cycle Reduction</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3b82f6', marginTop: 2 }}>87.1%</div>
                    <div style={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: 600 }}>Faster Decisions</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Admin Cost Saved</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#8b5cf6', marginTop: 2 }}>₹18.5L</div>
                    <div style={{ fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 600 }}>Govt Savings</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  ⏱️ Stage-by-Stage Evaluation Cycle Acceleration:
                </div>
                <div className="table-wrap" style={{ marginBottom: 16 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Procurement Stage</th>
                        <th>Manual Process</th>
                        <th>Antigravity AI</th>
                        <th>Efficiency Gain</th>
                        <th>GeM SLA Benchmark</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>OCR &amp; Entity Extraction</strong></td>
                        <td>2.5 Hours</td>
                        <td><strong style={{ color: '#10b981' }}>45 Seconds</strong></td>
                        <td><span className="pill pill-success">99.0% Faster</span></td>
                        <td>15 Mins</td>
                      </tr>
                      <tr>
                        <td><strong>Technical PQ Criteria Matching</strong></td>
                        <td>15.0 Hours</td>
                        <td><strong style={{ color: '#10b981' }}>1.2 Hours</strong></td>
                        <td><span className="pill pill-success">92.0% Faster</span></td>
                        <td>4 Hours</td>
                      </tr>
                      <tr>
                        <td><strong>Statutory Clauses &amp; GTC/ATC</strong></td>
                        <td>8.0 Hours</td>
                        <td><strong style={{ color: '#10b981' }}>45 Minutes</strong></td>
                        <td><span className="pill pill-success">89.0% Faster</span></td>
                        <td>2 Hours</td>
                      </tr>
                      <tr>
                        <td><strong>L1 Commercial Price Matrix</strong></td>
                        <td>4.0 Hours</td>
                        <td><strong style={{ color: '#10b981' }}>10 Minutes</strong></td>
                        <td><span className="pill pill-success">95.0% Faster</span></td>
                        <td>30 Mins</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Dual Value Box for Officer & Bidder */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#3b82f6', marginBottom: 4 }}>
                      🏛️ For Government Officers:
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Eliminates evaluation backlog completely. Committee review briefing sheets are generated in 20 minutes instead of 5 days, ready for CAG &amp; CVC audit scrutiny.
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', marginBottom: 4 }}>
                      🏢 For Participating Bidders:
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Tender results announced 7 days earlier, unfreezing Earnest Money Deposits (EMD) and Bank Guarantees rapidly, reducing contractor capital holding costs.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportVelocityCSV} style={{ gap: 6 }}>
                    <Download size={14} /> Export Velocity ROI CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveKpiModal(null)}>
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Drilldown 3: AI Accuracy Rate */}
            {activeKpiModal === 'accuracy' && (
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
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>AI Model Precision &amp; Statutory Conformance Matrix</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Clause-by-clause audit precision benchmarked against GeM STC and GFR 2017
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '18px 0' }}>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>AI Accuracy</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b', marginTop: 2 }}>98.2%</div>
                    <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>↑ 0.4% MoM</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Committee Match</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginTop: 2 }}>99.1%</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Concordance</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>False DQ Rate</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginTop: 2 }}>0.0%</div>
                    <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>Zero False DQ</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Audited Rules</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3b82f6', marginTop: 2 }}>16</div>
                    <div style={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: 600 }}>Clauses / Bid</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  ⚖️ Statutory Conformance by Regulatory Clause:
                </div>
                <div className="table-wrap" style={{ marginBottom: 16 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Audit Framework</th>
                        <th>Statutory Rule</th>
                        <th>AI Confidence</th>
                        <th>Committee Match</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Technical Spec Adherence</strong></td>
                        <td>Schedule of Requirements (SoR)</td>
                        <td><strong style={{ color: '#10b981' }}>97.8%</strong></td>
                        <td>98.5%</td>
                        <td><span className="pill pill-success">Verified</span></td>
                      </tr>
                      <tr>
                        <td><strong>Pre-Qualification (PQ) Check</strong></td>
                        <td>GFR 2017 Rule 149(4)(b)</td>
                        <td><strong style={{ color: '#10b981' }}>99.4%</strong></td>
                        <td>99.8%</td>
                        <td><span className="pill pill-success">Verified</span></td>
                      </tr>
                      <tr>
                        <td><strong>CA Turnover &amp; UDIN Validation</strong></td>
                        <td>ICAI UDIN &amp; GFR Rule 173</td>
                        <td><strong style={{ color: '#10b981' }}>98.9%</strong></td>
                        <td>99.2%</td>
                        <td><span className="pill pill-success">Verified</span></td>
                      </tr>
                      <tr>
                        <td><strong>ISO &amp; Cybersecurity Certs</strong></td>
                        <td>GeM STC Clause 3.2 &amp; ISO 27001</td>
                        <td><strong style={{ color: '#10b981' }}>99.0%</strong></td>
                        <td>99.5%</td>
                        <td><span className="pill pill-success">Verified</span></td>
                      </tr>
                      <tr>
                        <td><strong>MSME &amp; Make in India</strong></td>
                        <td>Public Procurement Policy 2012</td>
                        <td><strong style={{ color: '#10b981' }}>98.7%</strong></td>
                        <td>99.0%</td>
                        <td><span className="pill pill-success">Verified</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 18 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                    🎯 Algorithmic Impartiality Guarantee
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Every single evaluation parameter is mathematically verified against the tender RFP text without human bias, favoritism, or subjective error, providing bidders 100% legal fairness.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportAccuracyCSV} style={{ gap: 6 }}>
                    <Download size={14} /> Export Accuracy CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveKpiModal(null)}>
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Drilldown 4: Fraud & Cartels Blocked */}
            {activeKpiModal === 'fraud' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                  }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Statutory Integrity Sentinel &amp; Fraud Interception Dossier</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Algorithmic detection of bid rigging, forged CA certificates, and shell companies
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '18px 0' }}>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fraud Blocked</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444', marginTop: 2 }}>₹2.4 Cr</div>
                    <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 600 }}>Public Funds Protected</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cases Blocked</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444', marginTop: 2 }}>8</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Critical Incidents</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Forged UDINs</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b', marginTop: 2 }}>4</div>
                    <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 600 }}>ICAI Cross-Check</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cartels Broken</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#8b5cf6', marginTop: 2 }}>2</div>
                    <div style={{ fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 600 }}>Collusion Rings</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  🚨 Critical Fraud &amp; Collusion Interception Dossier:
                </div>
                <div className="table-wrap" style={{ marginBottom: 16 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Bidder Entity</th>
                        <th>Tender Ref</th>
                        <th>Irregularity Detected</th>
                        <th>Value</th>
                        <th>Statute</th>
                        <th>Action Taken</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Sigma Tech Corp</strong></td>
                        <td>GEM/2026/B/4521</td>
                        <td>Forged ISO 27001 &amp; GSTIN Mismatch</td>
                        <td><strong style={{ color: '#ef4444' }}>₹88.0L</strong></td>
                        <td>GeM STC Clause 3.2</td>
                        <td><span className="pill pill-danger">Disqualified &amp; Debarred</span></td>
                      </tr>
                      <tr>
                        <td><strong>Apex &amp; Zenith Systems</strong></td>
                        <td>GEM/2026/B/4476</td>
                        <td>IP &amp; MAC Collusion (Bid Rigging)</td>
                        <td><strong style={{ color: '#ef4444' }}>₹64.5L</strong></td>
                        <td>Competition Act 2002</td>
                        <td><span className="pill pill-danger">CVC Flagged</span></td>
                      </tr>
                      <tr>
                        <td><strong>Matrix Supply Chain</strong></td>
                        <td>GEM/2026/B/4390</td>
                        <td>Forged CA UDIN Turnover Certificate</td>
                        <td><strong style={{ color: '#ef4444' }}>₹45.0L</strong></td>
                        <td>GFR 2017 Rule 173</td>
                        <td><span className="pill pill-danger">ICAI Alert Sent</span></td>
                      </tr>
                      <tr>
                        <td><strong>Delta Tech Enterprises</strong></td>
                        <td>GEM/2026/B/4210</td>
                        <td>Non-compliant Shell Entity</td>
                        <td><strong style={{ color: '#ef4444' }}>₹42.5L</strong></td>
                        <td>GFR 2017 Rule 144</td>
                        <td><span className="pill pill-danger">Debarred under STC</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={exportFraudCSV} style={{ gap: 6 }}>
                    <Download size={14} /> Export Sentinel Dossier CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveKpiModal(null)}>
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
