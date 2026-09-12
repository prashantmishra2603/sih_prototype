import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { ScoreRing } from '../../components/ScoreRing';
import { getTenders, getTenderBids } from '../../api/client';
import { useToast } from '../../components/Toast';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tenders, setTenders] = useState([]);
  const [allBids, setAllBids] = useState([]);

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

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Dashboard Overview"
          subtitle={`Welcome back, ${user?.name || 'Rajesh Kumar'} — Real-time monitoring of all active GeM bids`}
        />

        <div className="page-content">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Compliance <span className="gradient-text-green">Overview</span>
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Real-time monitoring of all active GeM bids — Last synced 2 mins ago
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => showToast('Exporting executive PDF summary report...', 'info')}
              >
                📥 Export Report
              </button>
              <select className="input-field btn-sm" style={{ width: 'auto', padding: '6px 12px' }}>
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>FY 2026-27</option>
              </select>
            </div>
          </div>

          {/* Stat Grid */}
          <div className="stat-grid">
            <div className="stat-card blue" onClick={() => navigate('/provider/compare/tender_001')}>
              <div className="stat-icon blue">📋</div>
              <div className="stat-value">{totalBids}</div>
              <div className="stat-label">Total Bids Verified</div>
              <div className="stat-delta up">↑ 12% from last month</div>
            </div>
            <div className="stat-card green" onClick={() => navigate('/provider/analytics')}>
              <div className="stat-icon green">✅</div>
              <div className="stat-value">{avgScore}%</div>
              <div className="stat-label">Compliance Rate (%)</div>
              <div className="stat-delta up">↑ 4.3 pts improvement</div>
            </div>
            <div className="stat-card warn" onClick={() => navigate('/provider/verifier')}>
              <div className="stat-icon warn">⚠️</div>
              <div className="stat-value">{highRisk}</div>
              <div className="stat-label">Issues Flagged</div>
              <div className="stat-delta down">↓ 5 resolved today</div>
            </div>
            <div className="stat-card red" onClick={() => navigate('/provider/analytics')}>
              <div className="stat-icon red">⏱️</div>
              <div className="stat-value">68h</div>
              <div className="stat-label">Hours Saved (AI)</div>
              <div className="stat-delta up">↑ vs manual review</div>
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
                  Aggregate across all active bids weighted by bid value.
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

            {/* Live Feed */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">⚡ Live Alert Feed</div>
                <span className="pill pill-danger">3 Critical</span>
              </div>
              <div
                className="alert-item critical"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/provider/verifier')}
              >
                <span className="alert-icon">🚨</span>
                <div className="alert-body">
                  <h4>Missing GST Certificate — GEM/2026/B/4521</h4>
                  <p>Sigma Electronics has not uploaded valid GST certificate. Deadline in 6 hours.</p>
                </div>
                <span className="alert-time">2m ago</span>
              </div>

              <div
                className="alert-item warning"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/provider/verifier')}
              >
                <span className="alert-icon">⚠️</span>
                <div className="alert-body">
                  <h4>ISO 9001 Expiring — TechCraft Solutions</h4>
                  <p>Certificate expires in 14 days. Renewal required for continued compliance.</p>
                </div>
                <span className="alert-time">15m ago</span>
              </div>

              <div
                className="alert-item warning"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/provider/compare/tender_001')}
              >
                <span className="alert-icon">⏰</span>
                <div className="alert-body">
                  <h4>48-Hour Representation Window Closing</h4>
                  <p>Bid GEM/2026/B/4498 representation period ends in 32 hours.</p>
                </div>
                <span className="alert-time">1h ago</span>
              </div>
            </div>
          </div>

          {/* Active Bids Grid */}
          <div className="card mb-6">
            <div className="card-header">
              <div className="card-title">📋 Active Bids</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/provider/compare/tender_001')}>
                View All →
              </button>
            </div>

            <div className="grid-3">
              <div className="bid-card" onClick={() => navigate('/provider/bid/bid_001')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div className="bid-id">GEM/2026/B/4521</div>
                    <div className="bid-name">Industrial Safety Equipment</div>
                    <div className="bid-org">Ministry of Defence</div>
                  </div>
                  <span className="pill pill-danger">Critical</span>
                </div>
                <div className="bid-meta">
                  <span className="bid-meta-item">💰 ₹48.5L</span>
                  <span className="bid-meta-item">📅 3 days left</span>
                  <span className="bid-meta-item">👥 7 Bidders</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="breakdown-label">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Compliance</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--red-light)', fontWeight: 700 }}>62%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill progress-red" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>

              <div className="bid-card" onClick={() => navigate('/provider/bid/bid_4498')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div className="bid-id">GEM/2026/B/4498</div>
                    <div className="bid-name">IT Infrastructure Procurement</div>
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
  );
}
