import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Send, Maximize2, Award, CheckCircle2 } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { compareBidders } from '../../api/client';
import { useToast } from '../../components/Toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartModal } from '../../components/ChartModal';
import { sound } from '../../utils/soundEffects';

const CATEGORY_COLORS = {
  eligibility: '#8b5cf6',
  technical: '#06b6d4',
  financial: '#10b981',
  documentation: '#f59e0b',
};

export default function BidderComparison() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [comparison, setComparison] = useState([]);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [showDisqModal, setShowDisqModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [qualifyModalBidder, setQualifyModalBidder] = useState(null);

  useEffect(() => {
    compareBidders(tenderId)
      .then((data) => {
        setComparison(data);
      })
      .catch(() => {});
  }, [tenderId]);

  const chartData = comparison.map((b) => ({
    name: b.contractor_name.split(' ')[0],
    Overall: b.overall_score,
    Eligibility: b.scores?.eligibility || 0,
    Technical: b.scores?.technical || 0,
    Financial: b.scores?.financial || 0,
    Docs: b.scores?.documentation || 0,
  }));

  const qualifyBidder = (name, rank) => {
    showToast(`${name} qualified as ${rank} bidder!`, 'success');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Bidder Comparison & L1 Matrix"
          subtitle="Technical and financial evaluation — Buyer side tools & ranking"
          showBack={true}
        />

        <div className="page-content">
          <div className="section-header" style={{ justifyContent: 'flex-end', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="timer-chip">
                <Clock size={13} /> 48-HR window: <span>31:45:22</span>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => { sound.playTap(); setShowClarificationModal(true); }}>
                <Send size={14} /> Send Clarification
              </button>
            </div>
          </div>

          {/* L1 Ranking Table */}
          <div className="card mb-6">
            <div className="card-header">
              <div className="card-title">🏆 Bidder Ranking — L1 Analysis</div>
              <span className="pill pill-info">{comparison.length || 5} Bidders Evaluated</span>
            </div>

            <div className="table-wrapper">
              <div
                className="eval-row"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  padding: '10px 14px',
                }}
              >
                <div>Vendor / Bidder</div>
                <div>Tech Score</div>
                <div>Quoted Price</div>
                <div>Rank</div>
                <div>Compliance</div>
                <div>Action</div>
              </div>

              {[
                { name: 'Infosys BPM Ltd', sub: 'Vendor Assessed ✓ · MSME: No', tech: '94/100', price: '₹89.2L', rank: 'L1', rankCls: 'rank-1', comp: '100%', compPill: 'pill-success' },
                { name: 'TCS eGov Solutions', sub: 'Vendor Assessed ✓ · MSME: Yes', tech: '89/100', price: '₹91.5L', rank: 'L2', rankCls: 'rank-2', comp: '97%', compPill: 'pill-success' },
                { name: 'Wipro Digital Pvt Ltd', sub: 'Vendor Assessed ✓ · MSME: No', tech: '85/100', price: '₹95.8L', rank: 'L3', rankCls: 'rank-3', comp: '95%', compPill: 'pill-success' },
                { name: 'Zensar Technologies', sub: 'Not Assessed · MSME: Yes', tech: '78/100', price: '₹98.1L', rank: 'L4', rankCls: 'rank-n', comp: '78%', compPill: 'pill-warning' },
                { name: 'Sigma Tech Corp', sub: 'Not Assessed · MSME: Yes', tech: 'DQ', price: '₹88.0L', rank: 'DQ', rankCls: 'rank-n', comp: '38%', compPill: 'pill-danger', isDq: true },
              ].map((row, i) => (
                <div key={i} className="eval-row clickable-row" style={{ padding: '12px 14px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{row.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.sub}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{row.tech}</div>
                  <div style={{ fontWeight: 700, color: i === 0 ? 'var(--green-light)' : 'var(--text-primary)' }}>{row.price}</div>
                  <div>
                    <span className={`rank-badge ${row.rankCls}`}>{row.rank}</span>
                  </div>
                  <div>
                    <span className={`pill ${row.compPill}`}>{row.comp}</span>
                  </div>
                  <div>
                    {row.isDq ? (
                      <button className="btn btn-danger btn-sm" onClick={() => setShowDisqModal(true)}>
                        View DQ
                      </button>
                    ) : (
                      <button
                        className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                        onClick={() => {
                          sound.playTap();
                          setQualifyModalBidder(row);
                        }}
                      >
                        Qualify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="card mb-6">
            <div className="chart-card-header">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Score Breakdown Chart</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multi-parameter evaluation breakdown across all qualified bidders</div>
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
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData.length ? chartData : [
                { name: 'Infosys', Eligibility: 95, Technical: 94, Financial: 92, Docs: 98 },
                { name: 'TCS', Eligibility: 90, Technical: 89, Financial: 90, Docs: 95 },
                { name: 'Wipro', Eligibility: 88, Technical: 85, Financial: 88, Docs: 92 },
                { name: 'Zensar', Eligibility: 75, Technical: 78, Financial: 80, Docs: 70 },
              ]} barGap={4}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Bar dataKey="Eligibility" fill={CATEGORY_COLORS.eligibility} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Technical" fill={CATEGORY_COLORS.technical} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Financial" fill={CATEGORY_COLORS.financial} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Docs" fill={CATEGORY_COLORS.documentation} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Clarification Modal */}
      {showClarificationModal && (
        <div className="modal-overlay open" onClick={() => setShowClarificationModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowClarificationModal(false)}>✕</button>
            <h2 style={{ marginBottom: 4 }}>Send Clarification Request</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 18 }}>Request missing information from a bidder</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label>Select Bidder</label>
                <select>
                  <option>TCS eGov Solutions</option>
                  <option>Zensar Technologies</option>
                  <option>Wipro Digital Pvt Ltd</option>
                  <option>Infosys BPM Ltd</option>
                </select>
              </div>
              <div className="form-group">
                <label>Clarification Type</label>
                <select>
                  <option>Missing Document</option>
                  <option>Technical Specification</option>
                  <option>Financial Clarification</option>
                  <option>PQ Criteria</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={4} defaultValue="Please provide ISO 27001:2022 certificate with scope of certification as required under GeM STC Clause 3.2. Response required within 24 hours." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowClarificationModal(false)}>Cancel</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  showToast('Clarification request sent via GeM portal!', 'success');
                  setShowClarificationModal(false);
                }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disqualification Modal */}
      {showDisqModal && (
        <div className="modal-overlay open" onClick={() => setShowDisqModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDisqModal(false)}>✕</button>
            <h2 style={{ marginBottom: 4 }}>Disqualification Report</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 18 }}>Sigma Tech Corp — GEM/2026/B/4498</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--red-light)', marginBottom: 4 }}>DQ-01: Missing ISO 27001 Certificate</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mandatory cybersecurity certification not provided. Rule: GeM STC Clause 3.2.</div>
              </div>
              <div style={{ padding: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--red-light)', marginBottom: 4 }}>DQ-02: Annual Turnover Below Minimum</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Submitted: ₹68L vs Required: ₹1Cr. PQ Criteria not met. GFR Rule 149(4)(b).</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDisqModal(false)}>Close</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  showToast('DQ report sent to vendor via GeM portal', 'info');
                  setShowDisqModal(false);
                }}
              >
                Notify Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bidder Qualification Review & Approval Modal */}
      {qualifyModalBidder && (
        <div className="modal-overlay open" onClick={() => setQualifyModalBidder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <button className="modal-close" onClick={() => setQualifyModalBidder(null)}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  flexShrink: 0
                }}
              >
                <Award size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Bidder Qualification Review</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Confirm technical & financial evaluation — Proceed to stage qualification
                </p>
              </div>
            </div>

            {/* Bidder Summary Card */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '16px',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {qualifyModalBidder.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {qualifyModalBidder.sub}
                  </div>
                </div>
                <span className={`rank-badge ${qualifyModalBidder.rankCls}`}>
                  {qualifyModalBidder.rank}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Tech Score</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{qualifyModalBidder.tech}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Quoted Price</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--green-light)', marginTop: 2 }}>{qualifyModalBidder.price}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Compliance</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--blue-light)', marginTop: 2 }}>{qualifyModalBidder.comp}</div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Compliance & Evaluation Checks
              </div>
              {[
                'Technical evaluation score >= 75/100 benchmark met (GFR 173)',
                'GeM STC Clause 3.2 mandatory declarations verified',
                'Quoted price verified within estimated procurement range',
                'Vendor assessment status and MSME preference criteria confirmed'
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setQualifyModalBidder(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ gap: 6 }}
                onClick={() => {
                  sound.playPass();
                  showToast(`${qualifyModalBidder.name} qualified as ${qualifyModalBidder.rank} bidder!`, 'success');
                  setQualifyModalBidder(null);
                }}
              >
                <CheckCircle2 size={15} /> Confirm Qualification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart Full View Modal */}
      <ChartModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        title="Bidder Score Breakdown — Full View"
        subtitle="Comprehensive multi-category compliance evaluation scores across all bidders"
      >
        <div style={{ padding: '16px 0' }}>
          <ResponsiveContainer width="100%" height={460}>
            <BarChart
              data={chartData.length ? chartData : [
                { name: 'Infosys', Eligibility: 95, Technical: 94, Financial: 92, Docs: 98 },
                { name: 'TCS', Eligibility: 90, Technical: 89, Financial: 90, Docs: 95 },
                { name: 'Wipro', Eligibility: 88, Technical: 85, Financial: 88, Docs: 92 },
                { name: 'Zensar', Eligibility: 75, Technical: 78, Financial: 80, Docs: 70 },
              ]}
              barGap={8}
            >
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={14} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={14} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Legend verticalAlign="top" height={40} />
              <Bar dataKey="Eligibility" fill={CATEGORY_COLORS.eligibility} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Technical" fill={CATEGORY_COLORS.technical} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Financial" fill={CATEGORY_COLORS.financial} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Docs" fill={CATEGORY_COLORS.documentation} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartModal>
    </div>
  );
}
