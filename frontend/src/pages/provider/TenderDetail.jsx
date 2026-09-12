import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Users, BarChart3, GitCompare } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { ScoreRing } from '../../components/ScoreRing';
import { RiskBadge, RecommendationBadge } from '../../components/Badges';
import { getTender, getTenderBids } from '../../api/client';

export default function TenderDetail() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, b] = await Promise.all([getTender(tenderId), getTenderBids(tenderId)]);
        setTender(t);
        setBids(b);
      } catch {}
      setLoading(false);
    };
    load();
  }, [tenderId]);

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/provider/compare/${tenderId}`)}>
            <GitCompare size={14} /> Compare All Bidders
          </button>
        </div>

        <div className="page-content">
          {/* Tender Header */}
          <div className="card mb-6" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  GeM • {tender?.gem_id}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>{tender?.title}</h2>
                <p style={{ fontSize: '0.875rem', maxWidth: 600 }}>{tender?.description}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--blue-light)' }}>{bids.length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Bids</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green)' }}>{bids.filter(b => b.analysis?.recommendation?.includes('APPROVED')).length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Approved</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--red)' }}>{bids.filter(b => b.analysis?.risk_level === 'HIGH').length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>High Risk</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Department', value: tender?.department },
                { label: 'Category', value: tender?.category },
                { label: 'Value', value: tender?.value },
                { label: 'Deadline', value: tender?.deadline },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="card mb-6">
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
              📋 Tender Requirements ({tender?.requirements?.length || 0})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {tender?.requirements?.map(req => (
                <div key={req.id} style={{
                  padding: '12px 16px',
                  background: 'var(--bg-glass)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${req.mandatory ? 'var(--blue)' : 'var(--text-muted)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{req.title}</span>
                    {!req.mandatory && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>optional</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{req.category}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--blue-light)', marginTop: 4 }}>{req.required_value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bids List */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 20 }}>
              📁 Received Bids
            </div>
            {bids.length === 0 ? (
              <div className="empty-state">No bids received for this tender yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bids.map((bid, i) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '18px 20px', background: 'var(--bg-glass)',
                      borderRadius: 14, border: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/provider/bid/${bid.id}`)}
                    whileHover={{ borderColor: 'rgba(99,179,237,0.3)', backgroundColor: 'rgba(255,255,255,0.04)' }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1rem', color: '#fff', flexShrink: 0,
                    }}>
                      {bid.contractor_name[0]}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bid.contractor_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted {bid.submitted_at} • {bid.documents?.length} documents</div>
                    </div>

                    {bid.analysis && (
                      <>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                          <ScoreRing score={bid.analysis.overall_score} size={56} strokeWidth={5} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <RiskBadge risk={bid.analysis.risk_level} />
                            <RecommendationBadge recommendation={bid.analysis.recommendation} />
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            <span style={{ color: 'var(--green)', fontWeight: 700 }}>{bid.analysis.pass_count}✅ </span>
                            <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{bid.analysis.review_count}⚠ </span>
                            <span style={{ color: 'var(--red)', fontWeight: 700 }}>{bid.analysis.fail_count}❌</span>
                          </div>
                        </div>
                      </>
                    )}
                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/provider/bid/${bid.id}`); }}>
                      View Analysis
                    </button>
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
