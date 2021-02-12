import { Decimal } from "decimal.js";
import { Asset, asset_to_number, Sym as Symbol, Sym, asset } from "eos-common";
import _, { chunk } from "lodash";
import { compareString, StringPool } from "../helpers";

export type EosAccount = string;

export interface TokenSymbol {
  contract: EosAccount;
  symbol: Symbol;
}

export interface BaseRelay {
  contract: EosAccount;
  smartToken: TokenSymbol;
  isMultiContract: boolean;
}

export interface DryRelay extends BaseRelay {
  reserves: TokenSymbol[];
}

export interface v1Relay extends DryRelay {
  isMultiContract: false;
}

export interface HydratedRelay extends BaseRelay {
  reserves: TokenAmount[];
  fee: number;
}

export interface TokenAmount {
  contract: EosAccount;
  amount: Asset;
}

export interface ConvertPath {
  account: string;
  symbol: string;
  multiContractSymbol?: string;
}

export interface ChoppedRelay {
  contract: string;
  reserves: TokenSymbol[];
}

export function calculateReturn(
  balanceFrom: Asset,
  balanceTo: Asset,
  amount: Asset
) {
  if (!balanceFrom.symbol.isEqual(amount.symbol))
    throw new Error("From symbol does not match amount symbol");
  if (amount.amount >= balanceFrom.amount)
    throw new Error("Impossible to buy the entire reserve or more");

  Decimal.set({ precision: 15, rounding: Decimal.ROUND_DOWN });
  const balanceFromNumber = new Decimal(asset_to_number(balanceFrom));
  const balanceToNumber = new Decimal(asset_to_number(balanceTo));
  const amountNumber = new Decimal(asset_to_number(amount));

  const reward = amountNumber
    .div(balanceFromNumber.plus(amountNumber))
    .times(balanceToNumber);

  const rewardAsset = new Asset(
    reward
      .times(Math.pow(10, balanceTo.symbol.precision()))
      .toDecimalPlaces(0, Decimal.ROUND_DOWN)
      .toNumber(),
    balanceTo.symbol
  );
  const slippage = asset_to_number(amount) / asset_to_number(balanceFrom);

  return { reward: rewardAsset, slippage };
}

export function calculateCost(
  balanceFrom: Asset,
  balanceTo: Asset,
  amountDesired: Asset
) {
  if (!balanceTo.symbol.isEqual(amountDesired.symbol))
    throw new Error("From symbol does not match amount symbol");
  if (amountDesired.amount >= balanceTo.amount)
    throw new Error("Impossible to buy the entire reserve or more");
  const balanceFromNumber = new Decimal(asset_to_number(balanceFrom));
  const balanceToNumber = new Decimal(asset_to_number(balanceTo));
  const amountNumber = new Decimal(asset_to_number(amountDesired));
  const oneNumber = new Decimal(1);

  Decimal.set({ precision: 15, rounding: Decimal.ROUND_UP });
  const reward = balanceFromNumber
    .div(oneNumber.minus(amountNumber.div(balanceToNumber)))
    .minus(balanceFromNumber);

  const rewardAsset = new Asset(
    reward
      .times(Math.pow(10, balanceFrom.symbol.precision()))
      .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
      .toNumber(),
    balanceFrom.symbol
  );
  const slippage = asset_to_number(amountDesired) / asset_to_number(balanceTo);

  return { reward: rewardAsset, slippage };
}

export function concatAffiliate(
  memo: string,
  affiliateAccount: string,
  percentNumber: number | string
) {
  return memo.concat(`,${affiliateAccount},${percentNumber}`);
}

export function composeMemo(
  converters: ConvertPath[],
  minReturn: string,
  destAccount: string,
  version = 1,
  feeAccount?: string,
  feePercent?: number
): string {
  const receiver = converters
    .map(({ account, symbol, multiContractSymbol }) => {
      return `${account}${
        multiContractSymbol ? `:${multiContractSymbol}` : ""
      } ${symbol}`;
    })
    .join(" ");

  const base = `${version},${receiver},${minReturn},${destAccount}`;
  if (feeAccount && feePercent) {
    return concatAffiliate(base, feeAccount, feePercent);
  }
  return base;
}

export function poolsInMemo(receiver: string): StringPool[] {
  const splitted = chunk(receiver.split(" "), 2).map(([pool, destSymbol]) => {
    const isMultiContract = pool.includes(":");
    if (isMultiContract) {
      const [multiContract, poolSymbol] = pool.split(":");
      return {
        pool: multiContract,
        poolToken: poolSymbol,
        destSymbol
      };
    } else {
      return {
        pool,
        destSymbol
      };
    }
  });
  return splitted;
}

export function parseTransferMemo(memo: string) {
  const [version, receiver, minReturn, destAccount] = memo.split(",");
  const pools = poolsInMemo(receiver);
  return {
    version,
    pools,
    minReturn,
    destAccount
  };
}

export function relaysToConvertPaths(
  from: Symbol,
  relays: DryRelay[]
): ConvertPath[] {
  return relays
    .map(relay =>
      relay.reserves.map(token => {
        const base = {
          account: relay.contract,
          symbol: token.symbol.code().to_string()
        };
        return relay.isMultiContract
          ? {
              ...base,
              multiContractSymbol: relay.smartToken.symbol.code().to_string()
            }
          : base;
      })
    )
    .reduce((prev, curr) => prev.concat(curr))
    .filter(converter => converter.symbol !== from.code().to_string())
    .reduce((accum: ConvertPath[], item: ConvertPath) => {
      return accum.find(
        (converter: ConvertPath) => converter.symbol == item.symbol
      )
        ? accum
        : [...accum, item];
    }, []);
}

const tokenToSymbolName = (token: TokenSymbol) =>
  token.symbol.code().to_string();
const symbolToSymbolName = (symbol: Sym) => symbol.code().to_string();

export function relayHasBothSymbols(
  symbol1: Symbol,
  symbol2: Symbol
): (choppedRelay: ChoppedRelay) => boolean {
  return function (relay: ChoppedRelay) {
    return relay.reserves.every(
      token =>
        tokenToSymbolName(token) == symbolToSymbolName(symbol1) ||
        tokenToSymbolName(token) == symbolToSymbolName(symbol2)
    );
  };
}

const zip = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length)
    throw new Error("These arrays aren't the same");
  return arr1.map((item, index) => [item, arr2[index]]);
};

const reservesAreSame = (one: TokenSymbol, two: TokenSymbol): boolean => {
  return one.contract == two.contract && one.symbol == two.symbol;
};

const relaysAreSame = (one: ChoppedRelay, two: ChoppedRelay): boolean => {
  const zippedReserves = zip(one.reserves, two.reserves);
  const matchingReserves = zippedReserves.every(([reserve, opposingReserve]) =>
    reservesAreSame(reserve, opposingReserve)
  );
  const matchingContract = one.contract == two.contract;
  return matchingContract && matchingReserves;
};

export function removeChoppedRelay(
  relays: ChoppedRelay[],
  departingRelay: ChoppedRelay
): ChoppedRelay[] {
  const res = relays.filter(relay => !relaysAreSame(relay, departingRelay));
  if (res.length + 1 !== relays.length)
    throw new Error("Failed to remove chopped relay");
  return res;
}

export const chopRelay = (item: DryRelay): ChoppedRelay[] => {
  return [
    {
      contract: item.contract,
      reserves: [item.reserves[0], item.smartToken]
    },
    {
      contract: item.contract,
      reserves: [item.reserves[1], item.smartToken]
    }
  ];
};

export const chopRelays = (relays: DryRelay[]) => {
  return relays.reduce((accum: ChoppedRelay[], item: DryRelay) => {
    const [relay1, relay2] = chopRelay(item);
    return [...accum, relay1, relay2];
  }, []);
};

function relayOffersSymbols(symbol1: Symbol, symbol2: Symbol) {
  return function (relay: DryRelay) {
    const inReserves = relay.reserves.every(
      token => token.symbol.isEqual(symbol1) || token.symbol.isEqual(symbol2)
    );
    if (inReserves) return inReserves;
    const inReserve = relay.reserves.some(
      token => token.symbol.isEqual(symbol1) || token.symbol.isEqual(symbol2)
    );
    const inSmartToken =
      relay.smartToken.symbol.isEqual(symbol1) ||
      relay.smartToken.symbol.isEqual(symbol2);
    return inReserve && inSmartToken;
  };
}

export function unChopRelays(
  choppedRelays: ChoppedRelay[],
  relays: DryRelay[]
) {
  return choppedRelays.reduce(
    (accum: DryRelay[], choppedRelay: ChoppedRelay) => {
      const relayOfInterest = relayOffersSymbols(
        choppedRelay.reserves[0].symbol,
        choppedRelay.reserves[1].symbol
      );
      const alreadyExistingRelay = accum.find(relayOfInterest);
      return alreadyExistingRelay
        ? accum
        : [...accum, relays.find(relayOfInterest)!];
    },
    []
  );
}

type Node = string;
type Edge = [string, string];
type AdjacencyList = Map<string, string[]>;

const buildAdjacencyList = (edges: Edge[], nodes: Node[]): AdjacencyList => {
  const adjacencyList = new Map();
  nodes.forEach(node => adjacencyList.set(node, []));
  edges.forEach(([from, to]) => adjacencyList.get(from).push(to));
  edges.forEach(([from, to]) => adjacencyList.get(to).push(from));
  return adjacencyList;
};

const compareEdge = (edge1: Edge, edge2: Edge) =>
  edge1.every(edge => edge2.some(e => compareString(edge, e)));

const dfs = (
  fromId: string,
  toId: string,
  adjacencyList: AdjacencyList
): Promise<string[]> =>
  new Promise(resolve => callbackDfs(fromId, toId, adjacencyList, resolve));

const callbackDfs = (
  start: string,
  goal: string,
  adjacencyList: AdjacencyList,
  callBack: (stuff: any) => void,
  visited = new Set(),
  path: string[] = [start]
) => {
  visited.add(start);
  const destinations = adjacencyList.get(start)!;
  if (destinations.includes(goal)) {
    callBack([...path, goal]);
  }
  for (const destination of destinations) {
    if (!visited.has(destination)) {
      callbackDfs(destination, goal, adjacencyList, callBack, visited, [
        ...path,
        destination
      ]);
    }
  }
};

export async function findNewPath<T>(
  fromId: string,
  toId: string,
  pools: T[],
  identifier: (pool: T) => Edge
) {
  const edges = _.uniqWith(pools.map(identifier), compareEdge);
  const nodes: Node[] = _.uniqWith(edges.flat(1), compareString);

  const adjacencyList = buildAdjacencyList(edges, nodes);
  const startExists = adjacencyList.get(fromId);
  const goalExists = adjacencyList.get(toId);

  if (!(startExists && goalExists))
    throw new Error(
      `Start ${fromId} or goal ${toId} does not exist in adjacency list`
    );

  const dfsResult = await dfs(fromId, toId, adjacencyList)!;
  if (!dfsResult || dfsResult.length == 0)
    throw new Error("Failed to find path");

  const hops = _.chunk(dfsResult, 2).map((tokenIds, index, arr) => {
    let searchAbleIds: string[];

    if (tokenIds.length < 2) {
      searchAbleIds = [arr[index - 1][1], tokenIds[0]];
    } else searchAbleIds = tokenIds;

    const accomodatingRelays = pools.filter(pool => {
      const ids = identifier(pool);
      return ids.every(id => searchAbleIds.some(i => id == i));
    });

    return accomodatingRelays;
  });

  return {
    path: dfsResult,
    hops
  };
}

export function chargeFee(
  asset: Asset,
  decimalFee: number,
  magnitude: number = 1
): Asset {
  Decimal.set({ precision: 15, rounding: Decimal.ROUND_DOWN });
  const assetAmount = new Decimal(asset_to_number(asset));
  const one = new Decimal(1);
  const totalFee = assetAmount.times(
    one.minus(Decimal.pow(one.minus(decimalFee), magnitude))
  );
  const newAmount = assetAmount.minus(totalFee);
  return new Asset(
    newAmount
      .times(Math.pow(10, asset.symbol.precision()))
      .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
      .toNumber(),
    asset.symbol
  );
}

export function addFee(
  asset: Asset,
  decimalFee: number,
  magnitude: number = 1
): Asset {
  Decimal.set({ precision: 15, rounding: Decimal.ROUND_DOWN });
  const assetAmount = new Decimal(asset_to_number(asset));
  const one = new Decimal(1);
  const totalFee = assetAmount.times(
    one.minus(Decimal.pow(one.minus(decimalFee), magnitude))
  );
  const newAmount = assetAmount.plus(totalFee);
  return new Asset(
    newAmount
      .times(Math.pow(10, asset.symbol.precision()))
      .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
      .toNumber(),
    asset.symbol
  );
}

const sortReservesByAsset = (asset: Asset, reserves: TokenAmount[]) => {
  if (!reserves.some(reserve => reserve.amount.symbol.isEqual(asset.symbol)))
    throw new Error("Asset does not exist in these reserves");
  return reserves.sort(a => (a.amount.symbol.isEqual(asset.symbol) ? -1 : 1));
};

const highestNumber = (number1: number, number2: number) =>
  number1 > number2 ? number1 : number2;

export const findReturn = (amount: Asset, relaysPath: HydratedRelay[]) =>
  relaysPath.reduce(
    ({ amount, highestSlippage }, relay) => {
      const [fromReserve, toReserve] = sortReservesByAsset(
        amount,
        relay.reserves
      );
      const { reward, slippage } = calculateReturn(
        fromReserve.amount,
        toReserve.amount,
        amount
      );
      return {
        amount: chargeFee(reward, relay.fee, 2),
        highestSlippage: highestNumber(highestSlippage, slippage)
      };
    },
    { amount, highestSlippage: 0 }
  );

export const findCost = (amount: Asset, relaysPath: HydratedRelay[]) =>
  relaysPath.reverse().reduce(
    ({ amount, highestSlippage }, relay) => {
      const [toReserve, fromReserve] = sortReservesByAsset(
        amount,
        relay.reserves
      );
      const { reward, slippage } = calculateCost(
        fromReserve.amount,
        toReserve.amount,
        amount
      );
      return {
        amount: addFee(reward, relay.fee, 2),
        highestSlippage: highestNumber(highestSlippage, slippage)
      };
    },
    { amount, highestSlippage: 0 }
  );

export function fund(
  smartTokens: Asset,
  reserveBalance: Asset,
  smartSupply: Asset
) {
  Decimal.set({ precision: 18, rounding: Decimal.ROUND_HALF_EVEN });

  const cost = new Decimal(reserveBalance.amount.toString())
    .times(smartTokens.amount.toString())
    .div(smartSupply.amount.toString());

  const assetAmount = cost.ceil().toNumber();
  return asset(assetAmount, reserveBalance.symbol);
}

export function calculateFundReturn(
  reserveTokens: Asset,
  reserveBalance: Asset,
  smartSupply: Asset
) {
  Decimal.set({ precision: 18, rounding: Decimal.ROUND_HALF_EVEN });
  const one = new Decimal(1);

  // y(s+1) + 1 / r

  const reward = new Decimal(reserveTokens.amount.toString())
    .times(new Decimal(smartSupply.amount.toString()))
    .plus(one)
    .div(reserveBalance.amount.toString());

  const rewardAmount = reward.floor().toNumber();

  return asset(rewardAmount, smartSupply.symbol);
}
