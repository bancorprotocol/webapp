import {
  ABIDynamicRelay,
  RawABIDynamicRelay,
  StaticRelay
} from "@/store/modules/swap/ethBancor";
import {
  ConverterAndAnchor,
  ViewGroupedPositions,
  ViewProtectedLiquidity
} from "@/types/bancor";
import BigNumber from "bignumber.js";
import { partition } from "lodash";
import { compareString } from "./helpers";
import sort from "fast-sort";
import numeral from "numeral";

const oneMillion = new BigNumber(1000000);

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

export const staticToConverterAndAnchor = (
  staticRelay: StaticRelay
): ConverterAndAnchor => ({
  converterAddress: staticRelay.converterAddress,
  anchorAddress: staticRelay.poolToken.contract
});

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

export const prettifyNumber = (
  num: number | string | BigNumber,
  usd = false
): string => {
  const bigNum = new BigNumber(num);
  if (usd) {
    if (bigNum.lte(0)) return "$0.00";
    else if (bigNum.lt(0.01)) return "< $0.01";
    else if (bigNum.gt(100)) return numeral(bigNum).format("$0,0");
    else return numeral(bigNum).format("$0,0.00");
  } else {
    if (bigNum.lte(0)) return "0";
    else if (bigNum.gte(2)) return numeral(bigNum).format("0,0.[00]");
    else if (bigNum.lt(0.000001)) return "< 0.000001";
    else return numeral(bigNum).format("0.[000000]");
  }
};

// export const prettifyNumber = (num: number | string, usd = false): string => {
//   const roundDown = (num: number, places: number): number => {
//     const string = num.toString();
//     const number = string.split(".")[0];
//     const decimals = string.split(".")[1];
//     if (!decimals || !places) return Number(number);
//     else {
//       const result = number + "." + decimals.substr(0, places);
//       return Number(result);
//     }
//   };
//
//   const addCommaSeparator = (num: number, per = 3) => {
//     const string = num.toString();
//     const number = string.split(".")[0];
//     const decimal = string.split(".")[1];
//     let aComma = "";
//     if (number.length > per) {
//       let j = 0;
//       for (let i = number.length - 1; i >= 0; i--) {
//         aComma = number.charAt(i) + aComma;
//         j++;
//         if (j == per && i != 0) {
//           aComma = "," + aComma;
//           j = 0;
//         }
//       }
//     } else {
//       aComma = number;
//     }
//     return aComma + (decimal ? `.${decimal}` : "");
//   };
//
//   const number = Number(num);
//   if (isNaN(number)) return "N/A";
//
//   let result = 0;
//   if (usd) {
//     if (number === 0) return "$0";
//     else if (number < 0.01) return "< $0.01";
//     else if (number >= 100) result = Number(number.toFixed(0));
//     else result = Number(number.toFixed(2));
//     return "$" + addCommaSeparator(result);
//   } else {
//     if (number === 0) return "0";
//     else if (number < 0.000001) return "< 0.000001";
//     else if (number >= 2) result = Number(number.toFixed(2));
//     else result = Number(number.toFixed(6));
//     return addCommaSeparator(result);
//   }
// };

export const calculateLimits = (
  poolLimitWei: string,
  defaultLimitWei: string,
  mintedWei: string,
  tknReserveBalance: string,
  bntReserveBalance: string
) => {
  const limitOrDefault = new BigNumber(
    poolLimitWei !== "0" ? poolLimitWei : defaultLimitWei
  );
  const tknDelta = limitOrDefault.minus(mintedWei);
  const bntRate = new BigNumber(tknReserveBalance).dividedBy(
    new BigNumber(bntReserveBalance)
  );

  let tknLimitWei = bntRate.multipliedBy(tknDelta);

  // add some buffer to avoid tx fails
  tknLimitWei = tknLimitWei.multipliedBy(
    new BigNumber("99.9").dividedBy("100")
  );

  console.log(
    "limits",
    "limitOrDefault",
    limitOrDefault.toString(),
    "mintedWei",
    mintedWei.toString(),
    "bntRate",
    bntRate.toString(),
    "tknDelta",
    tknDelta.toString(),
    "tknLimitWei",
    tknLimitWei.toString()
  );

  return { bntLimitWei: mintedWei, tknLimitWei };
};
