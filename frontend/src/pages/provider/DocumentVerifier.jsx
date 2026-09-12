import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { useToast } from '../../components/Toast';
import { FileText, Search, Plus, CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck } from 'lucide-react';

const INITIAL_DOCS = [
  { id: 1, name: 'GST Certificate', number: '07AAACT1234F1Z5', vendor: 'Sigma Electronics', status: 'invalid', icon: '📋', expiry: 'Expired Aug 2026', details: 'GST registration was cancelled on 12 Aug 2026. Bid cannot proceed without valid GSTIN.' },
  { id: 2, name: 'PAN Card', number: 'AAACT1234F', vendor: 'TechCraft Solutions', status: 'valid', icon: '🪪', expiry: 'Permanent', details: 'PAN card verified with Income Tax database. Linked to active business entity.' },
  { id: 3, name: 'Udyam Registration', number: 'UDYAM-DL-12-0012345', vendor: 'TechCraft Solutions', status: 'warning', icon: '🏭', expiry: 'Expires 22 Oct 2026', details: 'MSME Udyam registration expiring in 14 days. Renewal required to maintain MSME benefits.' },
  { id: 4, name: 'ISO 9001:2015', number: 'ISO/TC-2021-8834', vendor: 'Infosys BPM Ltd', status: 'valid', icon: '⚙️', expiry: 'Valid until Jan 2028', details: 'Quality Management System certification. Covers software services and IT consulting.' },
  { id: 5, name: 'ISO 27001:2022', number: 'ISO/IT-2023-4421', vendor: 'TCS eGov Solutions', status: 'valid', icon: '🔐', expiry: 'Valid until Mar 2027', details: 'Information Security Management System. Mandatory for IT infrastructure bids.' },
  { id: 6, name: 'BIS Certificate (IS 4770)', number: 'BIS/2024/INS-0019', vendor: 'Sigma Electronics', status: 'invalid', icon: '🏷️', expiry: 'Not Submitted', details: 'BIS certification for safety equipment is mandatory as per GeM category requirements. Not uploaded.' },
  { id: 7, name: 'ESI Registration', number: '31-62882-101', vendor: 'Wipro Digital', status: 'valid', icon: '🏥', expiry: 'Permanent', details: "Active ESI registration. Covers 2,847 employees. Last filing: Aug 2026." },
  { id: 8, name: 'EPF Registration', number: 'MH/BAN/12345', vendor: 'Wipro Digital', status: 'valid', icon: '💼', expiry: 'Permanent', details: "EPF registration active. Monthly compliance filed. No defaults." },
  { id: 9, name: 'Vendor Assessment Badge', number: 'VA/RITES/2024/4891', vendor: 'Infosys BPM Ltd', status: 'valid', icon: '🛡️', expiry: 'Valid until Dec 2026', details: 'Third-party vendor assessment by RITES Ltd. Grade: A+. Covers financial, technical, and operational capabilities.' },
  { id: 10, name: 'Vendor Assessment Badge', number: 'VA/RITES/2024/4892', vendor: 'TCS eGov Ltd', status: 'valid', icon: '🛡️', expiry: 'Valid until Nov 2026', details: 'RITES Vendor Assessment completed. Grade: A. MSME verified and assessed.' },
  { id: 11, name: 'ISO 14001 (Env. Mgmt)', number: 'ISO/ENV-2022-6612', vendor: 'Zensar Tech', status: 'warning', icon: '🌿', expiry: 'Expires 30 Sep 2026', details: 'Environmental Management System certification expiring in 22 days. Renewal process initiated.' },
  { id: 12, name: 'GeM Aadhaar Auth', number: 'AUTH/GEM/2024/7823', vendor: 'Sigma Electronics', status: 'pending', icon: '🔏', expiry: 'Under Verification', details: 'Aadhaar-based authentication for authorized signatory pending GeM portal verification.' },
];

export default function DocumentVerifier() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { showToast } = useToast();

  const filteredDocs = docs.filter((d) => {
    const matchFilter = filter === 'all' || d.status === filter;
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.vendor.toLowerCase().includes(search.toLowerCase()) ||
      d.number.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'valid':
        return <span className="pill pill-success">✅ Valid</span>;
      case 'warning':
        return <span className="pill pill-warning">⚠️ Expiring</span>;
      case 'invalid':
        return <span className="pill pill-danger">❌ Invalid</span>;
      case 'pending':
        return <span className="pill pill-info">🔄 Pending</span>;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Document Verification Engine" subtitle="AI-powered document authenticity and expiry tracking" />

        <div className="page-content">
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Document <span className="gradient-text-green">Verification Engine</span>
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Real-time authenticity, expiry tracking, and OCR validation
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowUploadModal(true)}>
              <Plus size={14} /> Add Document
            </button>
          </div>

          {/* Filters & Search */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { id: 'all', label: `All (${docs.length})` },
              { id: 'valid', label: `✅ Valid (${docs.filter((d) => d.status === 'valid').length})` },
              { id: 'warning', label: `⚠️ Expiring (${docs.filter((d) => d.status === 'warning').length})` },
              { id: 'invalid', label: `❌ Invalid (${docs.filter((d) => d.status === 'invalid').length})` },
              { id: 'pending', label: `🔄 Pending (${docs.filter((d) => d.status === 'pending').length})` },
            ].map((f) => (
              <button
                key={f.id}
                className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}

            <div className="search-bar-wrap" style={{ marginLeft: 'auto' }}>
              <Search className="search-icon" size={14} />
              <input
                type="text"
                className="input-field btn-sm"
                style={{ width: 240, paddingLeft: 34 }}
                placeholder="Search vendor / doc type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          {filteredDocs.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon" style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <h3>No documents found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="doc-grid">
              {filteredDocs.map((d) => (
                <div key={d.id} className={`doc-card ${d.status}`}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{d.icon}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d.number}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>Vendor: {d.vendor}</div>
                  <div style={{ marginTop: 10 }}>{getStatusBadge(d.status)}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDoc(d)}>
                      View Details
                    </button>
                    {d.status !== 'valid' && (
                      <button className="btn btn-primary btn-sm" onClick={() => setShowUploadModal(true)}>
                        Re-upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Doc Detail Modal */}
      {selectedDoc && (
        <div className="modal-overlay open" onClick={() => setSelectedDoc(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDoc(null)}>✕</button>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{selectedDoc.icon}</div>
            <h2 style={{ marginBottom: 4 }}>{selectedDoc.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>{selectedDoc.number}</p>

            <div className="vendor-detail-grid mb-4">
              <div className="vendor-detail-item">
                <div className="vendor-detail-label">Vendor Name</div>
                <div className="vendor-detail-value">{selectedDoc.vendor}</div>
              </div>
              <div className="vendor-detail-item">
                <div className="vendor-detail-label">Status</div>
                <div className="vendor-detail-value">{getStatusBadge(selectedDoc.status)}</div>
              </div>
              <div className="vendor-detail-item" style={{ gridColumn: '1/-1' }}>
                <div className="vendor-detail-label">Validity / Expiry</div>
                <div className="vendor-detail-value">{selectedDoc.expiry}</div>
              </div>
            </div>

            <div style={{ padding: 14, background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--green-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                AI VERIFICATION REPORT
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedDoc.details}</p>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDoc(null)}>Close</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  showToast('Document re-verification queued with OCR model!', 'success');
                  setSelectedDoc(null);
                }}
              >
                <ShieldCheck size={14} /> Trigger Re-verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay open" onClick={() => setShowUploadModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUploadModal(false)}>✕</button>
            <h2 style={{ marginBottom: 4 }}>Add New Document</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>Upload a vendor document for automated AI verification</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>Document Type</label>
                <select>
                  <option>GST Certificate</option>
                  <option>PAN Card</option>
                  <option>ISO Certification</option>
                  <option>BIS Certificate</option>
                  <option>Udyam Registration</option>
                  <option>ESI Registration</option>
                  <option>EPF Registration</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vendor Name</label>
                <select>
                  <option>Sigma Electronics</option>
                  <option>TechCraft Solutions</option>
                  <option>Infosys BPM Ltd</option>
                  <option>TCS eGov Solutions</option>
                  <option>Wipro Digital</option>
                </select>
              </div>

              <div className="form-group">
                <label>Document Number / Reference</label>
                <input placeholder="e.g. GSTIN: 07AAACT1234F1Z5" />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" />
              </div>

              <div
                className="upload-zone"
                style={{ padding: 24 }}
                onClick={() => showToast('File browser opened', 'info')}
              >
                <div style={{ fontSize: 32, marginBottom: 6 }}>📄</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click or drag PDF document file</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  showToast('Document uploaded and queued for AI verification!', 'success');
                  setShowUploadModal(false);
                }}
              >
                Upload &amp; Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
