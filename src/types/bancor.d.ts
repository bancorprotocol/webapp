import { Contract, ContractSendMethod } from "web3-eth-contract";

export interface TokenPrice {
  id: string;
  code: string;
  name: string;
  primaryCommunityId: string;
  primaryCommunityImageName: string;
  liquidityDepth: number;
  price: number;
  change24h: number;
  volume24h: Volume24h;
  priceHistory: PriceHistory[];
}

export interface Volume24h {
  ETH: number;
  USD: number;
  EUR: number;
}

export interface PriceHistory {
  [index: number]: number;
}

export type FloatAmount = number;

export interface RawRow {
  timestamp: string;
  ROI: string;
  "Token Price": string;
  "Trade Volume": string;
}

export interface HistoryRow {
  timestamp: number;
  roi: number;
  tokenPrice: number;
  tradeVolume: number;
}

export interface TokenBalance {
  symbol: string;
  precision: number;
  amount: number;
  contract: string;
}

export interface TokenBalances {
  query_time: number;
  account: string;
  tokens: TokenBalance[];
}

export interface ProposedFromTransaction {
  from: ViewAmount;
  toId: string;
}

export interface ProposedToTransaction {
  to: ViewAmount;
  fromId: string;
}

export interface ViewAmount {
  id: string;
  amount: string;
}

type OnUpdate = (index: number, sections: Section[]) => void;

export interface LiquidityParams {
  id: string;
  reserves: ViewAmount[];
  onUpdate?: OnUpdate;
}

export interface OpposingLiquidParams {
  id: string;
  reserve: ViewAmount;
}

export interface OpposingLiquid {
  opposingAmount?: string;
  shareOfPool: number;
  singleUnitCosts: ViewAmount[];
  withdrawFee?: number;
  expectedReturn?: ViewAmount;
}

export interface Section {
  name: string;
  description: string;
}

export interface ProposedConvertTransaction {
  from: ViewAmount;
  to: ViewAmount;
  onUpdate?: OnUpdate;
}

export interface TokenDetail {
  _id: string;
  type: string;
  code: string;
  lowerCaseCode: string;
  status: string;
  isDiscoverable: boolean;
  createdAt: string;
  isDeleted: boolean;
  primaryCommunityId: string;
  name: string;
  about: string;
  promotionOrder: null;
  textIcon: string;
  adminProfileId: null;
  details: Detail[];
  primaryCommunityImageName: string;
  order: number;
  liquidityDepth: string;
}

export type EthAddress = string;

export interface CoTrade {
  tokenAddress: string;
  symbol: string;
  smartTokenSymbol: string;
  converterAddress: string;
  smartTokenAddress: string;
  owner: string;
  isOfficial: number;
  isCoTraderVerified: number;
  isBlacklisted: number;
  connectorType: string;
  smartTokenSupply: string;
  connectorBancorReserve: string;
  connectorOriginalReserve: string;
  smartTokenInETH: null;
  smartTokeninUSD: null;
  tokenDecimals: number;
  conversionFee: string;
  converterVersion: string;
}

export interface Detail {
  blockchain: Blockchain;
  blockchainId: string;
  type: string;
  stage: string;
  supply: string;
  decimals: number;
  relayCurrencyId: string;
  converter: Converter;
  symbol: string;
}

export interface Blockchain {
  type: string;
  chainId: string;
}

export interface Converter {
  activatedAt: string;
}

export interface ConvertReturn {
  amount: string;
  slippage?: number;
  fee?: string;
}

export interface ViewToken {
  id: string;
  contract: string;
  symbol: string;
  name: string;
  price?: number;
  liqDepth?: number;
  logo: string;
  change24h?: number;
  volume24h?: number;
  balance?: string;
  precision?: number;
}

interface TokenWithLogo extends AgnosticToken {
  logo: string[];
}

export interface ViewReserve {
  reserveId: string;
  id: string;
  logo: string[];
  symbol: string;
  contract: string;
  balance?: number;
  reserveWeight: number;
}

export interface ViewRelay {
  id: string;
  symbol: string;
  liqDepth: number;
  reserves: ViewReserve[];
  fee: number;
  owner: string;
  addLiquiditySupported: boolean;
  removeLiquiditySupported: boolean;
  focusAvailable?: boolean;
  v2: boolean;
}

export interface ContractMethods<T> extends Contract {
  methods: T;
}

export interface CallReturn<T = any> {
  arguments: any[];
  _method: {
    outputs: { name: string; type: string }[];
  };
  call: () => Promise<T>;
  encodeABI: () => string;
}

export interface TokenPriceExtended extends TokenPrice {
  balance: number;
}

export interface TokenPriceDecimal extends TokenPrice {
  decimals: number;
}

export interface TradeQuery {
  base: string;
  quote: string;
}

export type PoolQuery = string;

export interface ModuleParam {
  tradeQuery?: TradeQuery;
  poolQuery?: PoolQuery;
}

export interface ViewModalToken {
  id: string;
  symbol: string;
  img: string;
  balance?: string;
}

export interface SlippageTolerance {
  readonly slippageTolerance: number;
  setSlippageTolerance: (tolerance: number) => Promise<void>;
}

export interface TxResponse {
  txId: string;
  blockExplorerLink: string;
}
export interface TradingModule {
  init: (param?: ModuleParam) => Promise<void>;
  readonly token: (arg0: string) => ViewToken;
  readonly tokens: ViewToken[];
  readonly moreTokensAvailable: boolean;
  readonly loadingTokens: boolean;
  refreshBalances: (symbols?: BaseToken[]) => Promise<void>;
  onAuthChange: (address: string) => Promise<void>;
  convert: (propose: ProposedConvertTransaction) => Promise<TxResponse>;
  focusSymbol: (symbolName: string) => Promise<void>;
  getReturn: (propose: ProposedFromTransaction) => Promise<ConvertReturn>;
  getCost: (propose: ProposedToTransaction) => Promise<ConvertReturn>;
  loadMoreTokens: (tokenIds?: string[]) => Promise<void>;
}

export interface UserPoolBalances {
  maxWithdrawals: ViewAmount[];
  iouBalances: ViewAmount[];
}

interface PoolTokenPosition {
  relay: ViewRelay;
  smartTokenAmount?: number;
  poolTokens?: {
    reserveId: string;
    balance: number;
  }[];
}

export interface LiquidityModule {
  init: (param: ModuleParam) => Promise<void>;
  readonly primaryReserveChoices: (secondaryChoiceId: string) => ModalChoice[];
  readonly secondaryReserveChoices: ModalChoice[];
  readonly relay: (arg0: string) => ViewRelay;
  readonly relays: ViewRelay[];
  readonly supportedFeatures: (arg0: string) => string[];
  readonly morePoolsAvailable: boolean;
  readonly loadingPools: boolean;
  readonly stats: {
    totalLiquidityDepth: number;
  };
  readonly poolTokenPositions: PoolTokenPosition[];
  loadMorePools: () => Promise<void>;
  calculateOpposingDeposit: (
    opposingDeposit: OpposingLiquidParams
  ) => Promise<OpposingLiquid>;
  updateFee?: (fee: FeeParams) => Promise<TxResponse>;
  updateOwner?: (fee: NewOwnerParams) => Promise<TxResponse>;
  calculateOpposingWithdraw: (
    opposingWithdraw: OpposingLiquidParams
  ) => Promise<OpposingLiquid>;
  getUserBalances: (relayId: string) => Promise<UserPoolBalances>;
  removeLiquidity: (params: LiquidityParams) => Promise<TxResponse>;
  addLiquidity: (params: LiquidityParams) => Promise<TxResponse>;
  removeRelay?: (symbolName: string) => Promise<TxResponse>;
}

export interface TokenMeta {
  id: string;
  name: string;
  logo: string;
  logo_lg: string;
  symbol: string;
  account: string;
  chain: string;
}

export interface AgnosticToken {
  id: string;
  contract: string;
  precision: number;
  symbol: string;
  network: string;
  amount: number;
}

export interface EosMultiRelay {
  id: string;
  reserves: AgnosticToken[];
  contract: string;
  owner: string;
  isMultiContract: boolean;
  smartToken: AgnosticToken;
  fee: number;
}

export interface ModalChoice {
  id: string;
  symbol: string;
  contract: string;
  balance?: string;
  img: string;
  usdValue?: number;
}

export interface NetworkChoice extends ModalChoice {
  usdValue: number;
}

export interface Step {
  name: string;
  description: string;
}

export interface CreatePoolParams {
  reserves: ViewAmount[];
  fee: number;
  onUpdate: OnUpdate;
}

export interface CreatePoolModule {
  init: (param: ModuleParam) => Promise<void>;
  readonly newPoolTokenChoices: (networkToken: string) => ModalChoice[];
  readonly newNetworkTokenChoices: ModalChoice[];
  createPool: (param: CreatePoolParams) => Promise<TxResponse>;
}

export interface HistoryModule {
  fetchHistoryData: (relayId: string) => Promise<any[]>;
}

export interface FeeParams {
  fee: number;
  id: string;
}

export interface NewOwnerParams {
  newOwner: string;
  id: string;
}

export interface BaseToken {
  contract: string;
  symbol: string;
}
export interface PromiseEvent {
  name: string;
  description: string;
  promise: () => Promise<any>;
}

export interface PromiseSequence {
  promises: PromiseEvent[];
  title: string;
}

interface GetBalanceParam {
  tokens: TokenBalanceParam[];
  slow?: boolean;
  disableSetting?: boolean;
}

interface TokenBalanceParam {
  contract: string;
  symbol: string;
  precision?: number;
}

interface TransferParam {
  to: string;
  id: string;
  amount: number;
  memo?: string;
}

export interface TokenBalanceReturn extends TokenBalanceParam {
  balance: number;
}

interface TokenQueries extends TokenBalanceParam {
  balance?: number;
}

export interface NetworkModule {
  readonly networkId: string;
  getBalances: (tokens?: GetBalanceParam) => Promise<TokenBalanceReturn[]>;
}

// Amount in an asset without reference to it's actual precision
// E.g. "10000" will be 1.0000 EOS
export type IntegerAmount = string;

export interface BancorAPIResponseToken {
  id: string;
  code: string;
  name: string;
  primaryCommunityImageName: string;
  liquidityDepth: number;
  decimals: number;
  price: number;
  change24h: number;
  volume24h: Volume24H;
  priceHistory: Array<number[]>;
}

export interface Volume24H {
  ETH: number;
  USD: number;
  EUR: number;
}

export interface ReserveInstance {
  balance: string;
  ratio: number;
  sale_enabled: boolean;
  contract: string;
}

export interface SimpleToken {
  symbol: string;
  name: string;
  contract: string;
  logo: string;
  precision: number;
}

export interface SimpleTokenWithMarketData extends SimpleToken {
  price: string;
  liqDepth: number;
}

export interface Price {
  rate: number;
  diff: number;
  diff7d: number;
  ts: number;
  marketCapUsd: number;
  availableSupply: number;
  volume24h: number;
  diff30d: number;
}

export interface ETH {
  balance: number;
  price: Price;
}

export interface kv {
  [symcode: string]: number;
}

export interface Settings {
  paused: boolean;
  pool_fee: number;
  transaction_fee: string;
  stability_fee: number;
  min_convert: string;
  min_stake: string;
}

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
