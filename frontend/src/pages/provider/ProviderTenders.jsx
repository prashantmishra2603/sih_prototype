import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { getTenders } from '../../api/client';
import { sound } from '../../utils/soundEffects';

export default function ProviderTenders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTenders(user.id).then(data => { setTenders(data); setLoading(false); });
  }, [user]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Procurement Tenders"
          subtitle="Manage all active procurement tenders"
          rightContent={
            <button className="btn btn-primary btn-sm" onClick={() => { sound.playTap(); navigate('/provider/create-tender'); }}>
              <Plus size={14} /> Create Tender
            </button>
          }
        />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">My Tenders</div>
            <div className="page-subtitle">Manage all your procurement tenders</div>
          </div>
          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 16px' }} /></div>
          ) : tenders.length === 0 ? (
            <div className="empty-state">No tenders yet. Create your first tender!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tenders.map((t, i) => (
                <motion.div
                  key={t.id}
                  className="card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/provider/tender/${t.id}`)}
                  whileHover={{ borderColor: 'rgba(99,179,237,0.3)' }}
                >
                  <div className="provider-tender-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <span className={`badge ${t.status === 'open' ? 'status-open' : 'status-closed'}`} style={{ marginBottom: 8, display: 'inline-block' }}>{t.status.toUpperCase()}</span>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{t.title}</h3>
                      <p style={{ fontSize: '0.85rem', marginBottom: 10 }}>{t.description?.slice(0, 120)}...</p>
                      <div className="provider-tender-meta" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {[{ label: 'GeM ID', value: t.gem_id }, { label: 'Value', value: t.value }, { label: 'Deadline', value: t.deadline }, { label: 'Requirements', value: t.requirements?.length }].map(item => (
                          <div key={item.label}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm provider-tender-action">View Bids →</button>
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
