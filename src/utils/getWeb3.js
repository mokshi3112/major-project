import Web3 from 'web3';
export default function getWeb3() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new Web3(window.ethereum);
  } else if (typeof window !== 'undefined' && window.web3) {
    return new Web3(window.web3.currentProvider);
  } else {
    // fallback to Ganache local RPC
    return new Web3('http://127.0.0.1:8545');
  }
}
