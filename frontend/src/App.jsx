import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StockProvider } from './context/StockContext';
import Navbar from './components/Navbar';
import StockTicker from './components/StockTicker';
import Loader from './components/Loader';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Alerts from './pages/Alerts';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import Compare from './pages/Compare';
import News from './pages/News';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '2rem', height: '2rem', border: '2px solid #4a9eff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', paddingLeft: '4.5rem' }}>
    <StockTicker />
    <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {children}
    </main>
    <Navbar />
  </div>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><AppLayout><Market /></AppLayout></ProtectedRoute>} />
      <Route path="/portfolio" element={<ProtectedRoute><AppLayout><Portfolio /></AppLayout></ProtectedRoute>} />
      <Route path="/watchlist" element={<ProtectedRoute><AppLayout><Watchlist /></AppLayout></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AppLayout><Alerts /></AppLayout></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><AppLayout><Help /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><AppLayout><Transactions /></AppLayout></ProtectedRoute>} />
      <Route path="/compare" element={<ProtectedRoute><AppLayout><Compare /></AppLayout></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><AppLayout><News /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <StockProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#0f1629', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
            success: { iconTheme: { primary: '#00d4aa', secondary: '#0f1629' } },
            error: { iconTheme: { primary: '#ff4757', secondary: '#0f1629' } },
          }} />
        </StockProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
