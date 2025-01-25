const axios = require('axios');
const BINANCE_BASE_URL = 'https://api.binance.com';

async function getBinancePrices(symbol) {
  try {
    const response = await axios.get(`${BINANCE_BASE_URL}/api/v3/ticker/price`, {
      params: { symbol },
    });

    if (!response.data || !response.data.price) {
      throw new Error(`No price data found for symbol: ${symbol}`);
    }

    return {
      symbol: response.data.symbol,
      price: parseFloat(response.data.price),
    };
  } catch (error) {
    console.error('Error fetching Binance prices:', error.message);
    throw error;
  }
}

module.exports = { getBinancePrices };
