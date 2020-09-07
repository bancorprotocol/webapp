import BigNumber from "bignumber.js";
import { web3 } from "@/api/helpers";
import { isAddress } from "web3-utils";

export const expandToken = (amount: string | number, precision: number) =>
  new BigNumber(amount).times(new BigNumber(10).pow(precision)).toFixed(0);

export const removeLeadingZeros = (hexString: string) => {
  const withoutOx = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  const initialAttempt =
    "0x" + withoutOx.slice(withoutOx.split("").findIndex(x => x !== "0"));
  if (isAddress(initialAttempt)) return initialAttempt;
  const secondAttempt = [
    "0",
    "x",
    "0",
    ...initialAttempt.split("").slice(2)
  ].join("");
  if (isAddress(secondAttempt)) return secondAttempt;
  else throw new Error(`Failed parsing hex ${hexString}`);
};

export const shrinkToken = (amount: string | number, precision: number) =>
  new BigNumber(amount)
    .div(new BigNumber(10).pow(precision))
    .toFixed(precision);

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
