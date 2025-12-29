const HDWalletProvider = require('@truffle/hdwallet-provider');
const MNEMONIC = 'rhythm excuse judge rebuild frost code surge month horror isolate wool brain';

module.exports = {
  contracts_directory: "./src/Contracts",
  contracts_build_directory: "./build/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "1337" // Updated from 5777 to match Ganache
    }
  },
  compilers: {
    solc: {
      version: "0.5.16" // Match Truffle's default Solidity version
    }
  }
};