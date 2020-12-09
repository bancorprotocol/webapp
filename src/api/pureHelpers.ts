import { ViewGroupedPositions, ViewProtectedLiquidity } from "@/types/bancor";
import BigNumber from "bignumber.js";
import sort from "fast-sort";

const oneMillion = new BigNumber(1000000);

const zeroIfNegative = (big: BigNumber) =>
  big.isNegative() ? new BigNumber(0) : big;

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

export const groupPositionsArray = (
  arr: ViewProtectedLiquidity[]
): ViewGroupedPositions[] => {
  return arr.reduce(
    (obj => (acc: ViewGroupedPositions[], val: ViewProtectedLiquidity) => {
      const symbol = val.stake.symbol;
      const poolId = val.stake.poolId;
      const id = `${poolId}-${symbol}`;
      const filtered = arr.filter(
        x => x.stake.poolId === poolId && x.stake.symbol === symbol
      );
      let item: ViewGroupedPositions = obj.get(id);
      if (!item) {
        //@ts-ignore
        item = new Object({});
        item.collapsedData = [];
        item.id = id;
        item.positionId = val.id;
        item.poolId = poolId;
        item.symbol = symbol;
        item.apr = val.apr;
        item.insuranceStart = val.insuranceStart;
        item.coverageDecPercent = val.coverageDecPercent;
        item.fullCoverage = val.fullCoverage;

        const sumStakeAmount = filtered
          .map(x => Number(x.stake.amount || 0))
          .reduce((sum, current) => sum + current);
        const sumStakeUsd = filtered
          .map(x => Number(x.stake.usdValue || 0))
          .reduce((sum, current) => sum + current);

        const sumProtectedValueAmount = filtered
          .map(x => Number(x.fullyProtected ? x.fullyProtected.amount : 0))
          .reduce((sum, current) => sum + current);
        const sumProtectedValueUsd = filtered
          .map(x => Number(x.fullyProtected ? x.fullyProtected.usdValue : 0))
          .reduce((sum, current) => sum + current);

        const sumProtectedAmount = filtered
          .map(x => Number(x.protectedAmount ? x.protectedAmount.amount : 0))
          .reduce((sum, current) => sum + current);
        const sumProtectedAmountUsd = filtered
          .map(x => Number(x.protectedAmount ? x.protectedAmount.usdValue : 0))
          .reduce((sum, current) => sum + current);
        const sumFees = filtered
          .map(x => Number(x.fees ? x.fees.amount : 0))
          .reduce((sum, current) => sum + current);

        item.stake = {
          amount: sumStakeAmount,
          usdValue: sumStakeUsd,
          unixTime: val.stake.unixTime
        };
        item.fullyProtected = {
          amount: sumProtectedValueAmount,
          usdValue: sumProtectedValueUsd
        };
        item.protectedAmount = {
          amount: sumProtectedAmount,
          usdValue: sumProtectedAmountUsd
        };
        item.roi = (sumProtectedValueAmount - sumStakeAmount) / sumStakeAmount;
        item.fees = sumFees;

        obj.set(id, item);
        acc.push(item);
      }
      if (item.insuranceStart > val.insuranceStart) {
        item.insuranceStart = val.insuranceStart;
        item.coverageDecPercent = val.coverageDecPercent;
        item.fullCoverage = val.fullCoverage;
        item.stake.unixTime = val.stake.unixTime;
      }
      if (filtered.length > 1) {
        item.collapsedData.push(val);
        item.collapsedData = sort(item.collapsedData).desc(
          (p: ViewProtectedLiquidity) => p.stake.unixTime
        );
      }
      return acc;
    })(new Map()),
    []
  );
};

export const decToPpm = (dec: number | string): string =>
  new BigNumber(dec).times(oneMillion).toFixed(0);

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
