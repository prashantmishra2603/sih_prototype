import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, XCircle, Maximize2 } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { ScoreRing } from '../../components/ScoreRing';
import { RiskBadge, RecommendationBadge } from '../../components/Badges';
import { RequirementCard } from '../../components/RequirementCard';
import { getBid } from '../../api/client';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChartModal } from '../../components/ChartModal';
import { sound } from '../../utils/soundEffects';

export default function ContractorBidDetail() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showChartModal, setShowChartModal] = useState(false);

  useEffect(() => {
    getBid(bidId).then(data => { setBid(data); setLoading(false); }).catch(() => setLoading(false));
  }, [bidId]);

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </div>
  );

  if (!bid) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state">Bid not found.</div>
      </div>
    </div>
  );

  const analysis = bid?.analysis;
  const requirements = analysis?.requirements_analysis || [];
  const filtered = activeFilter === 'ALL' ? requirements : requirements.filter(r => r.status === activeFilter);

  const radarData = analysis ? [
    { subject: 'Eligibility', score: analysis.scores?.eligibility || 0 },
    { subject: 'Technical', score: analysis.scores?.technical || 0 },
    { subject: 'Financial', score: analysis.scores?.financial || 0 },
    { subject: 'Documentation', score: analysis.scores?.documentation || 0 },
  ] : [];

  const statusColor = bid.status === 'accepted' ? 'var(--green)' :
    bid.status === 'rejected' ? 'var(--red)' : 'var(--amber)';
  const statusBg = bid.status === 'accepted' ? 'rgba(16,185,129,0.1)' :
    bid.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Bid Details & Readiness"
          subtitle={bid?.tender_title || 'Tender Compliance'}
          showBack={true}
        />

        <div className="page-content">
          {/* Bid Header */}
          <div className="card mb-6" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Bid Reference
                </div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>
                  #{bid.id.slice(-8).toUpperCase()}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Submitted on {bid.submitted_at} • {bid.documents?.length} documents uploaded
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 14px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700,
                    background: statusBg, color: statusColor,
                    border: `1px solid ${statusColor}40`,
                    textTransform: 'uppercase',
                  }}>
                    {bid.status === 'accepted' ? '✅' : bid.status === 'rejected' ? '❌' : '⏳'} {bid.status}
                  </span>
                  {bid.officer_decision && (
                    <span style={{
                      padding: '4px 14px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700,
                      background: bid.officer_decision === 'ACCEPTED' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: bid.officer_decision === 'ACCEPTED' ? 'var(--green)' : 'var(--red)',
                      border: `1px solid ${bid.officer_decision === 'ACCEPTED' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    }}>
                      👤 Officer: {bid.officer_decision}
                    </span>
                  )}
                </div>
                {bid.officer_note && (
                  <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Officer Note: </span>
                    {bid.officer_note}
                  </div>
                )}
              </div>

              {analysis && (
                <div className="contractor-bid-header-score" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                  <ScoreRing score={analysis.overall_score} size={100} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <RiskBadge risk={analysis.risk_level} />
                    <RecommendationBadge recommendation={analysis.recommendation} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Evidence Coverage: <strong style={{ color: 'var(--text-primary)' }}>{analysis.evidence_coverage}%</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents Uploaded */}
          <div className="card mb-6">
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>📂 Uploaded Documents</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {bid.documents?.map((doc, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10,
                  fontSize: '0.82rem',
                }}>
                  <FileText size={14} color="var(--blue-light)" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Breakdown */}
          {analysis && (
            <div className="grid-2 mb-6">
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 20 }}>Category Scores</div>
                {Object.entries(analysis.scores || {}).map(([cat, score]) => (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{cat}</span>
                      <span style={{ fontWeight: 700, color: score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--red)' }}>{score}%</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className={`progress-fill ${score >= 80 ? 'progress-green' : score >= 60 ? 'progress-amber' : 'progress-red'}`}
                        initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  {[['PASS', analysis.pass_count, 'var(--green)', '16,185,129'], ['REVIEW', analysis.review_count, 'var(--amber)', '245,158,11'], ['FAIL', analysis.fail_count, 'var(--red)', '239,68,68']].map(([label, count, color, rgb]) => (
                    <div key={label} style={{ flex: 1, textAlign: 'center', padding: '10px', background: `rgba(${rgb},0.08)`, borderRadius: 10 }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color }}>{count}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="chart-card-header">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Compliance Radar</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score across evaluation domains</div>
                  </div>
                  <button
                    className="chart-expand-btn"
                    onClick={() => {
                      sound.playTap();
                      setShowChartModal(true);
                    }}
                  >
                    <Maximize2 size={13} /> Full View
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" stroke="var(--green)" fill="var(--green)" fillOpacity={0.12} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>

                {analysis.critical_issues?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--red)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      ⚠️ Issues to Address
                    </div>
                    {analysis.critical_issues.map((issue, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--red-light)', padding: '6px 10px', background: 'rgba(239,68,68,0.07)', borderRadius: 8, marginBottom: 6 }}>
                        {i + 1}. {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Requirements Analysis */}
          {requirements.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  📋 Requirement Analysis ({requirements.length} total)
                </div>
                <div className="filter-btn-group" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['ALL', 'PASS', 'REVIEW', 'FAIL'].map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {f === 'PASS' ? '✅ ' : f === 'FAIL' ? '❌ ' : f === 'REVIEW' ? '⚠️ ' : ''}{f}
                    </button>
                  ))}
                </div>
              </div>
              {filtered.length === 0 ? (
                <div className="empty-state">No requirements with status "{activeFilter}"</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filtered.map((r, i) => (
                    <motion.div key={r.req_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <RequirementCard analysis={r} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No analysis state */}
          {!analysis && (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>Analysis Not Available</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                AI analysis has not been run for this bid yet. The procurement officer will review manually.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full View Chart Modal */}
      <ChartModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        title="Compliance Evaluation Radar — Full View"
        subtitle="Bidder readiness across key compliance domains"
      >
        <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={460}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }} />
              <Radar name="Score" dataKey="score" stroke="var(--green)" fill="var(--green)" fillOpacity={0.25} strokeWidth={3} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, width: '100%', marginTop: 20 }}>
            {radarData.map(r => (
              <div key={r.subject} className="card" style={{ textAlign: 'center', padding: '14px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{r.subject}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: r.score >= 80 ? 'var(--green-light)' : r.score >= 60 ? 'var(--amber)' : 'var(--red-light)' }}>
                  {r.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartModal>
    </div>
  );
}
