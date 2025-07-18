import React, { useState } from 'react';
import { Coins, Loader } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import GasTracker from '../components/GasTracker';

const Mint: React.FC = () => {
  const { account, isConnected, refreshBalance, getGasEstimate } = useWallet();
  const { addToast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGasPrice, setSelectedGasPrice] = useState<number>(0);
  const [estimatedGas, setEstimatedGas] = useState('21000');

  const handleAmountChange = async (value: string) => {
    setAmount(value);
    if (value && account) {
      // Estimate gas for minting transaction
      const gasEstimate = await getGasEstimate(account, '0xa9059cbb'); // transfer function selector
      setEstimatedGas(gasEstimate);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      addToast('Please connect your wallet first', 'error');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call the smart contract
      addToast(`Successfully minted ${amount} CFT tokens!`, 'success');
      await refreshBalance();
      setAmount('');
    } catch (error) {
      addToast('Failed to mint tokens. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold text-white">Wallet Not Connected</h2>
          <p className="text-gray-400">Please connect your wallet to mint tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Mint Tokens</h1>
        <p className="text-gray-400">Create new CFT tokens and add them to your wallet</p>
      </div>

      {/* Mint Form */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <form onSubmit={handleMint} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Amount to Mint
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount (e.g., 100)"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-3 text-gray-400 text-sm">CFT</div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-400 mb-2">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Recipient:</span>
                <span className="text-white font-mono">{account?.slice(0, 10)}...{account?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">{amount || '0'} CFT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Gas:</span>
                <span className="text-white">{estimatedGas} gas</span>
              </div>
            </div>
          </div>

          <GasTracker
            onGasSelect={setSelectedGasPrice}
            estimatedGas={estimatedGas}
          />

          <button
            type="submit"
            disabled={isLoading || !amount}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Minting...</span>
              </>
            ) : (
              <>
                <Coins className="h-5 w-5" />
                <span>Mint Tokens</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">About CFT Tokens</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <p>• CFT (CryptoFlow Token) is an ERC-20 token on the Ethereum blockchain</p>
          <p>• Minting creates new tokens and adds them directly to your wallet</p>
          <p>• Each minting operation requires a small gas fee paid in ETH</p>
          <p>• Tokens can be transferred to other addresses once minted</p>
        </div>
      </div>
    </div>
  );
};

export default Mint;