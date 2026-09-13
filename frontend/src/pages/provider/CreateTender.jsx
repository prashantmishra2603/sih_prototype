import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlusCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { createTender } from '../../api/client';

const SAMPLE_REQUIREMENTS = [
  'Minimum annual turnover of ₹10 Crore in last 3 years',
  'Minimum 5 years of relevant experience',
  'Valid ISO 9001:2015 certification',
  'GST registration certificate',
  'EMD of ₹2.5 Lakh required',
];

export default function CreateTender() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', gem_id: '', department: user.organization, category: '', value: '', deadline: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedReqs, setExtractedReqs] = useState([]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const simulateExtract = () => {
    setExtracting(true);
    setTimeout(() => {
      setExtractedReqs(SAMPLE_REQUIREMENTS);
      setExtracting(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tender = await createTender(form, user.id);
      setSuccess(true);
      setTimeout(() => navigate(`/provider/tender/${tender.id}`), 1500);
    } catch (err) {
      alert('Error creating tender: ' + (err?.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Create New Tender"
          subtitle="AI-assisted requirement structuring and tender publishing"
          showBack={true}
        />
        <div className="page-content">

          <div className="grid-2">
            <div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card">
                  <div style={{ fontWeight: 700, marginBottom: 20, fontSize: '0.95rem' }}>📋 Tender Details</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                      <label>Tender Title *</label>
                      <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. IT Infrastructure Procurement 2026" required />
                    </div>
                    <div className="grid-2" style={{ gap: 12 }}>
                      <div className="form-group">
                        <label>GeM ID *</label>
                        <input name="gem_id" value={form.gem_id} onChange={handleChange} placeholder="GEM/2026/B/XXXXXXX" required />
                      </div>
                      <div className="form-group">
                        <label>Category *</label>
                        <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. IT Equipment & Services" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Department / Organization</label>
                      <input name="department" value={form.department} onChange={handleChange} placeholder="Department name" />
                    </div>
                    <div className="grid-2" style={{ gap: 12 }}>
                      <div className="form-group">
                        <label>Tender Value *</label>
                        <input name="value" value={form.value} onChange={handleChange} placeholder="₹X Crore" required />
                      </div>
                      <div className="form-group">
                        <label>Bid Deadline *</label>
                        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description *</label>
                      <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the scope and objective of this tender..." required />
                    </div>
                  </div>
                </div>

                {/* Tender PDF Upload (simulated) */}
                <div className="card">
                  <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.95rem' }}>📎 Tender Document Upload</div>
                  <div className="upload-zone" onClick={simulateExtract}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📄</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Upload Tender PDF</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>Click to upload or drag & drop your tender document</div>
                    {extracting ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'var(--blue)' }}>
                        <div className="spinner" /> AI extracting requirements...
                      </div>
                    ) : (
                      <button type="button" className="btn btn-secondary btn-sm">
                        <Sparkles size={14} /> Simulate AI Extraction
                      </button>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '14px' }}
                  disabled={loading || success}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                >
                  {success ? '✅ Tender Created!' : loading ? <><div className="spinner" /> Creating...</> : <><PlusCircle size={16} /> Create Tender</>}
                </motion.button>
              </form>
            </div>

            {/* Requirements Preview */}
            <div className="card" style={{ alignSelf: 'flex-start' }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
                🤖 AI Extracted Requirements
              </div>
              {extractedReqs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '0.875rem' }}>
                  Upload a tender PDF above to see AI-extracted requirements here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {extractedReqs.map((req, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(59,130,246,0.06)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: 10,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓</span>
                      <span>{req}</span>
                    </motion.div>
                  ))}
                  <div className="alert alert-success" style={{ marginTop: 8 }}>
                    ✅ {extractedReqs.length} requirements extracted successfully!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
