import React, { useState } from 'react';
import { Send, Loader, CheckCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import GasTracker from '../components/GasTracker';

const Transfer: React.FC = () => {
  const { account, isConnected, tokenBalance, refreshBalance, getGasEstimate } = useWallet();
  const { addToast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGasPrice, setSelectedGasPrice] = useState<number>(0);
  const [estimatedGas, setEstimatedGas] = useState('21000');

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleRecipientChange = async (address: string) => {
    setRecipient(address);
    if (validateAddress(address)) {
      const gasEstimate = await getGasEstimate(address, '0xa9059cbb');
      setEstimatedGas(gasEstimate);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      addToast('Please connect your wallet first', 'error');
      return;
    }

    if (!recipient || !validateAddress(recipient)) {
      addToast('Please enter a valid Ethereum address', 'error');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }

    if (parseFloat(amount) > parseFloat(tokenBalance)) {
      addToast('Insufficient token balance', 'error');
      return;
    }

    if (recipient.toLowerCase() === account?.toLowerCase()) {
      addToast('Cannot transfer to your own address', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would call the smart contract
      addToast(`Successfully transferred ${amount} CFT to ${recipient.slice(0, 10)}...`, 'success');
      await refreshBalance();
      setRecipient('');
      setAmount('');
    } catch (error) {
      addToast('Failed to transfer tokens. Please try again.', 'error');
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
          <p className="text-gray-400">Please connect your wallet to transfer tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Transfer Tokens</h1>
        <p className="text-gray-400">Send CFT tokens to another Ethereum address</p>
      </div>

      {/* Balance Display */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Available Balance</div>
          <div className="text-3xl font-bold text-purple-400">{tokenBalance} CFT</div>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => handleRecipientChange(e.target.value)}
              placeholder="0x1234567890123456789012345678901234567890"
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              disabled={isLoading}
            />
            {recipient && !validateAddress(recipient) && (
              <div className="mt-2 text-sm text-red-400">
                Please enter a valid Ethereum address
              </div>
            )}
            {recipient && validateAddress(recipient) && (
              <div className="mt-2 text-sm text-green-400 flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Valid Ethereum address</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to transfer"
                min="0"
                max={tokenBalance}
                step="0.01"
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-3 text-gray-400 text-sm">CFT</div>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-400">
                Balance: {tokenBalance} CFT
              </span>
              <button
                type="button"
                onClick={() => setAmount(tokenBalance)}
                className="text-purple-400 hover:text-purple-300"
              >
                Use Max
              </button>
            </div>
          </div>

          {recipient && amount && validateAddress(recipient) && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-400 mb-2">Transaction Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="text-white font-mono">{account?.slice(0, 10)}...{account?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="text-white font-mono">{recipient.slice(0, 10)}...{recipient.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{amount} CFT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Gas:</span>
                  <span className="text-white">{estimatedGas} gas</span>
                </div>
              </div>
            </div>
          )}

          <GasTracker
            onGasSelect={setSelectedGasPrice}
            estimatedGas={estimatedGas}
          />

          <button
            type="submit"
            disabled={isLoading || !amount || !recipient || !validateAddress(recipient)}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Processing Transfer...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send Tokens</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">⚠️ Security Notice</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Always double-check the recipient address before sending</p>
          <p>• Blockchain transactions are irreversible once confirmed</p>
          <p>• Ensure you have enough ETH for gas fees</p>
          <p>• Consider sending a small test amount first for large transfers</p>
        </div>
      </div>
    </div>
  );
};

export default Transfer;