import BigNumber from "bignumber.js";
import { isAddress } from "web3-utils";
import { web3 } from "@/api/web3";

const addZeros = (numberOfZeros: number, noLeadingZeros: string) => {
  const zeros = [...Array(numberOfZeros)].map(() => "0");
  const res = ["0", "x", ...zeros, ...noLeadingZeros.split("").slice(2)].join(
    ""
  );
  return res;
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
  if (!Number.isInteger(precision))
    throw new Error(
      `Must be passed integer to shrink token, received ${precision}`
    );
  const res = new BigNumber(amount)
    .div(new BigNumber(10).pow(precision))
    .toFixed(precision, BigNumber.ROUND_DOWN);

  return chopZeros ? new BigNumber(res).toString() : res;
};

export const makeBatchRequest = (calls: any[], from: string) => {
  const batch = new web3.BatchRequest();
  const promises = calls.map(
    call =>
      new Promise((resolve, reject) => {
        const request = call.request({ from }, (error: any, data: any) => {
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
