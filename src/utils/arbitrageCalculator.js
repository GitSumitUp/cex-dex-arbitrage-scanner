function calculateArbitrageOpportunity(cexPrice, dexPrice, fees) {
  if (cexPrice <= 0 || dexPrice <= 0) throw new Error('Prices must be greater than zero.');
  const priceDifference = dexPrice - cexPrice;
  const netProfit = priceDifference - fees;

  return {
    priceDifference,
    fees,
    netProfit,
    isProfitable: netProfit > 0,
  };
}

module.exports = { calculateArbitrageOpportunity };
