import axios, { AxiosResponse } from "axios";
import { vxm } from "@/store";
import { JsonRpc } from "eosjs";
import Onboard from "bnc-onboard";
import { Asset, number_to_asset, Sym } from "eos-common";
import { rpc } from "./eos/rpc";
import {
  BaseToken,
  EosMultiRelay,
  ModalChoice,
  OnUpdate,
  ReserveFeed,
  Step,
  TableItem,
  TokenBalanceParam,
  TokenBalanceReturn,
  TokenBalances,
  TokenMeta,
  ViewAmount,
  ViewRelay,
  ViewReserve,
  ViewToken
} from "@/types/bancor";
import Web3 from "web3";
import { EosTransitModule } from "@/store/modules/wallet/eosWallet";
import {
  buildConverterContract,
  buildLiquidityProtectionStoreContract
} from "./eth/contractTypes";
import { removeLeadingZeros, shrinkToken } from "./eth/helpers";
import { sortByNetworkTokens } from "./sortByNetworkTokens";
import numeral from "numeral";
import BigNumber from "bignumber.js";
import { pick, zip } from "lodash";
import dayjs from "@/utils/dayjs";
import { authenticatedReceiver$ } from "./observables/auth";
import { EthNetworks, getAlchemyUrl, getInfuraAddress, web3 } from "@/api/web3";
import { i18n } from "@/i18n";
import { Duration } from "dayjs/plugin/duration";
import { Dayjs } from "dayjs";
import { networkVersionReceiver$ } from "./observables/network";

export enum PositionType {
  single,
  double
}

export const rewindBlocksByDays = (
  currentBlock: number,
  days: number,
  secondsPerBlock = 13.3
) => {
  if (!Number.isInteger(currentBlock))
    throw new Error("Current block should be an integer");
  const secondsToRewind = dayjs.duration(days, "days").asSeconds();
  const blocksToRewind = parseInt(String(secondsToRewind / secondsPerBlock));
  return currentBlock - blocksToRewind;
};

export interface LockedBalance {
  index: number;
  amountWei: string;
  expirationTime: number;
}

export const buildRange = (count: number): number[] =>
  [...new Array(count)].map((_, index) => index);

export const traverseLockedBalances = async (
  contract: string,
  owner: string,
  expectedCount: number
): Promise<LockedBalance[]> => {
  const storeContract = buildLiquidityProtectionStoreContract(contract, web3);
  let lockedBalances: LockedBalance[] = [];

  const scopeRange = 5;
  for (let i = 0; i < 10; i++) {
    const startIndex = i * scopeRange;
    const endIndex = startIndex + scopeRange;

    const lockedBalanceRes = await storeContract.methods
      .lockedBalanceRange(owner, String(startIndex), String(endIndex))
      .call();

    const bntWeis = lockedBalanceRes["0"];
    const expirys = lockedBalanceRes["1"];

    const zipped = zip(bntWeis, expirys);
    const withIndex = zipped.map(
      ([bntWei, expiry], index) =>
        ({
          amountWei: bntWei,
          expirationTime: Number(expiry),
          index: index + startIndex
        } as LockedBalance)
    );
    lockedBalances = lockedBalances.concat(withIndex);
    if (lockedBalances.length >= expectedCount) break;
  }

  return lockedBalances;
};

export const networkTokens = ["BNT", "USDB"];

export const isOdd = (num: number) => num % 2 == 1;

interface TaskItem {
  description: string;
  task: (state?: any) => Promise<any>;
}

export const multiSteps = async ({
  items,
  onUpdate
}: {
  items: TaskItem[];
  onUpdate?: OnUpdate;
}) => {
  let state: any = {};
  for (const todo in items) {
    const steps = items.map(
      (todo, index): Step => ({
        name: String(index),
        description: todo.description
      })
    );
    if (typeof onUpdate == "function") {
      onUpdate(Number(todo), steps);
    } else if (typeof onUpdate !== "undefined") {
      throw new Error("onUpdate should be either a function or undefined");
    }

    const newState = await items[todo].task(state);
    if (typeof newState !== "undefined") {
      state = newState;
    }
  }
  return state;
};

const eosRpc: JsonRpc = rpc;

interface TraditionalStat {
  supply: Asset;
  max_supply: Asset;
}

export const findOrThrow = <T>(
  arr: readonly T[],
  iteratee: (obj: T, index: number, arr: readonly T[]) => unknown,
  message?: string
) => {
  const res = arr.find(iteratee);
  if (!res)
    throw new Error(message || "Failed to find object in find or throw");
  return res;
};

export const compareToken = (
  a: TokenBalanceParam | TokenBalanceReturn | BaseToken,
  b: TokenBalanceParam | TokenBalanceReturn | BaseToken
): boolean =>
  compareString(a.contract, b.contract) && compareString(a.symbol, b.symbol);

const replaceLastChar = (str: string, char: string) => {
  return str.slice(0, str.length - 1) + char;
};

export const formatNumber = (num: number | string, size: number = 4) => {
  const bigNum = new BigNumber(num);
  if (bigNum.eq(0)) return "0";
  const reduced = bigNum.toFixed(size);
  const isZero = Number(reduced) == 0;
  if (isZero) {
    return `< ${replaceLastChar(reduced, "1")}`;
  }
  return reduced;
};

export const stringifyPercentage = (percentage: number): string => {
  if (percentage <= 0) return "0.00%";
  else if (percentage < 0.0001) return "< 0.01%";
  else return numeral(percentage).format("0.00%");
};

export const findChangedReserve = (
  amounts: ViewAmount[],
  changedReserveId: string
) =>
  findOrThrow(
    amounts,
    reserve => compareString(reserve.id, changedReserveId),
    "failed to find changed reserve id in reserves passed"
  );

export const buildSingleUnitCosts = (
  reserveOneSupply: ViewAmount,
  reserveTwoSupply: ViewAmount
): ViewAmount[] => {
  const reserveTwoCost = new BigNumber(reserveOneSupply.amount)
    .div(reserveTwoSupply.amount)
    .toString();

  const reserveOneCost = new BigNumber(reserveTwoSupply.amount)
    .div(reserveOneSupply.amount)
    .toString();

  return [
    { id: reserveTwoSupply.id, amount: reserveTwoCost },
    { id: reserveOneSupply.id, amount: reserveOneCost }
  ];
};

export interface StringPool {
  pool: string;
  poolToken?: string;
  destSymbol: string;
}

export const formatPercent = (decNumber: number | string) =>
  numeral(decNumber).format("0.00%");

export const calculateProtectionLevel = (
  startTimeSeconds: number,
  minimumDelaySeconds: number,
  maximumDelaySeconds: number
): number => {
  const nowSeconds = dayjs().unix();

  const timeElaspedSeconds = nowSeconds - startTimeSeconds;

  if (timeElaspedSeconds < minimumDelaySeconds) return 0;
  if (timeElaspedSeconds >= maximumDelaySeconds) return 1;

  const timeProgressedPastMinimum = timeElaspedSeconds - minimumDelaySeconds;
  const waitingPeriod = maximumDelaySeconds - minimumDelaySeconds;

  return new BigNumber(timeProgressedPastMinimum).div(waitingPeriod).toNumber();
};

export const calculateProgressLevel = (
  startTimeSeconds: number,
  endTimeSeconds: number
) => {
  if (endTimeSeconds < startTimeSeconds)
    throw new Error("End time should be greater than start time");
  const totalWaitingTime = endTimeSeconds - startTimeSeconds;
  const now = dayjs().unix();
  if (now >= endTimeSeconds) return 1;
  const timeWaited = now - startTimeSeconds;
  return timeWaited / totalWaitingTime;
};

export const calculatePercentageChange = (
  numberNow: number,
  numberBefore: number
): number => {
  return Number(((numberNow / numberBefore - 1) * 100).toFixed(2));
};

export const compareString = (
  stringOne: string,
  stringTwo: string
): boolean => {
  const strings = [stringOne, stringTwo];
  if (!strings.every(str => typeof str == "string"))
    throw new Error(
      `String one: ${stringOne} String two: ${stringTwo} one of them are falsy or not a string`
    );
  return stringOne.toLowerCase() == stringTwo.toLowerCase();
};

const cryptoComparekey = process.env.VUE_APP_CRYPTO_COMPARE;

export interface UsdPrices {
  BNT: { USD: number };
  ETH: { USD: number };
}

export const cryptoComparePrices = async () => {
  const res = await axios.get<UsdPrices>(
    "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BNT,ETH&tsyms=USD",
    { headers: { authorization: `Apikey ${cryptoComparekey}` } }
  );
  return res.data;
};

export const fetchBinanceUsdPriceOfBnt = async (): Promise<number> => {
  const res = await axios.get<{ mins: number; price: string }>(
    "https://api.binance.com/api/v3/avgPrice?symbol=BNTUSDT"
  );
  return Number(res.data.price);
};

export const fetchUsdPriceOfBntViaRelay = async (
  w3: Web3,
  relayContractAddress = "0xE03374cAcf4600F56BDDbDC82c07b375f318fc5C"
): Promise<number> => {
  const contract = buildConverterContract(relayContractAddress, w3);
  const res = await contract.methods
    .getReturn(
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "1000000000000000000"
    )
    .call();
  return Number(shrinkToken(res["0"], 18));
};

export const updateArray = <T>(
  arr: T[],
  conditioner: (element: T) => boolean,
  updater: (element: T) => T
) => arr.map(element => (conditioner(element) ? updater(element) : element));

export type Wei = string | number;
export type Ether = string | number;

export const selectedWeb3Wallet = "SELECTED_WEB3_WALLET";

export interface InfuraEventResponse {
  jsonrpc: string;
  id: number;
  error: Error;
  result: RawEventResponse[];
}

export interface RawEventResponse {
  address: string;
  blockHash: string;
  blockNumber: string;
  data: string;
  logIndex: string;
  removed: boolean;
  topics: string[];
  transactionHash: string;
  transactionIndex: string;
}

const conversionEventNetworkAbi = [
  { type: "uint256", name: "fromAmount" },
  { type: "uint256", name: "toAmount" },
  { type: "address", name: "trader" }
];

const conversionEventAbi = [
  { type: "uint256", name: "fromAmount" },
  { type: "uint256", name: "toAmount" },
  { type: "int256", name: "conversionFee" }
];

const addLiquidityEventAbi = [
  { type: "uint256", name: "amount" },
  { type: "uint256", name: "newBalance" },
  { type: "uint256", name: "newSupply" }
];

const removeLiquidityEventAbi = [
  { type: "uint256", name: "amount" },
  { type: "uint256", name: "newBalance" },
  { type: "uint256", name: "newSupply" }
];

interface TokenAmount {
  address: string;
  weiAmount: string;
}
export interface ConversionEventDecoded {
  poolToken?: string;
  from: TokenAmount;
  to: TokenAmount;
  trader: string;
}

export const shortenEthAddress = (ethAddress: string) =>
  ethAddress.substring(0, 4) +
  "..." +
  ethAddress.substring(ethAddress.length - 6, ethAddress.length);

export interface DecodedEvent<T> {
  blockNumber: string;
  txHash: string;
  data: T;
  id: string;
}

export interface DecodedTimedEvent<T> extends DecodedEvent<T> {
  blockTime: number;
}
export interface RemoveLiquidityEvent {
  tokenRemoved: string;
  trader: string;
  amount: string;
  newBalance: string;
  newSupply: string;
}

export interface AddLiquidityEvent {
  tokenAdded: string;
  trader: string;
  amount: string;
  newBalance: string;
  newSupply: string;
}

const decodeRemoveLiquidity = (
  rawEvent: RawEventResponse
): DecodedEvent<RemoveLiquidityEvent> => {
  const decoded = web3.eth.abi.decodeLog(
    removeLiquidityEventAbi,
    rawEvent.data,
    rawEvent.topics
  );

  const txHash = rawEvent.transactionHash;
  const keys = removeLiquidityEventAbi.map(abi => abi.name);
  const dynamic = pick(decoded, keys) as {
    amount: string;
    newBalance: string;
    newSupply: string;
  };

  const [, trader, tokenAdded] = rawEvent.topics;
  const blockNumber = String(web3.utils.toDecimal(rawEvent.blockNumber));

  return {
    id: txHash,
    txHash,
    blockNumber,
    data: {
      ...dynamic,
      trader: removeLeadingZeros(trader),
      tokenRemoved: removeLeadingZeros(tokenAdded)
    }
  };
};

const decodeAddLiquidityEvent = (
  rawEvent: RawEventResponse
): DecodedEvent<AddLiquidityEvent> => {
  const decoded = web3.eth.abi.decodeLog(
    addLiquidityEventAbi,
    rawEvent.data,
    rawEvent.topics
  );
  const txHash = rawEvent.transactionHash;
  const blockNumber = String(web3.utils.toDecimal(rawEvent.blockNumber));

  const keys = addLiquidityEventAbi.map(abi => abi.name);
  const dynamic = pick(decoded, keys) as {
    amount: string;
    newBalance: string;
    newSupply: string;
  };
  const [, trader, tokenAdded] = rawEvent.topics;
  return {
    id: txHash,
    blockNumber,
    txHash,
    data: {
      ...dynamic,
      trader: removeLeadingZeros(trader),
      tokenAdded: removeLeadingZeros(tokenAdded)
    }
  };
};

const decodeConversionEvent = (
  rawEvent: RawEventResponse
): DecodedEvent<ConversionEventDecoded> => {
  const decoded = web3.eth.abi.decodeLog(
    conversionEventAbi,
    rawEvent.data,
    rawEvent.topics
  );

  const blockNumber = String(web3.utils.toDecimal(rawEvent.blockNumber));
  const txHash = rawEvent.transactionHash;

  const [, fromAddress, toAddress, trader] = rawEvent.topics;
  const picked = (pick(
    decoded,
    conversionEventNetworkAbi.map(abi => abi.name)
  ) as unknown) as {
    fromAmount: string;
    toAmount: string;
    conversionFee: string;
  };

  const res = {
    blockNumber,
    txHash,
    id: txHash,
    data: {
      from: {
        address: removeLeadingZeros(fromAddress),
        weiAmount: picked.fromAmount
      },
      to: {
        address: removeLeadingZeros(toAddress),
        weiAmount: picked.toAmount
      },
      trader: removeLeadingZeros(trader)
    }
  };

  return res;
};

const decodeNetworkConversionEvent = (
  rawEvent: RawEventResponse
): DecodedEvent<ConversionEventDecoded> => {
  const decoded = web3.eth.abi.decodeLog(
    conversionEventNetworkAbi,
    rawEvent.data,
    rawEvent.topics
  );

  const blockNumber = String(web3.utils.toDecimal(rawEvent.blockNumber));
  const txHash = rawEvent.transactionHash;

  const [, poolToken, fromAddress, toAddress] = rawEvent.topics;
  const picked = (pick(
    decoded,
    conversionEventNetworkAbi.map(abi => abi.name)
  ) as unknown) as { fromAmount: string; toAmount: string; trader: string };

  return {
    blockNumber,
    txHash,
    id: txHash,
    data: {
      poolToken: removeLeadingZeros(poolToken),
      from: {
        address: removeLeadingZeros(fromAddress),
        weiAmount: picked.fromAmount
      },
      to: {
        address: removeLeadingZeros(toAddress),
        weiAmount: picked.toAmount
      },
      trader: picked.trader
    }
  };
};

const isTopic = (topic: string) => (event: RawEventResponse) =>
  compareString(event.topics[0], topic);
const isNotTopics = (topicsToIgnore: string[]) => (
  rawEvent: RawEventResponse
) =>
  !topicsToIgnore.some(topicToIgnore =>
    compareString(topicToIgnore, rawEvent.topics[0])
  );

export const getConverterLogs = async (
  network: EthNetworks,
  converterAddress: string,
  fromBlock: number
) => {
  // const address = getAlchemyUrl(network, false);
  const address = getInfuraAddress(network);

  const LiquidityRemoved = web3.utils.sha3(
    "LiquidityRemoved(address,address,uint256,uint256,uint256)"
  ) as string;

  const LiquidityAdded = web3.utils.sha3(
    "LiquidityAdded(address,address,uint256,uint256,uint256)"
  ) as string;

  const Conversion = web3.utils.sha3(
    "Conversion(address,address,address,uint256,uint256,int256)"
  ) as string;

  const request = {
    jsonrpc: "2.0",
    method: "eth_getLogs",
    params: [
      {
        fromBlock: web3.utils.toHex(fromBlock),
        toBlock: "latest",
        address: converterAddress
        // topics: [Conversion, LiquidityAdded, LiquidityRemoved]
      }
    ],
    id: 1
  };

  const response = await axios.post<InfuraEventResponse>(address, request);

  if (response.data.error) {
    console.error("eth_getLogs failed!", response.data.error, address, request);
  }

  const TokenRateUpdate = web3.utils.sha3(
    "TokenRateUpdate(address,address,uint256,uint256)"
  ) as string;

  const PriceDataUpdate =
    "0x8a6a7f53b3c8fa1dc4b83e3f1be668c1b251ff8d44cdcb83eb3acec3fec6a788";

  const topicsToIgnore = [TokenRateUpdate, PriceDataUpdate];

  const focusedTopics = response.data.result.filter(
    isNotTopics(topicsToIgnore)
  );

  const conversions = focusedTopics
    .filter(isTopic(Conversion))
    .map(decodeConversionEvent);

  const removeLiquidity = focusedTopics
    .filter(isTopic(LiquidityRemoved))
    .map(decodeRemoveLiquidity);

  const addLiquidity = focusedTopics
    .filter(isTopic(LiquidityAdded))
    .map(decodeAddLiquidityEvent);

  return {
    addLiquidity,
    removeLiquidity,
    conversions
  };
};

export const getLogs = async (
  network: EthNetworks,
  networkAddress: string,
  fromBlock: number
) => {
  // const address = getAlchemyUrl(network, false);
  const address = getInfuraAddress(network);

  const request = {
    jsonrpc: "2.0",
    method: "eth_getLogs",
    params: [
      {
        fromBlock: web3.utils.toHex(fromBlock),
        toBlock: "latest",
        address: networkAddress
      }
    ],
    id: 1
  };

  const response = await axios.post<InfuraEventResponse>(address, request);

  if (response.data.error) {
    console.error("eth_getLogs failed!", response.data.error, address, request);
  }

  const decoded = response.data.result.map(decodeNetworkConversionEvent);

  return decoded;
};

const RPC_URL = getAlchemyUrl(EthNetworks.Mainnet, false);
const APP_NAME = "Bancor Swap";
const FORTMATIC_KEY = process.env.VUE_APP_FORTMATIC;
const PORTIS_KEY = process.env.VUE_APP_PORTIS;
const SQUARELINK_KEY = process.env.VUE_APP_SQUARELINK;

const wallets = [
  { walletName: "metamask", preferred: true },
  { walletName: "lattice", rpcUrl: RPC_URL, appName: APP_NAME },
  { walletName: "imToken", rpcUrl: RPC_URL, preferred: true },
  { walletName: "coinbase" },
  { walletName: "trust", rpcUrl: RPC_URL, preferred: true },
  { walletName: "dapper" },
  { walletName: "ledger", rpcUrl: RPC_URL },
  { walletName: "authereum" },
  { walletName: "opera", preferred: true },
  { walletName: "operaTouch" },
  { walletName: "torus" },
  { walletName: "status" },
  { walletName: "unilogin" },
  {
    walletName: "walletLink",
    rpcUrl: RPC_URL,
    appName: APP_NAME,
    preferred: true
  },
  { walletName: "meetone", preferred: true },
  { walletName: "mykey", rpcUrl: RPC_URL },
  { walletName: "huobiwallet", rpcUrl: RPC_URL },
  { walletName: "hyperpay" },
  {
    walletName: "trezor",
    appUrl: "https://www.bancor.network",
    email: "services@bancor.network",
    rpcUrl: RPC_URL
  },
  {
    walletName: "fortmatic",
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  {
    walletName: "portis",
    apiKey: PORTIS_KEY,
    preferred: true,
    label: "Login with Email"
  },
  {
    walletName: "squarelink",
    apiKey: SQUARELINK_KEY
  },
  { walletName: "authereum" },
  {
    walletName: "walletConnect",
    preferred: true,
    rpc: {
      [EthNetworks.Mainnet]: RPC_URL
    }
  },
  { walletName: "wallet.io", rpcUrl: RPC_URL }
];

export const calculatePercentIncrease = (
  small: number | string,
  big: number | string
): string => {
  const profit = new BigNumber(big).minus(small);
  return profit.div(small).toString();
};

const walletChecks = [
  { checkName: "derivationPath" },
  { checkName: "accounts" },
  { checkName: "connect" },
  { checkName: "network" }
];

export const onboard = Onboard({
  dappId: process.env.VUE_APP_BLOCKNATIVE,
  networkId: 1,
  hideBranding: true,
  subscriptions: {
    address: address => {
      authenticatedReceiver$.next(address);
    },
    balance: balance => vxm.ethWallet.nativeBalanceChange(balance),
    network: (network: EthNetworks) => {
      if (network == EthNetworks.Mainnet || network == EthNetworks.Ropsten) {
        onboard.config({ networkId: network });
      }
      if (network) {
        networkVersionReceiver$.next(network);
        vxm.ethWallet.onNetworkChange(network);
      }
    },
    wallet: wallet => {
      if (wallet.name) {
        localStorage.setItem(selectedWeb3Wallet, wallet.name);
      }
      web3.setProvider(wallet.provider);
    }
  },
  walletSelect: {
    wallets
  },
  walletCheck: walletChecks
});

export const fetchReserveBalance = async (
  converterContract: any,
  reserveTokenAddress: string,
  versionNumber: number | string,
  blockHeight?: number
): Promise<string> => {
  try {
    const res =
      (await blockHeight) !== undefined
        ? converterContract.methods[
            Number(versionNumber) >= 17
              ? "getConnectorBalance"
              : "getReserveBalance"
          ](reserveTokenAddress).call(null, blockHeight)
        : converterContract.methods[
            Number(versionNumber) >= 17
              ? "getConnectorBalance"
              : "getReserveBalance"
          ](reserveTokenAddress).call();
    return res;
  } catch (e) {
    try {
      const res = await converterContract.methods[
        Number(versionNumber) >= 17
          ? "getReserveBalance"
          : "getConnectorBalance"
      ](reserveTokenAddress).call();
      return res;
    } catch (e) {
      throw new Error("Failed getting reserve balance" + e);
    }
  }
};

export const fetchTokenSymbol = async (
  contractName: string,
  symbolName: string
): Promise<Sym> => {
  const statRes: {
    rows: { supply: string; max_supply: string; issuer: string }[];
  } = await rpc.get_table_rows({
    code: contractName,
    scope: symbolName,
    table: "stat"
  });
  if (statRes.rows.length == 0)
    throw new Error(
      `Unexpected stats table return from tokenContract ${contractName} ${symbolName}`
    );
  const maxSupplyAssetString = statRes.rows[0].max_supply;
  const maxSupplyAsset = new Asset(maxSupplyAssetString);
  return maxSupplyAsset.symbol;
};

export const getBalance = async (
  contract: string,
  symbolName: string,
  precision?: number
): Promise<string> => {
  const account = currentUserViaModule(vxm.eosWallet);
  const res: { rows: { balance: string }[] } = await rpc.get_table_rows({
    code: contract,
    scope: account,
    table: "accounts",
    limit: 99
  });
  const balance = res.rows.find(balance =>
    compareString(
      new Asset(balance.balance).symbol.code().to_string(),
      symbolName
    )
  );

  if (!balance) {
    if (typeof precision == "number") {
      return number_to_asset(0, new Sym(symbolName, precision)).to_string();
    } else {
      const symbol = await fetchTokenSymbol(contract, symbolName);
      return number_to_asset(0, symbol).to_string();
    }
  }
  return balance.balance;
};

export const fetchTokenStats = async (
  contract: string,
  symbol: string
): Promise<TraditionalStat> => {
  const tableResult = await eosRpc.get_table_rows({
    code: contract,
    table: "stat",
    scope: symbol,
    limit: 1
  });
  const tokenExists = tableResult.rows.length > 0;
  if (!tokenExists) throw new Error("Token does not exist");
  const { supply, max_supply } = tableResult.rows[0];
  return {
    supply: new Asset(supply),
    max_supply: new Asset(max_supply)
  };
};

const isValidBalance = (data: any): boolean =>
  typeof data.contract == "string" &&
  typeof data.symbol == "string" &&
  data.contract.length > 0 &&
  data.symbol.length > 0;

export const getTokenBalances = async (
  accountName: string
): Promise<TokenBalances> => {
  const res = await axios.get<TokenBalances>(
    `https://eos.eosn.io/v2/state/get_tokens?account=${accountName}`
  );
  return {
    ...res.data,
    tokens: res.data.tokens.filter(isValidBalance)
  };
};

export type EosAccount = string;
export type EthereumAddress = string;
export type ContractAccount = EosAccount | EthereumAddress;

export interface Token {
  symbol: string;
  contract: string;
  decimals: number;
  network: string;
}

export enum PoolType {
  Liquid = 0,
  Traditional = 1,
  ChainLink = 2
}
export interface PoolToken {
  reserveId: string;
  poolToken: Token;
}

interface LiqDepth {
  liqDepth?: number;
}

export const assetToDecNumberString = (asset: Asset): string =>
  asset.to_string().split(" ")[0];

export const decNumberStringToAsset = (
  decNumberString: string,
  symbolName: string
): Asset => new Asset(`${decNumberString} ${symbolName}`);

export const sortByLiqDepth = (a: LiqDepth, b: LiqDepth) => {
  if (a.liqDepth == undefined && b.liqDepth == undefined) return 0;
  if (a.liqDepth == undefined) return 1;
  if (b.liqDepth == undefined) return -1;
  if (isNaN(a.liqDepth) && isNaN(b.liqDepth)) return 0;
  if (isNaN(a.liqDepth)) return 1;
  if (isNaN(b.liqDepth)) return -1;
  return b.liqDepth - a.liqDepth;
};

export const zeroAddress: string = "0x0000000000000000000000000000000000000000";

export const sortAlongSide = <T>(
  arr: readonly T[],
  selector: (item: T) => string,
  sortedArr: string[]
): T[] => {
  const res = arr.slice().sort((a, b) => {
    const aIndex = sortedArr.findIndex(sort =>
      compareString(sort, selector(a))
    );
    const bIndex = sortedArr.findIndex(sort =>
      compareString(sort, selector(b))
    );

    if (aIndex == -1 && bIndex == -1) return 0;
    if (aIndex == -1) return 1;
    if (bIndex == -1) return -1;
    return aIndex - bIndex;
  });

  return res;
};

export const reserveIncludedInEosRelay = (reserveId: string) => (
  relay: EosMultiRelay
) => relay.reserves.some(reserve => compareString(reserve.id, reserveId));

export const reserveIncludedInRelay = (reserveId: string) => (relay: Relay) =>
  relay.reserves.some(reserve => compareString(reserve.contract, reserveId));

export const viewTokenToModalChoice = (token: ViewToken): ModalChoice => ({
  id: token.id,
  symbol: token.symbol,
  img: token.logo,
  contract: token.contract
});

export interface PoolContainer {
  poolContainerAddress: string;
  poolTokens: PoolToken[];
}

export type SmartToken = Token;
export type Anchor = SmartToken | PoolContainer;

interface TokenWithWeight extends Token {
  reserveWeight: number | undefined;
  reserveFeed?: ReserveFeed;
  meta?: {
    logo: string;
    name?: string;
  };
}
export interface Relay {
  id: string;
  reserves: TokenWithWeight[];
  anchor: Anchor;
  contract: ContractAccount;
  isMultiContract: boolean;
  fee: number;
  network: string;
  version: string;
  converterType: PoolType;
}

export interface RelayWithReserveBalances extends Relay {
  reserveBalances: { id: string; amount: string }[];
}

export interface TraditionalRelay extends Relay {
  anchor: SmartToken;
}

export interface ChainLinkRelay extends Relay {
  anchor: PoolContainer;
}

const currentUserViaModule = (module: EosTransitModule) => {
  const currentUser =
    module.wallet && module.wallet.auth && module.wallet.auth.accountName;
  if (!currentUser) throw new Error("Not logged in");
  return currentUser;
};

export const getBankBalance = async (): Promise<
  {
    id: number;
    quantity: string;
    symbl: string;
  }[]
> => {
  const account = currentUserViaModule(vxm.eosWallet);
  const res: {
    rows: {
      id: number;
      quantity: string;
      symbl: string;
    }[];
  } = await rpc.get_table_rows({
    code: process.env.VUE_APP_MULTICONTRACT!,
    scope: account,
    table: "accounts"
  })!;
  return res.rows;
};

export enum Feature {
  Trade,
  Wallet,
  Liquidity,
  CreatePool
}

export interface Service {
  namespace: string;
  features: Feature[];
}

export const services: Service[] = [
  {
    namespace: "eos",
    features: [
      Feature.Trade,
      Feature.Liquidity,
      Feature.Wallet,
      Feature.CreatePool
    ]
  },
  {
    namespace: "eth",
    features: [Feature.Trade, Feature.Liquidity, Feature.CreatePool]
  }
];

export interface ReserveTableRow {
  contract: string;
  ratio: number;
  balance: string;
}

export interface SettingTableRow {
  currency: string;
  owner: string;
  stake_enabled: boolean;
  fee: number;
}

export interface ConverterV2Row {
  currency: string;
  fee: number;
  metadata_json: string[];
  owner: string;
  protocol_features: string[];
  reserve_balances: {
    key: string;
    value: {
      quantity: string;
      contract: string;
    };
  }[];
  reserve_weights: {
    key: string;
    value: number;
  }[];
}

export const formatLockDuration = (seconds: number): string =>
  dayjs.duration(seconds, "seconds").humanize();
interface BaseSymbol {
  symbol: string;
  precision: number;
}

const symToBaseSymbol = (symbol: Sym): BaseSymbol => ({
  symbol: symbol.code().to_string(),
  precision: symbol.precision()
});

const assetStringtoBaseSymbol = (assetString: string): BaseSymbol => {
  const asset = new Asset(assetString);
  return symToBaseSymbol(asset.symbol);
};

export const buildTokenId = ({ contract, symbol }: BaseToken): string =>
  contract + "-" + symbol;

export const fetchMultiRelays = async (): Promise<EosMultiRelay[]> => {
  const contractName = process.env.VUE_APP_MULTICONTRACT!;

  if (!contractName) throw new Error("Failed to find multi contract name");
  const rawRelays: {
    rows: ConverterV2Row[];
    more: boolean;
  } = await rpc.get_table_rows({
    code: contractName,
    table: "converters",
    scope: contractName,
    limit: 99
  });
  if (rawRelays.more) {
    console.warn("Warning, there are more than 99 multi relays!");
  }
  const parsedRelays = rawRelays.rows;
  const passedRelays = parsedRelays
    .filter(
      relay =>
        relay.reserve_weights.reduce(
          (acc, reserve) => reserve.value + acc,
          0
        ) == 1000000
    )
    .filter(relay => relay.reserve_balances.length == 2);

  const smartTokenContract = process.env.VUE_APP_SMARTTOKENCONTRACT!;

  const relays: EosMultiRelay[] = passedRelays.map(relay => ({
    id: buildTokenId({
      contract: smartTokenContract,
      symbol: symToBaseSymbol(new Sym(relay.currency)).symbol
    }),
    reserves: relay.reserve_balances.map(({ value }) => ({
      ...assetStringtoBaseSymbol(value.quantity),
      id: buildTokenId({
        contract: value.contract,
        symbol: assetStringtoBaseSymbol(value.quantity).symbol
      }),
      contract: value.contract,
      network: "eos",
      amount: assetToDecNumberString(new Asset(value.quantity))
    })),
    contract: contractName,
    owner: relay.owner,
    isMultiContract: true,
    smartToken: {
      ...symToBaseSymbol(new Sym(relay.currency)),
      id: buildTokenId({
        contract: smartTokenContract,
        symbol: symToBaseSymbol(new Sym(relay.currency)).symbol
      }),
      contract: smartTokenContract!,
      amount: "0",
      network: "eos"
    },
    fee: relay.fee / 1000000
  }));

  return relays;
};

export const fetchMultiRelay = async (
  smartTokenSymbol: string
): Promise<EosMultiRelay> => {
  const relays = await fetchMultiRelays();
  const relay = findOrThrow(
    relays,
    relay => compareString(relay.smartToken.symbol, smartTokenSymbol),
    `failed to find multi relay with smart token symbol of ${smartTokenSymbol}`
  );
  return {
    ...relay,
    reserves: sortByNetworkTokens(relay.reserves, reserve => reserve.symbol, [
      "BNT"
    ])
  };
};

const tokenMetaDataEndpoint =
  "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/tokens.json";

const hardCoded: () => TokenMeta[] = () =>
  [
    {
      name: "EOS",
      logo:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/359b8290-0767-11e8-8744-97748b632eaf.png",
      logo_lg:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/359b8290-0767-11e8-8744-97748b632eaf.png",
      symbol: "EOS",
      account: "eosio.token",
      chain: "eos"
    },
    {
      name: "Prochain",
      logo:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/EPRA.png",
      logo_lg:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/EPRA.png",
      symbol: "EPRA",
      account: "epraofficial",
      chain: "eos"
    },
    {
      name: "Gold Tael",
      logo:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/f146c8c0-1e6c-11e9-96e6-590b33725e90.jpeg",
      logo_lg:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/f146c8c0-1e6c-11e9-96e6-590b33725e90.jpeg",
      symbol: "TAEL",
      account: "realgoldtael",
      chain: "eos"
    },
    {
      name: "ZOS",
      logo:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/636a3e10-328f-11e9-99c6-21750f32c67e.jpeg",
      logo_lg:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/636a3e10-328f-11e9-99c6-21750f32c67e.jpeg",
      symbol: "ZOS",
      account: "zosdiscounts",
      chain: "eos"
    },
    {
      name: "EQUA",
      logo:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/d03d3120-cd5b-11e9-923a-f50a5610b222.jpeg",
      logo_lg:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/d03d3120-cd5b-11e9-923a-f50a5610b222.jpeg",
      symbol: "EQUA",
      account: "equacasheos1",
      chain: "eos"
    },
    {
      name: "FINX",
      logo:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/77c385a0-6675-11e9-9f0e-7591708e99af.jpeg",
      logo_lg:
        "https://storage.googleapis.com/bancor-prod-file-store/images/communities/77c385a0-6675-11e9-9f0e-7591708e99af.jpeg",
      symbol: "FINX",
      account: "finxtokenvci",
      chain: "eos"
    }
  ].map(token => ({
    ...token,
    id: buildTokenId({ contract: token.account, symbol: token.symbol })
  }));

export const getTokenMeta = async (): Promise<TokenMeta[]> => {
  const res: AxiosResponse<TokenMeta[]> = await axios.get(
    tokenMetaDataEndpoint
  );
  return [...res.data, ...hardCoded()]
    .filter(token => compareString(token.chain, "eos"))
    .map(token => ({
      ...token,
      id: buildTokenId({ contract: token.account, symbol: token.symbol })
    }));
};

export interface TickerPrice {
  "15m": number;
  last: number;
  buy: number;
  sell: number;
  symbol: string;
}

export const buildPoolName = (poolId: string): string => {
  const pool: ViewRelay = vxm.bancor.relay(poolId);
  if (pool) {
    return buildPoolNameFromReserves(pool.reserves);
  } else return "N/A";
};

export const buildPoolNameFromReserves = (
  reserves: ViewReserve[],
  separator: string = "/"
): string => {
  const symbols = reserves.map(x => x.symbol);
  return symbols.reverse().join(separator);
};

export const formatUnixTime = (
  unixTime: number
): { date: string; time: string; dateTime: string } => {
  const date = dayjs.unix(unixTime).format("MMM D YYYY");
  const time = dayjs.unix(unixTime).format("HH:mm");
  const dateTime = `${date} ${time}`;

  return { date, time, dateTime };
};

export const formatDuration = (duration: plugin.Duration): string => {
  let sentence = "";
  const days = duration.days();
  const minutes = duration.minutes();
  const hours = duration.hours();
  if (days > 0) sentence += i18n.tc("days", days);
  if (hours > 0) sentence += " " + i18n.tc("hours", hours);
  if (minutes > 0) sentence += " " + i18n.tc("minutes", minutes);
  return sentence;
};

export const defaultTableSort = (row: TableItem, sortBy: string) => {
  const value = row[sortBy];
  if (!value || isNaN(value)) return null;
  if (isFinite(value)) {
    const number = new BigNumber(value);
    const isBigNumber = BigNumber.isBigNumber(number);
    if (isBigNumber) return number.toNumber();
  }

  return value;
};

export const generateEtherscanTxLink = (
  txHash: string,
  ropsten: boolean = false
): string => `https://${ropsten ? "ropsten." : ""}etherscan.io/tx/${txHash}`;

export const durationTimer = (
  duration: Duration,
  start: Dayjs = dayjs(),
  format: string = "DD[d:]HH[h:]mm[m]"
): string => {
  const end = start.add(duration);
  const result = dayjs.duration(end.diff(start));
  return result.format(format);
};
