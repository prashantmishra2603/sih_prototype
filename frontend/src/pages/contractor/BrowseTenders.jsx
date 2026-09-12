import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Tag, ArrowRight } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { getTenders } from '../../api/client';

export default function BrowseTenders() {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTenders().then(data => { setTenders(data); setFiltered(data); setLoading(false); });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(tenders.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q)
    ));
  }, [search, tenders]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div style={{ fontWeight: 700 }}>Browse Tenders</div>
        </div>
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">Available GeM Tenders</div>
            <div className="page-subtitle">Browse open tenders and submit your compliant bid</div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tenders by title, category, department..."
              style={{ paddingLeft: 42 }}
            />
          </div>

          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No tenders found matching your search.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map((tender, i) => (
                <motion.div
                  key={tender.id}
                  className="card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ borderColor: 'rgba(99,179,237,0.3)', transform: 'translateY(-2px)' }}
                  onClick={() => navigate(`/contractor/tender/${tender.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="badge status-open">OPEN</span>
                        <span className="badge" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--purple)', border: '1px solid rgba(139,92,246,0.2)', fontSize: '0.7rem' }}>
                          <Tag size={10} /> {tender.category}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{tender.title}</h3>
                      <p style={{ fontSize: '0.85rem', marginBottom: 14, maxWidth: 600 }}>{tender.description?.slice(0, 130)}...</p>
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        {[
                          { icon: '🏛️', label: 'Department', value: tender.department },
                          { icon: '💰', label: 'Value', value: tender.value },
                          { icon: '📋', label: 'Requirements', value: `${tender.requirements?.length || 0} conditions` },
                          { icon: '📅', label: 'Deadline', value: tender.deadline },
                        ].map(item => (
                          <div key={item.label}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.icon} {item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/contractor/tender/${tender.id}`); }}>
                        View Requirements
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/contractor/upload/${tender.id}`); }}>
                        Upload & Check <ArrowRight size={12} />
                      </button>
                    </div>
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
