# CryptoFlow - Full-Stack Blockchain Application

A comprehensive blockchain application built with React, Node.js, Express, and Solidity smart contracts on Ethereum.

## 🚀 Features

- **Wallet Integration**: Connect with MetaMask, switch networks, view balances
- **Smart Contract Interaction**: Mint tokens, transfer tokens, view transaction history
- **Dashboard**: Real-time blockchain data, wallet activity, token metrics
- **Security**: Address validation, rate limiting, transaction confirmations
- **Responsive Design**: Modern UI with Tailwind CSS, mobile-friendly

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- MetaMask integration
- Ethers.js for blockchain interaction

### Backend
- Node.js with Express
- Web3/Ethers.js for Ethereum connection
- Rate limiting and security middleware
- RESTful API design

### Smart Contracts
- Solidity 0.8.19
- OpenZeppelin contracts
- ERC-20 token standard
- Hardhat for development and testing

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Ethereum testnet ETH (for testing)

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install Hardhat dependencies (for smart contracts)
cd ..
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration:
# - Add your Ethereum RPC URLs (Alchemy/Infura)
# - Add your private key for contract deployment
# - Add Etherscan API key for verification
```

### 3. Smart Contract Deployment

```bash
# Compile contracts
npx hardhat compile

# Deploy to testnet (Goerli/Sepolia)
npx hardhat run scripts/deploy.js --network goerli

# Run tests
npx hardhat test

# Update CONTRACT_ADDRESS in .env with deployed address
```

### 4. Start Development Servers

```bash
# Start frontend (in root directory)
npm run dev

# Start backend (in new terminal)
cd backend
npm run dev
```

## 🧪 Testing

### Smart Contract Tests
```bash
npx hardhat test
npx hardhat coverage
```

### API Tests
```bash
cd backend
npm test
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder to Netlify or Vercel
```

### Backend (Render/Heroku)
```bash
cd backend
# Push to GitHub and connect to Render/Heroku
# Set environment variables in hosting platform
```

### Smart Contracts
```bash
# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Verify on Etherscan
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "CryptoFlow Token" "CFT" "YOUR_ADDRESS"
```

## 🔧 Configuration

### Supported Networks
- Ethereum Mainnet
- Goerli Testnet
- Sepolia Testnet
- Polygon Mainnet

### Environment Variables
See `.env.example` for all required environment variables.

## 🛡️ Security Features

- Address validation before transactions
- Rate limiting on API endpoints
- Private key handling best practices
- Transaction confirmation requirements
- Pause functionality for emergencies

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" to link your MetaMask
2. **Switch Networks**: Use the profile page to switch between networks
3. **Mint Tokens**: Visit the Mint page to create new CFT tokens
4. **Transfer Tokens**: Send tokens to other Ethereum addresses
5. **View Dashboard**: Monitor your activity and token metrics

## 🔗 API Endpoints

- `GET /api/health` - Health check
- `GET /api/token/info` - Token information
- `GET /api/token/balance/:address` - Get token balance
- `POST /api/token/mint` - Mint new tokens
- `POST /api/token/transfer` - Transfer tokens
- `GET /api/transactions/:address` - Transaction history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This is a demonstration application. Always audit smart contracts before mainnet deployment and never share private keys.