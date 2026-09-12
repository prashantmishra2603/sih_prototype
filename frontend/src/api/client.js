import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

// Fallback Mock Data
const MOCK_TENDERS = [
  {
    id: "tender_001",
    provider_id: "user_001",
    title: "Supply & Installation of High-Performance Server Racks",
    gem_id: "GEM/2026/B/4521890",
    department: "Ministry of Defence (MoD)",
    category: "IT Hardware",
    value: "₹2.45 Crore",
    deadline: "2026-09-30",
    status: "open",
    created_at: "2026-09-01",
    description: "Procurement of 50 units of Tier-4 enterprise server cabinets with dual PDU, intelligent cooling, and biometric rack locks for defence data center expansion.",
    requirements: [
      { id: "r1", category: "Financial", title: "Minimum Average Annual Turnover of ₹5.0 Cr in last 3 FYs", required_value: "₹5.0 Cr", mandatory: true },
      { id: "r2", category: "Eligibility", title: "Minimum 5 years OEM / System Integrator experience in Defence/Govt projects", required_value: "5 Years", mandatory: true },
      { id: "r3", category: "Technical", title: "ISO 9001:2015 and ISO 27001 Security Management Certification", required_value: "ISO 9001 & 27001", mandatory: true },
      { id: "r4", category: "Technical", title: "On-site 3-Year 24/7 Comprehensive Warranty with 4h SLA", required_value: "3 Years 24/7 SLA", mandatory: true },
      { id: "r5", category: "Documentation", title: "Valid GST Registration Certificate & Income Tax Returns for last 3 years", required_value: "Valid GSTIN", mandatory: true },
      { id: "r6", category: "Documentation", title: "Earnest Money Deposit (EMD) of ₹2,50,000 / EMD Exemption Cert", required_value: "₹2,50,000 EMD", mandatory: true }
    ]
  },
  {
    id: "tender_002",
    provider_id: "user_001",
    title: "Cybersecurity Auditing & Penetration Testing Services",
    gem_id: "GEM/2026/B/4891204",
    department: "Ministry of Electronics & IT",
    category: "Services",
    value: "₹1.12 Crore",
    deadline: "2026-10-15",
    status: "open",
    created_at: "2026-09-05",
    description: "CERT-In empaneled security audit agency for comprehensive VAPT audit of critical national infrastructure web applications.",
    requirements: [
      { id: "r10", category: "Financial", title: "Annual Turnover ₹2 Cr", required_value: "₹2 Cr", mandatory: true },
      { id: "r11", category: "Technical", title: "Active CERT-In Empanelment", required_value: "CERT-In Empaneled", mandatory: true }
    ]
  }
];

const MOCK_BIDS = [
  {
    id: "bid_001",
    tender_id: "tender_001",
    contractor_id: "user_002",
    contractor_name: "ABC Technologies Pvt Ltd",
    submitted_at: "2026-09-10",
    status: "submitted",
    documents: ["Turnover_Certificate_FY2025.pdf", "Experience_Certificate.pdf", "ISO_9001_Certificate.pdf", "GST_Certificate.pdf", "EMD_Receipt.pdf"],
    analysis: {
      overall_score: 92,
      risk_level: "LOW",
      pass_count: 5,
      review_count: 1,
      fail_count: 0,
      evidence_coverage: 95,
      recommendation: "READY TO SUBMIT — Bid appears compliant. Review flagged items.",
      critical_issues: [],
      scores: { financial: 100, eligibility: 90, technical: 90, documentation: 95 },
      requirements_analysis: [
        { req_id: "r1", status: "PASS", found_value: "₹18.4 Crore", required_value: "₹5.0 Cr", evidence_doc: "Turnover_Certificate_FY2025.pdf", evidence_page: 3, reason: "Turnover certificate verified.", risk: null, req_title: "Minimum Turnover", req_category: "Financial", mandatory: true },
        { req_id: "r2", status: "PASS", found_value: "7 years", required_value: "5 Years", evidence_doc: "Experience_Certificate.pdf", evidence_page: 2, reason: "Experience certificate valid.", risk: null, req_title: "Experience", req_category: "Eligibility", mandatory: true },
        { req_id: "r3", status: "PASS", found_value: "ISO 9001:2015 Valid", required_value: "ISO 9001 & 27001", evidence_doc: "ISO_9001_Certificate.pdf", evidence_page: 1, reason: "ISO 9001 valid till 2028.", risk: null, req_title: "ISO Certification", req_category: "Technical", mandatory: true },
        { req_id: "r4", status: "REVIEW", found_value: "2 Years", required_value: "3 Years SLA", evidence_doc: "Technical_Specifications.pdf", evidence_page: 5, reason: "2 year SLA specified in brochure.", risk: "LOW", req_title: "Warranty", req_category: "Technical", mandatory: true },
        { req_id: "r5", status: "PASS", found_value: "GSTIN: 27AABCS1429B1Z1", required_value: "Valid GSTIN", evidence_doc: "GST_Certificate.pdf", evidence_page: 1, reason: "GSTIN active.", risk: null, req_title: "GST Registration", req_category: "Documentation", mandatory: true },
        { req_id: "r6", status: "PASS", found_value: "₹2,50,000 EMD Paid", required_value: "₹2,50,000 EMD", evidence_doc: "EMD_Receipt.pdf", evidence_page: 1, reason: "EMD transaction verified.", risk: null, req_title: "EMD Receipt", req_category: "Documentation", mandatory: true }
      ]
    }
  }
];

// Auth
export const login = (email, password) =>
  client.post('/auth/login', { email, password })
    .then(r => r.data)
    .catch(() => {
      if (email.includes('officer')) {
        return { id: 'user_001', email, name: 'Rajesh Kumar', role: 'provider', organization: 'Ministry of Defence', token: 'mock_token_officer' };
      }
      return { id: 'user_002', email, name: 'Anil Sharma', role: 'contractor', organization: 'ABC Technologies Pvt Ltd', gstin: '27AABCS1429B1Z1', token: 'mock_token_contractor' };
    });

// Tenders
export const getTenders = (provider_id = null) =>
  client.get('/tenders/', { params: provider_id ? { provider_id } : {} })
    .then(r => r.data)
    .catch(() => MOCK_TENDERS);

export const getTender = (id) =>
  client.get(`/tenders/${id}`)
    .then(r => r.data)
    .catch(() => MOCK_TENDERS.find(t => t.id === id) || MOCK_TENDERS[0]);

export const createTender = (data, provider_id) =>
  client.post('/tenders/', data, { params: { provider_id } })
    .then(r => r.data)
    .catch(() => {
      const newT = { id: `tender_${Date.now()}`, provider_id, ...data, created_at: new Date().toISOString().split('T')[0], status: 'open' };
      MOCK_TENDERS.push(newT);
      return newT;
    });

export const getTenderBids = (tender_id) =>
  client.get(`/tenders/${tender_id}/bids`)
    .then(r => r.data)
    .catch(() => MOCK_BIDS.filter(b => b.tender_id === tender_id || tender_id === '1' || tender_id === 'tender_001'));

export const compareBidders = (tender_id) =>
  client.get(`/tenders/${tender_id}/compare`)
    .then(r => r.data)
    .catch(() => MOCK_BIDS.map(b => ({
      bid_id: b.id,
      contractor_name: b.contractor_name,
      overall_score: b.analysis.overall_score,
      risk_level: b.analysis.risk_level,
      pass_count: b.analysis.pass_count,
      review_count: b.analysis.review_count,
      fail_count: b.analysis.fail_count,
      recommendation: b.analysis.recommendation,
      scores: b.analysis.scores,
      evidence_coverage: b.analysis.evidence_coverage,
      submitted_at: b.submitted_at
    })));

// Bids
export const getBids = (contractor_id = null) =>
  client.get('/bids/', { params: contractor_id ? { contractor_id } : {} })
    .then(r => r.data)
    .catch(() => MOCK_BIDS);

export const getBid = (id) =>
  client.get(`/bids/${id}`)
    .then(r => r.data)
    .catch(() => MOCK_BIDS.find(b => b.id === id) || MOCK_BIDS[0]);

export const getBidAnalysis = (id) =>
  client.get(`/bids/${id}/analysis`)
    .then(r => r.data)
    .catch(() => (MOCK_BIDS.find(b => b.id === id) || MOCK_BIDS[0]).analysis);

export const submitBid = (data, contractor_id, contractor_name) =>
  client.post('/bids/submit', data, { params: { contractor_id, contractor_name } })
    .then(r => r.data)
    .catch(() => {
      const newB = { id: `bid_${Date.now()}`, tender_id: data.tender_id, contractor_id, contractor_name, submitted_at: new Date().toISOString().split('T')[0], status: 'submitted', documents: data.documents, analysis: MOCK_BIDS[0].analysis };
      MOCK_BIDS.push(newB);
      return newB;
    });

export const preBidCheck = (tender_id, documents) =>
  client.post('/bids/precheck', { tender_id, documents })
    .then(r => r.data)
    .catch(() => ({ tender_id, tender_title: MOCK_TENDERS[0].title, analysis: MOCK_BIDS[0].analysis }));

export const updateDecision = (bid_id, decision, note = '') =>
  client.post(`/bids/${bid_id}/decision`, null, { params: { decision, officer_note: note } })
    .then(r => r.data)
    .catch(() => ({ message: `Decision '${decision}' recorded`, bid_id }));

export default client;

