import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Shield, Zap, Globe } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const Home: React.FC = () => {
  const { isConnected, connectWallet } = useWallet();

  const features = [
    {
      icon: Wallet,
      title: 'Wallet Integration',
      description: 'Seamlessly connect your MetaMask wallet and interact with the blockchain',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are validated and secured through smart contracts',
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Lightning-fast token transfers and minting with minimal gas fees',
    },
    {
      icon: Globe,
      title: 'Multi-Network',
      description: 'Support for multiple Ethereum networks including mainnet and testnets',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-tight tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              CryptoFlow
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Your gateway to decentralized finance. Mint, transfer, and manage your crypto assets
            with ease on the Ethereum blockchain.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-500 hover:via-purple-600 hover:to-blue-500 text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 border border-purple-400/30 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Connect Wallet to Get Started</span>
              </span>
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-500 hover:via-purple-600 hover:to-blue-500 text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 border border-purple-400/30 overflow-hidden inline-block"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Go to Dashboard</span>
              </span>
            </Link>
          )}
          <Link
            to="/mint"
            className="group px-10 py-4 border-2 border-purple-400/60 text-purple-300 hover:text-white hover:bg-purple-500/30 hover:border-purple-300 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Explore Features</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-16 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
          Why Choose CryptoFlow?
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <feature.icon className="h-12 w-12 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-white/5 via-purple-500/5 to-white/5 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-12 shadow-2xl">
        <h3 className="text-2xl font-bold text-center text-white mb-8">Platform Statistics</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">1000+</div>
            <div className="text-gray-300 text-lg font-medium">Tokens Minted</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">500+</div>
            <div className="text-gray-300 text-lg font-medium">Active Users</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2">99.9%</div>
            <div className="text-gray-300 text-lg font-medium">Uptime</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;