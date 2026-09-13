import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Tag, Calendar, DollarSign, Building } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { getTender } from '../../api/client';
import { sound } from '../../utils/soundEffects';

export default function ContractorTenderView() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTender(tenderId).then(data => { setTender(data); setLoading(false); }).catch(() => setLoading(false));
  }, [tenderId]);

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </div>
  );

  const catColors = {
    Financial: { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', text: 'var(--green)' },
    Eligibility: { bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.2)', text: 'var(--purple)' },
    Technical: { bg: 'rgba(6,182,212,0.06)', border: 'rgba(6,182,212,0.2)', text: 'var(--cyan)' },
    Documentation: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', text: 'var(--amber)' },
  };

  const groupedReqs = tender?.requirements?.reduce((acc, req) => {
    if (!acc[req.category]) acc[req.category] = [];
    acc[req.category].push(req);
    return acc;
  }, {}) || {};

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Tender Requirements & Eligibility"
          subtitle={tender?.title ? `${tender.gem_id} — ${tender.title}` : 'Tender Details'}
          showBack={true}
          rightContent={
            <button className="btn btn-primary btn-sm" onClick={() => { sound.playTap(); navigate(`/contractor/upload/${tenderId}`); }}>
              <Upload size={14} /> Upload & Check Bid
            </button>
          }
        />

        <div className="page-content">
          {/* Tender Header */}
          <motion.div
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderColor: 'rgba(59,130,246,0.25)', background: 'linear-gradient(135deg, rgba(59,130,246,0.04), rgba(139,92,246,0.02))' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="badge status-open">OPEN</span>
                  <span style={{
                    fontSize: '0.72rem', padding: '3px 10px', borderRadius: 100, fontWeight: 600,
                    background: 'rgba(139,92,246,0.1)', color: 'var(--purple)',
                    border: '1px solid rgba(139,92,246,0.2)',
                  }}>
                    <Tag size={9} style={{ marginRight: 4 }} />{tender?.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {tender?.gem_id}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: 8, lineHeight: 1.3 }}>{tender?.title}</h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 700 }}>
                  {tender?.description}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: Building, label: 'Department', value: tender?.department },
                { icon: Tag, label: 'Category', value: tender?.category },
                { icon: DollarSign, label: 'Tender Value', value: tender?.value },
                { icon: Calendar, label: 'Bid Deadline', value: tender?.deadline },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <item.icon size={16} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>
              📋 Tender Requirements
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Review all {tender?.requirements?.length} requirements before preparing your bid. Ensure you have all mandatory documents ready.
            </p>

            {Object.entries(groupedReqs).map(([category, reqs]) => {
              const colors = catColors[category] || { bg: 'var(--bg-glass)', border: 'var(--border)', text: 'var(--text-primary)' };
              return (
                <div key={category} style={{ marginBottom: 24 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                    fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: colors.text,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.text }} />
                    {category} ({reqs.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                    {reqs.map((req, i) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          padding: '14px 16px',
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          borderLeft: `3px solid ${colors.text}`,
                          borderRadius: 10,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>{req.title}</div>
                          {req.mandatory ? (
                            <span style={{ fontSize: '0.65rem', color: 'var(--red)', fontWeight: 700, background: 'rgba(239,68,68,0.1)', padding: '2px 7px', borderRadius: 100, border: '1px solid rgba(239,68,68,0.2)', flexShrink: 0, marginLeft: 6 }}>
                              MANDATORY
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: 6 }}>
                              optional
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: colors.text, fontWeight: 600 }}>
                          Required: {req.required_value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))',
              borderColor: 'rgba(59,130,246,0.2)',
              textAlign: 'center',
              padding: '40px 24px',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Ready to Submit Your Bid?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
              Use our AI Pre-Bid Check to verify your documents against all {tender?.requirements?.length} requirements before final submission.
            </p>
            <motion.button
              className="btn btn-primary"
              style={{ padding: '13px 32px' }}
              onClick={() => navigate(`/contractor/upload/${tenderId}`)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload size={16} /> Upload Documents & Run AI Check
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
