import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Search, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { ScoreRing } from '../../components/ScoreRing';
import { RiskBadge, RecommendationBadge } from '../../components/Badges';
import { getBids } from '../../api/client';
import { sound } from '../../utils/soundEffects';

export default function ContractorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBids(user.id).then(data => { setBids(data); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const myBids = bids.filter(b => b.contractor_id === user.id || b.contractor_name?.includes(user.organization?.split(' ')[0]));
  const avgScore = myBids.length ? Math.round(myBids.reduce((s, b) => s + (b.analysis?.overall_score || 0), 0) / myBids.length) : 0;
  const passedBids = myBids.filter(b => b.analysis?.recommendation?.includes('APPROVED')).length;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Contractor Portal"
          subtitle={`Welcome, ${user?.name || 'Vendor'} — ${user?.organization || 'GeM Supplier'}`}
          rightContent={
            <button className="btn btn-primary btn-sm" onClick={() => { sound.playTap(); navigate('/contractor/browse'); }}>
              <Search size={14} /> Browse Tenders
            </button>
          }
        />

        <div className="page-content">
          {/* Stats */}
          <div className="grid-4 mb-6">
            {[
              { icon: '📁', label: 'Total Bids', value: myBids.length, color: 'var(--blue)' },
              { icon: '✅', label: 'Approved', value: passedBids, color: 'var(--green)' },
              { icon: '⚠️', label: 'Under Review', value: myBids.filter(b => b.analysis?.recommendation?.includes('REVIEW')).length, color: 'var(--amber)' },
              { icon: '📊', label: 'Avg. Score', value: `${avgScore}%`, color: avgScore >= 80 ? 'var(--green)' : avgScore >= 60 ? 'var(--amber)' : 'var(--red)' },
            ].map((s, i) => (
              <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid-2 mb-6">
            <motion.div
              className="card"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.06))', borderColor: 'rgba(59,130,246,0.25)', cursor: 'pointer' }}
              onClick={() => navigate('/contractor/browse')}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>Browse Open Tenders</div>
              <p style={{ fontSize: '0.85rem', marginBottom: 16 }}>Find and explore GeM tenders matching your capabilities.</p>
              <button className="btn btn-primary btn-sm">Browse Now <ArrowRight size={12} /></button>
            </motion.div>

            <motion.div
              className="card"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))', borderColor: 'rgba(16,185,129,0.25)', cursor: 'pointer' }}
              onClick={() => navigate('/contractor/browse')}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🤖</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>Pre-Bid AI Check</div>
              <p style={{ fontSize: '0.85rem', marginBottom: 16 }}>Upload documents and check compliance before submitting your bid.</p>
              <button className="btn btn-success btn-sm">Start Check <ArrowRight size={12} /></button>
            </motion.div>
          </div>

          {/* My Bids */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 20 }}>My Bid Submissions</div>
            {loading ? (
              <div className="empty-state"><div className="spinner" style={{ width: 36, height: 36, margin: '0 auto' }} /></div>
            ) : myBids.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>No bids submitted yet</div>
                <p style={{ marginBottom: 16 }}>Browse available tenders and submit your first bid.</p>
                <button className="btn btn-primary" onClick={() => navigate('/contractor/browse')}>Browse Tenders</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {myBids.map((bid, i) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 18px', background: 'var(--bg-glass)',
                      borderRadius: 12, border: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/contractor/bid/${bid.id}`)}
                    whileHover={{ borderColor: 'rgba(99,179,237,0.25)' }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>Bid #{bid.id.slice(-6)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted {bid.submitted_at} • {bid.documents?.length} docs</div>
                    </div>
                    {bid.analysis && (
                      <>
                        <ScoreRing score={bid.analysis.overall_score} size={52} strokeWidth={5} />
                        <RiskBadge risk={bid.analysis.risk_level} />
                        <RecommendationBadge recommendation={bid.analysis.recommendation} />
                      </>
                    )}
                    <ArrowRight size={14} color="var(--text-muted)" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
