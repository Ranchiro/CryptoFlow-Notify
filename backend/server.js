const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ethers } = require('ethers');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Ethereum provider setup
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract ABI and address (would be imported from compiled contract)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  // ERC-20 Standard Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Custom Functions
  "function mint(address to, uint256 amount) returns (bool)",
  "function burn(uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Mint(address indexed to, uint256 amount)"
];

// Create contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('subscribe', (address) => {
    socket.join(`address_${address}`);
    console.log(`Client subscribed to address: ${address}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Monitor blockchain events
if (contract && provider) {
  contract.on('Transfer', (from, to, amount, event) => {
    console.log('Transfer event detected:', { from, to, amount: amount.toString() });
    
    // Notify relevant clients
    io.to(`address_${to}`).emit('transfer_received', {
      from,
      to,
      amount: ethers.formatUnits(amount, 18),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
    
    io.to(`address_${from}`).emit('transfer_sent', {
      from,
      to,
      amount: ethers.formatUnits(amount, 18),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });
  
  contract.on('Mint', (to, amount, event) => {
    console.log('Mint event detected:', { to, amount: amount.toString() });
    
    io.to(`address_${to}`).emit('mint_successful', {
      to,
      amount: ethers.formatUnits(amount, 18),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get token info
app.get('/api/token/info', async (req, res) => {
  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);

    res.json({
      name,
      symbol,
      decimals: decimals.toString(),
      totalSupply: ethers.formatUnits(totalSupply, decimals)
    });
  } catch (error) {
    console.error('Error fetching token info:', error);
    res.status(500).json({ error: 'Failed to fetch token information' });
  }
});

// Get balance for an address
app.get('/api/token/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    
    res.json({
      address,
      balance: ethers.formatUnits(balance, decimals),
      balanceWei: balance.toString()
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Mint tokens
app.post('/api/token/mint', async (req, res) => {
  try {
    const { to, amount } = req.body;
    
    if (!ethers.isAddress(to)) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    
    const tx = await contract.mint(to, amountWei);
    const receipt = await tx.wait();
    
    res.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });
  } catch (error) {
    console.error('Error minting tokens:', error);
    res.status(500).json({ error: 'Failed to mint tokens' });
  }
});

// Transfer tokens
app.post('/api/token/transfer', async (req, res) => {
  try {
    const { from, to, amount, privateKey } = req.body;
    
    if (!ethers.isAddress(from) || !ethers.isAddress(to)) {
      return res.status(400).json({ error: 'Invalid address' });
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create wallet from private key
    const senderWallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(senderWallet);
    
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    
    const tx = await contractWithSigner.transfer(to, amountWei);
    const receipt = await tx.wait();
    
    res.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });
  } catch (error) {
    console.error('Error transferring tokens:', error);
    res.status(500).json({ error: 'Failed to transfer tokens' });
  }
});

// Get transaction history
app.get('/api/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Get transfer events with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const fromBlock = parseInt(req.query.fromBlock) || -10000;
    
    const transferFilter = contract.filters.Transfer();
    const events = await contract.queryFilter(transferFilter, fromBlock);
    
    const transactions = events
      .filter(event => 
        event.args[0].toLowerCase() === address.toLowerCase() || 
        event.args[1].toLowerCase() === address.toLowerCase()
      )
      .map(event => ({
        hash: event.transactionHash,
        blockNumber: event.blockNumber,
        from: event.args[0],
        to: event.args[1],
        amount: ethers.formatUnits(event.args[2], 18),
        type: event.args[0].toLowerCase() === address.toLowerCase() ? 'outgoing' : 'incoming',
        timestamp: new Date() // In real app, get block timestamp
      }))
      .slice((page - 1) * limit, page * limit);

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});

// Get gas prices from multiple networks
app.get('/api/gas-prices', async (req, res) => {
  try {
    const networks = [
      { name: 'ethereum', rpc: process.env.ETHEREUM_RPC_URL },
      { name: 'polygon', rpc: process.env.POLYGON_RPC_URL },
      { name: 'arbitrum', rpc: process.env.ARBITRUM_RPC_URL }
    ];
    
    const gasPrices = {};
    
    for (const network of networks) {
      if (network.rpc) {
        try {
          const networkProvider = new ethers.JsonRpcProvider(network.rpc);
          const feeData = await networkProvider.getFeeData();
          gasPrices[network.name] = {
            gasPrice: ethers.formatUnits(feeData.gasPrice || 0, 'gwei'),
            maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null
          };
        } catch (error) {
          console.error(`Error fetching gas price for ${network.name}:`, error);
          gasPrices[network.name] = { error: 'Failed to fetch' };
        }
      }
    }
    
    res.json(gasPrices);
  } catch (error) {
    console.error('Error fetching gas prices:', error);
    res.status(500).json({ error: 'Failed to fetch gas prices' });
  }
});

// ENS resolution endpoint
app.get('/api/ens/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    // Only resolve ENS on Ethereum mainnet
    if (process.env.ETHEREUM_RPC_URL) {
      const mainnetProvider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
      const ensName = await mainnetProvider.lookupAddress(address);
      
      res.json({ address, ensName });
    } else {
      res.json({ address, ensName: null });
    }
  } catch (error) {
    console.error('Error resolving ENS:', error);
    res.json({ address: req.params.address, ensName: null });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d';
    
    // In real app, aggregate data from blockchain events and external APIs
    const mockAnalytics = {
      totalSupply: await contract.totalSupply().then(s => ethers.formatUnits(s, 18)),
      totalHolders: 1234, // Would query unique addresses from Transfer events
      totalTransactions: 5678, // Would count Transfer events
      volume24h: '123456',
      priceChange: Math.random() * 20 - 10, // Mock price change
      burnRate: 2.3,
      distributionData: [
        { name: 'Treasury', value: 30 },
        { name: 'Community', value: 40 },
        { name: 'Team', value: 15 },
        { name: 'Liquidity', value: 10 },
        { name: 'Burned', value: 5 }
      ]
    };
    
    res.json(mockAnalytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Contract address: ${CONTRACT_ADDRESS}`);
  console.log(`WebSocket server enabled`);
});

module.exports = { app, server, io };