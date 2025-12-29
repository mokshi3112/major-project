# 🚀 How to Run Academic Verification System

This guide will help you set up and run the Academic Verification System using blockchain technology on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MetaMask Browser Extension** - [Install here](https://metamask.io/)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/mokshi3112/major-project.git
cd major-project
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React Router
- Web3.js for blockchain interaction
- Truffle for smart contract deployment
- Ganache for local blockchain
- And other dependencies

## 🏃‍♂️ Running the Project

### Step 1: Start Ganache (Local Blockchain)

Open a terminal and run:

```bash
npx ganache-cli
```

**Important Notes:**
- Ganache will start a local blockchain at `http://127.0.0.1:8545`
- Keep this terminal window open while working with the application
- You'll see 10 test accounts with private keys - save these for MetaMask setup

### Step 2: Deploy Smart Contracts

Open a **new terminal** (keep Ganache running) and run:

```bash
npx truffle migrate --reset
```

This command will:
- Compile the Solidity smart contracts
- Deploy them to your local Ganache blockchain
- Generate ABI files in the `build/contracts/` directory

### Step 3: Start the React Application

In the same terminal (or a new one), run:

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 🦊 MetaMask Configuration

### 1. Add Ganache Network to MetaMask

1. Open MetaMask extension
2. Click on the network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter the following details:
   - **Network Name:** Ganache Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** ETH
5. Click "Save"

### 2. Import Test Account

1. In MetaMask, click on the account icon → "Import Account"
2. Copy one of the private keys from the Ganache terminal output
3. Paste it into MetaMask
4. Click "Import"

Now you have a test account with ETH to interact with the application!

## 🎯 Using the Application

### For Students:
1. Connect MetaMask wallet
2. Register as a new user
3. Fill in your academic details
4. Upload certificates for verification
5. View your verified credentials

### For Organizations/Endorsers:
1. Connect MetaMask wallet
2. Register as an endorser
3. Review student verification requests
4. Approve or reject certificates
5. Issue verified credentials

### For Verifiers:
1. Enter student's transaction ID or unique hash
2. View all verified certificates
3. Verify authenticity of credentials

## 🛠️ Troubleshooting

### Issue: "Cannot connect to blockchain"
**Solution:** Ensure Ganache is running on `http://127.0.0.1:8545` and MetaMask is connected to the correct network.

### Issue: "Transaction failed"
**Solution:** 
- Check if you have enough ETH in your MetaMask account
- Try resetting your MetaMask account: Settings → Advanced → Reset Account

### Issue: "Contract not deployed"
**Solution:** Run `npx truffle migrate --reset` again to redeploy contracts.

### Issue: "npm install fails"
**Solution:** 
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- If issues persist, try `npm install --legacy-peer-deps`

### Issue: Port 3000 already in use
**Solution:** 
- Kill the process using port 3000, or
- Set a different port: `PORT=3001 npm start` (Linux/Mac) or `set PORT=3001 && npm start` (Windows)

## 📁 Project Structure

```
academic-verify/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── abis/           # Smart contract ABIs
│   └── App.js          # Main application
├── migrations/         # Truffle migration scripts
├── truffle-config.js   # Truffle configuration
├── package.json        # Dependencies
└── .env               # Environment variables
```

## 🔐 Environment Variables

The project uses a `.env` file with the following variables:

```
DISABLE_NEW_JSX_TRANSFORM=true
SKIP_PREFLIGHT_CHECK=true
```

These are already configured in the repository.

## 📝 Available Scripts

- `npm start` - Runs the React development server
- `npm run build` - Builds the app for production
- `npm test` - Runs tests
- `npx ganache-cli` - Starts local blockchain
- `npx truffle migrate` - Deploys smart contracts
- `npx truffle compile` - Compiles smart contracts

## 🌐 Production Deployment

For deploying to a testnet or mainnet:

1. Update `truffle-config.js` with network configuration
2. Set up environment variables for network credentials
3. Run `npx truffle migrate --network <network-name>`
4. Build the React app: `npm run build`
5. Deploy the `build` folder to your hosting service

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Ensure all prerequisites are properly installed
4. Check that all terminals are running the required processes

## 🎉 Success!

If everything is set up correctly, you should see:
- ✅ Ganache running with 10 test accounts
- ✅ Smart contracts deployed successfully
- ✅ React app running on `http://localhost:3000`
- ✅ MetaMask connected to Ganache network

Happy coding! 🚀
