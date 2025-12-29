    ## How to run Academic-verify locally (frontend + local blockchain)

    Prereqs:
    - Node.js v14+ and npm
    - Recommended: npx or npm available in PATH

    Steps:
    1. Install dependencies:
       ```bash
cd /mnt/data/Academic-verify-main/Academic-verify-main
npm install
```
    2. Start Ganache (local blockchain):
       ```bash
npm run ganache
```
    3. In another terminal, deploy contracts to Ganache:
       ```bash
npm run truffle:migrate
```
    4. Start the React frontend:
       ```bash
npm start
```

    Notes:
    - If Metamask is used, connect it to `http://127.0.0.1:8545` with the Ganache chain.
    - ABI files were copied into `src/abis/` from `build/contracts/`.
