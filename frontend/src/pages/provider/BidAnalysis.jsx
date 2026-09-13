import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, XCircle, AlertCircle, Download, ThumbsUp, ThumbsDown, MessageSquare, Maximize2 } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { ScoreRing } from '../../components/ScoreRing';
import { ComplianceBadge, RiskBadge, RecommendationBadge } from '../../components/Badges';
import { RequirementCard } from '../../components/RequirementCard';
import { getBid, updateDecision } from '../../api/client';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChartModal } from '../../components/ChartModal';
import { sound } from '../../utils/soundEffects';
import { useToast } from '../../components/Toast';
import { downloadExecutiveReport } from '../../utils/exportReport';

export default function BidAnalysis() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [decisionNote, setDecisionNote] = useState('');
  const [deciding, setDeciding] = useState(false);
  const [decided, setDecided] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);

  useEffect(() => {
    getBid(bidId).then(data => { setBid(data); setLoading(false); }).catch(() => setLoading(false));
  }, [bidId]);

  const handleDecision = async (decision) => {
    setDeciding(true);
    try {
      await updateDecision(bidId, decision, decisionNote);
      setDecided(true);
      setBid(prev => ({ ...prev, officer_decision: decision }));
      if (decision === 'ACCEPTED') sound.playPass();
      else if (decision === 'REJECTED') sound.playFail();
      else sound.playReview();
    } catch {}
    setDeciding(false);
  };

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </div>
  );

  const analysis = bid?.analysis;
  const requirements = analysis?.requirements_analysis || [];

  const filtered = activeFilter === 'ALL'
    ? requirements
    : requirements.filter(r => r.status === activeFilter);

  const radarData = analysis ? [
    { subject: 'Eligibility', score: analysis.scores?.eligibility || 0 },
    { subject: 'Technical', score: analysis.scores?.technical || 0 },
    { subject: 'Financial', score: analysis.scores?.financial || 0 },
    { subject: 'Documentation', score: analysis.scores?.documentation || 0 },
  ] : [];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Bid Compliance Analysis"
          subtitle={bid?.contractor_name ? `${bid.contractor_name} — Evaluation Report` : 'Evaluation Report'}
          showBack={true}
          rightContent={
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                sound.playExport();
                downloadExecutiveReport(`GeM Compliance Evaluation Report - ${bid?.contractor_name || `Bid ${bidId}`}`);
                showToast('✓ Bid evaluation report downloaded successfully!', 'success');
              }}
            >
              <Download size={14} /> Export Report
            </button>
          }
        />

        <div className="page-content">
          {/* Bid Header */}
          <div className="card mb-6" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Bid Analysis Report
                </div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{bid?.contractor_name}</h2>
                <p style={{ fontSize: '0.85rem' }}>Submitted {bid?.submitted_at} • {bid?.documents?.length} documents uploaded</p>
                {bid?.officer_decision && (
                  <div style={{ marginTop: 10 }}>
                    <span style={{
                      padding: '4px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700,
                      background: bid.officer_decision === 'ACCEPTED' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: bid.officer_decision === 'ACCEPTED' ? 'var(--green)' : 'var(--red)',
                      border: `1px solid ${bid.officer_decision === 'ACCEPTED' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    }}>
                      👤 Officer Decision: {bid.officer_decision}
                    </span>
                  </div>
                )}
              </div>
              {analysis && (
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
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

          {/* Score breakdown + Radar */}
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

                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', flex: 1, padding: '10px', background: 'rgba(16,185,129,0.08)', borderRadius: 10 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--green)' }}>{analysis.pass_count}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PASS</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, padding: '10px', background: 'rgba(245,158,11,0.08)', borderRadius: 10 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amber)' }}>{analysis.review_count}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>REVIEW</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, padding: '10px', background: 'rgba(239,68,68,0.08)', borderRadius: 10 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--red)' }}>{analysis.fail_count}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FAIL</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="chart-card-header">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Compliance Radar</div>
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
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Critical Issues */}
                {analysis.critical_issues?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--red)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      ⚠️ Critical Issues
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
          <div className="card mb-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                📋 Requirements Analysis ({requirements.length} total)
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
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
                {filtered.map((reqAnalysis, i) => (
                  <motion.div key={reqAnalysis.req_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <RequirementCard analysis={reqAnalysis} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Officer Decision */}
          {!bid?.officer_decision && (
            <div className="card" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>
                👨‍⚖️ Officer Decision (Human-in-the-Loop)
              </div>
              <div className="alert alert-info mb-4" style={{ fontSize: '0.82rem' }}>
                AI has completed its analysis. The final procurement decision rests with the authorized officer.
              </div>
              <div className="form-group mb-4">
                <label>Officer Notes (optional)</label>
                <textarea
                  value={decisionNote}
                  onChange={e => setDecisionNote(e.target.value)}
                  placeholder="Add any notes or observations before making your decision..."
                  rows={3}
                />
              </div>
              {decided ? (
                <div className="alert alert-success">✅ Decision recorded successfully.</div>
              ) : (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="btn btn-success" onClick={() => handleDecision('ACCEPTED')} disabled={deciding}>
                    <ThumbsUp size={15} /> Accept Bid
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDecision('REJECTED')} disabled={deciding}>
                    <ThumbsDown size={15} /> Reject Bid
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleDecision('CLARIFICATION_REQUESTED')} disabled={deciding}>
                    <MessageSquare size={15} /> Request Clarification
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full View Chart Modal */}
      <ChartModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        title="Compliance Evaluation Radar — Full View"
        subtitle={`${bid?.contractor_name || 'Bidder'} domain score breakdown (0-100)`}
      >
        <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={460}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }} />
              <Radar name="Score" dataKey="score" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.25} strokeWidth={3} />
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
