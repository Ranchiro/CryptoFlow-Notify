import React, { useState } from 'react';
import { ChevronDown, Wifi, WifiOff, Zap } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const NetworkSelector: React.FC = () => {
  const { chainId, supportedNetworks, switchNetwork, gasPrice } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const currentNetwork = supportedNetworks.find(n => n.chainId === chainId);

  const getNetworkIcon = (layer: string) => {
    return layer === 'L2' ? <Zap className="h-4 w-4 text-green-400" /> : <Wifi className="h-4 w-4 text-blue-400" />;
  };

  const getNetworkColor = (isTestnet: boolean) => {
    return isTestnet ? 'text-yellow-400' : 'text-green-400';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-purple-500/30 rounded-lg transition-colors"
      >
        {currentNetwork ? (
          <>
            {getNetworkIcon(currentNetwork.layer)}
            <span className="text-white text-sm">{currentNetwork.name}</span>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>{gasPrice} gwei</span>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm">Unknown Network</span>
          </>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Select Network</div>
            {supportedNetworks.map((network) => (
              <button
                key={network.chainId}
                onClick={() => {
                  switchNetwork(network.chainId);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors ${
                  network.chainId === chainId ? 'bg-purple-500/20 border border-purple-500/30' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getNetworkIcon(network.layer)}
                  <div className="text-left">
                    <div className={`text-sm font-medium ${getNetworkColor(network.isTestnet)}`}>
                      {network.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {network.layer} • {network.nativeCurrency.symbol}
                    </div>
                  </div>
                </div>
                {network.isTestnet && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    Testnet
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;