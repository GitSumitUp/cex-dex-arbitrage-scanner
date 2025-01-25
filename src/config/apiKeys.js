require('dotenv').config();

const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY;
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;

if (!SOLANA_RPC_URL || !(SOLANA_RPC_URL.startsWith('http://') || SOLANA_RPC_URL.startsWith('https://'))) {
  throw new Error('Invalid or undefined SOLANA_RPC_URL. Please set it in your .env file.');
}

export default { BINANCE_API_KEY, BINANCE_SECRET_KEY, SOLANA_RPC_URL };
