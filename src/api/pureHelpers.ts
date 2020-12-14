import {
  ABIDynamicRelay,
  RawABIDynamicRelay,
  StaticRelay
} from "@/store/modules/swap/ethBancor";
import { ConverterAndAnchor } from "@/types/bancor";
import BigNumber from "bignumber.js";
import { partition } from "lodash";
import { compareString } from "./helpers";

const oneMillion = new BigNumber(1000000);

const zeroIfNegative = (big: BigNumber) =>
  big.isNegative() ? new BigNumber(0) : big;

export const calculateMaxStakes = (
  tknReserveBalanceWei: string,
  bntReserveBalanceWei: string,
  poolTokenSupplyWei: string,
  poolTokenSystemBalanceWei: string,
  maxSystemNetworkTokenAmount: string,
  maxSystemNetworkTokenRatioPpm: string,
  isHighTierPool: boolean
) => {
  const poolTokenSystemBalance = new BigNumber(poolTokenSystemBalanceWei);
  const poolTokenSupply = new BigNumber(poolTokenSupplyWei);
  const bntReserveBalance = new BigNumber(bntReserveBalanceWei);
  const tknReserveBalance = new BigNumber(tknReserveBalanceWei);
  const maxSystemNetworkTokenRatioDec = new BigNumber(
    maxSystemNetworkTokenRatioPpm
  ).div(1000000);

  // calculating the systemBNT  from system pool tokens
  const rate = bntReserveBalance.div(poolTokenSupply);
  const systemBNT = poolTokenSystemBalance.times(rate);

  // allowed BNT based on limit cap
  const maxLimitBnt = zeroIfNegative(
    new BigNumber(maxSystemNetworkTokenAmount).minus(systemBNT)
  );

  // allowed BNT based on ratio cap
  const maxRatioBnt = zeroIfNegative(
    new BigNumber(bntReserveBalance)
      .times(maxSystemNetworkTokenRatioDec)
      .minus(systemBNT)
      .div(new BigNumber(1).minus(maxSystemNetworkTokenRatioDec))
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

export const compareStaticRelayAndSet = (
  staticRelay: StaticRelay,
  anchorAndConverter: ConverterAndAnchor
) =>
  compareString(
    staticRelay.poolToken.contract,
    anchorAndConverter.anchorAddress
  ) &&
  compareString(
    staticRelay.converterAddress,
    anchorAndConverter.converterAddress
  );

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

export const reserveContractsInStatic = (relay: StaticRelay) =>
  relay.reserves.map(reserve => reserve.contract);

export const parseRawDynamic = (
  rawDynamicRelay: RawABIDynamicRelay
): ABIDynamicRelay => {
  const {
    reserveOneAddress,
    reserveOne,
    reserveTwoAddress,
    reserveTwo
  } = rawDynamicRelay;
  const reserves = [
    [reserveOneAddress, reserveOne],
    [reserveTwoAddress, reserveTwo]
  ].map(([reserveAddress, reserveBalance]) => ({
    reserveAddress,
    reserveBalance
  }));

  return {
    connectorTokenCount: rawDynamicRelay.connectorTokenCount,
    conversionFee: rawDynamicRelay.conversionFee,
    converterAddress: rawDynamicRelay.converterAddress,
    reserves
  };
};

export const filterAndWarn = <T>(
  arr: T[],
  conditioner: (item: T) => boolean,
  reason?: string
): T[] => {
  const [passed, dropped] = partition(arr, conditioner);
  if (dropped.length > 0) {
    console.warn(
      "Dropped",
      dropped,
      "items from array",
      reason ? `because ${reason}` : ""
    );
  }
  return passed;
};
