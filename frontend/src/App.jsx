import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { ComparisonProvider } from './context/ComparisonContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Alert from './components/Alert';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SchoolsList from './pages/SchoolsList';
import SchoolDetail from './pages/SchoolDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminPanel from './pages/SuperAdminPanel';
import Compare from './pages/Compare';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import OAuthSuccess from './pages/OAuthSuccess';
import CompleteProfile from './pages/CompleteProfile';
import './styles/global.css';
import './styles/layout.css';
import './styles/modern-theme.css';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <ComparisonProvider>
          <Router>
            <ScrollToTop />
            <div className="app-layout">
              <NavBar />
              <Alert />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/schools" element={<SchoolsList />} />
                  <Route path="/schools/:slug" element={<SchoolDetail />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/oauth/success" element={<OAuthSuccess />} />
                  <Route path="/complete-profile" element={<CompleteProfile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/superadmin" element={<SuperAdminPanel />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/features" element={<Features />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ComparisonProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
