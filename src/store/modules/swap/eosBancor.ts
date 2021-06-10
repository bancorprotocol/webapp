import { createModule, mutation, action } from "vuex-class-component";
import {
  ProposedConvertTransaction,
  TradingModule,
  LiquidityModule,
  ViewToken,
  ConvertReturn,
  LiquidityParams,
  OpposingLiquidParams,
  OpposingLiquid,
  EosMultiRelay,
  AgnosticToken,
  CreatePoolModule,
  ModalChoice,
  NetworkChoice,
  FeeParams,
  NewOwnerParams,
  BaseToken,
  CreatePoolParams,
  ViewRelay,
  TokenMeta,
  ViewAmount,
  ProposedFromTransaction,
  ProposedToTransaction,
  ModuleParam,
  TokenBalanceParam,
  TokenBalanceReturn,
  UserPoolBalances,
  PoolTokenPosition,
  TxResponse,
  DFuseTrade,
  ViewTradeEvent,
  ViewLiquidityEvent,
  ViewReserve
} from "@/types/bancor";
import {
  fetchMultiRelays,
  getBalance,
  fetchTokenStats,
  compareString,
  findOrThrow,
  getTokenMeta,
  updateArray,
  fetchMultiRelay,
  buildTokenId,
  EosAccount,
  compareToken,
  multiSteps,
  viewTokenToModalChoice,
  reserveIncludedInEosRelay,
  sortAlongSide,
  sortByLiqDepth,
  assetToDecNumberString,
  decNumberStringToAsset,
  findChangedReserve,
  StringPool,
  buildPoolNameFromReserves
} from "@/api/helpers";
import {
  Sym as Symbol,
  Asset,
  asset_to_number,
  number_to_asset,
  Sym
} from "eos-common";
import { multiContract } from "@/api/eos/multiContractTx";
import { multiContractAction } from "@/contracts/multi";
import { vxm } from "@/store";
import { rpc, dfuseClient } from "@/api/eos/rpc";
import {
  findCost,
  relaysToConvertPaths,
  composeMemo,
  DryRelay,
  HydratedRelay,
  findReturn,
  calculateFundReturn,
  TokenAmount,
  findNewPath,
  parseTransferMemo
} from "@/api/eos/eosBancorCalc";
import _, { uniqWith, first, last } from "lodash";
import wait from "waait";
import { getHardCodedRelays } from "./staticRelays";
import { sortByNetworkTokens } from "@/api/sortByNetworkTokens";
import { liquidateAction } from "@/api/eos/singleContractTx";
import BigNumber from "bignumber.js";
import dayjs from "@/utils/dayjs";
import * as Sentry from "@sentry/browser";

const networkContract = "thisisbancor";

const searchTransactionsWithHigherBlock = `query ($limit: Int64!, $highBlockNum: Int64!) {
  searchTransactionsBackward(query: "receiver:${networkContract} action:transfer data.from:${networkContract}", limit: $limit, highBlockNum: $highBlockNum) {
    results {
      block {
        num
        timestamp
      }
      trace { 
        id
        executedActions {
          json
        }
        matchingActions { 
          json 
        } 
      }
    }
  }
}`;

const past24HourTrades = async (
  lastBlockTarget?: number,
  highBlockNum = -1,
  tradesFetched: DFuseTrade[] = []
): Promise<DFuseTrade[]> => {
  const response = await dfuseClient.graphql(
    searchTransactionsWithHigherBlock,
    {
      variables: {
        limit: 1000,
        highBlockNum
      }
    }
  );

  if (response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  const results: DFuseTrade[] =
    response.data.searchTransactionsBackward.results || [];

  const firstBlock = first(results)!.block.num;
  const lastBlock = last(results)!.block.num;

  if (!lastBlockTarget) {
    const secondsInADay = 86400;
    const blocksPerSecond = 2;
    const searchBlockAmount = secondsInADay * blocksPerSecond;
    lastBlockTarget = firstBlock - searchBlockAmount;
  }

  const blockTargetReached = lastBlock <= lastBlockTarget;
  const latestTrades = [...tradesFetched, ...results];
  if (blockTargetReached) {
    return latestTrades.map(trade => ({
      ...trade,
      trace: {
        ...trade.trace,
        executedActions: trade.trace.executedActions.filter(x => x.json)
      }
    }));
  } else {
    return past24HourTrades(lastBlockTarget, lastBlock - 1, latestTrades);
  }
};

const compareEosMultiRelayToStringPool = (
  relay: EosMultiRelay,
  stringPool: StringPool
) => {
  const isMulti = stringPool.poolToken;
  if (isMulti) {
    const sameSymbol = compareString(
      relay.smartToken.symbol,
      stringPool.poolToken!
    );
    const sameAccount = compareString(relay.contract, stringPool.pool);
    return sameSymbol && sameAccount;
  } else {
    return compareString(relay.contract, stringPool.pool);
  }
};

const bnt: BaseToken = {
  symbol: "BNT",
  contract: "bntbntbntbnt"
};

const compareAgnosticToBalanceParam = (
  agnostic: AgnosticToken,
  balance: TokenBalanceReturn
) =>
  compareString(balance.contract, agnostic.contract) &&
  compareString(agnostic.symbol, balance.symbol);

const agnosticToTokenBalanceParam = (
  agnostic: AgnosticToken
): TokenBalanceParam => ({
  contract: agnostic.contract,
  symbol: agnostic.symbol
});

const dryToTraditionalEdge = (relay: DryRelay): [string, string] => [
  buildTokenId({
    contract: relay.reserves[0].contract,
    symbol: relay.reserves[0].symbol.code().to_string()
  }),
  buildTokenId({
    contract: relay.reserves[1].contract,
    symbol: relay.reserves[1].symbol.code().to_string()
  })
];

const pureTimesAsset = (asset: Asset, multiplier: number): Asset => {
  const newAsset = new Asset(asset.to_string());
  const res = newAsset.times(multiplier);
  if (res.isEqual(newAsset)) {
    return number_to_asset(
      asset_to_number(newAsset) * multiplier,
      newAsset.symbol
    );
  } else {
    return res;
  }
};

const splitAsset = (asset: Asset): [Asset, Asset] => {
  const originalAssetString = asset.to_string();
  const newAsset = new Asset(originalAssetString);
  const newAsset2 = new Asset(originalAssetString);
  const firstAssetNumber = asset_to_number(newAsset) * 0.5;
  const firstHalfAsset = number_to_asset(firstAssetNumber, newAsset.symbol);
  const secondHalfAsset = newAsset2.minus(firstHalfAsset);

  return [firstHalfAsset, secondHalfAsset];
};

const tokenContractSupportsOpen = async (contractName: string) => {
  const abiConf = await rpc.get_abi(contractName);
  return abiConf.abi.actions.some(action => action.name == "open");
};

const relayHasReserveBalances = (relay: EosMultiRelay) =>
  relay.reserves.every(reserve => new BigNumber(reserve.amount).gt(0));

const reservesIncludeTokenMeta = (tokenMeta: TokenMeta[]) => (
  relay: EosMultiRelay
) => {
  const status = relay.reserves.every(reserve =>
    tokenMeta.some(
      meta =>
        compareString(reserve.contract, meta.account) &&
        compareString(reserve.symbol, meta.symbol)
    )
  );
  if (!status)
    console.warn(
      "Dropping relay",
      relay.reserves.map(x => x.symbol),
      "because it does not exist in tokenMeta"
    );
  return status;
};

const singleUnitCost = (
  returningBalance: Asset,
  opposingBalance: Asset
): Asset => {
  const returningBalanceNumber = asset_to_number(returningBalance);
  const opposingBalanceNumber = asset_to_number(opposingBalance);
  const decAmount = returningBalanceNumber / opposingBalanceNumber;
  return number_to_asset(decAmount, new Sym(returningBalance.symbol));
};

const tokenAmountToId = (tokenAmount: TokenAmount) =>
  buildTokenId({
    contract: tokenAmount.contract,
    symbol: tokenAmount.amount.symbol.code().to_string()
  });

const reservesIncludeTokenMetaDry = (tokenMeta: TokenMeta[]) => (
  relay: DryRelay
) => {
  const status = relay.reserves.every(reserve =>
    tokenMeta.some(
      meta =>
        compareString(reserve.contract, meta.account) &&
        compareString(reserve.symbol.code().to_string(), meta.symbol)
    )
  );
  if (!status)
    console.warn(
      "Dropping relay containing reserves",
      relay.reserves.map(x => x.symbol),
      "because they are not included in reserves"
    );
  return status;
};

const generateEosxLink = (txId: string) => `https://www.eosx.io/tx/${txId}`;

const fetchBalanceAssets = async (tokens: BaseToken[], account: string) => {
  return Promise.all(
    tokens.map(async token => {
      const res: { rows: { balance: string }[] } = await rpc.get_table_rows({
        code: token.contract,
        scope: account,
        table: "accounts"
      });
      const assets = res.rows.map(row => new Asset(row.balance));
      const foundAsset = assets.find(
        asset => asset.symbol.code().to_string() == token.symbol
      );
      return foundAsset;
    })
  );
};

interface EosOpposingLiquid extends OpposingLiquid {
  smartTokenAmount: Asset;
}

const blackListedTokens: BaseToken[] = [
  { contract: "therealkarma", symbol: "KARMA" },
  { contract: "wizznetwork1", symbol: "WIZZ" }
];

const noBlackListedReservesDry = (blackListedTokens: BaseToken[]) => (
  relay: DryRelay
) =>
  !relay.reserves.some(reserve =>
    blackListedTokens.some(
      token =>
        compareString(reserve.contract, token.contract) &&
        compareString(reserve.symbol.code().to_string(), token.symbol)
    )
  );

const noBlackListedReserves = (blackListedTokens: BaseToken[]) => (
  relay: EosMultiRelay
): boolean =>
  !relay.reserves.some(reserve =>
    blackListedTokens.some(
      token =>
        compareString(reserve.contract, token.contract) &&
        compareString(reserve.symbol, reserve.symbol)
    )
  );

const mandatoryNetworkTokens: BaseToken[] = [
  { contract: "bntbntbntbnt", symbol: "BNT" },
  { contract: "usdbusdbusdb", symbol: "USDB" }
];

const isBaseToken = (token: BaseToken) => (comparasion: BaseToken): boolean =>
  token.symbol == comparasion.symbol && token.contract == comparasion.contract;

const relayIncludesBothTokens = (
  networkTokens: BaseToken[],
  tradingTokens: BaseToken[]
) => {
  const networkTokensExcluded = _.differenceWith(
    tradingTokens,
    networkTokens,
    _.isEqual
  );

  return (relay: EosMultiRelay) => {
    const includesNetworkToken = relay.reserves.some(reserve =>
      networkTokens.some(isBaseToken(reserve))
    );
    const includesTradingToken = relay.reserves.some(reserve =>
      networkTokensExcluded.some(isBaseToken(reserve))
    );
    const includesNetworkTokens = relay.reserves.every(reserve =>
      networkTokens.some(isBaseToken(reserve))
    );
    return (
      (includesNetworkToken && includesTradingToken) || includesNetworkTokens
    );
  };
};

const lowestAsset = (assetOne: Asset, assetTwo: Asset) =>
  assetOne.isLessThan(assetTwo) ? assetOne : assetTwo;

const assetToSymbolName = (asset: Asset) => asset.symbol.code().to_string();

export interface ViewTokenMinusLogo {
  symbol: string;
  name: string;
  price: number;
  liqDepth: number;
  change24h: number;
  volume24h: number;
  source: string;
  precision: number;
  contract: string;
  balance?: number;
}

const agnosticToAsset = (agnostic: AgnosticToken): Asset =>
  decNumberStringToAsset(agnostic.amount, agnostic.symbol);

const agnosticToTokenAmount = (agnostic: AgnosticToken): TokenAmount => ({
  contract: agnostic.contract,
  amount: agnosticToAsset(agnostic)
});

const simpleReturn = (from: Asset, to: Asset) =>
  asset_to_number(to) / asset_to_number(from);

const baseReturn = (from: AgnosticToken, to: AgnosticToken) => {
  const fromAsset = agnosticToAsset(from);
  const toAsset = agnosticToAsset(to);
  const reward = simpleReturn(fromAsset, toAsset);
  return number_to_asset(reward, toAsset.symbol);
};

interface KnownPrice {
  symbol: string;
  unitPrice: number;
}

export interface TokenSymbol {
  contract: EosAccount;
  symbol: Symbol;
}

const compareTokenSymbol = (t1: TokenSymbol, t2: TokenSymbol) =>
  compareString(t1.contract, t2.contract) &&
  compareString(t1.symbol.code().to_string(), t2.symbol.code().to_string());

const compareEosMultiRelay = (r1: EosMultiRelay, r2: EosMultiRelay) =>
  compareString(r1.id, r2.id);

const compareAssetPrice = (asset: Asset, knownPrice: KnownPrice) =>
  compareString(assetToSymbolName(asset), knownPrice.symbol);

const sortByKnownToken = (assets: Asset[], knownPrices: KnownPrice[]) =>
  assets.sort(a =>
    knownPrices.some(price => compareAssetPrice(a, price)) ? -1 : 1
  );

const calculatePriceBothWays = (
  reserves: AgnosticToken[],
  knownPrices: KnownPrice[]
) => {
  const atLeastOnePriceKnown = reserves.some(reserve =>
    knownPrices.some(price => compareString(reserve.symbol, price.symbol))
  );
  if (reserves.length !== 2)
    throw new Error("This only works for 2 reserve relays");
  if (!atLeastOnePriceKnown)
    throw new Error(
      "Failed to determine USD price, was not passed in known prices"
    );
  if (reserves.some(reserve => new BigNumber(reserve.amount).eq(0)))
    throw new Error("One of more of the reserves passed has a zero balance");

  const [reserveOne, reserveTwo] = reserves;
  const rewards = [
    baseReturn(reserveOne, reserveTwo),
    baseReturn(reserveTwo, reserveOne)
  ];

  const [knownValue, unknownValue] = sortByKnownToken(rewards, knownPrices);

  const knownToken = knownPrices.find(price =>
    compareAssetPrice(knownValue, price)
  )!.unitPrice;
  const unknownToken = asset_to_number(knownValue) * knownToken;

  return [
    {
      unitPrice: knownToken,
      symbol: knownValue.symbol.code().to_string()
    },
    {
      unitPrice: unknownToken,
      symbol: unknownValue.symbol.code().to_string()
    }
  ];
};

const calculateLiquidtyDepth = (
  relay: EosMultiRelay,
  knownPrices: KnownPrice[]
) => {
  const [indexedToken] = sortByKnownToken(
    relay.reserves.map(agnosticToAsset),
    knownPrices
  );
  return (
    asset_to_number(indexedToken) *
    knownPrices.find(price => compareAssetPrice(indexedToken, price))!.unitPrice
  );
};

const buildTwoFeedsFromRelay = (
  relay: EosMultiRelay,
  knownPrices: KnownPrice[]
): RelayFeed[] => {
  const prices = calculatePriceBothWays(relay.reserves, knownPrices);
  return prices.map(price => {
    const token = relay.reserves.find(reserve =>
      compareString(reserve.symbol, price.symbol)
    )!;
    return {
      costByNetworkUsd: price.unitPrice,
      liqDepth: calculateLiquidtyDepth(relay, knownPrices),
      smartTokenId: buildTokenId({
        contract: relay.smartToken.contract,
        symbol: relay.smartToken.symbol
      }),
      tokenId: buildTokenId({ contract: token.contract, symbol: token.symbol })
    };
  });
};

const getEosioTokenPrecision = async (
  symbol: string,
  contract: string
): Promise<number> => {
  const res = await rpc.get_table_rows({
    code: contract,
    table: "stat",
    scope: symbol
  });
  if (res.rows.length == 0) throw new Error("Failed to find token");
  return new Asset(res.rows[0].supply).symbol.precision();
};

const chopSecondSymbol = (one: string, two: string, maxLength = 7) =>
  two.slice(0, maxLength - one.length) + one;

const chopSecondLastChar = (text: string, backUp: number) => {
  const secondLastIndex = text.length - backUp - 1;
  return text
    .split("")
    .filter((_, index) => index !== secondLastIndex)
    .join("");
};

const tokenStrategies: Array<(one: string, two: string) => string> = [
  chopSecondSymbol,
  (one, two) => chopSecondSymbol(one, chopSecondLastChar(two, 1)),
  (one, two) => chopSecondSymbol(one, chopSecondLastChar(two, 2)),
  (one, two) => chopSecondSymbol(one, chopSecondLastChar(two, 3)),
  (one, two) => chopSecondSymbol(one, two.split("").reverse().join(""))
];

const generateSmartTokenSymbol = async (
  symbolOne: string,
  symbolTwo: string,
  multiTokenContract: string
) => {
  for (const strat in tokenStrategies) {
    const draftedToken = tokenStrategies[strat](symbolOne, symbolTwo);
    try {
      await getEosioTokenPrecision(draftedToken, multiTokenContract);
    } catch (e) {
      return draftedToken;
    }
  }
  throw new Error("Failed to find a new SmartTokenSymbol!");
};

const multiToDry = (relay: EosMultiRelay): DryRelay => ({
  reserves: relay.reserves.map(reserve => ({
    contract: reserve.contract,
    symbol: new Symbol(reserve.symbol, reserve.precision)
  })),
  contract: relay.contract,
  smartToken: {
    symbol: new Symbol(relay.smartToken.symbol, relay.smartToken.precision),
    contract: relay.smartToken.contract
  },
  isMultiContract: relay.isMultiContract
});

const eosMultiToHydrated = (relay: EosMultiRelay): HydratedRelay => ({
  reserves: relay.reserves.map(
    (reserve): TokenAmount => ({
      contract: reserve.contract,
      amount: decNumberStringToAsset(reserve.amount, reserve.symbol)
    })
  ),
  contract: relay.contract,
  fee: relay.fee,
  isMultiContract: relay.isMultiContract,
  smartToken: {
    symbol: new Symbol(relay.smartToken.symbol, relay.smartToken.precision),
    contract: relay.smartToken.contract
  }
});

type FeatureEnabled = (relay: EosMultiRelay, loggedInUser: string) => boolean;
type Feature = [string, FeatureEnabled];

const isOwner: FeatureEnabled = (relay, account) => relay.owner == account;

interface RelayFeed {
  smartTokenId: string;
  tokenId: string;
  liqDepth: number;
  costByNetworkUsd?: number;
  change24H?: number;
  volume24H?: number;
}

const VuexModule = createModule({
  strict: false
});

export class EosBancorModule
  extends VuexModule.With({ namespaced: "eosBancor/" })
  implements TradingModule, LiquidityModule, CreatePoolModule {
  initialised: boolean = false;
  relaysList: EosMultiRelay[] = [];
  relayFeed: RelayFeed[] = [];
  loadingPools: boolean = true;
  usdPrice = 0;
  usdPriceOfBnt = 0;
  tokenMeta: TokenMeta[] = [];
  moreTokensAvailable = false;
  loadingTokens = false;

  get morePoolsAvailable() {
    return false;
  }

  @mutation setLoadingPools(status: boolean) {
    this.loadingPools = status;
  }

  @action async loadMorePools() {}

  get supportedFeatures() {
    return (id: string) => {
      const currentUser = this.currentUser;
      const relay = this.relaysList.find(relay => compareString(relay.id, id))!;
      if (!relay.isMultiContract) return ["removeLiquidity"];
      const features: Feature[] = [
        ["addLiquidity", () => true],
        [
          "removeLiquidity",
          relay =>
            relay.reserves.some(reserve => new BigNumber(reserve.amount).gt(0))
        ],
        ["setFee", isOwner],
        ["changeOwner", isOwner],
        [
          "deleteRelay",
          relay =>
            relay.reserves.every(reserve => new BigNumber(reserve.amount).eq(0))
        ]
      ];
      return features
        .filter(([, test]) => test(relay, currentUser))
        .map(([name]) => name);
    };
  }

  get currentUser() {
    return vxm.wallet.currentUser;
  }

  @action async onAuthChange(currentUser: string | false) {
    if (currentUser) {
      Sentry.setUser({ id: currentUser });
      const reserves = uniqWith(
        this.relaysList.flatMap(relay => relay.reserves),
        (a, b) => compareString(a.id, b.id)
      );
      this.fetchTokenBalancesIfPossible(reserves);
    } else {
      Sentry.configureScope(scope => scope.setUser(null));
    }
  }

  get wallet() {
    return "eos";
  }

  get poolTokenPositions(): PoolTokenPosition[] {
    const smartTokensIds = this.relaysList.map(relay => relay.smartToken.id);
    const smartTokenBalances = vxm.eosNetwork.balances.filter(balance =>
      smartTokensIds.some(id =>
        compareString(
          buildTokenId({ contract: balance.contract, symbol: balance.symbol }),
          id
        )
      )
    );

    const viewRelays = this.relays;
    const data = smartTokenBalances.map(balance => {
      const smartTokenId = buildTokenId(balance);
      const viewRelay = viewRelays.find(relay =>
        compareString(relay.id, smartTokenId)
      )!;
      if (!viewRelay)
        console.warn("Pool token position does not have a relay", smartTokenId);
      return {
        relay: viewRelay,
        smartTokenAmount: balance.balance
      };
    });

    return data.filter(row => row.relay);
  }

  get balance() {
    return (token: { contract: string; symbol: string }) => {
      // @ts-ignore
      return this.$store.rootGetters[`${this.wallet}Network/balance`](token);
    };
  }

  get newPoolTokenChoices() {
    return (): ModalChoice[] => {
      return this.tokenMeta
        .map(tokenMeta => {
          const { symbol, account: contract } = tokenMeta;
          const balance = this.balance({
            contract,
            symbol
          });
          return {
            id: buildTokenId({ contract, symbol }),
            symbol,
            contract,
            balance: balance && balance.balance,
            img: tokenMeta.logo
          };
        })
        .filter(
          (value, index, array) =>
            array.findIndex(token => value.symbol == token.symbol) == index
        )
        .filter(() => {
          // currently been asked to allow new relays of the same reserve.
          return true;

          // const suggestedReserves = [tokenMeta.id, networkToken];
          // const existingReserveExists = this.relays.some(relay =>
          // relay.reserves.every(existingReserve =>
          // suggestedReserves.some(suggestedReserve =>
          // compareString(existingReserve.id, suggestedReserve)
          // )
          // )
          // );
          // return !existingReserveExists;
        })
        .filter(
          token =>
            !mandatoryNetworkTokens.some(
              networkToken => token.symbol == networkToken.symbol
            )
        )
        .sort((a, b) => {
          const second = isNaN(b.balance) ? 0 : Number(b.balance);
          const first = isNaN(a.balance) ? 0 : Number(a.balance);
          return second - first;
        });
    };
  }

  get secondaryReserveChoices(): ModalChoice[] {
    return this.newNetworkTokenChoices;
  }

  get primaryReserveChoices() {
    return (secondaryReserveId: string): ModalChoice[] => {
      const poolsWithReserve = this.relaysList.filter(
        reserveIncludedInEosRelay(secondaryReserveId)
      );
      const reserves = uniqWith(
        poolsWithReserve
          .flatMap(relay => relay.reserves)
          .filter(reserve => !compareString(reserve.id, secondaryReserveId)),
        (a, b) => compareString(a.id, b.id)
      );
      const choices = reserves
        .filter(reserve =>
          this.tokens.some(token => compareString(reserve.id, token.id))
        )
        .map(reserve =>
          viewTokenToModalChoice(
            this.tokens.find(token => compareString(token.id, reserve.id))!
          )
        )
        .filter(token => !compareString(token.id, secondaryReserveId));

      return sortAlongSide(
        choices,
        choice => choice.id.toLowerCase(),
        this.tokens.map(token => token.id.toLowerCase())
      );
    };
  }

  get newNetworkTokenChoices(): NetworkChoice[] {
    const usdb: BaseToken = {
      symbol: "USDB",
      contract: "usdbusdbusdb"
    };

    return [
      {
        ...bnt,
        id: buildTokenId(bnt),
        usdValue: this.usdPriceOfBnt
      },
      {
        ...usdb,
        id: buildTokenId(usdb),
        usdValue: 1
      }
    ].map(choice => ({
      ...choice,
      balance: this.balance(choice) && this.balance(choice)!.balance,
      img: this.tokenMetaObj(choice.id).logo
    }));
  }

  get currentUserBalances(): TokenBalanceReturn[] {
    return vxm.eosNetwork.balances;
  }

  @action async fetchTokenBalancesIfPossible(tokens: TokenBalanceParam[]) {
    if (!this.currentUser) return;
    const tokensFetched = this.currentUserBalances;
    const allTokens = _.uniqWith(
      this.relaysList.flatMap(relay => relay.reserves),
      (a, b) => compareString(a.id, b.id)
    );
    const tokenBalancesNotYetFetched = _.differenceWith(
      allTokens,
      tokensFetched,
      compareAgnosticToBalanceParam
    );

    const tokensToAskFor = _.uniqWith(
      [
        ...tokens,
        ...tokenBalancesNotYetFetched.map(agnosticToTokenBalanceParam)
      ],
      compareToken
    );

    return vxm.eosNetwork.getBalances({ tokens: tokensToAskFor, slow: false });
  }

  @action async updateFee({ fee, id }: FeeParams): Promise<TxResponse> {
    const relay = await this.relayById(id);
    const updateFeeAction = multiContract.updateFeeAction(
      relay.smartToken.symbol,
      fee
    );
    const txRes = await this.triggerTx([updateFeeAction]);
    const txId = txRes.transaction_id as string;

    return {
      txId,
      blockExplorerLink: generateEosxLink(txId),
      blockExplorerName: "EOSX"
    };
  }

  @action async removeRelay(id: string): Promise<TxResponse> {
    const relay = await this.relayById(id);
    const reserves = relay.reserves.map(reserve => reserve.symbol);
    const nukeRelayActions = multiContract.nukeRelayAction(
      relay.smartToken.symbol,
      reserves
    );
    const txRes = await this.triggerTx(nukeRelayActions);
    this.waitAndUpdate();

    const txId = txRes.transaction_id as string;

    return {
      txId,
      blockExplorerLink: generateEosxLink(txId),
      blockExplorerName: "EOSX"
    };
  }

  @action async updateOwner({
    id,
    newOwner
  }: NewOwnerParams): Promise<TxResponse> {
    const relay = await this.relayById(id);
    const updateOwnerAction = multiContract.updateOwnerAction(
      relay.smartToken.symbol,
      newOwner
    );
    const txRes = await this.triggerTx([updateOwnerAction]);
    return {
      txId: txRes.transaction_id,
      blockExplorerLink: generateEosxLink(txRes.transaction_id),
      blockExplorerName: "EOSX"
    };
  }

  @action async createPool(poolParams: CreatePoolParams): Promise<TxResponse> {
    const reserveAssets = await Promise.all(
      poolParams.reserves.map(async reserve => {
        const data = this.tokenMetaObj(reserve.id);
        return {
          amount: number_to_asset(
            Number(reserve.amount),
            new Symbol(
              data.symbol,
              await getEosioTokenPrecision(data.symbol, data.account)
            )
          ),
          contract: data.account
        };
      })
    );

    const [networkAsset, tokenAsset] = sortByNetworkTokens(
      reserveAssets.map(reserveAsset => reserveAsset.amount),
      asset => asset.symbol.code().to_string()
    );

    const smartTokenSymbol = await generateSmartTokenSymbol(
      tokenAsset.symbol.code().to_string(),
      networkAsset.symbol.code().to_string(),
      process.env.VUE_APP_SMARTTOKENCONTRACT!
    );

    const networkSymbol = networkAsset.symbol.code().to_string();
    const initialLiquidity = compareString(networkSymbol, "USDB")
      ? 0.5
      : 1 * asset_to_number(networkAsset);

    const actions = await multiContract.kickStartRelay(
      smartTokenSymbol,
      reserveAssets,
      Number(initialLiquidity.toFixed(0)),
      poolParams.fee
    );

    const txRes = await this.triggerTx(actions!);
    const txId = txRes.transaction_id as string;

    return {
      txId,
      blockExplorerLink: generateEosxLink(txId),
      blockExplorerName: "EOSX"
    };
  }

  get tokenMetaObj() {
    return (id: string) => {
      return findOrThrow(
        this.tokenMeta,
        meta => compareString(meta.id, id),
        `Failed to find token meta for ${id}`
      );
    };
  }

  get relaysWithFeeds() {
    return this.relaysList
      .filter(
        relayIncludesBothTokens(
          mandatoryNetworkTokens,
          this.tokenMeta.map(token => ({
            contract: token.account,
            symbol: token.symbol
          }))
        )
      )
      .filter(relay =>
        relay.reserves.every(reserve => {
          const relayId = buildTokenId(relay.smartToken);
          const reserveId = buildTokenId(reserve);
          const feed = this.relayFeed.find(
            feed =>
              compareString(feed.smartTokenId, relayId) &&
              compareString(feed.tokenId, reserveId)
          );
          return feed;
        })
      );
  }

  get tokens(): ViewToken[] {
    return this.relaysWithFeeds
      .flatMap(relay =>
        relay.reserves.map(reserve => {
          const reserveTokenId = buildTokenId({
            contract: reserve.contract,
            symbol: reserve.symbol
          });

          const feed = findOrThrow(
            this.relayFeed,
            (feed: RelayFeed) =>
              compareString(feed.smartTokenId, relay.id) &&
              compareString(feed.tokenId, reserveTokenId),
            `failed finding relay feed for ${relay.id} ${reserveTokenId}`
          );
          return {
            id: reserveTokenId,
            symbol: reserve.symbol,
            price: feed.costByNetworkUsd,
            change24h: feed.change24H,
            liqDepth: feed.liqDepth,
            volume24h: feed.volume24H,
            contract: reserve.contract,
            precision: reserve.precision
          };
        })
      )
      .sort(sortByLiqDepth)
      .reduce<any[]>((acc, item) => {
        const existingToken = acc.find(token =>
          compareString(token.id, item.id)
        );

        return existingToken
          ? updateArray(
              acc,
              token => compareString(token.id, item.id),
              token => ({
                ...token,
                liqDepth:
                  existingToken.liqDepth +
                  (isNaN(item.liqDepth) ? 0 : item.liqDepth),
                ...(!existingToken.change24h &&
                  item.change24h && { change24h: item.change24h }),
                ...(!existingToken.volume24h &&
                  item.volume24h && { volume24h: item.volume24h })
              })
            )
          : [...acc, item];
      }, [])
      .map(
        (token): ViewToken => {
          const id = token.id as string;
          const contract = token.contract as string;
          const symbol = token.symbol as string;

          const tokenMeta = findOrThrow(this.tokenMeta, token =>
            compareString(token.id, id)
          );
          const tokenBalance = vxm.eosNetwork.balance({
            contract,
            symbol
          });
          const tokenBalanceString =
            tokenBalance && new BigNumber(tokenBalance.balance).toString();
          return {
            ...token,
            name: tokenMeta.name,
            balance: tokenBalanceString,
            logo: tokenMeta.logo,
            limitOrderAvailable: false,
            tradeSupported: true,
            liquidityProtection: false
          };
        }
      );
  }

  get token(): (arg0: string) => ViewToken {
    return (id: string) => {
      const tradableToken = this.tokens.find(token =>
        compareString(token.id, id)
      );

      if (tradableToken) {
        return tradableToken;
      } else {
        const token = findOrThrow(
          this.relaysList.flatMap(relay => relay.reserves),
          token => compareString(token.id, id),
          `Failed to find token ${id} in this.token on EOS`
        );

        const meta = this.tokenMetaObj(token.id);

        return {
          ...token,
          name: meta.name,
          logo: meta.logo,
          tradeSupported: true,
          limitOrderAvailable: false
        };
      }
    };
  }

  get stats() {
    const eos = this.tokens.find(token =>
      compareString(
        buildTokenId({ contract: "eosio.token", symbol: "EOS" }),
        token.id
      )
    );
    return {
      totalLiquidityDepth: this.relays.reduce(
        (acc, item) => acc + item.liqDepth,
        0
      ),
      nativeTokenPrice: {
        symbol: "EOS",
        price: (eos && eos.price) || 0
      },
      twentyFourHourTradeCount: this.liquidityHistory.data.length,
      totalVolume24h: this.relays
        .map(x => Number(x.volume || 0))
        .reduce((sum, current) => sum + current)
    };
  }

  get relay() {
    return (id: string) => {
      return findOrThrow(
        this.relays,
        relay => compareString(relay.id, id),
        `Failed to find relay with ID of ${id}`
      );
    };
  }

  get relays(): ViewRelay[] {
    return this.relaysList
      .filter(
        relayIncludesBothTokens(
          mandatoryNetworkTokens,
          this.tokenMeta.map(token => ({
            contract: token.account,
            symbol: token.symbol
          }))
        )
      )
      .filter(reservesIncludeTokenMeta(this.tokenMeta))
      .filter(relay =>
        this.relayFeed.some(feed =>
          compareString(
            feed.smartTokenId,
            buildTokenId({
              contract: relay.smartToken.contract,
              symbol: relay.smartToken.symbol
            })
          )
        )
      )
      .map(relay => {
        const relayFeed = this.relayFeed.find(feed =>
          compareString(
            feed.smartTokenId,
            buildTokenId({
              contract: relay.smartToken.contract,
              symbol: relay.smartToken.symbol
            })
          )
        )!;

        const sortedReserves = sortByNetworkTokens(
          relay.reserves,
          reserve => reserve.symbol
        );

        const reserves = sortedReserves.map(
          (reserve: AgnosticToken) =>
            ({
              ...reserve,
              reserveWeight: 0.5,
              reserveId: relay.id + reserve.id,
              logo: [this.token(reserve.id).logo],
              ...(reserve.amount && { balance: reserve.amount })
            } as ViewReserve)
        );
        return {
          ...relay,
          tradeSupported: true,
          version: relay.isMultiContract ? 2 : 1,
          id: buildTokenId({
            contract: relay.smartToken.contract,
            symbol: relay.smartToken.symbol
          }),
          name: buildPoolNameFromReserves(reserves),
          symbol: sortedReserves[1].symbol,
          liqDepth: relayFeed && relayFeed.liqDepth,
          addProtectionSupported: false,
          addLiquiditySupported: relay.isMultiContract,
          removeLiquiditySupported: true,
          v2: false,
          liquidityProtection: false,
          whitelisted: false,
          reserves
        } as ViewRelay;
      });
  }

  get convertableRelays() {
    return this.relaysWithFeeds
      .map(relay => {
        const relayId = buildTokenId({
          contract: relay.smartToken.contract,
          symbol: relay.smartToken.symbol
        });
        const feed = this.relayFeed.find(feed =>
          compareString(feed.smartTokenId, relayId)
        )!;
        return {
          ...relay,
          liqDepth: feed!.liqDepth
        };
      })
      .sort(sortByLiqDepth)
      .filter(
        (value, index, arr) =>
          arr.findIndex(x =>
            x.reserves.every(reserve =>
              value.reserves.some(
                y =>
                  reserve.symbol == y.symbol && reserve.contract == y.contract
              )
            )
          ) == index
      );
  }

  @action async buildManuallyIfNotIncludedInExistingFeeds({
    relays,
    existingFeeds
  }: {
    relays: EosMultiRelay[];
    existingFeeds: RelayFeed[];
  }) {
    this.updateMultiRelays(relays);
    const relaysNotFulfilled = _.differenceWith(relays, existingFeeds, (a, b) =>
      compareString(
        buildTokenId({
          contract: a.smartToken.contract,
          symbol: a.smartToken.symbol
        }),
        b.smartTokenId
      )
    );

    await this.buildPossibleRelayFeedsFromHydrated(
      relaysNotFulfilled.filter(relayHasReserveBalances)
    );
  }

  @action async addDryPools({
    dryRelays,
    chunkSize,
    waitTime
  }: {
    dryRelays: DryRelay[];
    chunkSize: number;
    waitTime: number;
  }) {
    const chunked = _.chunk(dryRelays, chunkSize);
    const [firstChunk, ...remainingChunks] = chunked;
    const [bancorApiFeeds, firstBatch] = await Promise.all([
      this.buildPossibleRelayFeedsFromBancorApi({ relays: dryRelays }),
      this.hydrateOldRelays(firstChunk)
    ]);

    this.buildManuallyIfNotIncludedInExistingFeeds({
      relays: firstBatch,
      existingFeeds: bancorApiFeeds
    });

    for (const chunk in remainingChunks) {
      await wait(waitTime);
      const relays = await this.hydrateOldRelays(remainingChunks[chunk]);
      this.buildManuallyIfNotIncludedInExistingFeeds({
        relays,
        existingFeeds: bancorApiFeeds
      });
    }
  }

  @action async addPools({
    multiRelays,
    dryDelays,
    tokenMeta
  }: {
    multiRelays: EosMultiRelay[];
    dryDelays: DryRelay[];
    tokenMeta: TokenMeta[];
  }) {
    const passedMultiRelays = multiRelays
      .filter(reservesIncludeTokenMeta(tokenMeta))
      .filter(noBlackListedReserves(blackListedTokens));

    this.updateMultiRelays(passedMultiRelays);
    await this.buildPossibleRelayFeedsFromHydrated(
      passedMultiRelays.filter(relayHasReserveBalances)
    );

    const passedDryPools = dryDelays
      .filter(noBlackListedReservesDry(blackListedTokens))
      .filter(reservesIncludeTokenMetaDry(tokenMeta));

    await this.addDryPools({
      dryRelays: passedDryPools,
      chunkSize: 4,
      waitTime: 100
    });
  }

  @mutation setInitialised(status: boolean) {
    this.initialised = status;
  }

  @action async refresh() {
    return;
  }

  @action async fetchBalancesFromReserves(relays: DryRelay[]) {
    const tokens = relays
      .flatMap(relay => relay.reserves)
      .map(reserve => ({
        contract: reserve.contract,
        symbol: reserve.symbol.code().to_string()
      }));

    const uniqueTokens = _.uniqWith(
      tokens,
      (a, b) =>
        compareString(a.symbol, b.symbol) &&
        compareString(a.contract, b.contract)
    );

    return vxm.eosNetwork.getBalances({
      tokens: uniqueTokens,
      slow: false
    });
  }

  @action async bareMinimumForTrade({
    fromId,
    toId,
    v1Relays,
    v2Relays,
    tokenMeta
  }: {
    fromId: string;
    toId: string;
    v1Relays: DryRelay[];
    v2Relays: EosMultiRelay[];
    tokenMeta: TokenMeta[];
  }) {
    const allDry = [...v1Relays, ...v2Relays.map(multiToDry)];
    const foundPath = await findNewPath(fromId, toId, allDry, dry => {
      const [from, to] = dry.reserves.map(r =>
        buildTokenId({
          contract: r.contract,
          symbol: r.symbol.code().to_string()
        })
      );
      return [from, to];
    });

    const relaysInvolved = foundPath.hops.flat(1);
    const requiredV1s = relaysInvolved.filter(relay => !relay.isMultiContract);
    const accomodatingV1Relays = requiredV1s;
    await this.addPools({
      multiRelays: v2Relays,
      dryDelays: accomodatingV1Relays,
      tokenMeta
    });

    const remainingV1Relays = v1Relays.filter(
      relay =>
        !accomodatingV1Relays.some(r =>
          compareTokenSymbol(relay.smartToken, r.smartToken)
        )
    );

    this.addPools({
      multiRelays: [],
      tokenMeta,
      dryDelays: remainingV1Relays
    });
  }

  liquidityHistoryArr: DFuseTrade[] = [];
  liquidityHistoryLoading: boolean = true;
  liquidityHistoryError: string = "";

  @mutation setLiquidityHistoryError(errorMessage: string) {
    this.liquidityHistoryError = errorMessage;
    this.liquidityHistoryLoading = false;
  }

  @mutation setLiquidityHistory(trades: DFuseTrade[]) {
    this.liquidityHistoryArr = trades;
    this.liquidityHistoryLoading = false;
  }

  get liquidityHistory() {
    const relays = this.relaysList;

    const parsedPools = this.liquidityHistoryArr.map(trade => {
      const fromTokenAction = first(trade.trace.matchingActions)!;
      const poolsInTrade = parseTransferMemo(fromTokenAction.json.memo).pools;
      const enteringPool = first(poolsInTrade)!;
      const exitingPool = last(poolsInTrade)!;
      return {
        ...trade,
        enteringPool,
        exitingPool
      };
    });

    const withKnownPools = parsedPools.filter(
      trade =>
        relays.some(relay =>
          compareEosMultiRelayToStringPool(relay, trade.enteringPool)
        ) &&
        relays.some(relay =>
          compareEosMultiRelayToStringPool(relay, trade.exitingPool)
        )
    );

    // @ts-ignore
    const data: ViewLiquidityEvent<ViewTradeEvent>[] = withKnownPools
      .map(trade => {
        const dayjsTime = dayjs(trade.block.timestamp);

        const fromTokenAction = first(trade.trace.matchingActions)!;

        const fromAmountAsset = new Asset(fromTokenAction.json.quantity);
        const fromSymbol = fromAmountAsset.symbol.code().to_string();

        const initialTransferMemoObj = parseTransferMemo(
          fromTokenAction.json.memo
        );
        const toSymbol = last(initialTransferMemoObj.pools)!.destSymbol;
        const destinationAccount = initialTransferMemoObj.destAccount;

        const executedActions = trade.trace.executedActions.map(x => x.json);
        const rewardTransferAction = executedActions.find(x => {
          const res =
            x.to &&
            x.from &&
            x.quantity &&
            compareString(x.to, destinationAccount) &&
            compareString(
              new Asset(x.quantity).symbol.code().to_string(),
              toSymbol
            ) &&
            (compareString(x.from, trade.exitingPool.pool) ||
              compareString(x.from, "thisisbancor"));
          return res;
        });
        if (!rewardTransferAction) return;

        const enteringRelay = findOrThrow(relays, relay =>
          compareEosMultiRelayToStringPool(relay, trade.enteringPool)
        );
        const exitingRelay = findOrThrow(relays, relay =>
          compareEosMultiRelayToStringPool(relay, trade.exitingPool)
        );

        const fromToken = enteringRelay.reserves.find(reserve =>
          compareString(reserve.symbol, fromSymbol)
        );

        if (!fromToken) return;
        const toToken = findOrThrow(
          exitingRelay.reserves,
          reserve => compareString(reserve.symbol, toSymbol),
          `failed finding to token ${toSymbol}`
        );
        const fromTokenI = this.token(fromToken.id);

        const valueTransmitted =
          asset_to_number(fromAmountAsset) *
          ((fromTokenI && fromTokenI.price) || 0);

        return {
          type: "swap",
          account: initialTransferMemoObj.destAccount,
          txLink: `https://www.eosx.io/tx/${trade.trace.id}`,
          accountLink: `https://www.eosx.io/account/${initialTransferMemoObj.destAccount}`,
          unixTime: dayjsTime.unix(),
          data: {
            from: {
              decimals: fromToken.precision,
              amount: fromTokenAction.json.quantity.split(" ")[0],
              id: fromToken.id,
              logo: "",
              symbol: fromToken.symbol
            },
            to: {
              decimals: toToken.precision,
              amount: rewardTransferAction!.quantity.split(" ")[0],
              id: toToken.id,
              logo: "",
              symbol: toToken.symbol
            }
          },
          txHash: trade.trace.id,
          valueTransmitted
        } as ViewLiquidityEvent<ViewTradeEvent>;
      })
      .filter(Boolean);

    return {
      // error: '',
      loading: this.liquidityHistoryLoading,
      data
    };
  }

  @action async pullEvents() {
    // try {
    //   const results = await past24HourTrades();
    //   const timeNow = dayjs();
    //   const oneDay = dayjs.duration(1, "day");
    //   const yesterday = timeNow.subtract(oneDay);
    //   const withinPastDay = results.filter(result =>
    //     dayjs(result.block.timestamp).isSameOrAfter(yesterday)
    //   );
    //   this.setLiquidityHistory(withinPastDay);
    // } catch (error) {
    //   console.error("An error occurred in fetching transaction history", error);
    //   this.setLiquidityHistoryError(error.message as string);
    // }
  }

  @action async init(param?: ModuleParam) {
    this.pullEvents();

    if (this.initialised) return this.refresh();

    try {
      const [usdPriceOfBnt, v2Relays, tokenMeta] = await Promise.all([
        vxm.bancor.fetchUsdPriceOfBnt(),
        fetchMultiRelays(),
        getTokenMeta()
      ]);
      this.setTokenMeta(tokenMeta);
      this.setBntPrice(usdPriceOfBnt);

      const v1Relays = getHardCodedRelays();
      const allDry = [...v1Relays, ...v2Relays.map(multiToDry)].filter(
        noBlackListedReservesDry(blackListedTokens)
      );

      this.fetchTokenBalancesIfPossible(
        _.uniqWith(
          allDry.flatMap(x =>
            x.reserves.map(x => ({ ...x, symbol: x.symbol.code().to_string() }))
          ),
          compareToken
        )
      );

      const quickTrade =
        param &&
        param.tradeQuery &&
        param.tradeQuery.base &&
        param.tradeQuery.quote;
      if (quickTrade) {
        const { base: fromId, quote: toId } = param!.tradeQuery!;
        await this.bareMinimumForTrade({
          fromId,
          toId,
          v1Relays,
          v2Relays,
          tokenMeta
        });
      } else {
        await this.addPools({
          multiRelays: v2Relays,
          dryDelays: v1Relays,
          tokenMeta
        });
      }

      this.setInitialised(true);
      this.setLoadingPools(false);
    } catch (e) {
      throw new Error(`Threw inside eosBancor: ${e.message}`);
    }
  }

  @mutation updateRelayFeed(feeds: RelayFeed[]) {
    this.relayFeed = _.uniqWith(
      [...feeds, ...this.relayFeed],
      (a, b) =>
        compareString(a.smartTokenId, b.smartTokenId) &&
        compareString(a.tokenId, b.tokenId)
    );
  }

  @action async buildPossibleRelayFeedsFromHydrated(relays: EosMultiRelay[]) {
    const feeds = relays.flatMap(relay =>
      buildTwoFeedsFromRelay(relay, [
        { symbol: "USDB", unitPrice: 1 },
        { symbol: "BNT", unitPrice: this.usdPriceOfBnt }
      ])
    );
    this.updateRelayFeed(feeds);
  }

  @action async buildPossibleRelayFeedsFromBancorApi({
    relays
  }: {
    relays: DryRelay[];
  }) {
    return [];
  }

  @action async hydrateOldRelays(relays: DryRelay[]) {
    return Promise.all(
      relays.map(
        async (relay): Promise<EosMultiRelay> => {
          const [settings, reserveBalances] = await Promise.all([
            rpc.get_table_rows({
              code: relay.contract,
              scope: relay.contract,
              table: "settings"
            }) as Promise<{
              rows: {
                smart_contract: string;
                smart_currency: string;
                smart_enabled: boolean;
                enabled: boolean;
                network: string;
                max_fee: number;
                fee: number;
              }[];
            }>,
            fetchBalanceAssets(
              relay.reserves.map(reserve => ({
                contract: reserve.contract,
                symbol: reserve.symbol.code().to_string()
              })),
              relay.contract
            ) as Promise<Asset[]>
          ]);

          const allBalancesFetched = reserveBalances.every(Boolean);
          if (!allBalancesFetched)
            throw new Error(
              `Failed to find both reserve balances on old pool ${relay.contract}`
            );

          const mergedBalances = relay.reserves.map(reserve => ({
            ...reserve,
            amount: reserveBalances.find(balance =>
              balance.symbol.isEqual(reserve.symbol)
            )!
          }));

          const smartTokenSymbol = relay.smartToken.symbol.code().to_string();

          const smartTokenId = buildTokenId({
            contract: relay.smartToken.contract,
            symbol: smartTokenSymbol
          });

          return {
            id: smartTokenId,
            contract: relay.contract,
            isMultiContract: false,
            fee: settings.rows[0].fee / 1000000,
            owner: relay.contract,
            smartToken: {
              id: smartTokenId,
              amount: "0",
              contract: relay.smartToken.contract,
              precision: 4,
              network: "eos",
              symbol: smartTokenSymbol
            },
            reserves: mergedBalances.map(reserve => ({
              ...reserve,
              id: buildTokenId({
                contract: reserve.contract,
                symbol: assetToSymbolName(reserve.amount)
              }),
              network: "eos",
              precision: reserve.amount.symbol.precision(),
              contract: reserve.contract,
              symbol: assetToSymbolName(reserve.amount),
              amount: assetToDecNumberString(reserve.amount)
            }))
          };
        }
      )
    );
  }

  @action async refreshBalances(tokens: BaseToken[] = []) {
    if (!this.currentUser) return;
    if (tokens.length > 0) {
      await vxm.eosNetwork.getBalances({ tokens });
      return;
    }
    await vxm.eosNetwork.getBalances();
  }

  @action async addLiquidity({
    id: relayId,
    reserves,
    onUpdate
  }: LiquidityParams): Promise<TxResponse> {
    const relay = await this.relayById(relayId);
    if (!relay.isMultiContract)
      throw new Error("Only adding liquidity to V2 pools are supported");
    const tokenAmounts = await this.viewAmountToTokenAmounts(reserves);

    const tokenContractsAndSymbols: BaseToken[] = [
      {
        contract: process.env.VUE_APP_SMARTTOKENCONTRACT!,
        symbol: relay.smartToken.symbol
      },
      ...tokenAmounts.map(tokenAmount => ({
        contract: tokenAmount.contract,
        symbol: tokenAmount.amount.symbol.code().to_string()
      }))
    ];

    const originalBalances = await vxm.eosNetwork.getBalances({
      tokens: tokenContractsAndSymbols
    });

    const finalState = await multiSteps({
      items: [
        {
          description: "Depositing liquidity...",
          task: async () => {
            const addLiquidityActions = multiContract.addLiquidityActions(
              relay.smartToken.symbol,
              tokenAmounts
            );

            const { smartTokenAmount } = await this.calculateOpposingDeposit({
              id: relayId,
              reserves,
              changedReserveId: reserves[0].id
            });

            const fundAmount = smartTokenAmount;

            const fundAction = multiContractAction.fund(
              this.currentUser,
              smartTokenAmount.to_string()
            );

            const actions = [...addLiquidityActions, fundAction];

            try {
              const txRes = await this.triggerTx(actions);
              return {
                failedDueToBadCalculation: false,
                txRes
              };
            } catch (e) {
              if (
                e.message !==
                "assertion failure with message: insufficient balance"
              )
                throw new Error(e);
              return {
                failedDueToBadCalculation: true,
                addLiquidityActions,
                fundAmount
              };
            }
          }
        },
        {
          description: "Fund failed, trying again...",
          task: async state => {
            const {
              failedDueToBadCalculation
            }: { failedDueToBadCalculation: boolean } = state;
            if (failedDueToBadCalculation) {
              const { fundAmount, addLiquidityActions } = state;
              const backupFundAction = multiContractAction.fund(
                this.currentUser,
                number_to_asset(
                  Number(fundAmount) * 0.96,
                  new Symbol(relay.smartToken.symbol, 4)
                ).to_string()
              );

              const newActions = [...addLiquidityActions, backupFundAction];
              const txRes = await this.triggerTx(newActions);
              return { txRes };
            }
          }
        },
        {
          description: "Waiting for catchup...",
          task: async () => wait(5000)
        },
        {
          description: `Checking and collecting any left over dust...`,
          task: async () => {
            const bankBalances = await this.fetchBankBalances({
              smartTokenSymbol: relay.smartToken.symbol,
              accountHolder: this.currentUser
            });

            const aboveZeroBalances = bankBalances
              .map(balance => ({
                ...balance,
                quantity: new Asset(balance.quantity)
              }))
              .filter(balance => asset_to_number(balance.quantity) > 0);

            const withdrawActions = aboveZeroBalances.map(balance =>
              multiContract.withdrawAction(balance.symbl, balance.quantity)
            );
            if (withdrawActions.length > 0) {
              await this.triggerTx(withdrawActions);
            }
          }
        }
      ],
      onUpdate
    });

    vxm.eosNetwork.pingTillChange({ originalBalances });

    const txId = finalState.txRes.transaction_id as string;

    return {
      txId,
      blockExplorerLink: generateEosxLink(txId),
      blockExplorerName: "EOSX"
    };
  }

  @action async fetchBankBalances({
    smartTokenSymbol,
    accountHolder
  }: {
    smartTokenSymbol: string;
    accountHolder: string;
  }): Promise<{ symbl: string; quantity: string }[]> {
    const res: {
      rows: { symbl: string; quantity: string }[];
    } = await rpc.get_table_rows({
      code: process.env.VUE_APP_MULTICONTRACT!,
      scope: accountHolder,
      table: "accounts"
    });
    return res.rows.filter(row => compareString(row.symbl, smartTokenSymbol));
  }

  @action async relayById(id: string) {
    return findOrThrow(
      this.relaysList,
      relay => compareString(relay.id, id),
      `failed to find a pool by id of ${id}`
    );
  }

  @action async viewAmountToTokenAmounts(
    amounts: ViewAmount[]
  ): Promise<TokenAmount[]> {
    return Promise.all(
      amounts.map(
        async (amount): Promise<TokenAmount> => {
          const token = await this.tokenById(amount.id);
          return {
            contract: token.contract,
            amount: number_to_asset(
              Number(amount.amount),
              await this.idToSymbol(token.id)
            )
          };
        }
      )
    );
  }

  @action async doubleLiquidateActions({
    relay,
    smartTokenAmount,
    reserveAssets
  }: {
    relay: EosMultiRelay;
    smartTokenAmount: Asset;
    reserveAssets: Asset[];
  }) {
    if (reserveAssets.length !== 2)
      throw new Error("Was expecting only 2 reserve assets");
    const [firstAsset, secondAsset] = splitAsset(smartTokenAmount);

    const actions = reserveAssets.map((reserveAsset, index) =>
      liquidateAction(
        index == 0 ? firstAsset : secondAsset,
        relay.smartToken.contract,
        number_to_asset(0, reserveAsset.symbol),
        relay.contract,
        this.currentUser
      )
    );
    return actions;
  }

  @action async removeLiquidityV1({
    reserves,
    id: relayId,
    onUpdate
  }: LiquidityParams) {
    const relay = await this.relayById(relayId);

    const supply = await fetchTokenStats(
      relay.smartToken.contract,
      relay.smartToken.symbol
    );

    const { smartTokenAmount } = await this.calculateOpposingWithdraw({
      id: relayId,
      reserves,
      changedReserveId: reserves[0].id
    });

    const percentChunkOfRelay =
      asset_to_number(smartTokenAmount) / asset_to_number(supply.supply);

    const reserveAssets = await this.viewAmountToTokenAmounts(reserves);
    if (reserveAssets.length !== 2)
      throw new Error("Anything other than 2 reserves not supported");

    const maxSlippage = 0.01;
    let suggestTxs = parseInt(String(percentChunkOfRelay / maxSlippage));
    if (suggestTxs == 0) suggestTxs = 1;

    const tooSmall =
      asset_to_number(pureTimesAsset(smartTokenAmount, 1 / suggestTxs)) == 0;
    if (tooSmall) suggestTxs = 1;

    const steps = Array(suggestTxs)
      .fill(null)
      .map((_, i) => ({
        name: `Withdraw${i}`,
        description: `Withdrawing Liquidity stage ${i + 1}`
      }));

    let lastTxId: string = "";
    for (let i = 0; i < suggestTxs; i++) {
      onUpdate!(i, steps);
      const txRes = await this.triggerTx(
        await this.doubleLiquidateActions({
          relay,
          reserveAssets: reserveAssets.map(asset => asset.amount),
          smartTokenAmount: pureTimesAsset(smartTokenAmount, 1 / suggestTxs)
        })
      );
      lastTxId = txRes.transaction_id as string;
    }

    return {
      txId: lastTxId,
      blockExplorerLink: generateEosxLink(lastTxId),
      blockExplorerName: "EOSX"
    };
  }

  @action async removeLiquidity({
    reserves,
    id: relayId,
    onUpdate
  }: LiquidityParams): Promise<TxResponse> {
    const relay = await this.relayById(relayId);
    const smartTokenSymbol = relay.smartToken.symbol;

    const isMultiRelay = relay.isMultiContract;

    if (!isMultiRelay) {
      return this.removeLiquidityV1({ reserves, id: relayId, onUpdate });
    }

    const { smartTokenAmount } = await this.calculateOpposingWithdraw({
      id: relayId,
      reserves,
      changedReserveId: reserves[0].id
    });

    const liquidityAsset = smartTokenAmount;

    const action = multiContract.removeLiquidityAction(liquidityAsset);

    const tokenContractsAndSymbols = [
      {
        contract: process.env.VUE_APP_SMARTTOKENCONTRACT!,
        symbol: smartTokenSymbol
      },
      ...relay.reserves.map(reserve => ({
        contract: reserve.contract,
        symbol: reserve.symbol
      }))
    ];

    const [txRes, originalBalances] = await Promise.all([
      this.triggerTx([action]),
      vxm.eosNetwork.getBalances({
        tokens: tokenContractsAndSymbols
      })
    ]);
    vxm.eosNetwork.pingTillChange({ originalBalances });
    this.waitAndUpdate(6000);

    const txId = txRes.transaction_id as string;
    return {
      txId,
      blockExplorerLink: generateEosxLink(txId),
      blockExplorerName: "EOSX"
    };
  }

  @action async waitAndUpdate(time: number = 4000) {
    await wait(time);
    // @ts-ignore
    return this.init();
  }

  @action async expectNewRelay(smartToken: string) {
    const attempts = 10;
    const waitPeriod = 1000;
    for (let i = 0; i < attempts; i++) {
      const relays = await fetchMultiRelays();
      const includesRelay = relays.find(relay =>
        compareString(relay.smartToken.symbol, smartToken)
      );
      if (includesRelay) {
        this.setMultiRelays(relays);
        this.refreshBalances(
          includesRelay.reserves.map(reserve => ({
            contract: reserve.contract,
            symbol: reserve.symbol
          }))
        );
        return;
      }
      await wait(waitPeriod);
    }
  }

  @mutation updateMultiRelays(relays: EosMultiRelay[]) {
    const meshedRelays = _.uniqWith(
      [...relays, ...this.relaysList],
      compareEosMultiRelay
    );
    this.relaysList = meshedRelays;
  }

  @action async fetchRelayReservesAsAssets(id: string): Promise<TokenAmount[]> {
    const relay = await this.relayById(id);

    if (relay.isMultiContract) {
      const hydratedRelay = await fetchMultiRelay(relay.smartToken.symbol);
      return hydratedRelay.reserves.map(agnosticToTokenAmount);
    } else {
      const dryRelay = multiToDry(relay);
      const [hydrated] = await this.hydrateOldRelays([dryRelay]);
      return hydrated.reserves.map(agnosticToTokenAmount);
    }
  }

  @action async getUserBalances(relayId: string): Promise<UserPoolBalances> {
    const relay = await this.relayById(relayId);
    const [[smartTokenBalance], reserves, supply] = await Promise.all([
      vxm.network.getBalances({
        tokens: [
          {
            contract: relay.smartToken.contract,
            symbol: relay.smartToken.symbol
          }
        ]
      }),
      this.fetchRelayReservesAsAssets(relayId),
      fetchTokenStats(relay.smartToken.contract, relay.smartToken.symbol)
    ]);

    const smartSupply = asset_to_number(supply.supply);
    const percent = new BigNumber(smartTokenBalance.balance).div(smartSupply);

    const maxWithdrawals: ViewAmount[] = reserves.map(reserve => ({
      id: buildTokenId({
        contract: reserve.contract,
        symbol: reserve.amount.symbol.code().to_string()
      }),
      amount: new BigNumber(asset_to_number(reserve.amount))
        .times(percent)
        .toString()
    }));

    return {
      maxWithdrawals,
      iouBalances: [{ id: "", amount: String(smartTokenBalance.balance) }]
    };
  }

  @action async tokenSupplyAsAsset({
    contract,
    symbol
  }: {
    contract: string;
    symbol: string;
  }): Promise<Asset> {
    const stats = await fetchTokenStats(contract, symbol);
    return stats.supply;
  }

  @action async calculateOpposingDeposit(
    suggestedDeposit: OpposingLiquidParams
  ): Promise<EosOpposingLiquid> {
    const changedReserve = findChangedReserve(
      suggestedDeposit.reserves,
      suggestedDeposit.changedReserveId
    );

    const relay = await this.relayById(suggestedDeposit.id);
    const [reserves, supply] = await Promise.all([
      this.fetchRelayReservesAsAssets(relay.id),
      this.tokenSupplyAsAsset({
        contract: relay.smartToken.contract,
        symbol: relay.smartToken.symbol
      })
    ]);

    const sameAsset = await this.viewAmountToAsset(changedReserve);

    const tokenAmount = changedReserve.amount;

    const [sameReserve, opposingReserve] = sortByNetworkTokens(
      reserves,
      reserve => assetToSymbolName(reserve.amount),
      [assetToSymbolName(sameAsset)]
    );

    const reserveBalance = asset_to_number(sameReserve.amount);
    const percent = Number(tokenAmount) / reserveBalance;
    const opposingNumberAmount =
      percent * asset_to_number(opposingReserve.amount);

    const opposingAsset = number_to_asset(
      opposingNumberAmount,
      opposingReserve.amount.symbol
    );

    const sameReserveFundReturn = calculateFundReturn(
      sameAsset,
      sameReserve.amount,
      supply
    );
    const opposingReserveFundReturn = calculateFundReturn(
      opposingAsset,
      opposingReserve.amount,
      supply
    );

    const lowerAsset = lowestAsset(
      sameReserveFundReturn,
      opposingReserveFundReturn
    );

    return {
      opposingAmount: String(asset_to_number(opposingAsset)),
      shareOfPool: percent,
      singleUnitCosts: sortAlongSide(
        [
          {
            id: tokenAmountToId(opposingReserve),
            amount: String(
              asset_to_number(
                singleUnitCost(sameReserve.amount, opposingReserve.amount)
              )
            )
          },
          {
            id: tokenAmountToId(sameReserve),
            amount: String(
              asset_to_number(
                singleUnitCost(opposingReserve.amount, sameReserve.amount)
              )
            )
          }
        ],
        unitCost => unitCost.id,
        relay.reserves.map(x => x.id)
      ),
      smartTokenAmount: lowerAsset
    };
  }

  @action async idToSymbol(id: string): Promise<Sym> {
    const token = await this.tokenById(id);
    return new Sym(token.symbol, token.precision);
  }

  @action async viewAmountToAsset(amount: ViewAmount): Promise<Asset> {
    return number_to_asset(
      Number(amount.amount),
      await this.idToSymbol(amount.id)
    );
  }

  @action async calculateOpposingWithdraw(
    suggestWithdraw: OpposingLiquidParams
  ): Promise<EosOpposingLiquid> {
    const relay = await this.relayById(suggestWithdraw.id);

    const changedReserve = findChangedReserve(
      suggestWithdraw.reserves,
      suggestWithdraw.changedReserveId
    );

    const sameAmountAsset = await this.viewAmountToAsset(changedReserve);

    const tokenAmount = changedReserve.amount;

    const [reserves, supply, smartUserBalanceString] = await Promise.all([
      this.fetchRelayReservesAsAssets(suggestWithdraw.id),
      fetchTokenStats(relay.smartToken.contract, relay.smartToken.symbol),
      getBalance(relay.smartToken.contract, relay.smartToken.symbol) as Promise<
        string
      >
    ]);

    const smartUserBalance = new Asset(smartUserBalanceString);
    const smartSupply = asset_to_number(supply.supply);

    const [sameReserve, opposingReserve] = sortByNetworkTokens(
      reserves,
      reserve => assetToSymbolName(reserve.amount),
      [assetToSymbolName(sameAmountAsset)]
    );

    const reserveBalance = asset_to_number(sameReserve.amount);
    const percent = Number(tokenAmount) / reserveBalance;

    const smartTokenAmount = percent * smartSupply;

    const opposingAmountNumber =
      percent * asset_to_number(opposingReserve.amount);
    const opposingAsset = number_to_asset(
      opposingAmountNumber,
      opposingReserve.amount.symbol
    );

    return {
      opposingAmount: String(asset_to_number(opposingAsset)),
      shareOfPool: percent,
      singleUnitCosts: [
        {
          id: tokenAmountToId(sameReserve),
          amount: String(
            asset_to_number(
              singleUnitCost(sameReserve.amount, opposingReserve.amount)
            )
          )
        },
        {
          id: tokenAmountToId(opposingReserve),
          amount: String(
            asset_to_number(
              singleUnitCost(opposingReserve.amount, sameReserve.amount)
            )
          )
        }
      ],
      smartTokenAmount:
        smartTokenAmount / asset_to_number(smartUserBalance) > 0.99
          ? smartUserBalance
          : number_to_asset(smartTokenAmount, smartUserBalance.symbol)
    };
  }

  @action async focusSymbol(id: string) {
    const reserveToken = this.tokens.find(token => compareString(token.id, id));

    if (reserveToken) {
      const tokens: TokenBalanceParam[] = [
        {
          contract: reserveToken.contract,
          symbol: reserveToken.symbol,
          precision: reserveToken.precision
        }
      ];
      await this.fetchTokenBalancesIfPossible(tokens);
    } else {
      const token = findOrThrow(this.tokenMeta, meta =>
        compareString(meta.id, id)
      );
      const tokens: TokenBalanceParam[] = [
        { contract: token.account, symbol: token.symbol }
      ];
      await this.fetchTokenBalancesIfPossible(tokens);
    }
  }

  @action async hasExistingBalance({
    contract,
    symbol
  }: {
    contract: string;
    symbol: string;
  }) {
    try {
      const res: { rows: { balance: string }[] } = await rpc.get_table_rows({
        code: contract,
        scope: this.currentUser,
        table: "accounts"
      });
      return (
        res.rows.length > 0 &&
        res.rows
          .map(({ balance }) => balance)
          .some(balance => balance.includes(symbol))
      );
    } catch (e) {
      console.error("Balance error", e);
      return false;
    }
  }

  @action async tokenById(id: string) {
    return findOrThrow(
      this.relaysList.flatMap(relay => relay.reserves),
      token => compareString(token.id, id),
      `failed to find token by its ID of ${id}`
    );
  }

  @action async convert(
    proposal: ProposedConvertTransaction
  ): Promise<TxResponse> {
    const { from, to } = proposal;
    if (compareString(from.id, to.id))
      throw new Error("Cannot convert a token to itself.");
    const fromAmount = from.amount;
    const toAmount = Number(to.amount);

    const [fromToken, toToken] = await Promise.all([
      this.tokenById(from.id),
      this.tokenById(to.id)
    ]);

    const fromSymbolInit = new Symbol(fromToken.symbol, fromToken.precision);
    const toSymbolInit = new Symbol(toToken.symbol, toToken.precision);
    const assetAmount = number_to_asset(Number(fromAmount), fromSymbolInit);

    const allRelays = this.convertableRelays;
    const path = await this.findPath({
      fromId: fromToken.id,
      toId: toToken.id,
      relays: allRelays.map(multiToDry)
    });
    const convertPath = relaysToConvertPaths(fromSymbolInit, path);

    const currentUser = this.currentUser;

    const memo = composeMemo(
      convertPath,
      String((toAmount * 0.96).toFixed(toSymbolInit.precision())),
      currentUser
    );

    const fromTokenContract = fromToken.contract;
    let convertActions = await multiContract.convert(
      fromTokenContract,
      assetAmount,
      memo
    );

    const toContract = toToken.contract;
    const toSymbol = toToken.symbol;

    const existingBalance = await this.hasExistingBalance({
      contract: toContract,
      symbol: toSymbol
    });

    if (!existingBalance) {
      const openActions = await this.generateOpenActions({
        contract: toToken.contract,
        symbol: toSymbolInit
      });
      convertActions = [...openActions, ...convertActions];
    }

    const txRes = await this.triggerTxAndWatchBalances({
      actions: convertActions,
      tokenIds: [from.id, to.id]
    });

    return {
      txId: txRes.transaction_id,
      blockExplorerLink: generateEosxLink(txRes.transaction_id),
      blockExplorerName: "EOSX"
    };
  }

  @action async generateOpenActions({
    contract,
    symbol
  }: {
    contract: string;
    symbol: Sym;
  }) {
    const openSupported = await tokenContractSupportsOpen(contract);
    if (!openSupported)
      throw new Error(
        `You do not have an existing balance of ${symbol} and it's token contract ${contract} does not support 'open' functionality.`
      );
    const openActions = await multiContract.openActions(
      contract,
      symbol.toString(true),
      this.currentUser
    );
    return openActions;
  }

  @action async triggerTxAndWatchBalances({
    actions,
    tokenIds
  }: {
    actions: any[];
    tokenIds: string[];
  }) {
    const fullTokens = await Promise.all(
      tokenIds.map(tokenId => this.tokenById(tokenId))
    );
    const tokens: BaseToken[] = fullTokens;
    const [txRes, originalBalances] = await Promise.all([
      this.triggerTx(actions),
      vxm.eosNetwork.getBalances({
        tokens
      })
    ]);
    vxm.eosNetwork.pingTillChange({ originalBalances });
    return txRes;
  }

  @action async hydrateV1Relays(
    v1Relays: DryRelay[]
  ): Promise<HydratedRelay[]> {
    if (v1Relays.length == 0) return [];
    const hydrated = await this.hydrateOldRelays(v1Relays);
    return hydrated.map(eosMultiToHydrated);
  }

  @action async hydrateRelays(relays: DryRelay[]): Promise<HydratedRelay[]> {
    const v1Relays = relays.filter(relay => !relay.isMultiContract);
    const v2Relays = relays.filter(relay => relay.isMultiContract);
    const [v1, v2] = await Promise.all([
      this.hydrateV1Relays(v1Relays),
      this.hydrateV2Relays(v2Relays)
    ]);
    const flat = [...v2, ...v1];
    return relays.map(
      relay =>
        flat.find(
          r =>
            r.smartToken.symbol.isEqual(relay.smartToken.symbol) &&
            compareString(r.smartToken.contract, relay.smartToken.contract)
        )!
    );
  }

  @action async hydrateV2Relays(relays: DryRelay[]): Promise<HydratedRelay[]> {
    if (relays.length == 0) return [];

    const freshRelays = await fetchMultiRelays();
    const hydratedRelays = freshRelays.map(eosMultiToHydrated);

    const result = hydratedRelays.filter(relay =>
      relays.some(
        r =>
          compareString(relay.smartToken.contract, r.smartToken.contract) &&
          relay.smartToken.symbol.isEqual(r.smartToken.symbol)
      )
    );
    if (relays.length !== result.length)
      throw new Error(
        "Failed to hydrate all relays requested in hydrateV2Relays"
      );
    return result;
  }

  @action async findPath({
    fromId,
    toId,
    relays
  }: {
    fromId: string;
    toId: string;
    relays: DryRelay[];
  }): Promise<DryRelay[]> {
    const path = await findNewPath(fromId, toId, relays, dryToTraditionalEdge);
    return path.hops.flatMap(hop => hop[0]);
  }

  @action async getReturn({
    from,
    toId
  }: ProposedFromTransaction): Promise<ConvertReturn> {
    if (compareString(from.id, toId))
      throw new Error("Cannot convert a token to itself.");
    const assetAmount = await this.viewAmountToAsset(from);

    const allRelays = this.convertableRelays.map(multiToDry);
    const path = await this.findPath({
      fromId: from.id,
      toId: toId,
      relays: allRelays
    });

    const hydratedRelays = await this.hydrateRelays(path);
    const calculatedReturn = findReturn(assetAmount, hydratedRelays);

    return {
      amount: String(asset_to_number(calculatedReturn.amount)),
      slippage: calculatedReturn.highestSlippage
    };
  }

  @action async getCost({ fromId, to }: ProposedToTransaction) {
    if (compareString(fromId, to.id))
      throw new Error("Cannot convert a token to itself.");
    const assetAmount = await this.viewAmountToAsset(to);

    const allRelays = this.convertableRelays.map(multiToDry);
    const path = await this.findPath({
      fromId,
      toId: to.id,
      relays: allRelays
    });
    const hydratedRelays = await this.hydrateRelays(path);
    const calculatedCost = findCost(assetAmount, hydratedRelays);

    return {
      amount: String(asset_to_number(calculatedCost.amount)),
      slippage: calculatedCost.highestSlippage
    };
  }

  @action async triggerTx(actions: any[]) {
    // @ts-ignore
    return this.$store.dispatch("eosWallet/tx", actions, { root: true });
  }

  @mutation setMultiRelays(relays: EosMultiRelay[]) {
    this.relaysList = relays;
  }

  @mutation setBntPrice(price: number) {
    this.usdPriceOfBnt = price;
  }

  @mutation setTokenMeta(tokens: TokenMeta[]) {
    this.tokenMeta = tokens.filter(token => compareString(token.chain, "eos"));
  }
}
