import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, XCircle, AlertCircle, Download, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { ScoreRing } from '../../components/ScoreRing';
import { ComplianceBadge, RiskBadge, RecommendationBadge } from '../../components/Badges';
import { RequirementCard } from '../../components/RequirementCard';
import { getBid, updateDecision } from '../../api/client';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

export default function BidAnalysis() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [decisionNote, setDecisionNote] = useState('');
  const [deciding, setDeciding] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    getBid(bidId).then(data => { setBid(data); setLoading(false); }).catch(() => setLoading(false));
  }, [bidId]);

  const handleDecision = async (decision) => {
    setDeciding(true);
    try {
      await updateDecision(bidId, decision, decisionNote);
      setDecided(true);
      setBid(prev => ({ ...prev, officer_decision: decision }));
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
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ fontWeight: 700 }}>Bid Compliance Analysis</div>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export Report</button>
        </div>

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
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>Compliance Radar</div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.15} strokeWidth={2} />
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
    </div>
  );
}
