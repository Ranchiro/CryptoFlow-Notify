import React, { useState, useEffect } from 'react';
import { Fuel, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface GasPrices {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
}

interface GasTrackerProps {
  onGasSelect?: (gasPrice: number) => void;
  estimatedGas?: string;
}

const GasTracker: React.FC<GasTrackerProps> = ({ onGasSelect, estimatedGas = '21000' }) => {
  const { gasPrice, chainId } = useWallet();
  const [gasPrices, setGasPrices] = useState<GasPrices>({
    slow: 0,
    standard: 0,
    fast: 0,
    instant: 0
  });
  const [selectedSpeed, setSelectedSpeed] = useState<keyof GasPrices>('standard');
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    const currentGas = parseFloat(gasPrice);
    setGasPrices({
      slow: Math.max(1, currentGas * 0.8),
      standard: currentGas,
      fast: currentGas * 1.2,
      instant: currentGas * 1.5
    });
  }, [gasPrice]);

  useEffect(() => {
    // Simulate gas price trend
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.33) setTrend('up');
      else if (random < 0.66) setTrend('down');
      else setTrend('stable');
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const calculateCost = (gasPrice: number) => {
    const gasCost = (gasPrice * parseInt(estimatedGas)) / 1e9; // Convert to ETH
    return gasCost.toFixed(6);
  };

  const getSpeedLabel = (speed: keyof GasPrices) => {
    switch (speed) {
      case 'slow':
        return { label: 'Slow', time: '~5 min', color: 'text-gray-400' };
      case 'standard':
        return { label: 'Standard', time: '~2 min', color: 'text-blue-400' };
      case 'fast':
        return { label: 'Fast', time: '~30 sec', color: 'text-orange-400' };
      case 'instant':
        return { label: 'Instant', time: '~15 sec', color: 'text-red-400' };
    }
  };

  const handleSpeedSelect = (speed: keyof GasPrices) => {
    setSelectedSpeed(speed);
    onGasSelect?.(gasPrices[speed]);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Fuel className="h-5 w-5 text-purple-400" />
          <span className="text-white font-medium">Gas Tracker</span>
        </div>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className="text-sm text-gray-400">{gasPrice} gwei</span>
        </div>
      </div>

      <div className="space-y-2">
        {(Object.keys(gasPrices) as Array<keyof GasPrices>).map((speed) => {
          const speedInfo = getSpeedLabel(speed);
          const isSelected = selectedSpeed === speed;
          
          return (
            <button
              key={speed}
              onClick={() => handleSpeedSelect(speed)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-purple-500/20 border border-purple-500/40'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isSelected ? 'bg-purple-400' : 'bg-gray-600'
                }`} />
                <div className="text-left">
                  <div className={`text-sm font-medium ${speedInfo.color}`}>
                    {speedInfo.label}
                  </div>
                  <div className="text-xs text-gray-400">
                    {speedInfo.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">
                  {gasPrices[speed].toFixed(1)} gwei
                </div>
                <div className="text-xs text-gray-400">
                  ~{calculateCost(gasPrices[speed])} ETH
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="text-xs text-blue-400 mb-1">Estimated Transaction Cost</div>
        <div className="text-sm text-white">
          {calculateCost(gasPrices[selectedSpeed])} ETH
          <span className="text-gray-400 ml-2">
            (Gas: {estimatedGas} × {gasPrices[selectedSpeed].toFixed(1)} gwei)
          </span>
        </div>
      </div>
    </div>
  );
};

export default GasTracker;