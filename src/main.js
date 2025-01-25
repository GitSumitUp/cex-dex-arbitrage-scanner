require('dotenv').config();

const { getBinancePrices } = require('./services/binanceAPI');
const { getDexPrices } = require('./services/solanaDEXAPI');
const { calculateBinanceFee, calculateSolanaFee } = require('./utils/feesCalculator');
const { calculateArbitrageOpportunity } = require('./utils/arbitrageCalculator');

if (!process.env.SOLANA_RPC_URL) {
  console.error("Error: SOLANA_RPC_URL is not set in the environment variables.");
  process.exit(1);
}

if (!process.env.DOGEUSDC_MARKET_ADDRESS || !process.env.SOLUSDC_MARKET_ADDRESS) {
  console.error("Error: Market addresses for DOGE/USDC or SOL/USDC are not set in the environment variables.");
  process.exit(1);
}

const pairs = [
  { symbol: 'DOGEUSDC', dexMarketAddress: process.env.DOGEUSDC_MARKET_ADDRESS },
  { symbol: 'SOLUSDC', dexMarketAddress: process.env.SOLUSDC_MARKET_ADDRESS },
];

console.log('SOLANA_RPC_URL:', process.env.SOLANA_RPC_URL);

async function runArbitrageScanner() {
  for (const { symbol, dexMarketAddress } of pairs) {
    try {
      console.log(`\nScanning arbitrage for ${symbol}...`);
      console.log(`Using DEX Market Address: ${dexMarketAddress}`);

      const binancePriceData = await getBinancePrices(symbol);
      const dexPriceData = await getDexPrices(dexMarketAddress);

      const binancePrice = parseFloat(binancePriceData.price);
      const dexPrice = parseFloat(dexPriceData.price);

      if (isNaN(binancePrice) || isNaN(dexPrice)) {
        throw new Error(`Invalid price data for ${symbol}. Binance Price: ${binancePrice}, DEX Price: ${dexPrice}`);
      }

      const binanceFee = calculateBinanceFee(binancePrice);
      const solanaFee = calculateSolanaFee(dexPrice);

      const netProfit = calculateArbitrageOpportunity(binancePrice, dexPrice, binanceFee + solanaFee);

      if (netProfit > 0) {
        console.log(`✅ Profitable arbitrage for ${symbol}! Net Profit: $${netProfit.toFixed(2)}`);
      } else {
        console.log(`❌ No arbitrage opportunity for ${symbol}.`);
      }
    } catch (error) {
      console.error(
        `❌ Error scanning ${symbol}: ${error.message || error}\nCheck your environment variables and ensure they are correctly set.`
      );
    }
  }
}

runArbitrageScanner();
