import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Coins, Activity, DollarSign, Zap } from 'lucide-react';

interface AnalyticsData {
  totalSupply: string;
  totalHolders: number;
  totalTransactions: number;
  marketCap: string;
  volume24h: string;
  priceChange: number;
  burnRate: number;
  distributionData: Array<{ name: string; value: number; color: string }>;
  transactionHistory: Array<{ date: string; transactions: number; volume: number }>;
  topHolders: Array<{ address: string; balance: string; percentage: number }>;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Mock data - in real app, fetch from The Graph or custom analytics API
    const mockData: AnalyticsData = {
      totalSupply: '1,000,000',
      totalHolders: 1234,
      totalTransactions: 5678,
      marketCap: '$2,345,678',
      volume24h: '$123,456',
      priceChange: 5.67,
      burnRate: 2.3,
      distributionData: [
        { name: 'Treasury', value: 30, color: '#8B5CF6' },
        { name: 'Community', value: 40, color: '#06B6D4' },
        { name: 'Team', value: 15, color: '#10B981' },
        { name: 'Liquidity', value: 10, color: '#F59E0B' },
        { name: 'Burned', value: 5, color: '#EF4444' }
      ],
      transactionHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        transactions: Math.floor(Math.random() * 100) + 50,
        volume: Math.floor(Math.random() * 10000) + 5000
      })),
      topHolders: [
        { address: '0x1234...5678', balance: '50,000', percentage: 5.0 },
        { address: '0x2345...6789', balance: '35,000', percentage: 3.5 },
        { address: '0x3456...7890', balance: '25,000', percentage: 2.5 },
        { address: '0x4567...8901', balance: '20,000', percentage: 2.0 },
        { address: '0x5678...9012', balance: '15,000', percentage: 1.5 }
      ]
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive token metrics and insights</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Market Cap</div>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analyticsData.marketCap}</div>
          <div className={`text-sm ${analyticsData.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {analyticsData.priceChange >= 0 ? '+' : ''}{analyticsData.priceChange}%
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Total Supply</div>
            <Coins className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analyticsData.totalSupply}</div>
          <div className="text-sm text-gray-400">CFT Tokens</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Holders</div>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analyticsData.totalHolders.toLocaleString()}</div>
          <div className="text-sm text-green-400">+12% this month</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">24h Volume</div>
            <Activity className="h-5 w-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{analyticsData.volume24h}</div>
          <div className="text-sm text-orange-400">+8.3% vs yesterday</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction History */}
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Transaction History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.transactionHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Token Distribution */}
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Token Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {analyticsData.distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {analyticsData.distributionData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Trading Volume</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analyticsData.transactionHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Bar dataKey="volume" fill="#06B6D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Holders */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Top Token Holders</h3>
        <div className="space-y-4">
          {analyticsData.topHolders.map((holder, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-mono">{holder.address}</div>
                  <div className="text-sm text-gray-400">{holder.percentage}% of total supply</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{holder.balance} CFT</div>
                <div className="text-sm text-gray-400">
                  ${(parseInt(holder.balance.replace(',', '')) * 1.23).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Burn Rate</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">{analyticsData.burnRate}%</div>
          <p className="text-sm text-gray-400">Monthly token burn rate</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Growth Rate</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">+15.3%</div>
          <p className="text-sm text-gray-400">Monthly holder growth</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Avg. Transaction</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">$234</div>
          <p className="text-sm text-gray-400">Average transaction value</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;