import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPages from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import RoleSelection from './pages/RoleSelection';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InterviewRoom from './pages/InterviewRoom';
import ReportPage from './pages/ReportPage';
import RoadmapPage from './pages/RoadmapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPanel from './pages/AdminPanel';

// Private Route Wrapper
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-100 font-bold uppercase tracking-wider text-xs">
        Verifying Authentication Session...
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Layout Private Route Wrapper
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PrivateRoute>
      <Layout>{children}</Layout>
    </PrivateRoute>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPages mode="login" />} />
            <Route path="/register" element={<AuthPages mode="register" />} />
            <Route path="/forgot-password" element={<AuthPages mode="forgot-password" />} />

            {/* Private Layout-wrapped Routes */}
            <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
            <Route path="/roles" element={<LayoutWrapper><RoleSelection /></LayoutWrapper>} />
            <Route path="/resume" element={<LayoutWrapper><ResumeAnalyzer /></LayoutWrapper>} />
            <Route path="/interview/:id" element={<LayoutWrapper><InterviewRoom /></LayoutWrapper>} />
            <Route path="/report/:id" element={<LayoutWrapper><ReportPage /></LayoutWrapper>} />
            <Route path="/roadmap" element={<LayoutWrapper><RoadmapPage /></LayoutWrapper>} />
            <Route path="/analytics" element={<LayoutWrapper><AnalyticsPage /></LayoutWrapper>} />
            <Route path="/admin" element={<LayoutWrapper><AdminPanel /></LayoutWrapper>} />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
