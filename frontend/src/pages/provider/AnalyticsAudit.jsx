import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { useToast } from '../../components/Toast';
import { Download, ShieldCheck, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Lock, FileText } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const TREND_DATA = [
  { month: 'Apr', rate: 72, issues: 34 },
  { month: 'May', rate: 75, issues: 28 },
  { month: 'Jun', rate: 80, issues: 26 },
  { month: 'Jul', rate: 83, issues: 25 },
  { month: 'Aug', rate: 85, issues: 24 },
  { month: 'Sep', rate: 87, issues: 23 },
];

const ISSUE_PIE_DATA = [
  { name: 'Missing Documents', value: 35, color: '#ef4444' },
  { name: 'PQ Criteria Fail', value: 25, color: '#f59e0b' },
  { name: 'Expired Certs', value: 20, color: '#8b5cf6' },
  { name: 'Spec Mismatch', value: 12, color: '#3b82f6' },
  { name: 'Turnover Issue', value: 8, color: '#10b981' },
];

const MONTHLY_VOLUME = [
  { month: 'Apr', submitted: 18, qualified: 12 },
  { month: 'May', submitted: 22, qualified: 16 },
  { month: 'Jun', submitted: 25, qualified: 20 },
  { month: 'Jul', submitted: 28, qualified: 24 },
  { month: 'Aug', submitted: 26, qualified: 22 },
  { month: 'Sep', submitted: 23, qualified: 20 },
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

  const exportCSV = () => {
    showToast('Generating audit log CSV...', 'info');
    setTimeout(() => {
      const headers = ['Timestamp', 'Action', 'Detail', 'User'];
      const rows = AUDIT_ENTRIES.map((e) => [`"${e.ts}"`, `"${e.action}"`, `"${e.detail}"`, `"${e.user}"`].join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'GeM_Audit_Trail_Sep2026.csv';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Audit log exported to GeM_Audit_Trail_Sep2026.csv', 'success');
    }, 1200);
  };

  const exportReport = () => {
    showToast('Generating PDF report...', 'info');
    setTimeout(() => {
      showToast('Report downloaded: GeM_Compliance_Report_Sep2026.pdf', 'success');
    }, 1500);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Analytics & Audit Trail" subtitle="Compliance trends, performance metrics, and immutable audit records" />

        <div className="page-content">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Analytics &amp; <span className="gradient-text-green">Audit Trail</span>
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Real-time compliance analytics and tamper-proof verification history
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
                <Download size={14} /> Export CSV
              </button>
              <button className="btn btn-primary btn-sm" onClick={exportReport}>
                <FileText size={14} /> PDF Report
              </button>
            </div>
          </div>

          {/* Stat Grid */}
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card blue">
              <div className="stat-icon blue">📊</div>
              <div className="stat-value">142</div>
              <div className="stat-label">Total Bids Analyzed</div>
              <div className="stat-delta up">↑ FY 2026-27</div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon green">⏱️</div>
              <div className="stat-value">68h</div>
              <div className="stat-label">Man-hours Saved</div>
              <div className="stat-delta up">↑ 340% vs manual</div>
            </div>
            <div className="stat-card warn">
              <div className="stat-icon warn">🎯</div>
              <div className="stat-value">98.2%</div>
              <div className="stat-label">AI Accuracy Rate</div>
              <div className="stat-delta up">↑ 0.4% this month</div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon red">🛡️</div>
              <div className="stat-value">₹2.4Cr</div>
              <div className="stat-label">Fraud Prevented</div>
              <div className="stat-delta up">↑ 8 cases blocked</div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 20 }}>
                📈 Compliance Trend (6 Months)
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="rate" name="Compliance Rate (%)" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  <Line type="monotone" dataKey="issues" name="Issues Flagged" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 20 }}>
                🥧 Issue Breakdown
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={ISSUE_PIE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {ISSUE_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid var(--border)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vendor Matrix & Audit Log */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>
                📊 Monthly Bid Volume
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MONTHLY_VOLUME}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Bar dataKey="submitted" name="Bids Submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="qualified" name="Bids Qualified" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

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
                <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
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
    </div>
  );
}
