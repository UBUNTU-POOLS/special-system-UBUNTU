
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Contribute from './pages/Contribute';
import CreatePool from './pages/CreatePool';
import PoolAgreement from './pages/PoolAgreement';
import PoolDetails from './pages/PoolDetails';
import KycVerification from './pages/KycVerification';
import FAQ from './pages/FAQ';
import Prospectus from './pages/Prospectus';
import ComplianceBanner from './components/ComplianceBanner';
import { CurrencyProvider } from './contexts/CurrencyContext';

const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <Router>
        <ComplianceBanner />
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/create-pool" element={<CreatePool />} />
            <Route path="/verify" element={<KycVerification />} />
            <Route path="/agreement/:poolId" element={<PoolAgreement />} />
            <Route path="/contribute/:id" element={<Contribute />} />
            <Route path="/pool/:id" element={<PoolDetails />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/prospectus" element={<Prospectus />} />
          </Routes>
        </Layout>
      </Router>
    </CurrencyProvider>
  );
};

export default App;
