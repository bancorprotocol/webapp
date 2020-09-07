import axios, { AxiosResponse } from "axios";
import { vxm } from "@/store";
import { JsonRpc } from "eosjs";
import Onboard from "bnc-onboard";
import { Asset, Sym, number_to_asset } from "eos-common";
import { rpc } from "./eos/rpc";
import {
  TokenBalances,
  EosMultiRelay,
  TokenMeta,
  BaseToken,
  TokenBalanceReturn,
  TokenBalanceParam,
  Step,
  OnUpdate,
  ViewToken,
  ReserveFeed,
  ModalChoice,
  ViewAmount
} from "@/types/bancor";
import Web3 from "web3";
import { EosTransitModule } from "@/store/modules/wallet/eosWallet";
import { buildConverterContract } from "./eth/contractTypes";
import { shrinkToken } from "./eth/helpers";
import { sortByNetworkTokens } from "./sortByNetworkTokens";
import numeral from "numeral";
import BigNumber from "bignumber.js";
import { DictionaryItem } from "@/api/eth/bancorApiRelayDictionary";
import { PropOptions } from "vue";
import { createDecorator } from "vue-class-component";
import { pick } from "lodash";
import { removeLeadingZeros } from "./eth/helpers";

export function VModel(propsArgs: PropOptions = {}) {
  const valueKey: string = "value";
  return createDecorator((componentOptions, key) => {
    (componentOptions.props || ((componentOptions.props = {}) as any))[
      valueKey
    ] = propsArgs;
    (componentOptions.computed || (componentOptions.computed = {}))[key] = {
      get() {
        return (this as any)[valueKey];
      },
      set(value: any) {
        // @ts-ignore
        this.$emit("input", value);
      }
    };
  });
}

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
    let steps = items.map(
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

    let newState = await items[todo].task(state);
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

export const formatPercent = (decNumber: number) =>
  numeral(decNumber).format("0.00%");

export const compareString = (stringOne: string, stringTwo: string) => {
  const strings = [stringOne, stringTwo];
  if (!strings.every(str => typeof str == "string"))
    throw new Error(
      `String one: ${stringOne} String two: ${stringTwo} one of them are falsy or not a string`
    );
  return stringOne.toLowerCase() == stringTwo.toLowerCase();
};

export const fetchBinanceUsdPriceOfBnt = async (): Promise<number> => {
  const res = await axios.get<{ mins: number; price: string }>(
    "https://api.binance.com/api/v3/avgPrice?symbol=BNTUSDT"
  );
  return Number(res.data.price);
};

export const fetchUsdPriceOfBntViaRelay = async (
  relayContractAddress = "0xE03374cAcf4600F56BDDbDC82c07b375f318fc5C"
): Promise<number> => {
  const contract = buildConverterContract(relayContractAddress);
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
export enum EthNetworks {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5
}

const projectId = "da059c364a2f4e6eb89bfd89600bce07";

const buildInfuraAddress = (subdomain: string, projectId: string) =>
  `https://${subdomain}.infura.io/v3/${projectId}`;

const getInfuraAddress = (network: EthNetworks) => {
  if (network == EthNetworks.Mainnet) {
    return buildInfuraAddress("mainnet", projectId);
  } else if (network == EthNetworks.Ropsten) {
    return buildInfuraAddress("ropsten", projectId);
  }
  throw new Error("Infura address for network not supported ");
};

export let web3 = new Web3(
  Web3.givenProvider || getInfuraAddress(EthNetworks.Mainnet)
);

export const selectedWeb3Wallet = "SELECTED_WEB3_WALLET";

export interface InfuraEventResponse {
  jsonrpc: string;
  id: number;
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

// const tz = {
//   address: "0x2f9ec37d6ccfff1cab21733bdadede11c823ccb0",
//   blockHash:
//     "0x2570d981705b282aafd2ff07ed293cb3169513b0d12ea819f84b71b4d68ab2c1",
//   blockNumber: "0xa49f45",
//   data:
//     "0x0000000000000000000000000000000000000000000008238eb1566fee5d0000000000000000000000000000000000000000000000000007b4be6e4156334ad4000000000000000000000000dead1241f2ee2a7950ad967993efb72d62bf6822",
//   logIndex: "0x17",
//   removed: false,
//   topics: [
//     "0x7154b38b5dd31bb3122436a96d4e09aba5b323ae1fd580025fab55074334c095",
//     "0x000000000000000000000000b1cd6e4153b2a390cf00a6556b0fc1458c4a5533",
//     "0x0000000000000000000000001f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
//     "0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
//   ],
//   transactionHash:
//     "0x3d200c94eca4474b421a6342121e7933f3b94abb22494719550461c5ba2c4571",
//   transactionIndex: "0x10"
// };

const conversionEventAbi = [
  { type: "uint256", name: "fromAmount" },
  { type: "uint256", name: "toAmount" },
  { type: "address", name: "trader" }
];

interface TokenAmount {
  address: string;
  weiAmount: string;
}
export interface ConversionEventDecoded {
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
}

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

  const [_, poolToken, fromAddress, toAddress] = rawEvent.topics;
  const picked = (pick(
    decoded,
    conversionEventAbi.map(abi => abi.name)
  ) as unknown) as { fromAmount: string; toAmount: string; trader: string };

  return {
    blockNumber,
    txHash,
    data: {
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

export const getLogs = async (
  network: EthNetworks,
  networkAddress: string,
  fromBlock: number
) => {
  const address = getInfuraAddress(network);

  const res = await axios.post<InfuraEventResponse>(address, {
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
  });
  const decoded = res.data.result.map(decodeConversionEvent);

  return decoded;
};

const RPC_URL = getInfuraAddress(EthNetworks.Mainnet);
const APP_NAME = "Bancor Swap";

const wallets = [
  { walletName: "metamask" },
  { walletName: "imToken", rpcUrl: RPC_URL },
  { walletName: "coinbase" },
  { walletName: "trust", rpcUrl: RPC_URL },
  { walletName: "dapper" },
  {
    walletName: "ledger",
    rpcUrl: RPC_URL
  },
  { walletName: "authereum" },
  { walletName: "opera" },
  { walletName: "operaTouch" },
  { walletName: "torus" },
  { walletName: "status" },
  { walletName: "unilogin" },
  { walletName: "walletLink", rpcUrl: RPC_URL, appName: APP_NAME },
  { walletName: "meetone" },
  { walletName: "mykey", rpcUrl: RPC_URL },
  { walletName: "huobiwallet", rpcUrl: RPC_URL },
  { walletName: "hyperpay" }
];

export const onboard = Onboard({
  dappId: process.env.VUE_APP_BLOCKNATIVE,
  networkId: 1,
  hideBranding: true,
  subscriptions: {
    address: address => {
      vxm.ethWallet.accountChange(address);
    },
    balance: balance => vxm.ethWallet.nativeBalanceChange(balance),
    network: (network: EthNetworks) => {
      if (network == EthNetworks.Mainnet || network == EthNetworks.Ropsten) {
        onboard.config({ networkId: network });
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
  }
});

export const fetchReserveBalance = async (
  converterContract: any,
  reserveTokenAddress: string,
  versionNumber: number | string
): Promise<string> => {
  try {
    const res = await converterContract.methods[
      Number(versionNumber) >= 17 ? "getConnectorBalance" : "getReserveBalance"
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
  const account = isAuthenticatedViaModule(vxm.eosWallet);
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
  liqDepth: number;
}

export const assetToDecNumberString = (asset: Asset): string =>
  asset.to_string().split(" ")[0];

export const decNumberStringToAsset = (
  decNumberString: string,
  symbolName: string
): Asset => new Asset(`${decNumberString} ${symbolName}`);

export const sortByLiqDepth = (a: LiqDepth, b: LiqDepth) => {
  if (isNaN(a.liqDepth) && isNaN(b.liqDepth)) return 0;
  if (isNaN(a.liqDepth)) return 1;
  if (isNaN(b.liqDepth)) return -1;
  return b.liqDepth - a.liqDepth;
};

export const zeroAddress: string = "0x0000000000000000000000000000000000000000";

export const matchReserveFeed = (reserveFeed: ReserveFeed) => (
  dict: DictionaryItem
) =>
  compareString(dict.smartTokenAddress, reserveFeed.poolId) &&
  compareString(dict.tokenAddress, reserveFeed.reserveAddress);

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
  owner: string;
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

const isAuthenticatedViaModule = (module: EosTransitModule) => {
  const isAuthenticated =
    module.wallet && module.wallet.auth && module.wallet.auth.accountName;
  if (!isAuthenticated) throw new Error("Not logged in");
  return isAuthenticated;
};

export const getBankBalance = async (): Promise<
  {
    id: number;
    quantity: string;
    symbl: string;
  }[]
> => {
  const account = isAuthenticatedViaModule(vxm.eosWallet);
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
    table: "converter.v2",
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

export const getCountryCode = async (): Promise<string> => {
  try {
    const res: AxiosResponse<any> = await axios.get("https://ipapi.co/json");
    const code = res.data.country_code_iso3;
    if (code) return code;
    else return "UNKOWN";
  } catch (e) {
    console.error(e);
    return "UNKOWN";
  }
};
