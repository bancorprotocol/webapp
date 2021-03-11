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

export interface RfqOrderJson {
  maker: string;
  taker: string;
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  txOrigin: string;
  pool: string;
  expiry: number;
  salt: string;
  chainId: number; // Ethereum Chain Id where the transaction is submitted.
  verifyingContract: string; // Address of the contract where the transaction should be sent.
  signature: Signature;
}

export interface InfoResponse {
  result: Result;
  message: string;
}

export interface Result {
  orderDetails: OrderDetails;
  tokenList: TokenList;
  recommendedMinTradeAmounts: RecommendedMinTradeAmounts;
}

export interface OrderDetails {
  verifyingContract: string;
  chainId: number;
  txOrigin: string;
  taker: string;
  pool: string;
}

export interface RecommendedMinTradeAmounts {
  TODO: number;
}

export interface TokenList {
  keywords: string[];
  logoURI: string;
  name: string;
  timestamp: string;
  tokens: Token[];
  version: Version;
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

const getInfo = async () => {
  const res = await axios.get<InfoResponse>(`${baseUrl}/info`);
  return res.data;
};

export const getTxOrigin = async (): Promise<string> => {
  const res = await getInfo();
  return res.result.orderDetails.txOrigin;
};

export const sendOrder = async (rfqOrder: RfqOrderJson[]) => {
  const url = `${baseUrl}/orders`;
  const res = await axios.post(url, rfqOrder);
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

const goodOrder2 = [
  {
    signature: {
      r: "0xdc74f3f8160b4b593ed2509b43cf3e79ec328b8b58f42927ce38775bfde54ff7",
      s: "0x533520e294134c9b1ac8dea446b062a78a729527f8f0c964532a8549059be11f",
      v: 28,
      signatureType: 2
    },
    makerToken: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
    takerToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    txOrigin: "0xbd49a97300e10325c78d6b4ec864af31623bb5dd",
    maker: "0xcf057a4ce6d27da5f0320d4e2a5b3deaf608971c",
    taker: "0x0000000000000000000000000000000000000000",
    makerAmount: "1189",
    takerAmount: "8117",
    pool: "0x000000000000000000000000000000000000000000000000000000000000002d",
    expiry: 1614900836,
    salt: "1614900236158000",
    chainId: 1,
    verifyingContract: "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
  }
];

const goodOrder = [
  {
    signature: {
      r: "0x2aedeb89457c5d9915d7e73d5007b50942b9a9d22438626108fe5e01e38352df",
      s: "0x2bc729fd6ac1ec80d9e4db3a05ff7d051db98573f3425e5a9768e5197b94241d",
      v: 28,
      signatureType: 2
    },
    makerToken: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
    takerToken: "0x960b236a07cf122663c4303350609a66a7b288c0",
    txOrigin: "0xbd49a97300e10325c78d6b4ec864af31623bb5dd",
    maker: "0xcf057a4ce6d27da5f0320d4e2a5b3deaf608971c",
    taker: "0x0000000000000000000000000000000000000000",
    makerAmount: "1189",
    takerAmount: "1224",
    pool: "0x000000000000000000000000000000000000000000000000000000000000002d",
    expiry: 1614843241,
    salt: "1614842641777000",
    chainId: 1,
    verifyingContract: "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
  }
];

const badOrder = [
  {
    maker: "0xcf057a4ce6d27da5f0320d4e2a5b3deaf608971c",
    taker: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    expiry: 1614846687,
    makerAmount: "10000000000000000",
    makerToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    pool: "0x0000000000000000000000000000000000000000000000000000000000000000",
    salt: "186997492765405",
    signature: {
      r: "0xea242b883479a61c7c080f6aacf72bf76641849d5ef0a1c04911e39e613cbd39",
      s: "0x64435bf855400988420c86538a9bf7e0a562ad2569dc5d54fe3e005896446ec8",
      v: 27,
      signatureType: 2
    },
    takerAmount: "200000000000000000",
    takerToken: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
    txOrigin: "0x0000000000000000000000000000000000000000",
    verifyingContract: "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
  }
];
