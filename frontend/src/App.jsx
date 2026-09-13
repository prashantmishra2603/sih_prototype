import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import ParticleBackground from './components/ParticleBackground';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import AIChat from './pages/AIChat';
import Settings from './pages/Settings';

// Provider pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderTenders from './pages/provider/ProviderTenders';
import CreateTender from './pages/provider/CreateTender';
import TenderDetail from './pages/provider/TenderDetail';
import BidAnalysis from './pages/provider/BidAnalysis';
import BidderComparison from './pages/provider/BidderComparison';
import DocumentVerifier from './pages/provider/DocumentVerifier';
import AnalyticsAudit from './pages/provider/AnalyticsAudit';

// Contractor pages
import ContractorDashboard from './pages/contractor/ContractorDashboard';
import BrowseTenders from './pages/contractor/BrowseTenders';
import UploadDocuments from './pages/contractor/UploadDocuments';
import MyBids from './pages/contractor/MyBids';
import ContractorBidDetail from './pages/contractor/ContractorBidDetail';
import ContractorTenderView from './pages/contractor/ContractorTenderView';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" style={{ width: 40, height: 40 }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'provider' ? '/provider/dashboard' : '/contractor/dashboard'} replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'provider' ? '/provider/dashboard' : '/contractor/dashboard'} replace /> : <Login />} />

      {/* Shared Suite Routes */}
      <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Provider Routes */}
      <Route path="/provider/dashboard" element={<ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider/tenders" element={<ProtectedRoute role="provider"><ProviderTenders /></ProtectedRoute>} />
      <Route path="/provider/create-tender" element={<ProtectedRoute role="provider"><CreateTender /></ProtectedRoute>} />
      <Route path="/provider/tender/:tenderId" element={<ProtectedRoute role="provider"><TenderDetail /></ProtectedRoute>} />
      <Route path="/provider/bid/:bidId" element={<ProtectedRoute role="provider"><BidAnalysis /></ProtectedRoute>} />
      <Route path="/provider/compare/:tenderId" element={<ProtectedRoute role="provider"><BidderComparison /></ProtectedRoute>} />
      <Route path="/provider/verifier" element={<ProtectedRoute role="provider"><DocumentVerifier /></ProtectedRoute>} />
      <Route path="/provider/analytics" element={<ProtectedRoute role="provider"><AnalyticsAudit /></ProtectedRoute>} />

      {/* Contractor Routes */}
      <Route path="/contractor/dashboard" element={<ProtectedRoute role="contractor"><ContractorDashboard /></ProtectedRoute>} />
      <Route path="/contractor/browse" element={<ProtectedRoute role="contractor"><BrowseTenders /></ProtectedRoute>} />
      <Route path="/contractor/tender/:tenderId" element={<ProtectedRoute role="contractor"><ContractorTenderView /></ProtectedRoute>} />
      <Route path="/contractor/upload/:tenderId" element={<ProtectedRoute role="contractor"><UploadDocuments /></ProtectedRoute>} />
      <Route path="/contractor/bids" element={<ProtectedRoute role="contractor"><MyBids /></ProtectedRoute>} />
      <Route path="/contractor/bid/:bidId" element={<ProtectedRoute role="contractor"><ContractorBidDetail /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ParticleBackground />
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

