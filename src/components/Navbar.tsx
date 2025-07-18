import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import NetworkSelector from './NetworkSelector';
import NotificationCenter from './NotificationCenter';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { account, isConnected, connectWallet, disconnectWallet, ensName } = useWallet();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/mint', label: 'Mint' },
    { path: '/transfer', label: 'Transfer' },
    { path: '/governance', label: 'Governance' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/profile', label: 'Profile' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">CryptoFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'text-purple-400 bg-purple-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <NetworkSelector />
                <NotificationCenter />
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <div className="text-purple-400 font-medium">
                      {ensName || formatAddress(account!)}
                    </div>
                    <div className="text-gray-400 text-xs">Connected</div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-purple-400 bg-purple-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-purple-500/20">
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="px-3">
                      <NetworkSelector />
                    </div>
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm">
                        <div className="text-purple-400 font-medium">
                          {ensName || formatAddress(account!)}
                        </div>
                        <div className="text-gray-400 text-xs">Connected</div>
                      </div>
                      <button
                        onClick={disconnectWallet}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;