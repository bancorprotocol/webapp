import BigNumber from "bignumber.js";

export const calculatePositionFees = (
  originalPoolTokenAmount: string,
  currentPoolTokenSupply: string,
  depositedAmount: string,
  depositedReserveCurrentBalance: string,
  opposingDepositedReserveCurrentBalance: string,
  reserveRate: string
) => {
  const currentReserveToPoolBalanceRate = new BigNumber(
    depositedReserveCurrentBalance
  ).div(currentPoolTokenSupply);

  const amount1 = new BigNumber(originalPoolTokenAmount).times(
    currentReserveToPoolBalanceRate
  );
  const amount0 = new BigNumber(depositedAmount);

  const rate0 = new BigNumber(reserveRate);
  const rate1 = new BigNumber(opposingDepositedReserveCurrentBalance).div(
    depositedReserveCurrentBalance
  );

  const randomRate = rate1.div(rate0);
  const feePercent = amount1
    .div(amount0)
    .times(randomRate)
    .sqrt()
    .minus(1);

  const feeAmount = new BigNumber(depositedAmount).times(feePercent);

  const result = feeAmount.toFixed(0);

  return result;
};
