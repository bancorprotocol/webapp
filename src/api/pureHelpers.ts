import { StaticRelay } from "@/store/modules/swap/ethBancor";
import { ConverterAndAnchor } from "@/types/bancor";
import BigNumber from "bignumber.js";
import { compareString } from "./helpers";

const oneMillion = new BigNumber(1000000);

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

  const rateDiv = rate1.div(rate0);
  const result = rateDiv.sqrt().times(amount1).minus(amount0).times(-1);

  return result.toFixed(0);
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
