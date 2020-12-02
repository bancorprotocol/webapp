import BigNumber from "bignumber.js";

const oneMillion = new BigNumber(1000000);

const zeroIfNegative = (big: BigNumber) =>
  big.isNegative() ? new BigNumber(0) : big;

export const calculateMaxStakesInternal = (
  tknReserveBalanceWei: string,
  bntReserveBalanceWei: string,
  poolTokenSupplyWei: string,
  poolTokenSystemBalanceWei: string,
  maxSystemNetworkTokenRatioPpm: string,
) => {
  const poolTokenSystemBalance = new BigNumber(poolTokenSystemBalanceWei);
  const poolTokenSupply = new BigNumber(poolTokenSupplyWei);
  const bntReserveBalance = new BigNumber(bntReserveBalanceWei);

  const maxSystemNetworkTokenRatioDec = ppmToDec(maxSystemNetworkTokenRatioPpm)

  console.log("www", maxSystemNetworkTokenRatioDec)

  // calculating the systemBNT  from system pool tokens
  const rate = bntReserveBalance.div(poolTokenSupply);
  const systemBNT = poolTokenSystemBalance.times(rate);

  // allowed BNT based on ratio cap
  const maxRatioBnt = zeroIfNegative(
    new BigNumber(maxSystemNetworkTokenRatioDec)
      .times(bntReserveBalance)
      .minus(systemBNT)
  );

  return {
    systemBNT,
    maxRatioBnt,
  }
}

export const calculateMaxStakes = (
  tknReserveBalanceWei: string,
  bntReserveBalanceWei: string,
  poolTokenSupplyWei: string,
  poolTokenSystemBalanceWei: string,
  maxSystemNetworkTokenAmount: string,
  maxSystemNetworkTokenRatioPpm: string,
  isHighTierPool: boolean
) => {

  const tknReserveBalance = new BigNumber(tknReserveBalanceWei);
  const bntReserveBalance = new BigNumber(bntReserveBalanceWei);

  const {
    systemBNT,
    maxRatioBnt,
  } = calculateMaxStakesInternal(
    tknReserveBalanceWei,
    bntReserveBalanceWei,
    poolTokenSupplyWei,
    poolTokenSystemBalanceWei,
    maxSystemNetworkTokenRatioPpm
  )

  // allowed BNT based on limit cap
  const maxLimitBnt = zeroIfNegative(
    new BigNumber(maxSystemNetworkTokenAmount).minus(systemBNT)
  );

  const lowestAmount = isHighTierPool
    ? maxLimitBnt
    : BigNumber.min(maxLimitBnt, maxRatioBnt);

  const maxAllowedBntInTkn = lowestAmount.times(
    tknReserveBalance.div(bntReserveBalance)
  );

  const maxAllowedBnt = systemBNT;

  return {
    maxAllowedBntWei: maxAllowedBnt.toString(),
    maxAllowedTknWei: maxAllowedBntInTkn.toString()
  };
};

export const calculatePositionFees = (
  originalPoolTokenAmount: string,
  currentPoolTokenSupply: string,
  depositedAmount: string,
  depositedReserveCurrentBalance: string,
  opposingDepositedReserveCurrentBalance: string,
  reserveRate: string
): string => {
  const currentReserveToPoolBalanceRate = new BigNumber(
    depositedReserveCurrentBalance
  ).div(currentPoolTokenSupply);

  const amount1 = new BigNumber(originalPoolTokenAmount)
    .times(currentReserveToPoolBalanceRate)
    .times(2);
  const amount0 = new BigNumber(depositedAmount);

  const rate0 = new BigNumber(reserveRate);
  const rate1 = new BigNumber(opposingDepositedReserveCurrentBalance).div(
    depositedReserveCurrentBalance
  );

  const rateDiv = rate1.div(rate0);
  const result = rateDiv.sqrt().times(amount1).minus(amount0);

  if (result.lte(0)) return "0";
  else return result.toFixed(0);
};

export const decToPpm = (dec: number | string): string =>
  new BigNumber(dec).times(oneMillion).toFixed(0)

export const ppmToDec = (ppm: number | string): number =>
  new BigNumber(ppm).dividedBy(oneMillion).toNumber();

export const miningBntReward = (protectedBnt: string, highCap: boolean) => {
  const baseNumber = "14000000000000000000000";
  const magicalNumber = highCap ? baseNumber + "0" : baseNumber;

  return new BigNumber(magicalNumber)
    .multipliedBy(52)
    .dividedBy(protectedBnt)
    .toNumber();
};

export const miningTknReward = (
  tknReserveBalance: string,
  bntReserveBalance: string,
  protectedTkn: string,
  highCap: boolean
) => {
  const baseNumber = "6000000000000000000000";
  const magicalNumber = highCap ? baseNumber + "0" : baseNumber;
  return new BigNumber(
    new BigNumber(magicalNumber)
      .multipliedBy(tknReserveBalance)
      .dividedBy(bntReserveBalance)
      .multipliedBy(52)
      .dividedBy(protectedTkn)
  ).toNumber();
};

export const expandToken = (amount: string | number, precision: number) => {
  const trimmed = new BigNumber(amount).toFixed(precision, 1);
  const inWei = new BigNumber(trimmed)
    .times(new BigNumber(10).pow(precision))
    .toFixed(0);
  return inWei;
};

export const calculatePriceDeviationTooHigh = (
  averageRate: BigNumber,
  primaryReserveBalance: BigNumber,
  secondaryReserveBalance: BigNumber,
  averageRateMaxDeviation: BigNumber
): boolean => {
  const spotRate = primaryReserveBalance.dividedBy(secondaryReserveBalance);

  const averageRateMaxDeviationBase = new BigNumber(oneMillion).minus(
    averageRateMaxDeviation
  );

  const threshold = averageRate.dividedBy(spotRate);

  const withinLowerThreshold = threshold.isGreaterThan(
    averageRateMaxDeviationBase.dividedBy(oneMillion)
  );

  const withinHigherThreshold = oneMillion
    .dividedBy(averageRateMaxDeviationBase)
    .isGreaterThan(threshold);

  const priceDeviationTooHigh = !(
    withinLowerThreshold && withinHigherThreshold
  );

  return priceDeviationTooHigh;
};
