import { authenticated$, onLogin$ } from "./auth";
import axios from "axios";
import { combineLatest, from, timer } from "rxjs";
import { pluck, share, tap } from "rxjs/operators";
import { switchMapIgnoreThrow } from "./customOperators";
import { oneMinute$ } from "./timers";

authenticated$.subscribe(x => console.log("regular joe 3", x));
onLogin$.subscribe(x => console.log(x, "regular joe 2"));

export interface KeeperTokenResponse {
  result: Result;
  message: string;
}

export interface Result {
  keywords: string[];
  logoURI: string;
  name: string;
  timestamp: string;
  tokens: Token[];
  version: Version;
}

export interface Token {
  address: string;
  chainId: number;
  decimals: number;
  symbol: string;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface OrderResponse {
  orders: OrderElement[];
  message: string;
}

export interface OrderElement {
  order: OrderOrder;
  metaData: MetaData;
}

export interface MetaData {
  orderHash: string;
  makerBalance_makerToken: number;
  makerAllowance_makerToken: number;
  status: number;
  filledAmount_takerToken: number;
  remainingFillableAmount_takerToken: number;
}

export interface OrderOrder {
  maker: string;
  taker: string;
  makerAmount: string;
  takerAmount: string;
  makerToken: string;
  takerToken: string;
  salt: string;
  expiry: string;
  chainId: number;
  txOrigin: string;
  pool: string;
  verifyingContract: string;
  signature: Signature;
}

export interface Signature {
  signatureType: number;
  v: number;
  r: string;
  s: string;
}

const baseUrl: string = "https://hidingbook.keeperdao.com/api/v1";

const getTokenList = async () => {
  const res = await axios.get<KeeperTokenResponse>(`${baseUrl}/tokenList`);

  return res.data;
};

const getOrders = async (currentUser: string) => {
  console.log("orders callled", currentUser);
  const res = await axios.get<OrderResponse>(
    `${baseUrl}/orders?maker=${currentUser}`
  );
  return res.data;
};

export const keeperTokens$ = oneMinute$.pipe(
  switchMapIgnoreThrow(() => getTokenList()),
  pluck("result"),
  pluck("tokens"),
  share()
);

export const limitOrders$ = combineLatest([onLogin$, oneMinute$]).pipe(
  switchMapIgnoreThrow(([currentUser]) => getOrders(currentUser)),
  pluck("orders")
);
