# 🎯 Quick Demo Guide - Academic Verification System

**Project Location:** `C:\Users\ithih\.gemini\antigravity\scratch\academic-verify`

> **For Demo Tomorrow** - Follow these steps exactly in order!

---

## ✅ Before You Start

Make sure you have:
- ✅ Node.js installed (check: `node --version`)
- ✅ MetaMask browser extension installed
- ✅ **Ganache GUI app** installed and ready
- ✅ 2 terminal windows ready

---

## 🚀 Step-by-Step Demo Instructions

### Step 1: Start Ganache GUI App

1. **Open Ganache desktop application**
2. Click **"Quickstart"** (or use existing workspace)
3. Verify settings:
   - **RPC Server:** `HTTP://127.0.0.1:7545` (or 8545)
   - **Network ID:** Usually `5777` or `1337`
4. **Copy one account's private key** (click key icon 🔑 next to any account)

**What you'll see:**
- 10 accounts with 100 ETH each
- Current block number
- RPC server running

> ⚠️ **IMPORTANT:** Keep Ganache app running during the demo!

---

### Step 2: Deploy Smart Contracts

**Open Terminal 1:**

```powershell
cd C:\Users\ithih\.gemini\antigravity\scratch\academic-verify
npx truffle migrate --reset
```

**What you'll see:**
- Compiling contracts...
- Deploying contracts...
- Contract addresses
- In Ganache app, you'll see new blocks and transactions!

> ✅ Wait for "Saving successful migration to network..." message

---

### Step 3: Start React App

**Open Terminal 2:**

```powershell
cd C:\Users\ithih\.gemini\antigravity\scratch\academic-verify
npm start
```

**What you'll see:**
- Compiled successfully!
- Opens browser at `http://localhost:3000`

---

## 🦊 MetaMask Setup (One-Time)

### Step 1: Add Ganache Network

1. Open MetaMask → Click network dropdown (top)
2. Click "Add Network" → "Add a network manually"
3. Fill in (check your Ganache app for exact values):
   - **Network Name:** `Ganache Local`
   - **RPC URL:** `http://127.0.0.1:7545` (or `8545` - check Ganache app)
   - **Chain ID:** `5777` (or `1337` - check Ganache app settings)
   - **Currency Symbol:** `ETH`
4. Click "Save"

> 💡 **Tip:** In Ganache app, go to Settings (⚙️) → Server to see your RPC URL and Network ID

### Step 2: Import Test Account

1. MetaMask → Account icon → "Import Account"
2. Paste the private key you copied from Ganache app (Step 1)
3. Click "Import"

> ✅ You should now see 100 ETH in your account!

---

## 🎬 Demo Flow

### 1. **Home Page**
- Show the landing page
- Explain blockchain-based verification

### 2. **Connect Wallet**
- Click "Connect Wallet" button
- MetaMask will pop up → Click "Connect"

### 3. **Register User**
- Register as Student/Employee
- Fill in details
- Submit (transaction will be on blockchain)

### 4. **Upload Certificates**
- Add academic records
- Upload certificates
- Generate QR code for verification

### 5. **Organization/Endorser View**
- Show how organizations verify credentials
- Endorse/approve certificates

### 6. **Verification**
- Show QR code scanning
- Verify credentials using transaction ID

---

## 🛑 Troubleshooting

### Problem: "Cannot connect to blockchain"
**Fix:** Make sure Ganache GUI app is running and shows "RPC Server" as active

### Problem: "Transaction failed"
**Fix:** In MetaMask → Settings → Advanced → Reset Account

### Problem: Port 3000 already in use
**Fix:** Kill the process or use different port:
```powershell
set PORT=3001 && npm start
```

### Problem: MetaMask not connecting
**Fix:** 
1. Make sure you're on "Ganache Local" network
2. Check RPC URL is `http://127.0.0.1:8545`

---

## 📋 Quick Reference

| What | Where |
|------|-------|
| **Project Path** | `C:\Users\ithih\.gemini\antigravity\scratch\academic-verify` |
| **Frontend URL** | `http://localhost:3000` |
| **Blockchain URL** | `http://127.0.0.1:7545` (check Ganache app) |
| **Chain ID** | `5777` or `1337` (check Ganache app) |

---

## 🎯 Demo Checklist

Before the demo:
- [ ] Ganache GUI app opens and runs
- [ ] Note down RPC URL and Chain ID from Ganache
- [ ] MetaMask is configured and connected
- [ ] Test account imported with 100 ETH
- [ ] Contracts deployed successfully
- [ ] Application loads at localhost:3000
- [ ] Can connect wallet successfully

During demo:
- [ ] Show home page
- [ ] Connect MetaMask
- [ ] Register new user
- [ ] Upload certificate
- [ ] Show verification process
- [ ] Demonstrate QR code feature

---

## 💡 Pro Tips

1. **Start Ganache GUI first** - Always start blockchain before deploying contracts
2. **Watch Ganache blocks** - You'll see transactions appear in real-time during demo
3. **Keep Ganache visible** - Shows the blockchain is working live
4. **Reset if stuck** - `npx truffle migrate --reset` redeploys everything
5. **Check Ganache settings** - RPC URL and Network ID must match MetaMask
6. **Have backup** - Keep the Desktop version as backup

---

## 🆘 Emergency Reset

If everything breaks:

1. **Restart Ganache GUI app** - Close and reopen the application
2. **Redeploy contracts:**
   ```powershell
   npx truffle migrate --reset
   ```
3. **Restart React app:**
   ```powershell
   npm start
   ```
4. **Reset MetaMask:** Settings → Advanced → Reset Account

---

**Good luck with your demo! 🚀**

*Last updated: 2026-01-08*
