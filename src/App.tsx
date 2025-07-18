import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Mint from './pages/Mint';
import Transfer from './pages/Transfer';
import Profile from './pages/Profile';
import Governance from './pages/Governance';
import Analytics from './pages/Analytics';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProfileProvider } from './context/ProfileContext';
import { GovernanceProvider } from './context/GovernanceContext';
import Toast from './components/Toast';

function App() {
  return (
    <WalletProvider>
      <ProfileProvider>
        <NotificationProvider>
          <GovernanceProvider>
            <ToastProvider>
              <Router>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/mint" element={<Mint />} />
                      <Route path="/transfer" element={<Transfer />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/governance" element={<Governance />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                  </main>
                  <Toast />
                </div>
              </Router>
            </ToastProvider>
          </GovernanceProvider>
        </NotificationProvider>
      </ProfileProvider>
    </WalletProvider>
  );
}

export default App;