function calculateBinanceFee(amount, feePercentage = 0.001) {
  if (amount <= 0) throw new Error('Amount must be greater than zero.');
  return amount * feePercentage;
}

function calculateSolanaFee(amount, swapFeePercentage = 0.003, networkCost = 0.00001) {
  if (amount <= 0) throw new Error('Amount must be greater than zero.');
  return amount * swapFeePercentage + networkCost;
}

module.exports = { calculateBinanceFee, calculateSolanaFee };
