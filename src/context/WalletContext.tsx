import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ENS } from '@ensdomains/ensjs';
import { ethers } from 'ethers';

export interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  balance: string;
  network: string;
  chainId: string;
  ensName: string | null;
  gasPrice: string;
  supportedNetworks: Network[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  tokenBalance: string;
  refreshBalance: () => Promise<void>;
  getGasEstimate: (to: string, data?: string) => Promise<string>;
}

interface Network {
  chainId: string;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  layer: 'L1' | 'L2';
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState('');
  const [ensName, setEnsName] = useState<string | null>(null);
  const [gasPrice, setGasPrice] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');

  const supportedNetworks: Network[] = [
    {
      chainId: '0x1',
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
      blockExplorer: 'https://etherscan.io',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      isTestnet: false,
      layer: 'L1'
    },
    {
      chainId: '0x89',
      name: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-rpc.com',
      blockExplorer: 'https://polygonscan.com',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      isTestnet: false,
      layer: 'L2'
    },
    {
      chainId: '0xa4b1',
      name: 'Arbitrum One',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      blockExplorer: 'https://arbiscan.io',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      isTestnet: false,
      layer: 'L2'
    },
    {
      chainId: '0xa',
      name: 'Optimism',
      rpcUrl: 'https://mainnet.optimism.io',
      blockExplorer: 'https://optimistic.etherscan.io',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      isTestnet: false,
      layer: 'L2'
    },
    {
      chainId: '0xaa36a7',
      name: 'Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/demo',
      blockExplorer: 'https://sepolia.etherscan.io',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
      isTestnet: true,
      layer: 'L1'
    }
  ];

  const connectWallet = async () => {
    try {
      // Check if window.ethereum exists first
      if (!window.ethereum) {
        alert('Please install MetaMask or another Ethereum wallet!');
        return;
      }

      const provider = await detectEthereumProvider();
      
      if (provider) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await refreshBalance();
          await getNetwork();
          await resolveENS(accounts[0]);
          await getGasPrice();
        }
      } else {
        alert('Ethereum provider not detected. Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        // User rejected the request
        console.log('User rejected wallet connection');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance('0');
    setTokenBalance('0');
    setNetwork('');
    setChainId('');
    setEnsName(null);
    setGasPrice('0');
  };

  const switchNetwork = async (chainId: string) => {
    try {
      const targetNetwork = supportedNetworks.find(n => n.chainId === chainId);
      if (!targetNetwork) {
        throw new Error('Unsupported network');
      }

      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      await getNetwork();
      await getGasPrice();
    } catch (error) {
      // If network doesn't exist, add it
      if ((error as any)?.code === 4902) {
        await addNetwork(chainId);
      } else {
        console.error('Error switching network:', error);
      }
    }
  };

  const addNetwork = async (chainId: string) => {
    const network = supportedNetworks.find(n => n.chainId === chainId);
    if (!network) return;

    try {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: network.chainId,
          chainName: network.name,
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.blockExplorer],
          nativeCurrency: network.nativeCurrency
        }],
      });
    } catch (error) {
      console.error('Error adding network:', error);
    }
  };

  const resolveENS = async (address: string) => {
    try {
      if (chainId === '0x1') { // Only on Ethereum mainnet
        const provider = new ethers.BrowserProvider(window.ethereum);
        const name = await provider.lookupAddress(address);
        setEnsName(name);
      }
    } catch (error) {
      console.error('Error resolving ENS:', error);
      setEnsName(null);
    }
  };

  const getGasPrice = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const feeData = await provider.getFeeData();
        const gasPriceGwei = ethers.formatUnits(feeData.gasPrice || 0, 'gwei');
        setGasPrice(parseFloat(gasPriceGwei).toFixed(2));
      }
    } catch (error) {
      console.error('Error getting gas price:', error);
    }
  };

  const getGasEstimate = async (to: string, data?: string): Promise<string> => {
    try {
      if (window.ethereum && account) {
        const gasEstimate = await window.ethereum.request({
          method: 'eth_estimateGas',
          params: [{
            from: account,
            to,
            data: data || '0x'
          }]
        });
        return parseInt(gasEstimate, 16).toString();
      }
      return '21000'; // Default gas limit
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '21000';
    }
  };

  const refreshBalance = async () => {
    if (account && window.ethereum) {
      try {
        const ethBalance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });
        
        // Convert from wei to ETH
        const balanceInEth = parseInt(ethBalance, 16) / Math.pow(10, 18);
        setBalance(balanceInEth.toFixed(4));
        
        // Simulate token balance (in real app, would call contract)
        setTokenBalance((Math.random() * 1000).toFixed(2));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  const getNetwork = async () => {
    if (window.ethereum) {
      try {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(currentChainId);
        
        const currentNetwork = supportedNetworks.find(n => n.chainId === currentChainId);
        setNetwork(currentNetwork?.name || 'Unknown Network');
      } catch (error) {
        console.error('Error getting network:', error);
      }
    }
  };

  useEffect(() => {
    // Early return if window.ethereum is not available
    if (!window.ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        refreshBalance();
      }
    };

    const handleChainChanged = () => {
      getNetwork();
      getGasPrice();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account]);

  const value = {
    account,
    isConnected,
    balance,
    network,
    chainId,
    ensName,
    gasPrice,
    supportedNetworks,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    tokenBalance,
    refreshBalance,
    getGasEstimate,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}