import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardCheck, ArrowRight, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { ScoreRing } from '../../components/ScoreRing';
import { RiskBadge, RecommendationBadge } from '../../components/Badges';
import { getBids } from '../../api/client';
import { sound } from '../../utils/soundEffects';

export default function MyBids() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getBids(user.id)
      .then(data => { setBids(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const filters = ['ALL', 'submitted', 'accepted', 'rejected'];
  const filtered = filter === 'ALL' ? bids : bids.filter(b => b.status === filter);

  const stats = {
    total: bids.length,
    approved: bids.filter(b => b.analysis?.recommendation?.includes('APPROVED') || b.status === 'accepted').length,
    review: bids.filter(b => b.analysis?.recommendation?.includes('REVIEW')).length,
    rejected: bids.filter(b => b.status === 'rejected').length,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="My Submitted Bids"
          subtitle="Track evaluation status, compliance scores, and decisions"
          rightContent={
            <button className="btn btn-primary btn-sm" onClick={() => { sound.playTap(); navigate('/contractor/browse'); }}>
              <Search size={14} /> Browse More Tenders
            </button>
          }
        />

        <div className="page-content">
          {/* Stats */}
          <div className="grid-4 mb-6">
            {[
              { label: 'Total Bids', value: stats.total, color: 'var(--blue)', icon: '📁' },
              { label: 'Approved', value: stats.approved, color: 'var(--green)', icon: '✅' },
              { label: 'Under Review', value: stats.review, color: 'var(--amber)', icon: '⏳' },
              { label: 'Rejected', value: stats.rejected, color: 'var(--red)', icon: '❌' },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {f === 'ALL' ? `All (${bids.length})` : `${f} (${bids.filter(b => b.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Bids List */}
          {loading ? (
            <div className="empty-state">
              <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>No bids found</div>
              <p style={{ marginBottom: 20 }}>
                {filter === 'ALL' ? "You haven't submitted any bids yet." : `No bids with status "${filter}".`}
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/contractor/browse')}>
                Browse Tenders
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((bid, i) => (
                <motion.div
                  key={bid.id}
                  className="card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/contractor/bid/${bid.id}`)}
                  whileHover={{ borderColor: 'rgba(99,179,237,0.3)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    {/* Bid Icon */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ClipboardCheck size={22} color="#fff" />
                    </div>

                    {/* Bid Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>
                        Bid #{bid.id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                        Submitted {bid.submitted_at} • {bid.documents?.length} documents
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.7rem', padding: '2px 10px', borderRadius: 100, fontWeight: 700,
                          background: bid.status === 'accepted' ? 'rgba(16,185,129,0.12)' :
                            bid.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                          color: bid.status === 'accepted' ? 'var(--green)' :
                            bid.status === 'rejected' ? 'var(--red)' : 'var(--amber)',
                          border: `1px solid ${bid.status === 'accepted' ? 'rgba(16,185,129,0.25)' :
                            bid.status === 'rejected' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
                          textTransform: 'uppercase',
                        }}>
                          {bid.status}
                        </span>
                        {bid.officer_decision && (
                          <span style={{
                            fontSize: '0.7rem', padding: '2px 10px', borderRadius: 100, fontWeight: 600,
                            background: 'rgba(139,92,246,0.1)', color: 'var(--purple)',
                            border: '1px solid rgba(139,92,246,0.2)',
                          }}>
                            👤 Officer: {bid.officer_decision}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Analysis */}
                    {bid.analysis ? (
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <ScoreRing score={bid.analysis.overall_score} size={58} strokeWidth={5} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <RiskBadge risk={bid.analysis.risk_level} />
                          <RecommendationBadge recommendation={bid.analysis.recommendation} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 8, border: '1px solid var(--border)' }}>
                        ⏳ Analysis pending
                      </div>
                    )}

                    <ArrowRight size={16} color="var(--text-muted)" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
