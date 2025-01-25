const { Connection, PublicKey } = require('@solana/web3.js');
const { Market } = require('@project-serum/serum'); 

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
if (!SOLANA_RPC_URL) {
  console.error("SOLANA_RPC_URL is not set in the environment variables.");
  process.exit(1); 
}

console.log('SOLANA_RPC_URL:', SOLANA_RPC_URL);

async function getDexPrices(marketAddress) {
  const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

  if (!marketAddress) {
    throw new Error("Market address is not provided or is invalid.");
  }

  try {
    const marketPublicKey = new PublicKey(marketAddress);

    const market = await Market.load(connection, marketPublicKey, {}, "9xQeWvG816bUx9EP7UN2Vn8kKkTH1m9g8XJm6Y8i9Jko"); // Serum program ID

    const bids = await market.loadBids(connection);
    const asks = await market.loadAsks(connection);

    const bestBid = bids.getL2(1)[0]?.[0] || 0; 
    const bestAsk = asks.getL2(1)[0]?.[0] || 0; 
    const midMarketPrice = (bestBid + bestAsk) / 2;

    console.log(`DEX Market Data for ${marketPublicKey.toString()}:`);
    console.log(`Best Bid: ${bestBid}, Best Ask: ${bestAsk}, Mid-Market Price: ${midMarketPrice}`);

    return { price: midMarketPrice }; 
  } catch (error) {

    if (error.message.includes("Market not found")) {
      console.error("Market not found. Ensure the market address is correct and the token pair exists on Serum.");
    } else {
      console.error("Error fetching Solana DEX prices:", error);
    }
    throw error;
  }
}

module.exports = { getDexPrices };
