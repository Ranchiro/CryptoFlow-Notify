import React, { useState } from 'react';
import { User, Copy, ExternalLink, Settings, RefreshCw } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

const Profile: React.FC = () => {
  const { account, isConnected, balance, tokenBalance, network, switchNetwork, refreshBalance } = useWallet();
  const { addToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Address copied to clipboard!', 'success');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    addToast('Balances refreshed!', 'info');
    setIsRefreshing(false);
  };

  const networks = [
    { name: 'Ethereum Mainnet', chainId: '0x1' },
    { name: 'Goerli Testnet', chainId: '0x5' },
    { name: 'Sepolia Testnet', chainId: '0xaa36a7' },
    { name: 'Polygon Mainnet', chainId: '0x89' },
  ];

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold text-white">Wallet Not Connected</h2>
          <p className="text-gray-400">Please connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Profile</h1>
        <p className="text-gray-400">Manage your wallet and view account details</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Wallet Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono text-sm md:text-base break-all">{account}</span>
                <button
                  onClick={() => copyToClipboard(account!)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  title="Copy wallet address"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <a
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">ETH Balance</div>
                <div className="text-xl font-bold text-white">{balance} ETH</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">CFT Balance</div>
                <div className="text-xl font-bold text-purple-400">{tokenBalance} CFT</div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Network Settings */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Network Settings</span>
        </h3>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-3">Current Network</div>
            <div className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <span className="text-purple-400 font-medium">{network}</span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-3">Switch Network</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {networks.map((net) => (
                <button
                  key={net.chainId}
                  onClick={() => switchNetwork(net.chainId)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-500/20 hover:border-purple-500/40 rounded-lg text-left transition-all duration-200"
                >
                  <span className="text-white">{net.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Activity */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Account Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">15</div>
            <div className="text-sm text-gray-400">Total Transactions</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">7</div>
            <div className="text-sm text-gray-400">Days Active</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">3</div>
            <div className="text-sm text-gray-400">Tokens Minted</div>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">🔐 Security Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="space-y-2">
            <p>• Never share your private keys or seed phrase</p>
            <p>• Always verify transaction details before confirming</p>
            <p>• Use hardware wallets for large amounts</p>
          </div>
          <div className="space-y-2">
            <p>• Keep your MetaMask extension updated</p>
            <p>• Be cautious of phishing websites</p>
            <p>• Double-check contract addresses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;