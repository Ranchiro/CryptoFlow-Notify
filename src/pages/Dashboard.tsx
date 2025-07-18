import React, { useState, useEffect } from 'react';
import { Coins, ArrowUpRight, ArrowDownLeft, Activity, TrendingUp } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface Transaction {
  id: string;
  type: 'mint' | 'transfer_in' | 'transfer_out';
  amount: string;
  from?: string;
  to?: string;
  timestamp: Date;
  hash: string;
}

const Dashboard: React.FC = () => {
  const { account, isConnected, balance, tokenBalance, network } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalSupply: '1,000,000',
    totalHolders: '1,234',
    todayVolume: '45,678',
    priceChange: '+5.67%',
  });

  useEffect(() => {
    // Simulate fetching transaction history
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'mint',
        amount: '100',
        to: account || '',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        hash: '0x1234...5678',
      },
      {
        id: '2',
        type: 'transfer_out',
        amount: '25',
        from: account || '',
        to: '0xabcd...efgh',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        hash: '0x2345...6789',
      },
      {
        id: '3',
        type: 'transfer_in',
        amount: '50',
        from: '0xijkl...mnop',
        to: account || '',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        hash: '0x3456...7890',
      },
    ];
    setTransactions(mockTransactions);
  }, [account]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold text-white">Wallet Not Connected</h2>
          <p className="text-gray-400">Please connect your wallet to view the dashboard</p>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mint':
        return <Coins className="h-4 w-4 text-green-400" />;
      case 'transfer_in':
        return <ArrowDownLeft className="h-4 w-4 text-blue-400" />;
      case 'transfer_out':
        return <ArrowUpRight className="h-4 w-4 text-orange-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Overview of your blockchain activity</p>
      </div>

      {/* Wallet Info */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
            <div className="text-purple-400 font-mono text-sm break-all">{account}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">ETH Balance</div>
            <div className="text-2xl font-bold text-white">{balance} ETH</div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-sm text-gray-400 mb-1">Network</div>
            <div className="text-blue-400 font-medium">{network}</div>
          </div>
        </div>
      </div>

      {/* Token Balance */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">CFT Token Balance</h3>
            <div className="text-3xl font-bold text-purple-400">{tokenBalance} CFT</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Value (USD)</div>
            <div className="text-xl font-semibold text-green-400">
              ${(parseFloat(tokenBalance) * 1.23).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Total Supply</div>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalSupply}</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Total Holders</div>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalHolders}</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">24h Volume</div>
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.todayVolume}</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Price Change</div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.priceChange}</div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Transactions</h3>
        
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getTransactionIcon(tx.type)}
                <div>
                  <div className="text-white font-medium capitalize">
                    {tx.type.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tx.hash}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-medium">
                  {tx.type === 'transfer_out' ? '-' : '+'}{tx.amount} CFT
                </div>
                <div className="text-sm text-gray-400">
                  {formatTime(tx.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;