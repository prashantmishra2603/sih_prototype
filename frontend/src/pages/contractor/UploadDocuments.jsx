import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { useAuth } from '../../context/AuthContext';
import { getTender, preBidCheck, submitBid } from '../../api/client';
import { ScoreRing } from '../../components/ScoreRing';
import { ComplianceBadge, RiskBadge, RecommendationBadge } from '../../components/Badges';
import { RequirementCard } from '../../components/RequirementCard';
import { sound } from '../../utils/soundEffects';

const SUGGESTED_DOCS = [
  'Turnover_Certificate_FY2025.pdf',
  'Experience_Certificate.pdf',
  'ISO_9001_Certificate.pdf',
  'Technical_Specifications.pdf',
  'GST_Certificate.pdf',
  'Company_Registration.pdf',
  'EMD_Receipt.pdf',
  'GeM_Registration.pdf',
];

export default function UploadDocuments() {
  const { tenderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [docs, setDocs] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    getTender(tenderId).then(setTender);
  }, [tenderId]);

  const addDoc = (docName) => {
    sound.playImport();
    if (!docs.includes(docName)) setDocs(d => [...d, docName]);
  };
  const removeDoc = (docName) => {
    sound.playTap();
    setDocs(d => d.filter(x => x !== docName));
  };

  const handlePreCheck = async () => {
    if (docs.length === 0) { alert('Please add at least one document.'); return; }
    sound.playTap();
    setChecking(true);
    setAnalysis(null);
    try {
      const result = await preBidCheck(tenderId, docs);
      setAnalysis(result.analysis);
      const score = result?.analysis?.overall_score || 0;
      if (score >= 80) sound.playPass();
      else if (score >= 60) sound.playReview();
      else sound.playFail();
    } catch (err) {
      sound.playFail();
      alert('Pre-check failed: ' + (err?.response?.data?.detail || err.message));
    }
    setChecking(false);
  };

  const handleSubmit = async () => {
    sound.playTap();
    setSubmitting(true);
    try {
      await submitBid({ tender_id: tenderId, documents: docs }, user.id, user.organization);
      sound.playPass();
      setSubmitted(true);
      setTimeout(() => navigate('/contractor/bids'), 2000);
    } catch {
      sound.playFail();
    }
    setSubmitting(false);
  };

  const requirements = analysis?.requirements_analysis || [];
  const filtered = activeFilter === 'ALL' ? requirements : requirements.filter(r => r.status === activeFilter);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Bid Document Submission"
          subtitle={tender?.title ? `Pre-bid compliance check for ${tender.title}` : 'Upload documents and verify compliance'}
          showBack={true}
        />

        <div className="page-content">
          {/* Tender info */}
          {tender && (
            <div className="card mb-6" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Tender</div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{tender.title}</h2>
              <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span>🏛️ {tender.department}</span>
                <span>💰 {tender.value}</span>
                <span>📅 Deadline: {tender.deadline}</span>
                <span>📋 {tender.requirements?.length} requirements</span>
              </div>
            </div>
          )}

          <div className="grid-2">
            {/* Document Upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>📂 Add Documents</div>
                <div className="alert alert-info mb-4" style={{ fontSize: '0.82rem' }}>
                  💡 Select documents to upload. AI will analyze them against tender requirements.
                </div>

                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Suggested Documents
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                  {SUGGESTED_DOCS.map(doc => (
                    <div
                      key={doc}
                      onClick={() => addDoc(doc)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: `1px solid ${docs.includes(doc) ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                        background: docs.includes(doc) ? 'rgba(16,185,129,0.06)' : 'var(--bg-glass)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.85rem',
                      }}
                    >
                      <FileText size={14} color={docs.includes(doc) ? 'var(--green)' : 'var(--text-muted)'} />
                      <span style={{ flex: 1 }}>{doc}</span>
                      {docs.includes(doc) ? <CheckCircle2 size={14} color="var(--green)" /> : <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+ Add</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Documents */}
              {docs.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}>
                    ✅ Selected Documents ({docs.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {docs.map(doc => (
                      <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 8 }}>
                        <FileText size={13} color="var(--green)" />
                        <span style={{ flex: 1, fontSize: '0.82rem' }}>{doc}</span>
                        <button onClick={() => removeDoc(doc)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    onClick={handlePreCheck}
                    disabled={checking}
                    whileHover={{ scale: checking ? 1 : 1.02 }}
                  >
                    {checking ? (
                      <><div className="spinner" /> AI Analyzing Compliance...</>
                    ) : (
                      <><Sparkles size={16} /> Run AI Pre-Bid Check</>
                    )}
                  </motion.button>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            <div>
              {checking && (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>AI is analyzing your documents...</div>
                  <p style={{ fontSize: '0.85rem', marginBottom: 20 }}>Matching requirements against uploaded documents</p>
                  <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto' }} />
                </div>
              )}

              {analysis && !checking && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Score Summary */}
                  <div className="card mb-4" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>🎯 Compliance Summary</div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                      <ScoreRing score={analysis.overall_score} size={110} label="Bid Readiness" />
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                      <RiskBadge risk={analysis.risk_level} />
                      <RecommendationBadge recommendation={analysis.recommendation} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                      {[['PASS', analysis.pass_count, 'var(--green)'], ['REVIEW', analysis.review_count, 'var(--amber)'], ['FAIL', analysis.fail_count, 'var(--red)']].map(([label, count, color]) => (
                        <div key={label} style={{ flex: 1, textAlign: 'center', padding: '10px', background: `rgba(${label === 'PASS' ? '16,185,129' : label === 'REVIEW' ? '245,158,11' : '239,68,68'},0.08)`, borderRadius: 10 }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{count}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    {analysis.critical_issues?.length > 0 && (
                      <div>
                        {analysis.critical_issues.slice(0, 2).map((issue, i) => (
                          <div key={i} className="alert alert-error mb-2" style={{ fontSize: '0.8rem' }}>⚠️ {issue}</div>
                        ))}
                      </div>
                    )}

                    {submitted ? (
                      <div className="alert alert-success">✅ Bid submitted successfully! Redirecting...</div>
                    ) : (
                      <motion.button
                        className="btn btn-success"
                        style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                        onClick={handleSubmit}
                        disabled={submitting || analysis.fail_count > 0}
                        whileHover={{ scale: 1.02 }}
                      >
                        {submitting ? <><div className="spinner" /> Submitting...</> : '🚀 Submit Final Bid'}
                      </motion.button>
                    )}
                    {analysis.fail_count > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--red)', textAlign: 'center', marginTop: 8 }}>
                        ⚠️ {analysis.fail_count} FAIL(s) detected. Please fix issues before submitting.
                      </div>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="card">
                    <div className="upload-filter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Requirement Analysis</div>
                      <div className="upload-filter-pills" style={{ display: 'flex', gap: 6 }}>
                        {['ALL', 'PASS', 'REVIEW', 'FAIL'].map(f => (
                          <button key={f} onClick={() => setActiveFilter(f)} className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-ghost'}`}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {filtered.map((r, i) => (
                        <motion.div key={r.req_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                          <RequirementCard analysis={r} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
