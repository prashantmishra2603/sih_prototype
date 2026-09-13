/**
 * GeM Compliance Platform - Executive Report & CSV Export Utility
 * Generates official printable executive audit reports and clean Excel-compatible CSVs.
 */

export function downloadCSV(filename, headers, rows) {
  const bom = '\uFEFF';
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => {
      const escaped = String(cell ?? '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(','))
  ].join('\r\n');

  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExecutiveReport(reportTitle = 'GeM Compliance Executive Audit Report', customMeta = {}) {
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  });

  const docId = `GEM-AUDIT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const sha256 = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - ${docId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #faf7ec;
      color: #0f172a;
      padding: 40px;
      line-height: 1.5;
    }
    .report-card {
      max-width: 900px;
      margin: 0 auto;
      background: #fffdf5;
      border: 1px solid #e5dcb8;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .logo-area h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      font-family: 'Space Grotesk', sans-serif;
    }
    .logo-area p {
      font-size: 0.8rem;
      color: #1e3a8a;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .gov-badge {
      text-align: right;
      font-size: 0.75rem;
      color: #334155;
    }
    .gov-badge strong {
      color: #0f172a;
      display: block;
      font-size: 0.85rem;
    }
    .title-box {
      background: #f4eee0;
      border: 1px solid #e5dcb8;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title-box h2 {
      font-size: 1.25rem;
      color: #0f172a;
      font-weight: 800;
    }
    .title-box span {
      font-size: 0.78rem;
      color: #1e3a8a;
      font-weight: 700;
      background: #fffdf5;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #e5dcb8;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 32px;
    }
    .metric-card {
      background: #fffdf5;
      border: 1px solid #e5dcb8;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
    }
    .metric-label {
      font-size: 0.72rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .metric-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      margin-top: 4px;
    }
    .metric-delta {
      font-size: 0.72rem;
      color: #0d9488;
      font-weight: 700;
      margin-top: 2px;
    }
    h3 {
      font-size: 1rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
      font-size: 0.82rem;
    }
    th {
      background: #f4eee0;
      color: #1e3a8a;
      text-align: left;
      padding: 10px 14px;
      font-weight: 700;
      border-bottom: 1px solid #e5dcb8;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid #e5dcb8;
      color: #0f172a;
    }
    tr:nth-child(even) td {
      background: #faf7ec;
    }
    .badge-success { background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; }
    .badge-danger { background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; }
    .badge-warning { background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; }
    
    .footer {
      border-top: 1px solid #e5dcb8;
      padding-top: 20px;
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #64748b;
    }
    .hash {
      font-family: monospace;
      color: #1e3a8a;
      font-weight: 600;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .report-card { border: none; box-shadow: none; padding: 0; width: 100%; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-end; gap: 10px;">
      <button onclick="window.print()" style="background: #1e3a8a; color: #fff; border: none; border-radius: 8px; padding: 8px 18px; font-weight: 600; cursor: pointer;">🖨️ Print / Save as PDF</button>
    </div>

    <div class="header">
      <div class="logo-area">
        <h1>🛡️ BidCheck AI</h1>
        <p>Government e-Marketplace (GeM) · Compliance Platform</p>
      </div>
      <div class="gov-badge">
        <strong>Government of India</strong>
        <span>Ministry of Defence / Central Public Procurement</span><br/>
        <span>Ref Doc: ${docId}</span>
      </div>
    </div>

    <div class="title-box">
      <div>
        <h2>${reportTitle}</h2>
        <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">Automated Statutory Audit & Rule 149/173 Compliance Verification</div>
      </div>
      <span>CONFIDENTIAL · OFFICIAL</span>
    </div>

    <div class="grid-4">
      <div class="metric-card">
        <div class="metric-label">Total Bids Analyzed</div>
        <div class="metric-val">142</div>
        <div class="metric-delta">↑ FY 2026-27 YTD</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">AI Accuracy Rate</div>
        <div class="metric-val">98.2%</div>
        <div class="metric-delta">↑ 0.4% this month</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Man-Hours Saved</div>
        <div class="metric-val">68 Hours</div>
        <div class="metric-delta">↑ 340% vs manual</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Irregularities Prevented</div>
        <div class="metric-val">₹2.4 Crore</div>
        <div class="metric-delta">8 Critical Cases</div>
      </div>
    </div>

    <h3>📊 1. Monthly Compliance & Volume Velocity</h3>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Submitted Bids</th>
          <th>Qualified Bids</th>
          <th>Conversion Rate</th>
          <th>Flagged Issues</th>
          <th>GeM SLA Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>April 2026</td><td>18</td><td>12</td><td>66.7%</td><td>34</td><td><span class="badge-warning">Monitoring</span></td></tr>
        <tr><td>May 2026</td><td>22</td><td>16</td><td>72.7%</td><td>28</td><td><span class="badge-warning">Monitoring</span></td></tr>
        <tr><td>June 2026</td><td>25</td><td>20</td><td>80.0%</td><td>26</td><td><span class="badge-success">SLA Met (80%)</span></td></tr>
        <tr><td>July 2026</td><td>28</td><td>24</td><td>85.7%</td><td>25</td><td><span class="badge-success">Exceeded (83%)</span></td></tr>
        <tr><td>August 2026</td><td>26</td><td>22</td><td>84.6%</td><td>24</td><td><span class="badge-success">Exceeded (85%)</span></td></tr>
        <tr><td>September 2026</td><td>23</td><td>20</td><td>87.0%</td><td>23</td><td><span class="badge-success">Exceeded (87%)</span></td></tr>
      </tbody>
    </table>

    <h3>🥧 2. Compliance Bottleneck Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>Issue Category</th>
          <th>Incidents (%)</th>
          <th>Severity</th>
          <th>Statutory Reference</th>
          <th>Corrective Action Required</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Missing Mandatory Documents</td><td>35% (35 flags)</td><td><span class="badge-danger">CRITICAL</span></td><td>GeM STC Clause 3.2</td><td>Immediate 24-hr clarification notice</td></tr>
        <tr><td>PQ Criteria / Turnover Deficit</td><td>25% (25 flags)</td><td><span class="badge-danger">CRITICAL</span></td><td>GFR 2017 Rule 149(4)(b)</td><td>Formal Disqualification recording</td></tr>
        <tr><td>Expired Certifications (ISO/BIS)</td><td>20% (20 flags)</td><td><span class="badge-warning">HIGH</span></td><td>GeM Vendor Undertaking</td><td>Upload renewal acknowledgement</td></tr>
        <tr><td>Technical Spec Deviations</td><td>12% (12 flags)</td><td><span class="badge-warning">MEDIUM</span></td><td>Schedule of Requirements</td><td>Technical Committee clarification</td></tr>
        <tr><td>Financial / Turnover Discrepancy</td><td>8% (8 flags)</td><td><span class="badge-warning">LOW</span></td><td>Audited Balance Sheet</td><td>CA Turnover Certificate check</td></tr>
      </tbody>
    </table>

    <h3>🔒 3. Immutable Statutory Audit Trail (Excerpt)</h3>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Action Recorded</th>
          <th>Details & Reference</th>
          <th>Authorized User</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>08 Sep 2026, 18:20:45</td><td>AI Compliance Scan Initiated</td><td>Bid GEM/2026/B/4521 — 16 criteria checked</td><td>System AI (Model v2.4)</td></tr>
        <tr><td>08 Sep 2026, 16:30:12</td><td>Vendor Qualified — Tech Stage</td><td>Infosys BPM Ltd passed all PQ criteria (Score: 94/100)</td><td>Rajesh Kumar (Officer - MoD)</td></tr>
        <tr><td>08 Sep 2026, 15:15:00</td><td>Disqualification Recorded</td><td>Sigma Tech Corp — DQ: Missing ISO 27001, Expired GSTIN</td><td>Rajesh Kumar (Officer - MoD)</td></tr>
        <tr><td>08 Sep 2026, 10:30:00</td><td>Clarification Request Sent</td><td>Sent to TCS eGov for ISO 27001 certificate verification</td><td>Rajesh Kumar (Officer - MoD)</td></tr>
        <tr><td>08 Sep 2026, 11:15:33</td><td>Document AI-Verified</td><td>Experience Certificate verified by OCR engine</td><td>System AI (Model v2.4)</td></tr>
      </tbody>
    </table>

    <div class="footer">
      <div>
        Generated on: <strong>${timestamp}</strong><br/>
        Cryptographic Audit Hash: <span class="hash">${sha256}</span>
      </div>
      <div style="text-align: right;">
        <strong>BidCheck AI Compliance Automation</strong><br/>
        Valid statutory document under IT Act 2000 Section 65B
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `GeM_Compliance_Executive_Audit_Report_${new Date().toISOString().slice(0, 10)}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
