import BigNumber from "bignumber.js";
import { compareString, findOrThrow, web3 } from "@/api/helpers";
import { isAddress } from "web3-utils";
import { WeiExtendedAsset } from "@/types/bancor";

export const expandToken = (amount: string | number, precision: number) =>
  new BigNumber(amount).times(new BigNumber(10).pow(precision)).toFixed(0);

const addZeros = (numberOfZeros: number, noLeadingZeros: string) => {
  const zeros = [...Array(numberOfZeros)].map(() => "0");
  const res = ["0", "x", ...zeros, ...noLeadingZeros.split("").slice(2)].join(
    ""
  );
  return res;
};

export const calculateHistoricPoolBalanceByConversions = (
  currentReserveBalances: WeiExtendedAsset[],
  conversionEvents: { from: WeiExtendedAsset; to: WeiExtendedAsset }[]
) => {
  return conversionEvents.reduce((acc, item) => {
    const fromBalance = findOrThrow(
      acc,
      balance => compareString(balance.contract, item.from.contract),
      "failed to find from token in reserve balances"
    );
    const toBalance = findOrThrow(
      acc,
      balance => compareString(balance.contract, item.to.contract),
      "failed to find to token in reserve balances"
    );

    const newFromBalanceWei = new BigNumber(fromBalance.weiAmount)
      .minus(item.from.weiAmount)
      .toString();
    const newToBalanceWei = new BigNumber(toBalance.weiAmount)
      .plus(item.to.weiAmount)
      .toString();

    return [
      {
        contract: fromBalance.contract,
        weiAmount: newFromBalanceWei
      },
      {
        contract: toBalance.contract,
        weiAmount: newToBalanceWei
      }
    ] as WeiExtendedAsset[];
  }, currentReserveBalances);
};

export const removeLeadingZeros = (hexString: string) => {
  const removedOx = hexString.startsWith("0x") ? hexString.slice(2) : hexString;

  const noLeadingZeros =
    "0x" + removedOx.slice(removedOx.split("").findIndex(x => x !== "0"));

  const attempts = [...Array(60)].map((_, index) => index);

  const correctAttemptNumber = attempts.find(attemptNumber => {
    const result = addZeros(attemptNumber, noLeadingZeros);
    return isAddress(result);
  });

  if (typeof correctAttemptNumber !== "undefined") {
    return addZeros(correctAttemptNumber, noLeadingZeros);
  } else throw new Error(`Failed parsing hex ${hexString}`);
};

export const shrinkToken = (
  amount: string | number,
  precision: number,
  chopZeros = false
) => {
  const res = new BigNumber(amount)
    .div(new BigNumber(10).pow(precision))
    .toFixed(precision);

  return chopZeros ? new BigNumber(res).toString() : res;
};

export const makeBatchRequest = (calls: any[], from: string) => {
  let batch = new web3.BatchRequest();
  let promises = calls.map(
    call =>
      new Promise((resolve, reject) => {
        let request = call.request({ from }, (error: any, data: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
        batch.add(request);
      })
  );

  batch.execute();

  return Promise.all(promises);
};

export interface TokenSymbol {
  contract: string;
  symbol: string;
}

export interface BaseRelay {
  contract: string;
  smartToken: TokenSymbol;
}

export interface DryRelay extends BaseRelay {
  reserves: TokenSymbol[];
}

export interface MinimalRelay {
  contract: string;
  anchorAddress: string;
  reserves: TokenSymbol[];
}

export const generateEthPath = (from: string, relays: MinimalRelay[]) =>
  relays.reduce<{ lastSymbol: string; path: string[] }>(
    (acc, item) => {
      const destinationSymbol = item.reserves.find(
        reserve => reserve.symbol !== acc.lastSymbol
      )!;
      return {
        path: [...acc.path, item.anchorAddress, destinationSymbol.contract],
        lastSymbol: destinationSymbol.symbol
      };
    },
    {
      lastSymbol: from,
      path: [
        relays[0].reserves.find(reserve => reserve.symbol == from)!.contract
      ]
    }
  ).path;
