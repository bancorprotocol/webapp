import { action, createModule, mutation } from "vuex-class-component";
import {
  BaseToken,
  ConverterAndAnchor,
  ConvertReturn,
  CreatePoolModule,
  CreateV1PoolEthParams,
  LiquidityModule,
  LiquidityParams,
  LiquidityProtectionSettings,
  MinimalPool,
  ModalChoice,
  OnPrompt,
  OnUpdate,
  OpposingLiquid,
  OpposingLiquidParams,
  PoolLiqMiningApr,
  PoolTokenPosition,
  ProposedConvertTransaction,
  ProposedCreateOrder,
  ProposedFromTransaction,
  ProposedToTransaction,
  ProtectedLiquidity,
  ProtectionRes,
  ProtectLiquidityParams,
  RawLiquidityProtectionSettings,
  RegisteredContracts,
  ReserveFeed,
  Section,
  Step,
  TokenPrecision,
  TokenPrice,
  TokenWei,
  TradingModule,
  TxResponse,
  UserPoolBalances,
  V1PoolResponse,
  ViewAmount,
  ViewAmountDetail,
  ViewLiquidityEvent,
  ViewLockedBalance,
  ViewProtectedLiquidity,
  ViewRelay,
  ViewReserve,
  ViewToken,
  ViewTokenAmount,
  ViewTradeEvent
} from "@/types/bancor";
import { RfqOrder, Signature, SignatureType } from "@0x/protocol-utils";
import {
  buildPoolNameFromReserves,
  buildSingleUnitCosts,
  calculatePercentageChange,
  ChainLinkRelay,
  compareString,
  fetchReserveBalance,
  findChangedReserve,
  findOrThrow,
  generateEtherscanTxLink,
  LockedBalance,
  multiSteps,
  PoolContainer,
  PoolType,
  Relay,
  RelayWithReserveBalances,
  rewindBlocksByDays,
  SmartToken,
  sortAlongSide,
  sortByLiqDepth,
  Token,
  TraditionalRelay,
  updateArray,
  zeroAddress
} from "@/api/helpers";
import { ContractSendMethod } from "web3-eth-contract";
import { ethErc20WrapperContract, ethReserveAddress } from "@/api/eth/ethAbis";
import {
  addLiquidityDisabled,
  conversionPath,
  existingPool,
  getAnchors,
  getApprovedBalanceWei,
  getConvertersByAnchors,
  getRemoveLiquidityReturn,
  getReturnByPath,
  getTokenSupplyWei,
  liquidationLimit
} from "@/api/eth/contractWrappers";
import { asciiToHex, fromWei, toHex, toWei } from "web3-utils";
import Decimal from "decimal.js";
import { vxm } from "@/store";
import wait from "waait";
import {
  chunk,
  differenceWith,
  first,
  fromPairs,
  groupBy,
  last,
  partition,
  toPairs,
  uniqWith,
  zip
} from "lodash";
import {
  buildAddressLookupContract,
  buildConverterContract,
  buildExchangeProxyContract,
  buildLiquidityProtectionContract,
  buildLiquidityProtectionSettingsContract,
  buildLiquidityProtectionSystemStoreContract,
  buildNetworkContract,
  buildRegistryContract,
  buildTokenContract,
  buildV28ConverterContract,
  buildV2Converter,
  buildWethContract
} from "@/api/eth/contractTypes";
import {
  generateEthPath,
  MinimalPoolWithReserveBalances,
  MinimalRelay,
  removeLeadingZeros,
  shrinkToken,
  TokenSymbol
} from "@/api/eth/helpers";
import { sortByNetworkTokens } from "@/api/sortByNetworkTokens";
import { findNewPath } from "@/api/eos/eosBancorCalc";
import {
  knownPools,
  moreStaticRelays,
  PreviousPoolFee,
  previousPoolFees,
  priorityEthPools,
  v2Pools
} from "./staticRelays";
import BigNumber from "bignumber.js";
import { knownVersions } from "@/api/eth/knownConverterVersions";
import { DataTypes, MultiCall, ShapeWithLabel } from "eth-multicall";
import dayjs from "@/utils/dayjs";
import { getNetworkVariables } from "@/api/config";
import { EthNetworks, web3 } from "@/api/web3";
import * as Sentry from "@sentry/browser";
import {
  combineLatest,
  from,
  merge,
  Observable,
  partition as partitionOb,
  Subject
} from "rxjs";
import {
  buffer,
  bufferTime,
  concatMap,
  delay,
  filter,
  first as firstItem,
  map,
  mergeMap,
  scan,
  share,
  shareReplay,
  switchMap,
  take,
  tap
} from "rxjs/operators";
import {
  calculateAmountToGetSpace,
  calculatePriceDeviationTooHigh,
  compareStaticRelayAndSet,
  decToPpm,
  expandToken,
  filterAndWarn,
  mapIgnoreThrown,
  parseRawDynamic,
  reserveContractsInStatic,
  throwAfter
} from "@/api/pureHelpers";
import {
  currentBlock$,
  currentBlockReceiver$,
  fetchPositionsTrigger$,
  immediateTokenMeta$,
  lockedBalancesTrigger$,
  minimalPoolBalanceReceiver$,
  newPools$,
  selectedPromptReceiver$,
  usdPriceOfBnt$
} from "@/api/observables";
import {
  balanceShape,
  dynamicRelayShape,
  liquidityProtectionSettingsShape,
  liquidityProtectionShape,
  poolTokenShape,
  protectedPositionShape,
  relayShape,
  reserveBalanceShape,
  slimBalanceShape,
  staticRelayShape,
  tokenShape,
  v2PoolBalanceShape
} from "@/api/eth/shapes";
import Web3 from "web3";
import { nullApprovals } from "@/api/eth/nullApprovals";
import { NewPool, Pool, WelcomeData } from "@/api/eth/bancorApi";
import { distinctArrayItem } from "@/api/observables/customOperators";
import {
  networkVersionReceiver$,
  supportedNetworkVersion$
} from "@/api/observables/network";
import {
  bancorConverterRegistry$,
  exchangeProxy$,
  govTokenAddress$
} from "@/api/observables/contracts";
import { authenticatedReceiver$, onLogout$ } from "@/api/observables/auth";
import {
  getTxOrigin,
  keeperTokens$,
  limitOrders$,
  limitOrderTrigger$,
  OrderElement,
  OrderStatus,
  orderToStringOrder,
  RfqOrderJson,
  sendOrders
} from "@/api/observables/keeperDao";
import { createOrder } from "@/api/orderSigning";
import { tokens$ } from "@/api/observables/pools";
import { ConversionEvents, sendConversionEvent } from "@/gtm";

keeperTokens$.subscribe(token =>
  vxm.ethBancor.setDaoTokens(token.map(x => x.address))
);

const limitOrdersSupported$ = combineLatest([limitOrders$, tokens$]).pipe(
  map(([orders, apiTokens]) =>
    filterAndWarn(
      orders,
      order => {
        const tokensTraded = [order.order.makerToken, order.order.takerToken];
        return (
          tokensTraded.every(
            token =>
              apiTokens.some(apiToken =>
                compareString(token, apiToken.dlt_id)
              ) || compareString(token, wethTokenContractAddress)
          ) &&
          tokensTraded.every(token => !compareString(token, ethReserveAddress))
        );
      },
      "because they are not included in API tokens"
    )
  ),
  filter(orders => orders.length > 0)
);

const imageOrDefault = (
  id: string,
  tokenMeta: TokenMeta[] | undefined
): string => {
  if (!tokenMeta) return defaultImage;
  const meta = tokenMeta.find(meta => compareString(meta.id, id));
  return (meta && meta.image) || defaultImage;
};

const viewLimitOrders$ = combineLatest([
  keeperTokens$,
  limitOrdersSupported$,
  immediateTokenMeta$
]).pipe(
  map(([keeperTokens, orders, tokenMeta]) =>
    orders.map(
      (order): ViewLimitOrder => {
        const fromToken = findOrThrow(
          keeperTokens,
          token => compareString(token.address, order.order.makerToken),
          `failed finding ${order.order.makerToken} in list of tokens ${keeperTokens}`
        );

        const fromTokenImage = imageOrDefault(fromToken.address, tokenMeta);

        const toToken = findOrThrow(
          keeperTokens,
          token => compareString(token.address, order.order.takerToken),
          `failed finding ${order.order.takerToken} in the list of keeper tokens `
        );
        const toTokenImage = imageOrDefault(toToken.address, tokenMeta);

        const fillPercentage = new BigNumber(
          order.metaData.filledAmount_takerToken
        )
          .div(order.order.takerAmount)
          .toNumber();
        return {
          expiryTime: Number(order.order.expiry),
          from: {
            id: order.order.makerToken,
            logo: fromTokenImage,
            symbol: fromToken.symbol,
            amount: shrinkToken(
              order.order.makerAmount.toString(),
              fromToken.decimals
            )
          },
          to: {
            id: order.order.takerToken,
            amount: shrinkToken(
              order.order.takerAmount.toString(),
              toToken.decimals
            ),
            logo: toTokenImage,
            symbol: toToken.symbol
          },
          id: order.metaData.orderHash,
          orderHash: order.metaData.orderHash,
          seller: order.order.maker,
          percentFilled: fillPercentage,
          status: order.metaData.status as OrderStatus
        };
      }
    )
  )
);

viewLimitOrders$.subscribe(orders => vxm.ethBancor.setLimitOrders(orders));
limitOrders$.subscribe(orders => vxm.ethBancor.setRawLimitOrders(orders));
onLogout$.subscribe(() => vxm.ethBancor.setLimitOrders([]));

type DecPercent = number;

export interface ViewLimitOrder {
  expiryTime: number;
  seller: string;
  from: ViewTokenAmount;
  to: ViewTokenAmount;
  orderHash: string;
  id: string;
  percentFilled: DecPercent;
  status: OrderStatus;
}
interface ViewRelayConverter extends ViewRelay {
  converterAddress: string;
}

const viewRelayConverterToMinimal = (
  relay: ViewRelayConverter
): MinimalRelay => ({
  anchorAddress: relay.id,
  contract: relay.converterAddress,
  reserves: relay.reserves.map(reserve => ({
    contract: reserve.id,
    symbol: reserve.symbol
  }))
});

const currentBlockTwo$ = new Subject<number>();
const convertersAndAnchors$ = new Subject<ConverterAndAnchor>();
const bufferToggle$ = new Subject();

convertersAndAnchors$
  .pipe(firstItem(), delay(1))
  .subscribe(() => bufferToggle$.next());

const bufferedAnchorsAndConverters$ = convertersAndAnchors$.pipe(
  buffer(bufferToggle$),
  scan(
    (acc, item) => {
      const allData = [...acc.data, ...item];

      const sortedData = sortAlongSide(
        allData,
        x => x.anchorAddress,
        priorityEthPools
      );
      const toEmit = sortedData[0];

      return {
        data: sortedData.slice(1),
        toEmit
      };
    },
    {
      data: [] as ConverterAndAnchor[],
      // @ts-ignore
      toEmit: (undefined as ConverterAndAnchor)!
    }
  ),
  filter(x => Boolean(x.toEmit)),
  map(x => x.toEmit)
);

combineLatest([currentBlockTwo$, bufferedAnchorsAndConverters$])
  .pipe(
    concatMap(([currentBlock, converterAndAnchor]) => {
      const blockYesterday = rewindBlocksByDays(currentBlock, 0.98);
      const { converterAddress, anchorAddress } = converterAndAnchor;
      return getHistoricFees(
        w3,
        anchorAddress,
        converterAddress,
        blockYesterday
      );
    }),
    tap(() => bufferToggle$.next()),
    filter(feeEvents => feeEvents.length > 0)
  )
  .subscribe(fees => {
    vxm.ethBancor.updateHistoricPoolFees(fees);
  });

const w3: Web3 = web3;

interface Balance {
  balance: string;
  id: string;
}

interface PoolApr {
  poolId: string;
  oneWeekApr: string;
}

const calculateReturnOnInvestment = (
  investment: string,
  newReturn: string
): string => {
  return new BigNumber(newReturn).div(investment).minus(1).toString();
};

// returns the rate of 1 pool token in reserve token units
const calculatePoolTokenRate = (
  poolTokenSupply: string,
  reserveTokenBalance: string
) => new BigNumber(reserveTokenBalance).times(2).div(poolTokenSupply);

type Wei = string;

const calculateExpectedPoolTokenReturnV2 = (
  poolTokenSupply: Wei,
  stakedReserveBalance: Wei,
  reserveTokenAmountToDeposit: Wei
): Wei =>
  new BigNumber(poolTokenSupply)
    .div(stakedReserveBalance)
    .times(reserveTokenAmountToDeposit)
    .toFixed(0);

const calculateShareOfPool = (
  poolTokensToAdd: Wei,
  poolTokenSupply: Wei,
  existingUserPoolTokenBalance?: Wei
): number => {
  if (new BigNumber(poolTokenSupply).eq(0)) return 1;

  const suggestedSmartTokens = new BigNumber(poolTokensToAdd).plus(
    existingUserPoolTokenBalance || 0
  );

  const suggestedSmartTokenSupply = new BigNumber(poolTokenSupply).plus(
    poolTokensToAdd
  );

  const shareOfPool = suggestedSmartTokens
    .div(suggestedSmartTokenSupply)
    .toNumber();

  return shareOfPool;
};

const compareRelayByReserves = (a: ViewRelay, b: ViewRelay) =>
  a.reserves.every(reserve =>
    b.reserves.some(r => compareString(reserve.contract, r.contract))
  );

const rawAbiV2ToStacked = (
  rawAbiV2: RawAbiV2PoolBalances
): StakedAndReserve => {
  const primaryReserveWeight =
    rawAbiV2.effectiveReserveWeights && rawAbiV2.effectiveReserveWeights[0];
  const secondaryReserveWeight =
    rawAbiV2.effectiveReserveWeights && rawAbiV2.effectiveReserveWeights[1];

  const reserveOneIsPrimaryReserve = compareString(
    rawAbiV2.reserveOne,
    rawAbiV2.primaryReserveToken
  );

  const reserveOneReserveWeight = reserveOneIsPrimaryReserve
    ? primaryReserveWeight
    : secondaryReserveWeight;
  const reserveTwoReserveWeight = reserveOneIsPrimaryReserve
    ? secondaryReserveWeight
    : primaryReserveWeight;

  return {
    converterAddress: rawAbiV2.converterAddress,
    reserves: [
      {
        reserveAddress: rawAbiV2.reserveOne,
        stakedBalance: rawAbiV2.reserveOneStakedBalance,
        reserveWeight: reserveOneReserveWeight,
        poolTokenAddress: rawAbiV2.reserveOnePoolToken
      },
      {
        reserveAddress: rawAbiV2.reserveTwo,
        stakedBalance: rawAbiV2.reserveTwoStakedBalance,
        reserveWeight: reserveTwoReserveWeight,
        poolTokenAddress: rawAbiV2.reserveTwoPoolToken
      }
    ]
  };
};

const getAnchorTokenAddresses = (relay: Relay): string[] => {
  if (relay.converterType == PoolType.ChainLink) {
    const actualRelay = relay as ChainLinkRelay;
    return actualRelay.anchor.poolTokens.map(x => x.poolToken.contract);
  } else if (relay.converterType == PoolType.Traditional) {
    const actualRelay = relay as TraditionalRelay;
    return [actualRelay.anchor.contract];
  } else {
    throw new Error("Failed to identify type of relay passed");
  }
};

interface RefinedAbiRelay {
  anchorAddress: string;
  reserves: [string, string];
  version: number;
  converterType: PoolType;
  converterAddress: string;
  connectorToken1: string;
  connectorToken2: string;
  connectorTokenCount: string;
  conversionFee: string;
  owner: string;
}

export const ppmToDec = (ppm: number | string): number =>
  new BigNumber(ppm).dividedBy(oneMillion).toNumber();

const determineConverterType = (
  converterType: string | undefined
): PoolType => {
  if (typeof converterType == "undefined") {
    return PoolType.Traditional;
  } else if (Number(converterType) == 32) {
    return PoolType.Traditional;
  } else if (Number(converterType) == 1) {
    return PoolType.Traditional;
  } else if (Number(converterType) == 3) {
    return PoolType.Traditional;
  } else if (Number(converterType) == 2) {
    return PoolType.ChainLink;
  } else if (Number(converterType) == 0) {
    return PoolType.Liquid;
  }
  throw new Error(`Failed to determine the converter type "${converterType}"`);
};

const getHistoricFees = async (
  w3: Web3,
  id: string,
  converterAddress: string,
  fromBlock: number
): Promise<PreviousPoolFee[]> => {
  const contract = buildV28ConverterContract(converterAddress, w3);
  const options = {
    fromBlock,
    toBlock: "latest"
  };

  try {
    const events = await contract.getPastEvents("ConversionFeeUpdate", options);

    const previousPoolFees = events
      .filter(event => event.blockNumber >= fromBlock)
      .map(
        (event): PreviousPoolFee => ({
          id,
          oldDecFee: ppmToDec(event.returnValues["_prevFee"]),
          blockNumber: event.blockNumber
        })
      );

    return previousPoolFees;
  } catch (err) {
    console.error(
      "Failed fetching pool fees for converterer",
      converterAddress,
      err,
      "from block",
      fromBlock
    );
    return [];
  }
};

const smartTokenAnchor = (smartToken: Token) => ({
  anchor: smartToken,
  converterType: PoolType.Traditional
});

const newRelayToRelayWithBalances = (
  newRelay: NewRelay
): RelayWithReserveBalances => ({
  anchor: {
    ...newRelay.poolToken,
    decimals: Number(newRelay.poolToken.decimals),
    network: "ETH"
  },
  contract: newRelay.converterAddress,
  converterType: newRelay.converterType,
  fee: newRelay.fee,
  id: newRelay.poolToken.contract,
  isMultiContract: false,
  network: "ETH",
  reserveBalances: newRelay.reserves.map(x => ({
    amount: x.reserveBalance,
    id: x.contract
  })),
  reserves: newRelay.reserves.map(x => ({
    ...x,
    reserveWeight: 0.5,
    network: "ETH",
    reserveBalance: x.reserveBalance,
    decimals: Number(x.decimals),
    symbol: x.symbol,
    contract: x.contract
  })),
  version: String(newRelay.version)
});

interface UsdValue {
  id: string;
  usdPrice: string;
}

const trustedStables = (network: EthNetworks): UsdValue[] => {
  if (network == EthNetworks.Mainnet) {
    return [
      { id: "0x309627af60f0926daa6041b8279484312f2bf060", usdPrice: "1" }
    ];
  }
  return [];
};

export const wethTokenContractAddress =
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

const calculateSlippage = (
  slippageLessRate: BigNumber,
  slippagedRate: BigNumber
): BigNumber => {
  if (slippagedRate.gt(slippageLessRate)) throw new Error("Rates are bad");
  const result = slippageLessRate.minus(slippagedRate).abs();
  return result.div(slippageLessRate);
};

const buildRate = (amountEntered: BigNumber, returnAmount: BigNumber) =>
  returnAmount.div(amountEntered);

const buildRelayFeedChainkLink = ({
  relays,
  usdPriceOfBnt
}: {
  relays: RawV2Pool[];
  usdPriceOfBnt: number;
}) => relays.flatMap(relay => buildReserveFeedsChainlink(relay, usdPriceOfBnt));

const buildReserveFeedsTraditional = (
  relay: RelayWithReserveBalances,
  knownUsdPrices: UsdValue[]
): ReserveFeed[] => {
  const reservesBalances = relay.reserves.map(reserve => {
    const reserveBalance = findOrThrow(
      relay.reserveBalances,
      balance => compareString(balance.id, reserve.contract),
      "failed to find a reserve balance for reserve"
    );

    const decAmount = shrinkToken(reserveBalance.amount, reserve.decimals);
    const knownUsdPrice = knownUsdPrices.find(price =>
      compareString(price.id, reserve.contract)
    );
    return {
      reserve,
      decAmount,
      knownUsdPrice
    };
  });

  const [networkReserve, tokenReserve] = sortByNetworkTokens(
    reservesBalances,
    balance => balance.reserve.symbol.toUpperCase()
  );

  const cryptoCostOfTokenReserve = new BigNumber(networkReserve.decAmount)
    .dividedBy(tokenReserve.decAmount)
    .toNumber();
  const cryptoCostOfNetworkReserve = new BigNumber(
    tokenReserve.decAmount
  ).dividedBy(networkReserve.decAmount);

  let usdCostOfTokenReserve: number;
  let usdCostOfNetworkReserve: number;

  if (networkReserve.knownUsdPrice) {
    usdCostOfTokenReserve = new BigNumber(cryptoCostOfTokenReserve)
      .times(networkReserve.knownUsdPrice.usdPrice)
      .toNumber();
    usdCostOfNetworkReserve = new BigNumber(cryptoCostOfNetworkReserve)
      .times(usdCostOfTokenReserve)
      .toNumber();
  } else if (tokenReserve.knownUsdPrice) {
    usdCostOfNetworkReserve = new BigNumber(cryptoCostOfNetworkReserve)
      .times(tokenReserve.knownUsdPrice.usdPrice)
      .toNumber();
    usdCostOfTokenReserve = new BigNumber(cryptoCostOfTokenReserve)
      .times(usdCostOfNetworkReserve)
      .toNumber();
  } else {
    throw new Error(
      `Cannot determine the price without knowing one of the reserve prices ${JSON.stringify(
        knownUsdPrices
      )}`
    );
  }

  if (Number.isNaN(usdCostOfNetworkReserve)) usdCostOfNetworkReserve = 0;

  const liqDepth = new BigNumber(networkReserve.decAmount)
    .times(usdCostOfNetworkReserve)
    .toNumber();

  return [
    {
      reserveAddress: tokenReserve.reserve.contract,
      poolId: relay.id,
      costByNetworkUsd: usdCostOfTokenReserve,
      liqDepth,
      priority: 10
    },
    {
      reserveAddress: networkReserve.reserve.contract,
      poolId: relay.id,
      liqDepth,
      costByNetworkUsd: usdCostOfNetworkReserve,
      priority: 10
    }
  ];
};

const duplicateWith = <T>(
  arr: readonly T[],
  comparator: (a: T, b: T) => boolean
) =>
  arr.filter(
    (item, index, arr) => arr.findIndex(i => comparator(item, i)) !== index
  );

const compareById = (a: { id: string }, b: { id: string }) =>
  compareString(a.id, b.id);

const compareReserveFeedByReserveAddress = (a: ReserveFeed, b: ReserveFeed) =>
  compareString(a.reserveAddress, b.reserveAddress);

const reserveFeedToUsdPrice = (reserveFeed: ReserveFeed): UsdValue => ({
  id: reserveFeed.reserveAddress,
  usdPrice: String(reserveFeed.costByNetworkUsd)
});

const buildPossibleReserveFeedsTraditional = (
  v1Pools: RelayWithReserveBalances[],
  initialKnownPrices: UsdValue[]
): ReserveFeed[] => {
  if (initialKnownPrices.length == 0)
    throw new Error("Must know the price of at least one token");
  const duplicatePrices = duplicateWith(initialKnownPrices, compareById);
  if (duplicatePrices.length > 0)
    throw new Error("Cannot pass multiple prices of a single token");

  const attemptedRelays = v1Pools.map(pool => {
    try {
      const res = buildReserveFeedsTraditional(pool, initialKnownPrices);
      return res;
    } catch (e) {
      return false;
    }
  });

  const [fulfilled, failed] = partition(attemptedRelays, Boolean);
  const flatReserveFeeds = ((fulfilled as unknown) as ReserveFeed[][])
    .flat(2)
    .sort(sortByLiqDepth);
  if (failed.length == 0) return flatReserveFeeds;
  const uniquePrices = uniqWith(
    flatReserveFeeds,
    compareReserveFeedByReserveAddress
  ).map(reserveFeedToUsdPrice);
  const learntPrices = uniqWith(
    [...initialKnownPrices, ...uniquePrices],
    compareById
  );
  const hasLearntNewPrices = learntPrices.length > initialKnownPrices.length;
  return hasLearntNewPrices
    ? buildPossibleReserveFeedsTraditional(v1Pools, learntPrices)
    : flatReserveFeeds;
};

const buildReserveFeedsChainlink = (
  relay: RawV2Pool,
  usdPriceOfBnt: number
): ReserveFeed[] => {
  const reserveBalances = relay.reserves;
  const reserveWeights = relay.reserves.map(balance => balance.reserveWeight);

  const noReserveWeights = reserveWeights.every(
    weight => typeof weight == "undefined"
  );
  if (noReserveWeights) return [];

  const sortedTokens = sortByNetworkTokens(
    reserveBalances,
    reserve => reserve.token.symbol
  ).map(token => ({
    ...token,
    decAmount: shrinkToken(token.stakedBalance, token.token.decimals),
    decWeight: new BigNumber(token.reserveWeight as string).div(oneMillion)
  }));

  const [secondaryReserveToken, primaryReserveToken] = sortedTokens;

  const secondarysPrice =
    secondaryReserveToken.token.symbol == "USDB" ? 1 : usdPriceOfBnt;

  const secondarysLiqDepth = new BigNumber(
    secondaryReserveToken.decAmount
  ).times(secondarysPrice);

  const wholeLiquidityDepth = secondarysLiqDepth.div(
    secondaryReserveToken.decWeight
  );
  const primaryLiquidityDepth = wholeLiquidityDepth.minus(secondarysLiqDepth);

  const result = [
    {
      reserveAddress: primaryReserveToken.token.contract,
      poolId: relay.anchorAddress,
      priority: 10,
      liqDepth: primaryLiquidityDepth.toNumber(),
      costByNetworkUsd: primaryLiquidityDepth
        .div(primaryReserveToken.decAmount)
        .toNumber()
    },
    {
      reserveAddress: secondaryReserveToken.token.contract,
      poolId: relay.anchorAddress,
      priority: 10,
      liqDepth: secondarysLiqDepth.toNumber(),
      costByNetworkUsd: secondarysPrice
    }
  ];
  return result;
};

export const defaultImage =
  "https://ropsten.etherscan.io/images/main/empty-token.png";
const ORIGIN_ADDRESS = DataTypes.originAddress;

interface RawV2Pool {
  reserves: {
    token: Token;
    reserveAddress: string;
    stakedBalance: string;
    reserveWeight: string | undefined;
    poolTokenAddress: string;
  }[];
  converterAddress: string;
  anchorAddress: string;
}

interface NewReserve extends RawAbiToken {
  reserveBalance: string;
}

interface NewRelay {
  reserves: NewReserve[];
  fee: number;
  converterAddress: string;
  converterType: number;
  version: number;
  poolToken: {
    symbol: string;
    decimals: string;
    contract: string;
  };
}

const unlimitedWei =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const calculateMean = (a: string, b: string) =>
  new BigNumber(a).plus(b).div(2).toString();

interface V2Response {
  reserveFeeds: ReserveFeed[];
  pools: (RelayWithReserveBalances | ChainLinkRelay)[];
}

const compareAnchorAndConverter = (
  a: ConverterAndAnchor,
  b: ConverterAndAnchor
) =>
  compareString(a.anchorAddress, b.anchorAddress) &&
  compareString(a.converterAddress, b.converterAddress);

interface RawAbiRelay {
  connectorToken1: string;
  connectorToken2: string;
  connectorTokenCount: string;
  conversionFee: string;
  owner: string;
  version: string;
  converterType?: string;
}

const poolsToOldRelay = (
  pools: NewPool[],
  tokens: WelcomeData["tokens"]
): Relay[] => {
  const allReserves = pools.flatMap(pool => pool.reserveTokens);
  const allReservesHaveToken = allReserves.every(reserve =>
    tokens.some(token => compareString(reserve.contract, token.dlt_id))
  );
  if (!allReservesHaveToken) throw new Error("Not enough tokens not passed");

  return pools.map(pool => ({
    anchor: {
      contract: pool.pool_dlt_id,
      decimals: pool.decimals,
      network: "eth",
      symbol: pool.name
    },
    contract: pool.converter_dlt_id,
    converterType: 1,
    fee: pool.decFee,
    id: pool.pool_dlt_id,
    isMultiContract: false,
    network: "eth",
    version: String(pool.version),
    reserves: pool.reserveTokens.map(reserve => ({
      network: "eth",
      contract: reserve.contract,
      symbol: reserve.symbol,
      decimals: findOrThrow(tokens, token =>
        compareString(token.dlt_id, reserve.contract)
      ).decimals,
      reserveWeight: reserve.reserveWeight
    }))
  }));
};

const zipAnchorAndConverters = (
  anchorAddresses: string[],
  converterAddresses: string[]
): ConverterAndAnchor[] => {
  if (anchorAddresses.length !== converterAddresses.length)
    throw new Error(
      "was expecting as many anchor addresses as converter addresses"
    );
  const zipped = zip(anchorAddresses, converterAddresses) as [string, string][];
  return zipped.map(([anchorAddress, converterAddress]) => ({
    anchorAddress: anchorAddress!,
    converterAddress: converterAddress!
  }));
};

const pickEthToken = (obj: any): Token => ({
  contract: obj.contract,
  decimals: obj.decimals,
  network: "ETH",
  symbol: obj.symbol
});

interface AbiRelay extends RawAbiRelay {
  converterAddress: string;
}

export interface AbiStaticRelay {
  converterAddress: string;
  converterType: string;
  version: string;
  connectorToken1: string;
  connectorToken2: string;
}

export interface RawABIDynamicRelay {
  connectorTokenCount: string;
  conversionFee: string;
  converterAddress: string;
  reserveOne: string;
  reserveOneAddress: string;
  reserveTwo: string;
  reserveTwoAddress: string;
}

export interface ABIDynamicRelay {
  connectorTokenCount: string;
  conversionFee: string;
  converterAddress: string;
  reserves: {
    reserveAddress: string;
    reserveBalance: string;
  }[];
}

export interface AbiDynamicRelay {
  converterAddress: string;
  reserves: {
    contract: string;
    balance: string;
  }[];
  fee: string;
}

interface RawAbiToken {
  contract: string;
  symbol: string;
  decimals: string;
}

export interface HalfStaticRelay {
  converterAddress: string;
  converterType: number;
  version: number;
  reserves: string[];
  poolToken: RawAbiToken;
}
export interface StaticRelay {
  converterAddress: string;
  converterType: number;
  version: number;
  reserves: RawAbiToken[];
  poolToken: RawAbiToken;
}

const prioritiseV2Pools = (a: ViewRelay, b: ViewRelay) => {
  if (a.v2 && b.v2) return 0;
  if (!a.v2 && !b.v2) return 0;
  if (a.v2 && !b.v2) return -1;
  if (!a.v2 && b.v2) return 1;
  return 0;
};

interface RawAbiCentralPoolToken extends RawAbiToken {
  poolTokens?: string[];
}

interface AbiCentralPoolToken extends RawAbiCentralPoolToken {
  contract: string;
}

const metaToModalChoice = (meta: TokenMeta): ModalChoice => ({
  id: meta.contract,
  contract: meta.contract,
  symbol: meta.symbol,
  img: meta.image
});

const isTraditional = (relay: Relay): boolean =>
  typeof relay.anchor == "object" &&
  relay.converterType == PoolType.Traditional;

const isChainLink = (relay: Relay): boolean =>
  Array.isArray((relay.anchor as PoolContainer).poolTokens) &&
  relay.converterType == PoolType.ChainLink;

const assertTraditional = (relay: Relay): TraditionalRelay => {
  if (isTraditional(relay)) {
    return relay as TraditionalRelay;
  }
  throw new Error("Not a traditional relay");
};

const assertChainlink = (relay: Relay): ChainLinkRelay => {
  if (isChainLink(relay)) {
    return relay as ChainLinkRelay;
  }
  throw new Error("Not a chainlink relay");
};

const generateEtherscanAccountLink = (
  account: string,
  ropsten: boolean = false
) => `https://${ropsten ? "ropsten." : ""}etherscan.io/address/${account}`;

const iouTokensInRelay = (relay: Relay): Token[] => {
  if (relay.converterType == PoolType.ChainLink) {
    const poolContainer = relay.anchor as PoolContainer;
    const poolTokens = poolContainer.poolTokens;
    const tokens = poolTokens.map(token => token.poolToken);
    return tokens;
  } else if (relay.converterType == PoolType.Traditional) {
    const smartToken = relay.anchor as SmartToken;
    return [smartToken];
  } else throw new Error("Failed to identify pool");
};

const reserveTokensInRelay = (relay: Relay): Token[] => relay.reserves;

const tokensInRelay = (relay: Relay): Token[] => [
  ...reserveTokensInRelay(relay),
  ...iouTokensInRelay(relay)
];

const relayToMinimal = (relay: Relay): MinimalRelay => ({
  contract: relay.contract,
  reserves: relay.reserves.map(
    (reserve): TokenSymbol => ({
      contract: reserve.contract,
      symbol: reserve.symbol
    })
  ),
  anchorAddress: isTraditional(relay)
    ? (relay.anchor as SmartToken).contract
    : (relay.anchor as PoolContainer).poolContainerAddress
});
interface TokenWithdrawParam {
  owner: string;
  spender: string;
  tokenAddress: string;
  amount: string;
  currentApprovedBalance?: string;
}

interface EthOpposingLiquid {
  smartTokenAmountWei: ViewAmount;
  opposingAmount?: string;
  shareOfPool: number;
  singleUnitCosts: ViewAmount[];
  reserveBalancesAboveZero: boolean;
}

interface RawAbiV2PoolBalances {
  converterAddress: string;
  reserveOne: string;
  reserveTwo: string;
  reserveOnePoolToken: string;
  reserveTwoPoolToken: string;
  primaryReserveToken: string;
  secondaryReserveToken: string;
  reserveOneStakedBalance: string;
  reserveTwoStakedBalance: string;
  effectiveReserveWeights: { 0: string; 1: string } | undefined;
}

interface RawAbiReserveBalance {
  converterAddress: string;
  reserveOne: string;
  reserveOneAddress: string;
  reserveTwoAddress: string;
  reserveTwo: string;
}

const hasTwoConnectors = (relay: RefinedAbiRelay | AbiRelay) => {
  const test = Number(relay.connectorTokenCount) == 2;
  if (!test)
    console.warn(
      "Dropping relay",
      relay,
      "because it does not have a connector count of two"
    );
  return test;
};

interface StakedAndReserve {
  converterAddress: string;
  reserves: {
    reserveAddress: string;
    stakedBalance: string;
    reserveWeight: string | undefined;
    poolTokenAddress: string;
  }[];
}

const polishTokens = (tokenMeta: TokenMeta[], tokens: Token[]) => {
  const ethReserveToken: Token = {
    contract: ethReserveAddress,
    decimals: 18,
    network: "ETH",
    symbol: "ETH"
  };

  const ethHardCode = updateArray(
    tokens,
    token => compareString(token.contract, ethReserveAddress),
    () => ethReserveToken
  );

  const decimalIsWrong = (decimals: number | undefined) =>
    typeof decimals == "undefined" || Number.isNaN(decimals);

  const missingDecimals = updateArray(
    ethHardCode,
    token => decimalIsWrong(token.decimals),
    missingDecimal => {
      const meta = tokenMeta.find(x =>
        compareString(x.contract, missingDecimal.contract)
      )!;
      if (Object.keys(meta).includes("precision")) {
        return {
          ...missingDecimal,
          decimals: meta.precision!
        };
      }
      console.warn(
        "Token Meta couldnt help determine decimals of token address",
        missingDecimal.contract
      );
      return {
        ...missingDecimal
      };
    }
  ).filter(token => !decimalIsWrong(token.decimals));

  const missingSymbol = updateArray(
    missingDecimals,
    token => !token.symbol,
    tokenWithoutSymbol => {
      const meta = tokenMeta.find(x =>
        compareString(x.contract, tokenWithoutSymbol.contract)
      )!;
      if (meta.symbol) {
        return {
          ...tokenWithoutSymbol,
          symbol: meta.symbol
        };
      } else {
        console.warn("Dropping", tokenWithoutSymbol, "due to no symbol");
        return {
          ...tokenWithoutSymbol
        };
      }
    }
  ).filter(token => token.symbol);

  const addedEth = [...missingSymbol, ethReserveToken];
  const uniqueTokens = uniqWith(addedEth, (a, b) =>
    compareString(a.contract, b.contract)
  );

  const difference = differenceWith(tokens, uniqueTokens, (a, b) =>
    compareString(a.contract, b.contract)
  );
  if (difference.length > 0) {
    console.warn(
      "Polish tokens is dropping",
      difference,
      "tokens",
      "sending back",
      uniqueTokens
    );
  }
  return uniqueTokens;
};

const priceChangePercent = (priceThen: number, priceNow: number): number => {
  const difference = priceNow - priceThen;
  return difference / priceThen;
};

const seperateMiniTokens = (tokens: AbiCentralPoolToken[]) => {
  const smartTokens = tokens
    .filter(token => !token.poolTokens)
    .map(pickEthToken);

  const poolTokenAddresses = tokens
    .filter(token => Array.isArray(token.poolTokens))
    .map(token => ({
      anchorAddress: token.contract,
      poolTokenAddresses: token.poolTokens as string[]
    }));

  const rebuiltLength = poolTokenAddresses.length + smartTokens.length;
  if (rebuiltLength !== tokens.length) {
    console.error("failed to rebuild properly");
  }
  return { smartTokens, poolTokenAddresses };
};

const percentageOfReserve = (
  percent: BigNumber,
  existingSupply: string
): string =>
  new BigNumber(percent).times(existingSupply).toFixed(0, BigNumber.ROUND_DOWN);

const percentageIncrease = (
  deposit: string,
  existingSupply: string
): BigNumber => new BigNumber(deposit).div(existingSupply);

const calculateOppositeFundRequirement = (
  deposit: string,
  depositsSupply: string,
  oppositesSupply: string
): string => {
  const increase = percentageIncrease(deposit, depositsSupply);
  return percentageOfReserve(increase, oppositesSupply);
};

const calculateOppositeLiquidateRequirement = (
  reserveAmount: string,
  reserveBalance: string,
  oppositeReserveBalance: string
): string => {
  const increase = percentageIncrease(reserveAmount, reserveBalance);
  return percentageOfReserve(increase, oppositeReserveBalance);
};

const oneMillion = new BigNumber(1000000);

const calculateFundReward = (
  reserveAmount: string,
  reserveSupply: string,
  smartSupply: string
) => {
  Decimal.set({ rounding: 0 });

  const smartSupplyNumber = new Decimal(smartSupply);
  if (smartSupplyNumber.eq(0)) {
    throw new Error("Client side geometric mean not yet supported");
  }
  return new Decimal(reserveAmount)
    .div(reserveSupply)
    .times(smartSupplyNumber)
    .times(0.99)
    .toFixed(0);
};

const calculateLiquidateCost = (
  reserveAmount: string,
  reserveBalance: string,
  smartSupply: string
) => {
  const percent = percentageIncrease(reserveAmount, reserveBalance);
  return percentageOfReserve(percent, smartSupply);
};

const percentDifference = (smallAmount: string, bigAmount: string) =>
  new Decimal(smallAmount).div(bigAmount).toNumber();

interface TokenMeta {
  id: string;
  image: string;
  contract: string;
  symbol: string;
  name: string;
  precision?: number;
}

const metaToTokenAssumedPrecision = (token: TokenMeta): Token => ({
  contract: token.contract,
  decimals: token.precision!,
  network: "ETH",
  symbol: token.symbol
});

const compareRelayById = (a: Relay, b: Relay) => compareString(a.id, b.id);

const VuexModule = createModule({
  strict: false
});

export class EthBancorModule
  extends VuexModule.With({ namespaced: "ethBancor/" })
  implements TradingModule, LiquidityModule, CreatePoolModule {
  registeredAnchorAddresses: string[] = [];
  convertibleTokenAddresses: string[] = [];
  loadingPools: boolean = false;

  bancorApiTokens: TokenPrice[] = [];
  relaysList: readonly Relay[] = [];
  tokenBalances: Balance[] = [];
  bntUsdPrice: number = 0;
  tokenMeta: TokenMeta[] = [];
  availableHistories: string[] = [];
  contracts: RegisteredContracts = {
    BancorNetwork: "",
    BancorConverterRegistry: "",
    LiquidityProtection: "",
    LiquidityProtectionStore: "",
    StakingRewards: ""
  };
  initiated: boolean = false;
  failedPools: string[] = [];
  currentNetwork: EthNetworks = EthNetworks.Mainnet;
  slippageTolerance = 0;

  liquidityProtectionSettings: LiquidityProtectionSettings = {
    contract: "",
    minDelay: dayjs.duration(30, "days").asSeconds(),
    maxDelay: dayjs.duration(100, "days").asSeconds(),
    lockedDelay: dayjs.duration(24, "hours").asSeconds(),
    networkToken: "",
    defaultNetworkTokenMintingLimit: "0"
  };

  @mutation setLiquidityProtectionSettings(
    settings: LiquidityProtectionSettings
  ) {
    this.liquidityProtectionSettings = settings;
  }

  @action async fetchLiquidityProtectionSettings({
    settingsContractAddress,
    protectionContractAddress
  }: {
    settingsContractAddress: string;
    protectionContractAddress: string;
  }) {
    const [[settings], [protection]] = ((await this.multi({
      groupsOfShapes: [
        [liquidityProtectionSettingsShape(settingsContractAddress, w3)],
        [liquidityProtectionShape(protectionContractAddress, w3)]
      ]
    })) as [unknown, unknown]) as [
      RawLiquidityProtectionSettings[],
      { govToken: string }[]
    ];

    const newSettings = {
      contract: settingsContractAddress,
      minDelay: Number(settings.minProtectionDelay),
      maxDelay: Number(settings.maxProtectionDelay),
      lockedDelay: Number(settings.lockDuration),
      govToken: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
      networkToken: settings.networkToken,
      defaultNetworkTokenMintingLimit: settings.defaultNetworkTokenMintingLimit
    } as LiquidityProtectionSettings;
    return newSettings;
  }

  get stats() {
    const apiData = this.apiData!;
    const bntUsdPrice = Number(apiData.bnt_price.usd);
    const bntPrice24Change = calculatePercentageChange(
      bntUsdPrice,
      Number(apiData.bnt_price_24h_ago.usd)
    );
    const bntSupply = this.bntSupply;

    const { pools, tokens } = apiData;
    const ethToken = findOrThrow(
      tokens,
      token => compareString(token.symbol, "ETH"),
      "failed finding ETH token in API data"
    );
    const bntToken = findOrThrow(
      tokens,
      token => compareString(token.symbol, "BNT"),
      "failed finding BNT token in API data"
    );
    const totalVolume24h = Number(apiData.total_volume_24h.usd || 0) || 0;
    const totalLiquidityDepth = pools.reduce(
      (acc, item) => Number(item.liquidity.usd || 0) + acc,
      0
    );

    const totalBntStaked = pools.reduce((acc, item) => {
      const bntReserve = item.reserves.find(reserve =>
        compareString(reserve.address, bntToken.dlt_id)
      );
      if (!bntReserve) return acc;
      return new BigNumber(bntReserve.balance).plus(acc);
    }, new BigNumber(0));

    const stakedBntPercent = totalBntStaked
      .div(shrinkToken(bntSupply, bntToken.decimals))
      .toNumber();

    return {
      totalLiquidityDepth,
      totalPoolCount: pools.length,
      totalTokenCount: tokens.length,
      stakedBntPercent,
      nativeTokenPrice: {
        symbol: "ETH",
        price: Number(ethToken.rate.usd)
      },
      twentyFourHourTradeCount: apiData.swaps.length,
      totalVolume24h,
      bntUsdPrice,
      bntPrice24Change
    };
  }

  whiteListedPools: string[] = [];
  whiteListedPoolsLoading = true;

  @mutation setWhiteListedPools(anchors: string[]) {
    this.whiteListedPools = anchors;
  }

  @mutation setWhiteListedPoolsLoading(state: boolean) {
    this.whiteListedPoolsLoading = state;
  }

  @action async protectLiquidityTx({
    anchorAddress,
    amountWei,
    onConfirmation,
    resolveImmediately = false
  }: {
    anchorAddress: string;
    amountWei: string;
    onConfirmation?: (hash: string) => void;
    resolveImmediately: boolean;
  }) {
    const liquidityProtectionAddress = this.contracts.LiquidityProtection;
    const contract = buildLiquidityProtectionContract(
      liquidityProtectionAddress
    );
    return this.resolveTxOnConfirmation({
      tx: contract.methods.protectLiquidity(anchorAddress, amountWei),
      onConfirmation,
      resolveImmediately
    });
  }

  @action async fetchPositionsMulti({
    positionIds,
    liquidityStore
  }: {
    positionIds: string[];
    liquidityStore: string;
  }): Promise<ProtectedLiquidity[]> {
    const positionShapes = positionIds.map(id =>
      protectedPositionShape(liquidityStore, id)
    );

    const [multiPositions] = await this.multi({
      groupsOfShapes: [positionShapes]
    });

    const keys = [
      "owner",
      "poolToken",
      "reserveToken",
      "poolAmount",
      "reserveAmount",
      "reserveRateN",
      "reserveRateD",
      "timestamp",
      "id"
    ];

    const protectedLiquidity = multiPositions
      .map(res => ({ ...res.position, "8": res.positionId }))
      .map(res =>
        fromPairs(keys.map((key, index) => [key, res[index]]))
      ) as ProtectedLiquidity[];

    return protectedLiquidity;
  }

  @action async fetchProtectionPositions() {
    fetchPositionsTrigger$.next(true);
  }

  @mutation updateReserveBalances(pools: MinimalPoolWithReserveBalances[]) {
    this.newPools = updateArray(
      this.newPools,
      pool => pools.some(p => compareString(pool.pool_dlt_id, p.anchorAddress)),
      pool => {
        const newBalances = findOrThrow(pools, p =>
          compareString(p.anchorAddress, pool.pool_dlt_id)
        );
        return {
          ...pool,
          reserves: pool.reserves.map(reserve => {
            const newBalance = findOrThrow(
              newBalances.reserveBalances,
              balance => compareString(balance.id, reserve.address)
            );
            return {
              ...reserve,
              balance: newBalance.amount
            };
          })
        };
      }
    );
    const apiData = this.apiData!;
    this.apiData = {
      ...apiData,
      pools: updateArray(
        this.apiData!.pools,
        pool =>
          pools.some(p => compareString(pool.pool_dlt_id, p.anchorAddress)),
        pool => {
          const newBalances = findOrThrow(pools, p =>
            compareString(p.anchorAddress, pool.pool_dlt_id)
          );
          return {
            ...pool,
            reserves: pool.reserves.map(reserve => {
              const newBalance = findOrThrow(
                newBalances.reserveBalances,
                balance => compareString(balance.id, reserve.address)
              );
              return {
                ...reserve,
                balance: newBalance.amount
              };
            })
          };
        }
      )
    };
  }

  @action async getReserveBalances(
    relays: MinimalPool[]
  ): Promise<MinimalPoolWithReserveBalances[]> {
    const [pools] = ((await this.multi({
      groupsOfShapes: [
        relays.map(v1Pool =>
          reserveBalanceShape(v1Pool.converterAddress, v1Pool.reserves)
        )
      ]
    })) as unknown[]) as [RawAbiReserveBalance[]];

    const zipped = pools.map(pool => ({
      reserves: [
        { id: pool.reserveOneAddress, amount: pool.reserveOne },
        { id: pool.reserveTwoAddress, amount: pool.reserveTwo }
      ],
      converterAddress: pool.converterAddress
    }));

    return relays.map(
      (relay): MinimalPoolWithReserveBalances => {
        const zippedPool = findOrThrow(
          zipped,
          pool => compareString(pool.converterAddress, relay.converterAddress),
          "failed to find zipped pool..."
        );
        return {
          ...relay,
          reserveBalances: sortAlongSide(
            zippedPool.reserves,
            r => r.id,
            relay.reserves
          )
        };
      }
    );
  }

  @action async addProtection({
    poolId,
    reserveAmount,
    onUpdate,
    onPrompt
  }: {
    poolId: string;
    reserveAmount: ViewAmount;
    onUpdate: OnUpdate;
    onPrompt: OnPrompt;
  }): Promise<TxResponse> {
    const pool = this.relay(poolId);

    if (!pool.whitelisted) {
      throw new Error("Pool must be whitelisted to protect liquidity");
    }

    const liqudityProtectionContractAddress = this.contracts
      .LiquidityProtection;
    const contract = buildLiquidityProtectionContract(
      liqudityProtectionContractAddress
    );

    const reserveTokenAddress = reserveAmount.id;
    const token = this.token(reserveTokenAddress);
    const reserveAmountWei = expandToken(reserveAmount.amount, token.precision);

    const depositIsEth = compareString(reserveAmount.id, ethReserveAddress);

    const govToken = await govTokenAddress$.pipe(take(1)).toPromise();

    const txHash = (await multiSteps({
      items: [
        {
          description: "Triggering approval..",
          task: async () => {
            await this.triggerApprovalIfRequired({
              owner: this.currentUser,
              spender: liqudityProtectionContractAddress,
              amount: reserveAmountWei,
              tokenAddress: reserveTokenAddress,
              onPrompt
            });
          }
        },
        {
          description: "Adding liquidity..",
          task: async () => {
            return this.resolveTxOnConfirmation({
              tx: contract.methods.addLiquidity(
                poolId,
                reserveTokenAddress,
                reserveAmountWei
              ),
              onConfirmation: async () => {
                this.spamBalances([govToken, reserveTokenAddress]);
                this.fetchProtectionPositions();
                await wait(3000);
                this.fetchProtectionPositions();
              },
              resolveImmediately: true,
              ...(depositIsEth && { value: reserveAmountWei })
            });
          }
        }
      ],
      onUpdate
    })) as string;

    return this.createTxResponse(txHash);
  }

  @action async removeProtection({
    decPercent,
    id,
    onPrompt
  }: {
    decPercent: number;
    id: string;
    onPrompt: OnPrompt;
  }): Promise<TxResponse> {
    const dbId = id.split(":")[1];

    const liquidityProtectionContract = this.contracts.LiquidityProtection;
    const contract = buildLiquidityProtectionContract(
      this.contracts.LiquidityProtection
    );

    const position = findOrThrow(
      this.protectedViewPositions,
      position => compareString(position.id.split(":")[1], dbId),
      `failed to find the referenced position of ${dbId}`
    );
    const isDissolvingNetworkToken = compareString(
      this.liquidityProtectionSettings.networkToken,
      position.inititalProtectedToken
    );
    const ppmPercent = decToPpm(decPercent);
    const govToken = await govTokenAddress$.pipe(take(1)).toPromise();

    if (isDissolvingNetworkToken) {
      const dissolvingFullPosition = decPercent === 1;
      const roundingBuffer = 0.01;
      const weiApprovalAmount = dissolvingFullPosition
        ? position.initialProtectedWei
        : new BigNumber(position.initialProtectedWei)
            .times(decPercent + roundingBuffer)
            .toFixed(0);
      await this.triggerApprovalIfRequired({
        owner: this.currentUser,
        spender: liquidityProtectionContract,
        amount: weiApprovalAmount,
        tokenAddress: govToken,
        onPrompt
      });
    }

    const txHash = await this.resolveTxOnConfirmation({
      tx: contract.methods.removeLiquidity(dbId, ppmPercent),
      resolveImmediately: true,
      onConfirmation: async () => {
        await wait(600);
        this.fetchAndSetLockedBalances();
        this.fetchProtectionPositions();
        await wait(2000);
        this.fetchAndSetLockedBalances();
        this.fetchProtectionPositions();
      }
    });

    return this.createTxResponse(txHash);
  }

  @action async protectLiquidity({
    amount,
    onUpdate,
    onPrompt
  }: ProtectLiquidityParams): Promise<TxResponse> {
    const liquidityProtectionContractAddress = this.contracts
      .LiquidityProtection;

    const pool = await this.traditionalRelayById(amount.id);
    const poolToken = pool.anchor;
    if (!compareString(amount.id, poolToken.contract))
      throw new Error("Pool token does not match anchor ID");
    const poolTokenWei = expandToken(amount.amount, poolToken.decimals);

    const govToken = await govTokenAddress$.pipe(take(1)).toPromise();

    const txHash = await multiSteps({
      items: [
        {
          description: "Approving transfer...",
          task: async () => {
            await this.triggerApprovalIfRequired({
              amount: poolTokenWei,
              owner: this.currentUser,
              spender: liquidityProtectionContractAddress,
              tokenAddress: poolToken.contract,
              onPrompt
            });
          }
        },
        {
          description: "Adding liquidity protection...",
          task: async () => {
            return this.protectLiquidityTx({
              anchorAddress: poolToken.contract,
              amountWei: poolTokenWei,
              onConfirmation: async () => {
                this.spamBalances([poolToken.contract, govToken]);
                this.fetchProtectionPositions();
                await wait(3000);
                this.fetchProtectionPositions();
              },
              resolveImmediately: true
            });
          }
        }
      ],
      onUpdate
    });

    return this.createTxResponse(txHash);
  }

  @mutation setTolerance(tolerance: number) {
    this.slippageTolerance = tolerance;
  }

  @action async setSlippageTolerance(tolerance: number) {
    this.setTolerance(tolerance);
  }

  get isSupportedNetwork() {
    return this.currentNetwork == EthNetworks.Mainnet;
  }

  @mutation setNetwork(network: EthNetworks) {
    this.currentNetwork = network;
  }

  @mutation setBancorApiTokens(tokens: TokenPrice[]) {
    this.bancorApiTokens = tokens;
  }

  lockedBalancesArr: LockedBalance[] = [];

  get lockedEth() {
    return this.lockedBalancesArr;
  }

  @mutation setLockedBalances(lockedBalances: LockedBalance[]) {
    this.lockedBalancesArr = lockedBalances;
  }

  @mutation setLoadingPositions(value: boolean) {
    this.loadingProtectedPositions = value;
  }

  @mutation updateHistoricPoolFees(newFees: PreviousPoolFee[]) {
    const currentFees = this.previousPoolFeesArr;
    this.previousPoolFeesArr = [...currentFees, ...newFees];
  }

  loadingProtectedPositions = true;
  protectedViewPositions: ViewProtectedLiquidity[] = [];

  @mutation setProtectedViewPositions(positions: ViewProtectedLiquidity[]) {
    this.protectedViewPositions = positions;
  }

  get protectedPositions(): ViewProtectedLiquidity[] {
    const positions = this.protectedViewPositions;
    return positions;
  }

  get poolTokenPositions(): PoolTokenPosition[] {
    const poolAnchors = this.newPools.map(pool => pool.pool_dlt_id);
    const balances = this.tokenBalances;
    const smartTokenBalances = balances.filter(balance =>
      poolAnchors.some(anchor => compareString(balance.id, anchor))
    );
    const newPositions = smartTokenBalances.map(balance => ({
      relay: findOrThrow(this.relays, relay =>
        compareString(relay.id, balance.id)
      ),
      smartTokenAmount: balance.balance
    })) as PoolTokenPosition[];

    const relaysList = this.relaysList;
    const allIouTokens = relaysList.flatMap(iouTokensInRelay);
    const existingBalances = this.tokenBalances.filter(
      balance =>
        balance.balance !== "0" &&
        allIouTokens.some(iouToken =>
          compareString(balance.id, iouToken.contract)
        )
    );

    const relevantRelays = relaysList
      .filter(x => x.converterType == PoolType.ChainLink)
      .filter(relay =>
        iouTokensInRelay(relay).some(token =>
          existingBalances.some(balance =>
            compareString(balance.id, token.contract)
          )
        )
      );

    const oldMethod = relevantRelays.map(
      (relay): PoolTokenPosition => {
        const anchorTokens = iouTokensInRelay(relay);
        const iouTokens = existingBalances.filter(existingBalance =>
          anchorTokens.some(anchor =>
            compareString(existingBalance.id, anchor.contract)
          )
        );

        const viewRelay = this.relay(relay.id);
        const isV1 = relay.converterType == PoolType.Traditional;
        if (isV1) {
          return {
            relay: viewRelay,
            smartTokenAmount: iouTokens[0].balance
          };
        } else {
          const chainkLinkRelay = relay as ChainLinkRelay;
          const reserveBalances = iouTokens.map(iouToken => {
            const relevantPoolTokenData = chainkLinkRelay.anchor.poolTokens.find(
              poolToken =>
                compareString(poolToken.poolToken.contract, iouToken.id)
            )!;
            return {
              balance: iouToken.balance,
              reserveId: relevantPoolTokenData.reserveId
            };
          });
          return {
            relay: viewRelay,
            poolTokens: reserveBalances
          };
        }
      }
    );

    return [...newPositions, ...oldMethod];
  }

  get morePoolsAvailable() {
    return !this.apiData;
  }

  @mutation setLoadingPools(status: boolean) {
    this.loadingPools = status;
  }

  @mutation updateFailedPools(ids: string[]) {
    this.failedPools = uniqWith([...this.failedPools, ...ids], compareString);
  }

  @action async loadMorePools() {}

  @action async checkPriceDeviationTooHigh({
    relayId,
    selectedTokenAddress
  }: {
    relayId: string;
    selectedTokenAddress: string;
  }): Promise<boolean> {
    const relay = await this.relayById(relayId);

    const converter = buildV28ConverterContract(relay.contract, w3);
    const liquidityProtectionSettings = buildLiquidityProtectionSettingsContract(
      this.liquidityProtectionSettings.contract,
      w3
    );

    const [
      primaryReserveContract,
      secondaryReserveContract
    ] = sortAlongSide(relay.reserves, reserve => reserve.contract, [
      selectedTokenAddress
    ]).map(x => x.contract);

    const [
      recentAverageRateResult,
      averageRateMaxDeviationResult,
      primaryReserveBalanceResult,
      secondaryReserveBalanceResult
    ] = await Promise.all([
      converter.methods.recentAverageRate(selectedTokenAddress).call(),
      liquidityProtectionSettings.methods.averageRateMaxDeviation().call(),
      converter.methods.reserveBalance(primaryReserveContract).call(),
      converter.methods.reserveBalance(secondaryReserveContract).call()
    ]);

    const averageRate = new BigNumber(recentAverageRateResult["1"]).dividedBy(
      recentAverageRateResult["0"]
    );

    console.log("/// PRICE DEVIATION DEBUG START");
    console.log("relayId", relayId);
    console.log("selectedTokenAddress", selectedTokenAddress);
    console.log("primaryReserveContract", primaryReserveContract);
    console.log("secondaryReserveContract", secondaryReserveContract);
    console.log("recentAverageRate", recentAverageRateResult);
    console.log("averageRateMaxDeviationResult", averageRateMaxDeviationResult);
    console.log("primaryReserveBalanceResult", primaryReserveBalanceResult);
    console.log("secondaryReserveBalanceResult", secondaryReserveBalanceResult);
    console.log("/// PRICE DEVIATION DEBUG END");

    if (averageRate.isNaN()) {
      throw new Error(
        "Price deviation calculation failed. Please contact support."
      );
    }

    const priceDeviationTooHigh = calculatePriceDeviationTooHigh(
      averageRate,
      new BigNumber(primaryReserveBalanceResult),
      new BigNumber(secondaryReserveBalanceResult),
      new BigNumber(averageRateMaxDeviationResult)
    );

    return priceDeviationTooHigh;
  }

  get secondaryReserveChoices(): ModalChoice[] {
    return this.newNetworkTokenChoices;
  }

  get primaryReserveChoices() {
    return (secondaryReserveId: string): ModalChoice[] => {
      const metaTokens = this.tokenMeta.filter(
        meta => !compareString(meta.id, secondaryReserveId)
      );
      const modalChoices = metaTokens.map(metaToModalChoice);
      const balances = this.tokenBalances;
      const tokensWithBalances = updateArray(
        modalChoices,
        token => balances.some(balance => compareString(balance.id, token.id)),
        token => ({
          ...token,
          balance: findOrThrow(balances, balance =>
            compareString(balance.id, token.id)
          ).balance
        })
      );

      return sortAlongSide(
        tokensWithBalances,
        choice => choice.id.toLowerCase(),
        this.tokens.map(token => token.id.toLowerCase())
      );
    };
  }

  get newNetworkTokenChoices(): ModalChoice[] {
    const toOffer = [
      { symbolName: "BNT", value: this.bntUsdPrice },
      { symbolName: "USDB", value: 1 }
    ];

    const addedMeta = toOffer
      .map(offer => ({
        ...offer,
        meta: this.tokenMeta.find(meta =>
          compareString(meta.symbol, offer.symbolName)
        )!
      }))
      .filter(offer => offer.meta);

    return addedMeta.map(meta => {
      const balance = this.tokenBalance(meta.meta.contract);
      const stringBalance =
        balance && new BigNumber(balance.balance).toString();
      return {
        id: meta.meta.id,
        contract: meta.meta.contract,
        img: meta.meta.image,
        symbol: meta.meta.symbol,
        balance: stringBalance,
        usdValue: meta.value
      };
    });
  }

  get newPoolTokenChoices() {
    return (networkToken: string): ModalChoice[] => {
      const tokenChoices = this.tokenMeta
        .map(metaToModalChoice)
        .map(modalChoice => {
          const balance = this.tokenBalance(modalChoice.contract);
          const stringBalance =
            balance && new BigNumber(balance.balance).toString();
          return {
            ...modalChoice,
            balance: stringBalance
          };
        })
        .filter(meta =>
          this.newNetworkTokenChoices.some(
            networkChoice => !compareString(networkChoice.id, meta.id)
          )
        )
        .filter(tokenChoice => tokenChoice.id !== networkToken)
        .filter(meta => {
          const suggestedReserveIds = [meta.id, networkToken];
          const existingRelayWithSameReserves = this.relays.some(relay => {
            const reserves = relay.reserves.map(reserve => reserve.contract);
            return suggestedReserveIds.every(id =>
              reserves.some(r => compareString(id, r))
            );
          });
          return !existingRelayWithSameReserves;
        })
        .filter((_, index) => index < 200);

      const sorted = sortAlongSide(
        tokenChoices,
        token => token.id.toLowerCase(),
        this.tokens.map(token => token.id.toLowerCase())
      ).sort((a, b) => Number(b.balance) - Number(a.balance));
      return sorted;
    };
  }

  get currentUser() {
    return vxm.wallet.currentUser;
  }

  @mutation moduleInitiated() {
    this.initiated = true;
  }

  @action async fetchNewConverterAddressFromHash(
    hash: string
  ): Promise<string> {
    const interval = 1000;
    const attempts = 10;

    for (let i = 0; i < attempts; i++) {
      const info = await web3.eth.getTransactionReceipt(hash);
      if (info) {
        return removeLeadingZeros(info.logs[0].address);
      }
      await wait(interval);
    }
    throw new Error("Failed to find new address in decent time");
  }

  @mutation resetData() {
    this.apiData = undefined;
    this.relaysList = [];
    this.tokenBalances = [];
    this.initiated = false;
  }

  @action async onNetworkChange(updatedNetwork: EthNetworks) {
    if (this.currentNetwork !== updatedNetwork) {
      this.resetData();
      this.init();
      this.setNetwork(updatedNetwork);
    }
  }

  @action async deployV1Converter({
    poolTokenName,
    poolTokenSymbol,
    poolTokenPrecision,
    reserves
  }: {
    poolTokenName: string;
    poolTokenSymbol: string;
    poolTokenPrecision: number;
    reserves: { contract: string; ppmReserveWeight: string }[];
  }): Promise<string> {
    if (reserves.length == 0) throw new Error("Must have at least one reserve");
    const converterRegistryAddress = this.contracts.BancorConverterRegistry;
    const contract = buildRegistryContract(converterRegistryAddress);

    const reserveTokenAddresses = reserves.map(reserve => reserve.contract);
    const reserveWeights = reserves.map(reserve => reserve.ppmReserveWeight);

    const poolType = PoolType.Traditional;

    const poolAlreadyExists = await existingPool(
      converterRegistryAddress,
      poolType,
      reserveTokenAddresses,
      reserveWeights,
      this.currentNetwork
    );
    if (poolAlreadyExists)
      throw new Error(`Similar pool already exists (${poolAlreadyExists})`);

    return this.resolveTxOnConfirmation({
      tx: contract.methods.newConverter(
        poolType,
        poolTokenName,
        poolTokenSymbol,
        poolTokenPrecision,
        50000,
        reserveTokenAddresses,
        reserveWeights
      )
    });
  }

  @action async createV1Pool({
    onUpdate,
    decFee,
    decimals,
    poolName,
    poolSymbol,
    reserves,
    onPrompt
  }: CreateV1PoolEthParams): Promise<V1PoolResponse> {
    await this.awaitConfirmation(onPrompt);
    const hasFee = new BigNumber(decFee).isGreaterThan(0);

    const {
      poolId,
      newConverterTx
    }: { poolId: string; newConverterTx: string } = await multiSteps({
      items: [
        {
          description: "Creating pool...",
          task: async () => {
            const converterRes = await this.deployV1Converter({
              reserves: reserves.map(reserve => ({
                contract: reserve.tokenId,
                ppmReserveWeight: decToPpm(reserve.decReserveWeight)
              })),
              poolTokenName: poolName,
              poolTokenSymbol: poolSymbol,
              poolTokenPrecision: decimals
            });

            const converterAddress = await this.fetchNewConverterAddressFromHash(
              converterRes
            );
            return { converterAddress, newConverterTx: converterRes };
          }
        },
        {
          description: "Transferring ownership...",
          task: async ({ converterAddress, newConverterTx }) => {
            await this.claimOwnership(converterAddress);
            return { converterAddress, newConverterTx };
          }
        },
        ...(hasFee
          ? [
              {
                description: "Setting fee...",
                task: async ({
                  converterAddress,
                  newConverterTx
                }: {
                  converterAddress: string;
                  newConverterTx: string;
                }) => {
                  await this.setFee({
                    converterAddress,
                    ppmFee: decToPpm(decFee)
                  });
                  return { converterAddress, newConverterTx };
                }
              }
            ]
          : []),
        {
          description: "Adding pool...",
          task: async ({
            converterAddress,
            newConverterTx
          }: {
            converterAddress: string;
            newConverterTx: string;
          }) => {
            const registeredAnchorAddresses = await this.fetchAnchorAddresses({
              converterRegistryAddress: this.contracts.BancorConverterRegistry
            });
            const convertersAndAnchors = await this.add(
              registeredAnchorAddresses
            );
            const converterAndAnchor = findOrThrow(
              convertersAndAnchors,
              converterAndAnchor =>
                compareString(
                  converterAndAnchor.converterAddress,
                  converterAddress
                ),
              "failed to find new pool in the contract registry"
            );
            await this.addPoolsBulk([converterAndAnchor]);
            return { newConverterTx, poolId: converterAndAnchor.anchorAddress };
          }
        }
      ],
      onUpdate
    });

    const txResponse = await this.createTxResponse(newConverterTx);
    return {
      ...txResponse,
      poolId
    };
  }

  @action async createTxResponse(txHash: string): Promise<TxResponse> {
    const txLink = generateEtherscanTxLink(
      txHash,
      this.currentNetwork == EthNetworks.Ropsten
    );
    return {
      blockExplorerName: "Etherscan",
      blockExplorerLink: txLink,
      txId: txHash
    };
  }

  @action async approveTokenWithdrawals(
    approvals: {
      approvedAddress: string;
      amount: string;
      tokenAddress: string;
    }[]
  ) {
    return Promise.all(
      approvals.map(approval => {
        const tokenContract = buildTokenContract(approval.tokenAddress);

        return this.resolveTxOnConfirmation({
          tx: tokenContract.methods.approve(
            approval.approvedAddress,
            approval.amount
          )
        });
      })
    );
  }

  @action async fetchAndSetLockedBalances() {
    lockedBalancesTrigger$.next(null);
  }

  @action async claimBnt(onPrompt: OnPrompt): Promise<TxResponse> {
    await this.awaitConfirmation(onPrompt);
    const contract = buildLiquidityProtectionContract(
      this.contracts.LiquidityProtection
    );

    const now = dayjs();
    const availableClaims = this.lockedBalancesArr
      .filter(balance => dayjs.unix(balance.expirationTime).isBefore(now))
      .sort((a, b) => a.index - b.index);

    if (availableClaims.length == 0)
      throw new Error("Failed finding available locked balance");

    const hash = await this.resolveTxOnConfirmation({
      tx: contract.methods.claimBalance("0", "1000")
    });

    const bntAddress = getNetworkVariables(this.currentNetwork).bntToken;
    this.spamBalances([bntAddress]);

    (async () => {
      await wait(2000);
      this.fetchAndSetLockedBalances();
    })();
    this.fetchAndSetLockedBalances();

    return {
      ...(await this.createTxResponse(hash)),
      txId: hash
    };
  }

  @action async claimOwnership(converterAddress: string) {
    const converter = buildConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: converter.methods.acceptOwnership()
    });
  }

  @action async setFee({
    converterAddress,
    ppmFee
  }: {
    converterAddress: string;
    ppmFee: string;
  }) {
    const converterContract = buildConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: converterContract.methods.setConversionFee(ppmFee),
      resolveImmediately: true
    });
  }

  @action async determineTxGas(tx: ContractSendMethod): Promise<number> {
    const from = this.currentUser;
    if (!from)
      throw new Error("Cannot estimate gas without being authenticated");
    const buffer = 1.1;

    let adjustedGas: number;
    try {
      const withUser = await tx.estimateGas({ from });
      adjustedGas = withUser;
    } catch (e) {
      try {
        const withoutUser = await tx.estimateGas();
        adjustedGas = withoutUser;
      } catch (e) {
        throw new Error(`Failed estimating gas for tx ${e}`);
      }
    }
    const bufferedResult = adjustedGas * buffer;
    return new BigNumber(bufferedResult.toFixed(0)).toNumber();
  }

  @action async resolveTxOnConfirmation({
    tx,
    gas,
    value,
    resolveImmediately = false,
    onHash,
    onConfirmation
  }: {
    tx: ContractSendMethod;
    value?: string;
    gas?: number;
    resolveImmediately?: boolean;
    onHash?: (hash: string) => void;
    onConfirmation?: (hash: string) => void;
  }): Promise<string> {
    let adjustedGas: number | boolean = false;
    if (gas) {
      adjustedGas = gas;
    } else {
      try {
        adjustedGas = await this.determineTxGas(tx);
      } catch (e) {}
    }

    return new Promise((resolve, reject) => {
      let txHash: string;
      tx.send({
        from: this.currentUser,
        ...(adjustedGas && { gas: adjustedGas as number }),
        ...(value && { value: toHex(value) })
      })
        .on("transactionHash", (hash: string) => {
          txHash = hash;
          if (onHash) onHash(hash);
          if (resolveImmediately) {
            resolve(txHash);
          }
        })
        .on("confirmation", (confirmationNumber: number) => {
          if (confirmationNumber === 1) {
            if (onConfirmation) onConfirmation(txHash);
            resolve(txHash);
          }
        })
        .on("error", (error: any) => reject(error));
    });
  }

  get supportedFeatures() {
    return () => {
      return ["addLiquidity", "removeLiquidity"];
    };
  }

  get wallet() {
    return "eth";
  }

  get tokens(): ViewToken[] {
    const liquidityProtectionNetworkToken =
      this.liquidityProtectionSettings.networkToken ||
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C";
    const whitelistedPools = this.whiteListedPools;
    if (!this.apiData) {
      return [];
    }
    const tokensWithPoolBackground = this.newPools
      .flatMap(pool => {
        const whitelisted = whitelistedPools.some(anchor =>
          compareString(anchor, pool.pool_dlt_id)
        );

        const liquidityProtection =
          whitelisted &&
          pool.reserves.some(reserve =>
            compareString(reserve.address, liquidityProtectionNetworkToken)
          ) &&
          pool.reserves.length == 2 &&
          pool.reserves.every(reserve => reserve.weight == decToPpm(0.5)) &&
          Number(pool.version) >= 41;

        const tradeSupported = pool.reserves.every(
          reserve => reserve.balance !== "0"
        );

        return pool.reserves.map(reserve => ({
          contract: reserve.address,
          liquidityProtection,
          tradeSupported
        }));
      })
      .reduce((acc, item) => {
        const existingToken = acc.find(token =>
          compareString(token.contract!, item.contract)
        );
        return existingToken
          ? updateArray(
              acc,
              token => compareString(token.contract!, item.contract),
              token => ({
                ...token,
                liquidityProtection:
                  token.liquidityProtection || item.liquidityProtection,
                tradeSupported: token.tradeSupported || item.tradeSupported
              })
            )
          : [...acc, item];
      }, [] as { contract: string; liquidityProtection: boolean; tradeSupported: boolean }[]);

    const tokenBalances = this.tokenBalances;
    const tokenMeta = this.tokenMeta;
    const daoTokenAddresses = this.daoTokenAddresses;

    const finalTokens = this.apiData.tokens
      .map(
        (token): ViewToken => {
          const tokenWithBackground = tokensWithPoolBackground.find(t =>
            compareString(t.contract, token.dlt_id)
          );
          const liquidityProtection = !!(
            tokenWithBackground && tokenWithBackground.liquidityProtection
          );
          const tradeSupported = !!(
            tokenWithBackground && tokenWithBackground.tradeSupported
          );

          const change24h =
            priceChangePercent(
              Number(token.rate_24h_ago.usd),
              Number(token.rate.usd)
            ) * 100;
          const meta = tokenMeta.find(meta =>
            compareString(meta.contract, token.dlt_id)
          );
          const balance = tokenBalances.find(balance =>
            compareString(balance.id, token.dlt_id)
          );
          const balanceString =
            balance && new BigNumber(balance.balance).toString();

          const limitOrderAvailable =
            daoTokenAddresses.some(tokenAddress =>
              compareString(token.dlt_id, tokenAddress)
            ) || compareString(token.dlt_id, ethReserveAddress);

          return {
            contract: token.dlt_id,
            id: token.dlt_id,
            name: token.symbol,
            symbol: token.symbol,
            precision: token.decimals,
            logo: (meta && meta.image) || defaultImage,
            change24h,
            ...(balance && { balance: balanceString }),
            liqDepth: Number(token.liquidity.usd || 0),
            liquidityProtection,
            price: Number(token.rate.usd),
            volume24h: Number(1),
            tradeSupported,
            limitOrderAvailable
          };
        }
      )
      .sort(sortByLiqDepth);

    if (this.currentNetwork == EthNetworks.Mainnet) {
      const wEthBalance = tokenBalances.find(balance =>
        compareString(balance.id, wethTokenContractAddress)
      );
      const wethBalanceString =
        wEthBalance && new BigNumber(wEthBalance.balance).toString();

      const wethTokenImage = imageOrDefault(
        wethTokenContractAddress,
        tokenMeta
      );

      const wethToken: ViewToken = {
        ...(wEthBalance && { balance: wethBalanceString }),
        contract: wethTokenContractAddress,
        id: wethTokenContractAddress,
        limitOrderAvailable: true,
        tradeSupported: false,
        logo: wethTokenImage,
        name: "WETH",
        precision: 18,
        symbol: "WETH",
        liquidityProtection: false
      };

      finalTokens.push(wethToken);
    }
    return finalTokens;
  }

  get tokenMetaObj() {
    return (id: string) => {
      return findOrThrow(
        this.tokenMeta,
        meta => compareString(id, meta.id),
        `Failed to find token meta for symbol with token contract of ${id}`
      );
    };
  }

  get tokenBalance() {
    return (tokenId: string) =>
      this.tokenBalances.find(token => compareString(token.id, tokenId));
  }

  get token(): (arg0: string) => ViewToken {
    return (id: string) =>
      findOrThrow(
        this.tokens,
        token => compareString(token.id, id),
        `failed to find token() with ID ${id} ethBancor`
      );
  }

  get relay() {
    return (id: string) =>
      findOrThrow(
        this.relays,
        relay => compareString(relay.id, id),
        `failed to find relay with id of ${id} in eth relay getter`
      );
  }

  get relays(): ViewRelay[] {
    const toReturn = [...this.chainkLinkRelays, ...this.traditionalRelays]
      .sort(sortByLiqDepth)
      .sort(prioritiseV2Pools);

    return toReturn;
  }

  get chainkLinkRelays(): ViewRelay[] {
    return (this.relaysList.filter(isChainLink) as ChainLinkRelay[])
      .filter(relay =>
        relay.reserves.every(reserve => reserve.reserveFeed && reserve.meta)
      )
      .map(relay => {
        const [, tokenReserve] = relay.reserves;

        const { poolContainerAddress } = relay.anchor;

        const reserves = relay.reserves.map(
          reserve =>
            ({
              reserveWeight: reserve.reserveWeight,
              id: reserve.contract,
              reserveId: poolContainerAddress + reserve.contract,
              logo: [reserve.meta!.logo],
              symbol: reserve.symbol,
              contract: reserve.contract,
              smartTokenSymbol: poolContainerAddress
            } as ViewReserve)
        );

        const bntTokenAddress = getNetworkVariables(this.currentNetwork)
          .bntToken;
        const relayBalances = relay as RelayWithReserveBalances;
        const bntReserveBalance =
          relayBalances.reserveBalances?.find(reserve =>
            compareString(reserve.id, bntTokenAddress)
          )?.amount || "0";

        const tradeSupported = relayBalances.reserveBalances.every(
          balance => balance.amount !== "0"
        );

        return {
          id: poolContainerAddress,
          tradeSupported,
          name: buildPoolNameFromReserves(reserves),
          version: Number(relay.version),
          reserves,
          fee: relay.fee,
          liqDepth: relay.reserves.reduce(
            (acc, item) => acc + item.reserveFeed!.liqDepth,
            0
          ),
          symbol: tokenReserve.symbol,
          addProtectionSupported: false,
          addLiquiditySupported: true,
          removeLiquiditySupported: true,
          whitelisted: false,
          liquidityProtection: false,
          bntReserveBalance: shrinkToken(bntReserveBalance, 18),
          v2: true
        } as ViewRelay;
      });
  }

  get traditionalRelays(): ViewRelay[] {
    if (!this.apiData) return [];

    const poolLiquidityMiningAprs = this.poolLiqMiningAprs;
    const whiteListedPools = this.whiteListedPools;
    const limit = vxm.minting.minNetworkTokenLiquidityforMinting;

    const liquidityProtectionNetworkToken =
      this.liquidityProtectionSettings.networkToken ||
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C";

    return this.newPools.map(relay => {
      const liqDepth = Number(relay.liquidity.usd);
      const tradeSupported = relay.reserves.every(
        reserve => reserve.balance !== "0"
      );

      const whitelisted = whiteListedPools.some(whitelistedAnchor =>
        compareString(whitelistedAnchor, relay.pool_dlt_id)
      );
      const lpNetworkTokenReserve = relay.reserves.find(reserve =>
        compareString(reserve.address, liquidityProtectionNetworkToken)
      );

      const hasEnoughLpNetworkToken =
        lpNetworkTokenReserve &&
        limit &&
        limit.isLessThan(lpNetworkTokenReserve!.balance);

      const liquidityProtection =
        relay.reserveTokens.some(reserve =>
          compareString(reserve.contract, liquidityProtectionNetworkToken)
        ) &&
        relay.reserveTokens.length == 2 &&
        relay.reserveTokens.every(reserve => reserve.reserveWeight == 0.5) &&
        whitelisted &&
        hasEnoughLpNetworkToken;

      const bntReserve = relay.reserves.find(reserve =>
        compareString(reserve.address, liquidityProtectionNetworkToken)
      );
      const addProtectionSupported = liquidityProtection && bntReserve;

      const feesGenerated = relay.fees_24h.usd || 0;
      const feesVsLiquidity =
        liqDepth === 0
          ? "0"
          : new BigNumber(feesGenerated).times(365).div(liqDepth).toString();

      const volume = relay.volume_24h.usd;

      const aprMiningRewards = poolLiquidityMiningAprs.find(apr =>
        compareString(apr.poolId, relay.pool_dlt_id)
      );

      const reserves = sortAlongSide(
        relay.reserveTokens.map(
          reserve =>
            ({
              id: reserve.contract,
              reserveWeight: reserve.reserveWeight,
              reserveId: relay.pool_dlt_id + reserve.contract,
              logo: [reserve.image],
              symbol: reserve.symbol,
              contract: reserve.contract,
              smartTokenSymbol: reserve.symbol
            } as ViewReserve)
        ),
        reserve => reserve.contract,
        [liquidityProtectionNetworkToken]
      );

      return {
        id: relay.pool_dlt_id,
        tradeSupported,
        name: buildPoolNameFromReserves(reserves),
        reserves,
        addProtectionSupported,
        fee: relay.decFee,
        liqDepth,
        symbol: relay.name,
        addLiquiditySupported: true,
        removeLiquiditySupported: true,
        liquidityProtection,
        whitelisted,
        v2: false,
        volume,
        feesGenerated,
        feesVsLiquidity,
        aprMiningRewards
      } as ViewRelay;
    });
  }

  @action async getGeometricMean(amounts: string[]) {
    const converter = buildConverterContract(
      getNetworkVariables(this.currentNetwork).converterContractForMaths,
      w3
    );
    return converter.methods.geometricMean(amounts).call();
  }

  @mutation setTokenMeta(tokenMeta: TokenMeta[]) {
    this.tokenMeta = tokenMeta.map(meta => {
      const hasDecimals = typeof meta.precision !== "undefined";
      return hasDecimals
        ? { ...meta, precision: Number(meta.precision!) }
        : meta;
    });
  }

  @action async triggerTx(actions: any[]) {
    // @ts-ignore
    return this.$store.dispatch("ethWallet/tx", actions, { root: true });
  }

  @action async fetchRelayBalances({
    poolId,
    blockHeight
  }: {
    poolId: string;
    blockHeight?: number;
  }) {
    const apiData = this.apiData;
    if (!apiData)
      throw new Error("Cannot fetch relay balances without API data");
    const pool = findOrThrow(
      apiData.pools,
      pool => compareString(pool.pool_dlt_id, poolId),
      "failed finding pool"
    );
    const { reserves, version } = pool;
    const contract = pool.converter_dlt_id;

    const converterContract = buildConverterContract(contract, w3);
    const smartTokenContract = buildTokenContract(poolId, w3);

    const requestAtParticularBlock = typeof blockHeight !== undefined;

    let [reserveBalances, smartTokenSupplyWei] = [reserves.map(() => "0"), "0"];

    try {
      [reserveBalances, smartTokenSupplyWei] = await Promise.all([
        Promise.all(
          reserves.map(reserve =>
            fetchReserveBalance(
              converterContract,
              reserve.address,
              version,
              blockHeight
            )
          )
        ),
        requestAtParticularBlock
          ? // @ts-ignore
            smartTokenContract.methods.totalSupply().call(null, blockHeight)
          : smartTokenContract.methods.totalSupply().call()
      ]);
    } catch (err) {
      console.error(`fetchRelayBalances failed ${err.message} for ${poolId}`);
    }

    const tokenReserves = reserves.map(reserve =>
      findOrThrow(apiData.tokens, token =>
        compareString(reserve.address, token.dlt_id)
      )
    );
    return {
      reserves: reserves.map((reserve, index) => {
        const token = findOrThrow(tokenReserves, token =>
          compareString(token.dlt_id, reserve.address)
        );
        return {
          ...reserve,
          contract: reserve.address,
          decimals: token.decimals,
          symbol: token.symbol,
          weiAmount: reserveBalances[index]
        };
      }),
      smartTokenSupplyWei
    };
  }

  @action async calculateOpposingDepositInfo(
    opposingDeposit: OpposingLiquidParams
  ): Promise<EthOpposingLiquid> {
    const {
      id,
      reserves: reservesViewAmounts,
      changedReserveId
    } = opposingDeposit;
    const reserve = findChangedReserve(reservesViewAmounts, changedReserveId);

    const relay = await this.traditionalRelayById(id);

    const reserveToken = await this.tokenById(reserve.id);

    const tokenSymbol = reserveToken.symbol;
    const tokenAmount = reserve.amount;

    const smartTokenAddress = relay.anchor.contract;
    const smartTokenDecimals = relay.anchor.decimals;

    this.getUserBalance({ tokenContractAddress: smartTokenAddress });
    const { reserves, smartTokenSupplyWei } = await this.fetchRelayBalances({
      poolId: smartTokenAddress
    });

    const [sameReserve, opposingReserve] = sortByNetworkTokens(
      reserves,
      reserve => reserve.symbol,
      [tokenSymbol]
    );

    const reserveBalancesAboveZero = reserves.every(reserve =>
      new BigNumber(reserve.weiAmount).gt(0)
    );
    const sameReserveWei = expandToken(tokenAmount, sameReserve.decimals);

    const userSmartTokenBalance = this.tokenBalances.find(balance =>
      compareString(balance.id, smartTokenAddress)
    );

    const userSmartTokenBalanceWei =
      userSmartTokenBalance &&
      new BigNumber(userSmartTokenBalance.balance).gt(0)
        ? expandToken(userSmartTokenBalance.balance, smartTokenDecimals)
        : "0";

    if (!reserveBalancesAboveZero) {
      const matchedInputs = reservesViewAmounts.map(viewAmount => ({
        decAmount: viewAmount.amount,
        decimals: findOrThrow(reserves, reserve =>
          compareString(reserve.contract, viewAmount.id)
        ).decimals
      }));

      const notAllInputsAreNumbers = matchedInputs.some(input =>
        new BigNumber(input.decAmount).isNaN()
      );
      if (notAllInputsAreNumbers) {
        return {
          shareOfPool: 0,
          smartTokenAmountWei: { amount: "1", id: smartTokenAddress },
          singleUnitCosts: [],
          opposingAmount: undefined,
          reserveBalancesAboveZero
        };
      }
      const weiInputs = matchedInputs.map(input =>
        expandToken(input.decAmount, input.decimals)
      );
      const fundReward = await this.getGeometricMean(weiInputs);

      const shareOfPool = calculateShareOfPool(
        fundReward,
        smartTokenSupplyWei,
        userSmartTokenBalanceWei
      );

      const singleUnitCosts =
        matchedInputs.length == 2
          ? buildSingleUnitCosts(reservesViewAmounts[0], reservesViewAmounts[1])
          : [];

      return {
        shareOfPool,
        smartTokenAmountWei: { amount: fundReward, id: smartTokenAddress },
        singleUnitCosts,
        opposingAmount: undefined,
        reserveBalancesAboveZero
      };
    }

    const opposingAmount = calculateOppositeFundRequirement(
      sameReserveWei,
      sameReserve.weiAmount,
      opposingReserve.weiAmount
    );
    const fundReward = calculateFundReward(
      sameReserveWei,
      sameReserve.weiAmount,
      smartTokenSupplyWei
    );

    const shareOfPool = calculateShareOfPool(
      fundReward,
      smartTokenSupplyWei,
      userSmartTokenBalanceWei
    );

    const opposingReserveSupplyDec = shrinkToken(
      opposingReserve.weiAmount,
      opposingReserve.decimals
    );
    const sameReserveSupplyDec = shrinkToken(
      sameReserve.weiAmount,
      sameReserve.decimals
    );

    const singleUnitCosts = buildSingleUnitCosts(
      { id: opposingReserve.contract, amount: opposingReserveSupplyDec },
      { id: sameReserve.contract, amount: sameReserveSupplyDec }
    );

    const res = {
      opposingAmount: shrinkToken(
        opposingAmount.toString(),
        opposingReserve.decimals
      ),
      smartTokenAmountWei: { id: smartTokenAddress, amount: fundReward },
      shareOfPool,
      singleUnitCosts: sortAlongSide(
        singleUnitCosts,
        unitCost => unitCost.id,
        relay.reserves.map(reserve => reserve.contract)
      ),
      reserveBalancesAboveZero
    };
    return res;
  }

  @action async fetchV2PoolBalances(
    relay: ChainLinkRelay
  ): Promise<StakedAndReserve> {
    const [reserveOne, reserveTwo] = relay.reserves;
    const [[poolBalace]] = ((await this.multi({
      groupsOfShapes: [
        [
          v2PoolBalanceShape(
            relay.contract,
            reserveOne.contract,
            reserveTwo.contract,
            this.currentNetwork
          )
        ]
      ]
    })) as unknown) as [RawAbiV2PoolBalances][];

    return rawAbiV2ToStacked(poolBalace);
  }

  @action async calculateOpposingDepositV2(
    opposingDeposit: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.chainLinkRelayById(opposingDeposit.id);

    const changedReserve = findChangedReserve(
      opposingDeposit.reserves,
      opposingDeposit.changedReserveId
    );
    const suggestedDepositDec = changedReserve.amount;

    const stakedAndReserveWeight = await this.fetchV2PoolBalances(relay);

    const [biggerWeight, smallerWeight] = stakedAndReserveWeight.reserves
      .map(reserve => ({
        ...reserve,
        decReserveWeight: new BigNumber(reserve.reserveWeight as string).div(
          oneMillion
        ),
        token: findOrThrow(
          relay.reserves,
          r => compareString(r.contract, reserve.reserveAddress),
          "failed to find token for weight"
        )
      }))
      .sort((a, b) => b.decReserveWeight.minus(a.decReserveWeight).toNumber());

    const weightsEqualOneMillion = new BigNumber(
      biggerWeight.reserveWeight as string
    )
      .plus(smallerWeight.reserveWeight as string)
      .eq(oneMillion);
    if (!weightsEqualOneMillion)
      throw new Error("Was expecting reserve weights to equal 100%");
    const distanceFromMiddle = biggerWeight.decReserveWeight.minus(0.5);

    const adjustedBiggerWeight = new BigNumber(biggerWeight.stakedBalance).div(
      new BigNumber(1).minus(distanceFromMiddle)
    );
    const adjustedSmallerWeight = new BigNumber(
      smallerWeight.stakedBalance
    ).div(new BigNumber(1).plus(distanceFromMiddle));

    const singleUnitCosts = buildSingleUnitCosts(
      {
        id: biggerWeight.reserveAddress,
        amount: shrinkToken(
          adjustedBiggerWeight.toString(),
          biggerWeight.token.decimals
        )
      },
      {
        id: smallerWeight.reserveAddress,
        amount: shrinkToken(
          adjustedSmallerWeight.toString(),
          smallerWeight.token.decimals
        )
      }
    );

    const sameReserve = findOrThrow(
      [biggerWeight, smallerWeight],
      weight => compareString(weight.reserveAddress, changedReserve.id),
      "failed to find same reserve"
    );

    const suggestedDepositWei = expandToken(
      suggestedDepositDec,
      sameReserve.token.decimals
    );

    const shareOfPool = new BigNumber(suggestedDepositWei)
      .div(sameReserve.stakedBalance)
      .toNumber();

    const v2Converter = buildV2Converter(relay.contract, w3);
    const maxStakingEnabled = await v2Converter.methods
      .maxStakedBalanceEnabled()
      .call();
    if (maxStakingEnabled) {
      const maxStakedBalance = await v2Converter.methods
        .maxStakedBalances(sameReserve.reserveAddress)
        .call();

      if (maxStakedBalance !== "0") {
        const currentBalance = new BigNumber(sameReserve.stakedBalance);
        const proposedTotalBalance = new BigNumber(suggestedDepositWei).plus(
          currentBalance
        );
        const maxStakedBalanceWei = new BigNumber(maxStakedBalance);
        if (proposedTotalBalance.gt(maxStakedBalanceWei)) {
          const remainingSpaceAvailableWei = maxStakedBalanceWei.minus(
            currentBalance
          );
          const remainingSpaceAvailableDec = shrinkToken(
            remainingSpaceAvailableWei.toString(),
            sameReserve.token.decimals
          );
          if (remainingSpaceAvailableWei.isLessThanOrEqualTo(0))
            throw new Error("This pool has reached the max liquidity cap");
          throw new Error(
            `This pool is currently capped and can receive ${remainingSpaceAvailableDec} additional tokens`
          );
        }
      }
    }

    const result = {
      opposingAmount: undefined,
      shareOfPool,
      singleUnitCosts
    };
    return result;
  }

  @action async getMaxStakes({ poolId }: { poolId: string }) {
    const contract = await buildLiquidityProtectionContract(
      this.contracts.LiquidityProtection,
      w3
    );
    const result = await contract.methods.poolAvailableSpace(poolId).call();

    const maxStakes = {
      maxAllowedBntWei: result["1"].toString(),
      maxAllowedTknWei: result["0"].toString()
    };

    return { maxStakes };
  }

  @action async getMaxStakesView({ poolId }: { poolId: string }) {
    const { maxStakes } = await this.getMaxStakes({
      poolId
    });

    const pool = this.relay(poolId);

    const bntTknArr = pool.reserves.map(r => {
      return {
        contract: r.contract,
        symbol: r.symbol,
        decimals: this.token(r.id).precision
      };
    });

    const [bnt, tkn] = sortAlongSide(bntTknArr, item => item.contract, [
      this.liquidityProtectionSettings.networkToken
    ]);

    return [
      {
        amount: shrinkToken(maxStakes.maxAllowedBntWei, bnt.decimals),
        token: bnt.symbol
      },
      {
        amount: shrinkToken(maxStakes.maxAllowedTknWei, tkn.decimals),
        token: tkn.symbol
      }
    ];
  }

  @action async fetchDisabledReserves(poolId: string): Promise<string[]> {
    const pool = findOrThrow(
      this.newPools,
      pool => compareString(pool.pool_dlt_id, poolId),
      `failed to find pool with id of ${poolId}`
    );
    const reserveIds = pool.reserves.map(reserve => reserve.address);
    const settingsContract = this.liquidityProtectionSettings.contract;

    const reserveStatuses = await Promise.all(
      reserveIds.map(async reserveId => ({
        reserveId,
        disabled: await addLiquidityDisabled(
          settingsContract,
          pool.pool_dlt_id,
          reserveId
        )
      }))
    );
    const disabledReserves = reserveStatuses
      .filter(reserve => reserve.disabled)
      .map(reserve => reserve.reserveId);

    return disabledReserves;
  }

  @action async getAvailableAndAmountToGetSpace({
    poolId
  }: {
    poolId: string;
  }): Promise<{
    availableSpace: {
      amount: string;
      token: string;
    }[];
    amountToGetSpace?: string;
  }> {
    const { maxStakes } = await this.getMaxStakes({
      poolId
    });
    const pool = this.relay(poolId);
    const bntTknArr = pool.reserves.map(r => {
      return {
        contract: r.contract,
        symbol: r.symbol,
        decimals: this.token(r.id).precision
      };
    });

    const [bnt, tkn] = sortAlongSide(bntTknArr, item => item.contract, [
      this.liquidityProtectionSettings.networkToken
    ]);

    const availableSpace = [
      {
        amount: shrinkToken(maxStakes.maxAllowedBntWei, bnt.decimals),
        token: bnt.symbol
      },
      {
        amount: shrinkToken(maxStakes.maxAllowedTknWei, tkn.decimals),
        token: tkn.symbol
      }
    ];
    const tknSpaceAvailableLTOne = new BigNumber(availableSpace[1].amount).lt(
      1
    );
    if (tknSpaceAvailableLTOne) {
      const liquidityProtectionSettings = buildLiquidityProtectionSettingsContract(
        this.liquidityProtectionSettings.contract,
        w3
      );
      const liqContract = await buildLiquidityProtectionContract(
        this.contracts.LiquidityProtection,
        w3
      );
      const systemStore = await liqContract.methods.systemStore().call();
      const liquidityProtectionSystemStore = buildLiquidityProtectionSystemStoreContract(
        systemStore,
        w3
      );
      const [balances, limit, tokensMintedWei] = await Promise.all([
        this.fetchRelayBalances({ poolId }),
        liquidityProtectionSettings.methods
          .networkTokenMintingLimits(poolId)
          .call(),
        liquidityProtectionSystemStore.methods
          .networkTokensMinted(poolId)
          .call()
      ]);
      const [bntReserve, tknReserve] = sortAlongSide(
        balances.reserves,
        reserve => reserve.symbol,
        ["BNT"]
      );

      const bntAmount = shrinkToken(bntReserve.weiAmount, bntReserve.decimals);
      const tknAmount = shrinkToken(tknReserve.weiAmount, tknReserve.decimals);
      const tokensMinted = shrinkToken(tokensMintedWei, bntReserve.decimals);
      const limitShrinked = shrinkToken(limit, bntReserve.decimals);

      const amountToGetSpace = calculateAmountToGetSpace(
        bntAmount,
        tknAmount,
        tokensMinted,
        limitShrinked
      );

      return {
        availableSpace,
        amountToGetSpace: amountToGetSpace
      };
    }
    return { availableSpace };
  }

  @action async calculateProtectionSingle({
    poolId,
    reserveAmount
  }: {
    poolId: string;
    reserveAmount: ViewAmount;
  }): Promise<ProtectionRes> {
    const depositingNetworkToken = compareString(
      this.liquidityProtectionSettings.networkToken,
      reserveAmount.id
    );

    const inputToken = this.token(reserveAmount.id);

    const { maxStakes } = await this.getMaxStakes({ poolId });

    const inputAmountWei = expandToken(
      reserveAmount.amount,
      inputToken.precision
    );

    const overMaxLimit = new BigNumber(inputAmountWei).isGreaterThan(
      depositingNetworkToken
        ? maxStakes.maxAllowedBntWei
        : maxStakes.maxAllowedTknWei
    );

    return {
      outputs: [],
      ...(overMaxLimit && { error: "overMaxLimit" })
    };
  }

  @action async calculateProtectionDouble({
    poolTokenAmount
  }: {
    poolTokenAmount: ViewAmount;
  }): Promise<ProtectionRes> {
    const balances = await this.fetchRelayBalances({
      poolId: poolTokenAmount.id
    });

    const outputs = balances.reserves.map(reserve => {
      const rate = new BigNumber(
        calculatePoolTokenRate(balances.smartTokenSupplyWei, reserve.weiAmount)
      ).div(2);

      const reserveAmount = rate.times(poolTokenAmount.amount);
      return {
        id: reserve.contract,
        amount: reserveAmount.toString(),
        symbol: reserve.symbol
      };
    });

    return {
      outputs
    };
  }

  @action async calculateOpposingDeposit(
    opposingDeposit: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.relayById(opposingDeposit.id);

    if (relay.converterType == PoolType.ChainLink) {
      return this.calculateOpposingDepositV2(opposingDeposit);
    } else {
      return this.calculateOpposingDepositInfo(opposingDeposit);
    }
  }

  @action async fetchTokenBalances(
    tokenAddresses: string[]
  ): Promise<Balance[]> {
    if (!this.currentUser)
      throw new Error("Cannot fetch balances when not logged in");
    const uniqueAddresses = uniqWith(tokenAddresses, compareString);

    const withPrecision =
      this.apiData &&
      uniqueAddresses.map(address => {
        const foundToken = this.apiData!.tokens.find(token =>
          compareString(token.dlt_id, address)
        );

        return {
          address,
          ...(foundToken && { precision: foundToken.decimals })
        };
      });

    if (withPrecision) {
      const [knownPrecisions, unknownPrecisions] = partition(
        withPrecision,
        token => Object.keys(token).includes("precision")
      );
      const owner = this.currentUser;
      const currentNetwork = this.currentNetwork;

      const knownDecimalShapes = knownPrecisions.map(token =>
        slimBalanceShape(token.address, owner, currentNetwork)
      );

      const unknownDecimalShapes = unknownPrecisions.map(token =>
        balanceShape(token.address, owner, currentNetwork)
      );

      try {
        const [knownDecimalsRes, unknownDecimalsRes] = (await this.multi({
          groupsOfShapes: [knownDecimalShapes, unknownDecimalShapes]
        })) as [
          { contract: string; balance: string }[],
          { contract: string; balance: string; decimals: string }[]
        ];

        const rebuiltDecimals = knownDecimalsRes.map(token => {
          const previouslyKnownPrecision = findOrThrow(knownPrecisions, t =>
            compareString(token.contract, t.address)
          );
          return {
            ...token,
            decimals: previouslyKnownPrecision.precision!
          };
        });

        const parsedNumbers = unknownDecimalsRes.map(res => ({
          ...res,
          decimals: Number(res.decimals)
        }));

        const mergedWei = [...rebuiltDecimals, ...parsedNumbers];
        const mergedDecimal = mergedWei.map(balance => ({
          ...balance,
          balance: balance.balance
            ? balance.balance !== "0"
              ? shrinkToken(balance.balance, balance.decimals)
              : balance.balance
            : "0"
        }));

        return mergedDecimal.map(
          (balance): Balance => ({
            balance: balance.balance,
            id: balance.contract
          })
        );
      } catch (e) {
        throw new Error("Failed fetching balances");
      }
    } else {
      return [];
    }
  }

  @action async getUserBalance({
    tokenContractAddress,
    userAddress,
    keepWei = false
  }: {
    tokenContractAddress: string;
    userAddress?: string;
    keepWei?: boolean;
  }) {
    if (!tokenContractAddress)
      throw new Error("Token contract address cannot be falsy");
    const balance = await vxm.ethWallet.getBalance({
      accountHolder: userAddress || vxm.wallet.currentUser,
      tokenContractAddress,
      keepWei
    });
    const currentBalance = this.tokenBalance(tokenContractAddress);
    const balanceDifferentToAlreadyStored =
      currentBalance && currentBalance.balance !== balance && !keepWei;
    const balanceNotStoredAndNotZero = new BigNumber(balance).gt(0) && !keepWei;

    if (balanceDifferentToAlreadyStored || balanceNotStoredAndNotZero) {
      this.updateUserBalances([{ id: tokenContractAddress, balance }]);
    }
    return balance;
  }

  @mutation updateUserBalances(incomingBalances: Balance[]) {
    const freshBalances = uniqWith(incomingBalances, (a, b) =>
      compareString(a.id, b.id)
    );
    const currentBalances = this.tokenBalances;

    const [actualIncomingBalances, nullBalances] = partition(
      freshBalances,
      balance => new BigNumber(balance.balance).isGreaterThan(0)
    );
    const droppedNullBalances = currentBalances.filter(
      balance => !nullBalances.some(b => compareString(balance.id, b.id))
    );

    const balancesToAdd = actualIncomingBalances.filter(
      balance => !droppedNullBalances.some(b => compareString(b.id, balance.id))
    );

    const balancesToUpdate = actualIncomingBalances.filter(balance => {
      const alreadyExists = droppedNullBalances.find(b =>
        compareString(b.id, balance.id)
      );
      return alreadyExists && alreadyExists.balance !== balance.balance;
    });

    const updatedBalances = updateArray(
      droppedNullBalances,
      balance => balancesToUpdate.some(b => compareString(balance.id, b.id)),
      balance => balancesToUpdate.find(b => compareString(balance.id, b.id))!
    );
    const addedBalances = [...updatedBalances, ...balancesToAdd];

    this.tokenBalances = addedBalances;
  }

  @action async relayById(relayId: string): Promise<Relay> {
    if (!this.apiData) {
      console.error("API data not downloaded yet");
      throw new Error("API data not downloaded yet");
    }
    const oldPools = poolsToOldRelay(this.newPools, this.apiData.tokens);

    return findOrThrow(
      oldPools,
      relay => compareString(relay.id, relayId),
      `failed to find relay by id ${relayId}`
    );
  }

  @action async getUserBalancesTraditional({
    relayId,
    smartTokenDec
  }: {
    relayId: string;
    smartTokenDec?: string;
  }): Promise<UserPoolBalances> {
    const relay = await this.traditionalRelayById(relayId);

    const smartTokenUserBalance =
      smartTokenDec ||
      (await this.getUserBalance({
        tokenContractAddress: relay.anchor.contract
      }));

    const { smartTokenSupplyWei, reserves } = await this.fetchRelayBalances({
      poolId: relay.anchor.contract
    });

    const smartTokenDecimals = relay.anchor.decimals;

    const percent = new Decimal(smartTokenUserBalance).div(
      shrinkToken(smartTokenSupplyWei, smartTokenDecimals)
    );

    const maxWithdrawals: ViewAmount[] = reserves.map(reserve => ({
      id: reserve.contract,
      amount: shrinkToken(
        percent.times(reserve.weiAmount).toString(),
        reserve.decimals
      )
    }));

    return {
      maxWithdrawals,
      iouBalances: [{ id: "", amount: String(smartTokenUserBalance) }]
    };
  }

  @action async getPoolType(pool: string | Relay): Promise<PoolType> {
    let relay: Relay;
    if (typeof pool == "undefined") {
      throw new Error("Pool is undefined");
    } else if (typeof pool == "string") {
      const poolId = pool as string;
      relay = await this.relayById(poolId);
    } else {
      relay = pool as Relay;
    }
    return typeof relay.converterType !== "undefined" &&
      relay.converterType == PoolType.ChainLink
      ? PoolType.ChainLink
      : PoolType.Traditional;
  }

  @action async removeLiquidityReturn({
    converterAddress,
    poolTokenWei,
    poolTokenContract
  }: {
    converterAddress: string;
    poolTokenWei: string;
    poolTokenContract: string;
  }) {
    const v2Converter = buildV2Converter(converterAddress, w3);

    const res = await v2Converter.methods
      .removeLiquidityReturnAndFee(poolTokenContract, poolTokenWei)
      .call();

    return { feeAmountWei: res[1], returnAmountWei: res[0] };
  }

  @action async getUserBalancesChainLink(
    relayId: string
  ): Promise<UserPoolBalances> {
    const relay = await this.chainLinkRelayById(relayId);
    const poolTokenBalances = await Promise.all(
      relay.anchor.poolTokens.map(async reserveAndPool => {
        const poolUserBalance = await this.getUserBalance({
          tokenContractAddress: reserveAndPool.poolToken.contract,
          keepWei: false
        });

        BigNumber.config({ EXPONENTIAL_AT: 256 });

        return {
          ...reserveAndPool,
          poolUserBalance: Number(poolUserBalance),
          reserveToken: findOrThrow(
            relay.reserves,
            reserve =>
              compareString(reserve.contract, reserveAndPool.reserveId),
            "failed to find reserve token"
          )
        };
      })
    );

    const v2Converter = buildV2Converter(relay.contract, w3);
    const data = await Promise.all(
      poolTokenBalances.map(async poolTokenBalance => {
        const poolTokenBalanceWei = expandToken(
          poolTokenBalance.poolUserBalance,
          poolTokenBalance.poolToken.decimals
        );

        const maxWithdrawWei = (
          await v2Converter.methods
            .removeLiquidityReturnAndFee(
              poolTokenBalance.poolToken.contract,
              poolTokenBalanceWei
            )
            .call()
        )[0];

        return {
          ...poolTokenBalance,
          maxWithdraw: shrinkToken(
            maxWithdrawWei,
            poolTokenBalance.reserveToken.decimals
          )
        };
      })
    );

    const maxWithdrawals = data.map(
      (x): ViewAmount => ({
        id: x.reserveId,
        amount: String(x.maxWithdraw)
      })
    );

    const iouBalances = data.map(
      (x): ViewAmount => ({
        id: x.reserveId,
        amount: new BigNumber(x.poolUserBalance).toString()
      })
    );

    return { iouBalances, maxWithdrawals };
  }

  @action async getUserBalances(relayId: string): Promise<UserPoolBalances> {
    if (!vxm.wallet.currentUser)
      throw new Error("Cannot find users .currentUser");

    const poolType = await this.getPoolType(relayId);
    return poolType == PoolType.Traditional
      ? this.getUserBalancesTraditional({ relayId })
      : this.getUserBalancesChainLink(relayId);
  }

  @action async getTokenSupply(tokenAddress: string) {
    const contract = buildTokenContract(tokenAddress, w3);
    return contract.methods.totalSupply().call();
  }

  limitOrdersArr: ViewLimitOrder[] = [];
  rawLimitOrdersArr: OrderElement[] = [];

  @mutation setRawLimitOrders(orders: OrderElement[]) {
    console.log(orders, "was the raw orders");
    this.rawLimitOrdersArr = orders;
  }

  @mutation setLimitOrders(orders: ViewLimitOrder[]) {
    this.limitOrdersArr = orders;
  }

  get limitOrders(): ViewLimitOrder[] {
    return this.limitOrdersArr;
  }

  @action async calculateOpposingWithdrawV2(
    opposingWithdraw: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.chainLinkRelayById(opposingWithdraw.id);

    const changedReserve = findChangedReserve(
      opposingWithdraw.reserves,
      opposingWithdraw.changedReserveId
    );
    const suggestedPoolTokenWithdrawDec = changedReserve.amount;

    const stakedAndReserveWeight = await this.fetchV2PoolBalances(relay);

    const matchedWeights = stakedAndReserveWeight.reserves.map(reserve => ({
      reserveWeight: reserve.reserveWeight,
      stakedBalance: reserve.stakedBalance,
      decReserveWeight: new BigNumber(reserve.reserveWeight as string).div(
        oneMillion
      ),
      reserveToken: findOrThrow(
        relay.reserves,
        r => compareString(r.contract, reserve.reserveAddress),
        "failed to find reserve token"
      ),
      poolToken: findOrThrow(
        relay.anchor.poolTokens,
        poolToken =>
          compareString(reserve.poolTokenAddress, poolToken.poolToken.contract),
        "failed to find pool token"
      )
    }));

    const [biggerWeight, smallerWeight] = matchedWeights.sort((a, b) =>
      b.decReserveWeight.minus(a.decReserveWeight).toNumber()
    );

    const weightsEqualOneMillion = new BigNumber(
      biggerWeight.reserveWeight as string
    )
      .plus(smallerWeight.reserveWeight as string)
      .eq(oneMillion);
    if (!weightsEqualOneMillion)
      throw new Error("Was expecting reserve weights to equal 100%");

    const distanceFromMiddle = biggerWeight.decReserveWeight.minus(0.5);

    const adjustedBiggerWeight = new BigNumber(biggerWeight.stakedBalance).div(
      new BigNumber(1).minus(distanceFromMiddle)
    );
    const adjustedSmallerWeight = new BigNumber(
      smallerWeight.stakedBalance
    ).div(new BigNumber(1).plus(distanceFromMiddle));

    const singleUnitCosts = sortAlongSide(
      buildSingleUnitCosts(
        {
          id: biggerWeight.reserveToken.contract,
          amount: shrinkToken(
            adjustedBiggerWeight.toString(),
            biggerWeight.reserveToken.decimals
          )
        },
        {
          id: smallerWeight.reserveToken.contract,
          amount: shrinkToken(
            adjustedSmallerWeight.toString(),
            smallerWeight.reserveToken.decimals
          )
        }
      ),
      unitCost => unitCost.id,
      relay.reserves.map(x => x.contract)
    );

    const sameReserve = findOrThrow(
      matchedWeights,
      weight => compareString(weight.reserveToken.contract, changedReserve.id),
      "failed to find same reserve"
    );

    const shareOfPool = new BigNumber(suggestedPoolTokenWithdrawDec)
      .div(
        shrinkToken(
          sameReserve.stakedBalance,
          sameReserve.reserveToken.decimals
        )
      )
      .toNumber();

    const suggestedWithdrawWei = expandToken(
      suggestedPoolTokenWithdrawDec,
      sameReserve.poolToken.poolToken.decimals
    );

    const [
      { returnAmountWei, feeAmountWei },
      liquidatationLimitWei
    ] = await Promise.all([
      this.removeLiquidityReturn({
        converterAddress: relay.contract,
        poolTokenContract: sameReserve.poolToken.poolToken.contract,
        poolTokenWei: suggestedWithdrawWei
      }),
      liquidationLimit({
        converterContract: relay.contract,
        poolTokenAddress: sameReserve.poolToken.poolToken.contract,
        web3: w3
      })
    ]);

    if (new BigNumber(suggestedWithdrawWei).gt(liquidatationLimitWei))
      throw new Error("Withdrawal amount above current liquidation limit");

    const noFeeLiquidityReturn = new BigNumber(returnAmountWei).plus(
      feeAmountWei
    );

    const feePercent = new BigNumber(feeAmountWei)
      .div(noFeeLiquidityReturn)
      .toNumber();

    const removeLiquidityReturnDec = shrinkToken(
      returnAmountWei,
      sameReserve.reserveToken.decimals
    );

    const result = {
      opposingAmount: undefined,
      shareOfPool,
      singleUnitCosts,
      withdrawFee: feePercent,
      expectedReturn: {
        id: sameReserve.reserveToken.contract,
        amount: removeLiquidityReturnDec
      }
    };
    return result;
  }

  @action async calculateOpposingWithdraw(
    opposingWithdraw: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.relayById(opposingWithdraw.id);
    if (relay.converterType == PoolType.ChainLink) {
      return this.calculateOpposingWithdrawV2(opposingWithdraw);
    } else {
      return this.calculateOpposingWithdrawInfo(opposingWithdraw);
    }
  }

  @action async traditionalRelayById(
    poolId: string
  ): Promise<TraditionalRelay> {
    const relay = await this.relayById(poolId);
    const traditionalRelay = assertTraditional(relay);
    return traditionalRelay;
  }

  @action async chainLinkRelayById(poolId: string): Promise<ChainLinkRelay> {
    const relay = await this.relayById(poolId);
    const chainlinkRelay = assertChainlink(relay);
    return chainlinkRelay;
  }

  @action async calculateOpposingWithdrawInfo(
    opposingWithdraw: OpposingLiquidParams
  ): Promise<EthOpposingLiquid> {
    const {
      id,
      reserves: reservesViewAmounts,
      changedReserveId
    } = opposingWithdraw;

    const reserve = findChangedReserve(reservesViewAmounts, changedReserveId);
    const tokenAmount = reserve.amount;
    const sameReserveToken = await this.tokenById(reserve.id);

    const relay = await this.traditionalRelayById(id);
    const smartTokenAddress = relay.anchor.contract;

    const { reserves, smartTokenSupplyWei } = await this.fetchRelayBalances({
      poolId: smartTokenAddress
    });

    const reserveBalancesAboveZero = reserves.every(reserve =>
      new BigNumber(reserve.weiAmount).gt(0)
    );

    const [sameReserve, opposingReserve] = sortByNetworkTokens(
      reserves,
      reserve => reserve.symbol,
      [sameReserveToken.symbol]
    );

    const sameReserveWei = expandToken(tokenAmount, sameReserve.decimals);
    const shareOfPool = new BigNumber(sameReserveWei)
      .div(sameReserve.weiAmount)
      .toNumber();

    const opposingValue = calculateOppositeLiquidateRequirement(
      sameReserveWei,
      sameReserve.weiAmount,
      opposingReserve.weiAmount
    );
    const liquidateCostWei = calculateLiquidateCost(
      sameReserveWei,
      sameReserve.weiAmount,
      smartTokenSupplyWei
    );

    const smartUserBalanceWei = await vxm.ethWallet.getBalance({
      accountHolder: vxm.wallet.currentUser,
      tokenContractAddress: smartTokenAddress,
      keepWei: true
    });

    const percentDifferenceBetweenSmartBalance = percentDifference(
      liquidateCostWei.toString(),
      String(smartUserBalanceWei)
    );
    let smartTokenAmount: string;
    if (percentDifferenceBetweenSmartBalance > 0.99) {
      smartTokenAmount = String(smartUserBalanceWei);
    } else {
      smartTokenAmount = liquidateCostWei.toString();
    }

    const sameReserveCost = shrinkToken(
      new BigNumber(opposingReserve.weiAmount)
        .div(sameReserve.weiAmount)
        .toString(),
      sameReserve.decimals
    );
    const opposingReserveCost = shrinkToken(
      new BigNumber(sameReserve.weiAmount)
        .div(opposingReserve.weiAmount)
        .toString(),
      opposingReserve.decimals
    );

    return {
      opposingAmount: shrinkToken(
        opposingValue.toString(),
        opposingReserve.decimals
      ),
      shareOfPool,
      smartTokenAmountWei: {
        id: smartTokenAddress,
        amount: smartTokenAmount
      },
      singleUnitCosts: [
        { id: sameReserve.contract, amount: sameReserveCost },
        { id: opposingReserve.contract, amount: opposingReserveCost }
      ],
      reserveBalancesAboveZero
    };
  }

  @action async removeLiquidityV2({
    converterAddress,
    poolToken,
    miniumReserveReturnWei = "1",
    onHash,
    onConfirmation,
    resolveImmediately = false
  }: {
    converterAddress: string;
    poolToken: TokenWei;
    miniumReserveReturnWei: string;
    onHash?: (hash: string) => void;
    onConfirmation?: (hash: string) => void;
    resolveImmediately: boolean;
  }) {
    const contract = buildV2Converter(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: contract.methods.removeLiquidity(
        poolToken.tokenContract,
        poolToken.weiAmount,
        miniumReserveReturnWei
      ),
      onHash,
      onConfirmation,
      resolveImmediately
    });
  }

  @action async liquidate({
    converterAddress,
    smartTokenAmount,
    onConfirmation,
    resolveImmediately = false
  }: {
    converterAddress: string;
    smartTokenAmount: string;
    onConfirmation?: (hash: string) => void;
    resolveImmediately: boolean;
  }) {
    const converterContract = buildConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: converterContract.methods.liquidate(smartTokenAmount),
      onConfirmation,
      resolveImmediately
    });
  }

  @action async removeLiquidity({
    reserves,
    id: relayId,
    onPrompt
  }: LiquidityParams): Promise<TxResponse> {
    if (onPrompt) {
      await this.awaitConfirmation(onPrompt);
    }
    const relay = await this.relayById(relayId);

    const preV11 = Number(relay.version) < 11;
    if (preV11)
      throw new Error("This Pool is not supported for adding liquidity");

    const postV28 = Number(relay.version) >= 28;

    const withdraw = reserves.find(reserve => reserve.amount)!;
    const converterAddress = relay.contract;

    const onConfirmation = () => {
      const anchorTokens = getAnchorTokenAddresses(relay);

      const tokenAddressesChanged = [
        ...relay.reserves.map(reserve => reserve.contract),
        ...anchorTokens
      ];
      this.spamBalances(tokenAddressesChanged);
    };

    let hash: string;
    if (postV28 && relay.converterType == PoolType.ChainLink) {
      const v2Relay = await this.chainLinkRelayById(relayId);
      const poolToken = findOrThrow(
        v2Relay.anchor.poolTokens,
        poolToken => compareString(poolToken.reserveId, withdraw.id),
        "failed to find pool token"
      );

      const poolTokenWeiAmount = expandToken(
        withdraw.amount,
        poolToken.poolToken.decimals
      );
      const weiPoolTokenBalance = (await this.getUserBalance({
        tokenContractAddress: poolToken.poolToken.contract,
        keepWei: true
      })) as string;

      const roundedWeiAmount = new BigNumber(poolTokenWeiAmount).gt(
        new BigNumber(weiPoolTokenBalance).times(0.995)
      )
        ? weiPoolTokenBalance
        : poolTokenWeiAmount;

      const expectedReserveReturn = await this.removeLiquidityReturn({
        converterAddress: relay.contract,
        poolTokenWei: roundedWeiAmount,
        poolTokenContract: poolToken.poolToken.contract
      });

      hash = await this.removeLiquidityV2({
        converterAddress,
        poolToken: {
          tokenContract: poolToken.poolToken.contract,
          weiAmount: roundedWeiAmount
        },
        miniumReserveReturnWei: await this.weiMinusSlippageTolerance(
          expectedReserveReturn.returnAmountWei
        ),
        onConfirmation,
        resolveImmediately: true
      });
    } else if (postV28 && relay.converterType == PoolType.Traditional) {
      const traditionalRelay = await this.traditionalRelayById(relay.id);
      const { smartTokenAmountWei } = await this.calculateOpposingWithdrawInfo({
        id: relayId,
        reserves,
        changedReserveId: reserves[0].id
      });
      const userPoolBalance = await this.getUserBalancesTraditional({
        relayId,
        smartTokenDec: shrinkToken(
          smartTokenAmountWei.amount,
          traditionalRelay.anchor.decimals
        )
      });
      hash = await this.removeLiquidityV28({
        converterAddress,
        smartTokensWei: smartTokenAmountWei.amount,
        reserveTokens: relay.reserves.map(reserve => {
          const reserveBalances = userPoolBalance.maxWithdrawals;
          return {
            tokenAddress: reserve.contract,
            minimumReturnWei: expandToken(
              new BigNumber(
                reserveBalances.find(balance =>
                  compareString(balance.id, reserve.contract)
                )!.amount
              )
                .times(0.98)
                .toNumber(),
              reserve.decimals
            )
          };
        }),
        onConfirmation,
        resolveImmediately: true
      });
    } else {
      const { smartTokenAmountWei } = await this.calculateOpposingWithdrawInfo({
        id: relayId,
        reserves,
        changedReserveId: reserves[0].id
      });
      hash = await this.liquidate({
        converterAddress,
        smartTokenAmount: smartTokenAmountWei.amount,
        onConfirmation,
        resolveImmediately: true
      });
    }

    return this.createTxResponse(hash);
  }

  @action async mintEthErc(ethDec: string) {
    return new Promise((resolve, reject) => {
      let txHash: string;
      web3.eth
        .sendTransaction({
          from: this.currentUser,
          to: ethErc20WrapperContract,
          value: toHex(toWei(ethDec))
        })
        .on("transactionHash", (hash: string) => {
          txHash = hash;
        })
        .on("confirmation", () => {
          resolve(txHash);
        })
        .on("error", (error: any) => reject(error));
    });
  }

  @action async fundRelay({
    converterAddress,
    fundAmount,
    onHash,
    onConfirmation,
    resolveImmediately = false
  }: {
    converterAddress: string;
    fundAmount: string;
    onHash?: (hash: string) => void;
    onConfirmation?: (hash: string) => void;
    resolveImmediately: boolean;
  }) {
    const converterContract = buildConverterContract(converterAddress);
    return this.resolveTxOnConfirmation({
      tx: converterContract.methods.fund(fundAmount),
      onConfirmation,
      resolveImmediately,
      ...(onHash && { onHash })
    });
  }

  @action async addLiquidityV28({
    converterAddress,
    reserves,
    minimumReturnWei,
    onHash,
    onConfirmation,
    resolveImmediately = false
  }: {
    converterAddress: string;
    reserves: TokenWei[];
    minimumReturnWei: string;
    onHash?: (hash: string) => void;
    onConfirmation?: (hash: string) => void;
    resolveImmediately: boolean;
  }) {
    const contract = buildV28ConverterContract(converterAddress);

    const newEthReserve = reserves.find(reserve =>
      compareString(reserve.tokenContract, ethReserveAddress)
    );

    return this.resolveTxOnConfirmation({
      tx: contract.methods.addLiquidity(
        reserves.map(reserve => reserve.tokenContract),
        reserves.map(reserve => reserve.weiAmount),
        minimumReturnWei
      ),
      onHash,
      onConfirmation,
      resolveImmediately,
      ...(newEthReserve && { value: newEthReserve.weiAmount })
    });
  }

  @action async addLiquidityV2({
    converterAddress,
    reserve,
    poolTokenMinReturnWei = "1",
    onHash,
    onConfirmation,
    resolveImmediately = false
  }: {
    converterAddress: string;
    reserve: TokenWei;
    poolTokenMinReturnWei?: string;
    onHash?: (hash: string) => void;
    onConfirmation?: (hash: string) => void;
    resolveImmediately: boolean;
  }) {
    const contract = buildV2Converter(converterAddress);

    const newEthReserve = compareString(
      reserve.tokenContract,
      ethReserveAddress
    );

    return this.resolveTxOnConfirmation({
      tx: contract.methods.addLiquidity(
        reserve.tokenContract,
        reserve.weiAmount,
        poolTokenMinReturnWei
      ),
      onHash: onHash,
      onConfirmation,
      resolveImmediately: true,
      ...(newEthReserve && { value: reserve.weiAmount })
    });
  }

  @action async removeLiquidityV28({
    converterAddress,
    smartTokensWei,
    reserveTokens,
    onConfirmation,
    resolveImmediately = false
  }: {
    converterAddress: string;
    smartTokensWei: string;
    reserveTokens: { tokenAddress: string; minimumReturnWei: string }[];
    onConfirmation?: (hash: string) => void;
    resolveImmediately: boolean;
  }) {
    const contract = buildV28ConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: contract.methods.removeLiquidity(
        smartTokensWei,
        reserveTokens.map(token => token.tokenAddress),
        reserveTokens.map(token => token.minimumReturnWei)
      ),
      onConfirmation,
      resolveImmediately
    });
  }

  @action async weiMinusSlippageTolerance(wei: string): Promise<string> {
    const slippageTolerance = vxm.bancor.slippageTolerance;
    if (typeof slippageTolerance !== "number")
      throw new Error("Error finding slippage tolerance");
    const percent = new BigNumber(1).minus(slippageTolerance);
    const newWei = new BigNumber(wei).times(percent).toFixed(0);
    return newWei;
  }

  @action async addToken(
    tokenAddress: string
  ): Promise<{
    decimals: number;
    symbol: string;
    tokenAddress: string;
  }> {
    const isAddress = web3.utils.isAddress(tokenAddress);
    if (!isAddress) throw new Error(`${tokenAddress} is not a valid address`);

    const shape = tokenShape(tokenAddress);
    const [[token]] = (await this.multi({ groupsOfShapes: [[shape]] })) as [
      [{ symbol: string; decimals: string; contract: string }]
    ];

    const tokenAddressesMatch = compareString(token.contract, tokenAddress);
    if (!tokenAddressesMatch) throw new Error("RPC return was not expected");

    if (!(token.symbol && token.decimals))
      throw new Error(
        "Failed parsing token information, please ensure this is an ERC-20 token"
      );

    const metadata = {
      decimals: Number(token.decimals),
      symbol: token.symbol,
      tokenAddress: token.contract
    };

    this.addTokenToMeta(metadata);

    return metadata;
  }

  @mutation addTokenToMeta(token: {
    decimals: number;
    symbol: string;
    tokenAddress: string;
  }) {
    const tokenMetaList = this.tokenMeta;

    const tokenAlreadyExists = this.tokenMeta.some(meta =>
      compareString(meta.contract, token.tokenAddress)
    );
    if (tokenAlreadyExists) return;

    const tokenMeta: TokenMeta = {
      contract: token.tokenAddress,
      id: token.tokenAddress,
      image: defaultImage,
      name: token.symbol,
      symbol: token.symbol,
      precision: token.decimals
    };

    this.tokenMeta = [...tokenMetaList, tokenMeta];
  }

  @action async addLiquidity({
    id: relayId,
    reserves,
    onUpdate,
    onPrompt
  }: LiquidityParams): Promise<TxResponse> {
    const relay = await this.relayById(relayId);

    const preV11 = Number(relay.version) < 11;
    if (preV11)
      throw new Error("This Pool is not supported for adding liquidity");

    const postV28 = Number(relay.version) >= 28;

    const matchedBalances = reserves
      .filter(reserve => reserve.amount)
      .map(reserve => {
        const relayReserve = findOrThrow(
          relay.reserves,
          relayReserve => compareString(relayReserve.contract, reserve.id),
          "failed to match passed reserves"
        );
        return {
          ...relayReserve,
          amount: reserve.amount
        };
      });

    const syncBalance = () => {
      const anchorTokens = getAnchorTokenAddresses(relay);

      const tokenAddressesChanged = [
        ...matchedBalances.map(x => x.contract),
        ...anchorTokens
      ];
      this.spamBalances(tokenAddressesChanged);
    };

    const steps: Step[] = [
      {
        name: "CheckBalance",
        description: "Updating balance approvals..."
      },
      {
        name: "Funding",
        description: "Now funding..."
      },
      {
        name: "BlockConfirmation",
        description: "Awaiting block confirmation..."
      },
      {
        name: "Done",
        description: "Done!"
      }
    ];

    onUpdate!(0, steps);

    const converterAddress = relay.contract;

    const approvalStatuses = await Promise.all(
      matchedBalances.map(async balance => {
        const balanceWei = expandToken(balance.amount!, balance.decimals);
        const { approvalIsRequired } = await this.isApprovalRequired({
          owner: this.currentUser,
          amount: balanceWei,
          spender: converterAddress,
          tokenAddress: balance.contract
        });
        return {
          contract: balance.contract,
          approvalIsRequired,
          balanceWei,
          balanceDec: balance.amount
        };
      })
    );

    const requiredApprovals = approvalStatuses.filter(
      status => status.approvalIsRequired
    );

    const requiredApprovalsWithType: {
      unlimitedApproval: boolean;
      contract: string;
      approvalIsRequired: boolean;
      balanceWei: string;
      balanceDec: string;
    }[] = [];

    for (const requiredApproval of requiredApprovals) {
      const { unlimitedApproval } = await this.promptUserForApprovalType(
        onPrompt!
      );
      requiredApprovalsWithType.push({
        ...requiredApproval,
        unlimitedApproval
      });
    }

    await Promise.all(
      requiredApprovalsWithType.map(async type => {
        if (compareString(type.contract, ethErc20WrapperContract) && !postV28) {
          await this.mintEthErc(type.balanceDec);
        }

        return this.triggerApprovalIfRequired({
          owner: this.currentUser,
          amount: type.unlimitedApproval ? unlimitedWei : type.balanceWei,
          spender: converterAddress,
          tokenAddress: type.contract
        });
      })
    );

    onUpdate!(1, steps);

    if (onPrompt) {
      await this.awaitConfirmation(onPrompt);
    }
    let txHash: string;

    if (postV28 && relay.converterType == PoolType.Traditional) {
      const {
        smartTokenAmountWei,
        reserveBalancesAboveZero
      } = await this.calculateOpposingDepositInfo({
        id: relay.id,
        reserves,
        changedReserveId: reserves[0].id
      });

      const minimumReturnWei = reserveBalancesAboveZero
        ? await this.weiMinusSlippageTolerance(smartTokenAmountWei.amount)
        : "1";

      txHash = await this.addLiquidityV28({
        converterAddress,
        reserves: matchedBalances
          .filter(balance => new BigNumber(balance.amount).gt(0))
          .map(balance => ({
            tokenContract: balance.contract,
            weiAmount: expandToken(balance.amount, balance.decimals)
          })),
        minimumReturnWei,
        onHash: () => onUpdate!(2, steps),
        onConfirmation: syncBalance,
        resolveImmediately: true
      });
    } else if (postV28 && relay.converterType == PoolType.ChainLink) {
      const chainLinkRelay = await this.chainLinkRelayById(relay.id);
      const reserveToken = matchedBalances.map(balance => ({
        tokenContract: balance.contract,
        weiAmount: expandToken(balance.amount, balance.decimals)
      }))[0];
      const poolToken = chainLinkRelay.anchor.poolTokens.find(poolToken =>
        compareString(poolToken.reserveId, reserveToken.tokenContract)
      );
      if (!poolToken)
        throw new Error("Client side error - failed finding pool token");

      const [stakedReserveBalance, poolTokenSupply] = await Promise.all([
        this.fetchStakedReserveBalance({
          converterAddress: chainLinkRelay.contract,
          reserveTokenAddress: reserveToken.tokenContract
        }),
        getTokenSupplyWei(poolToken.poolToken.contract)
      ]);

      const expectedPoolTokenReturnWei = calculateExpectedPoolTokenReturnV2(
        poolTokenSupply,
        stakedReserveBalance,
        reserveToken.weiAmount
      );

      const poolTokenMinReturnWei = await this.weiMinusSlippageTolerance(
        expectedPoolTokenReturnWei
      );

      txHash = await this.addLiquidityV2({
        converterAddress,
        reserve: reserveToken,
        poolTokenMinReturnWei,
        onHash: () => onUpdate!(2, steps),
        onConfirmation: syncBalance,
        resolveImmediately: true
      });
    } else {
      const { smartTokenAmountWei } = await this.calculateOpposingDepositInfo({
        reserves,
        changedReserveId: reserves[0].id,
        id: relayId
      });

      const fundAmount = smartTokenAmountWei;

      txHash = await this.fundRelay({
        converterAddress,
        fundAmount: fundAmount.amount,
        onHash: () => onUpdate!(2, steps),
        onConfirmation: syncBalance,
        resolveImmediately: true
      });
    }

    onUpdate!(3, steps);

    return this.createTxResponse(txHash);
  }

  @action async spamBalances(tokenAddresses: string[]) {
    for (let i = 0; i < 5; i++) {
      await this.fetchAndSetTokenBalances(tokenAddresses);
      await wait(1500);
    }
  }

  @action async fetchContractAddresses(
    contractRegistry: string
  ): Promise<RegisteredContracts> {
    if (!contractRegistry || !web3.utils.isAddress(contractRegistry))
      throw new Error("Must pass valid address");

    const hardCodedBytes: RegisteredContracts = {
      BancorNetwork: asciiToHex("BancorNetwork"),
      BancorConverterRegistry: asciiToHex("BancorConverterRegistry"),
      LiquidityProtectionStore: asciiToHex("LiquidityProtectionStore"),
      LiquidityProtection: asciiToHex("LiquidityProtection"),
      StakingRewards: asciiToHex("StakingRewards")
    };

    const hardCodedShape = (
      contractAddress: string,
      label: string,
      ascii: string
    ) => {
      const contract = buildAddressLookupContract(contractAddress);
      return {
        [label]: contract.methods.addressOf(ascii)
      };
    };

    const arrBytes = toPairs(hardCodedBytes) as [string, string][];

    try {
      const hardCodedShapes = arrBytes.map(([label, ascii]) =>
        hardCodedShape(contractRegistry, label, ascii)
      );
      const [contractAddresses] = await this.multi({
        groupsOfShapes: [hardCodedShapes]
      });

      const registeredContracts = Object.assign(
        {},
        ...contractAddresses
      ) as RegisteredContracts;

      this.setContractAddresses(registeredContracts);
      console.log(registeredContracts, "are registered contracts");
      return registeredContracts;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  @mutation setContractAddresses(contracts: RegisteredContracts) {
    this.contracts = {
      ...this.contracts,
      ...contracts
    };
  }

  @action async addPossiblePropsFromBancorApi(
    reserveFeeds: ReserveFeed[]
  ): Promise<ReserveFeed[]> {
    return reserveFeeds;
  }

  @action async updateRelayFeeds(suggestedFeeds: ReserveFeed[]) {
    const feeds = suggestedFeeds;

    const potentialRelaysToMutate = this.relaysList.filter(relay =>
      feeds.some(feed => compareString(feed.poolId, relay.id))
    );
    const relaysToMutate = potentialRelaysToMutate.filter(relay =>
      relay.reserves.some(reserve => {
        const feed = feeds.find(feed =>
          compareString(reserve.contract, feed.reserveAddress)
        );
        if (feed && !reserve.reserveFeed) return true;
        if (!feed) return false;
        const existingFeed = reserve.reserveFeed!;
        if (existingFeed) return feed.priority < existingFeed.priority;
      })
    );

    if (relaysToMutate.length > 0) {
      const updatedRelays = relaysToMutate.map(relay => ({
        ...relay,
        reserves: relay.reserves.map(reserve => {
          const feed = feeds.find(
            feed =>
              compareString(feed.reserveAddress, reserve.contract) &&
              compareString(feed.poolId, relay.id)
          );
          return {
            ...reserve,
            reserveFeed: feed
          };
        })
      }));

      this.updateRelays(updatedRelays);
    }
  }

  @action async fetchUsdPriceOfBnt() {
    const price = await vxm.bancor.fetchUsdPriceOfBnt();
    this.setBntUsdPrice(price);
    return price;
  }

  @mutation setBntUsdPrice(usdPrice: number) {
    this.bntUsdPrice = usdPrice;
  }

  @action async fetchStakedReserveBalance({
    converterAddress,
    reserveTokenAddress
  }: {
    converterAddress: string;
    reserveTokenAddress: string;
  }): Promise<string> {
    const contract = buildV2Converter(converterAddress, w3);
    return contract.methods.reserveStakedBalance(reserveTokenAddress).call();
  }

  get loadingTokens() {
    return !this.apiData;
  }

  get moreTokensAvailable() {
    return this.morePoolsAvailable;
  }

  @action async refresh() {}

  @action async conversionPathFromNetworkContract({
    from,
    to,
    networkContractAddress
  }: {
    from: string;
    to: string;
    networkContractAddress: string;
  }) {
    return conversionPath({
      networkContractAddress,
      from,
      to,
      web3: w3
    });
  }

  @action async multi({
    groupsOfShapes,
    blockHeight,
    traditional = false,
    label
  }: {
    groupsOfShapes: ShapeWithLabel[][];
    blockHeight?: number;
    traditional?: boolean;
    label?: string;
  }) {
    const currentNetwork = this.currentNetwork;
    const networkVars = getNetworkVariables(currentNetwork);
    const isMainNet = currentNetwork == EthNetworks.Mainnet;
    const multi = new MultiCall(w3, networkVars.multiCall, [
      500,
      100,
      50,
      10,
      1
    ]);

    try {
      const res = await multi.all(groupsOfShapes, {
        traditional,
        blockHeight
      });
      return res;
    } catch (e) {
      throw new Error(`Failed eth-multicall fetch ${e} label is ${label}`);
    }
  }

  @action async addPoolsV2(
    convertersAndAnchors: ConverterAndAnchor[]
  ): Promise<V2Response> {
    const smallLoad = convertersAndAnchors.length < 5;

    const allAnchors = convertersAndAnchors.map(item => item.anchorAddress);
    const allConverters = convertersAndAnchors.map(
      item => item.converterAddress
    );

    const groupsOfShapes = [
      allConverters.map(relayShape),
      allAnchors.map(poolTokenShape)
    ];

    const [rawRelays, poolAndSmartTokens] = ((await this.multi({
      groupsOfShapes,
      traditional: smallLoad,
      label: "raw relays fetch"
    })) as [unknown, unknown]) as [AbiRelay[], AbiCentralPoolToken[]];

    const { poolTokenAddresses, smartTokens } = seperateMiniTokens(
      poolAndSmartTokens
    );

    const polished: RefinedAbiRelay[] = await Promise.all(
      rawRelays.filter(hasTwoConnectors).map(
        async half =>
          <RefinedAbiRelay>{
            ...half,
            anchorAddress: findOrThrow(
              convertersAndAnchors,
              item =>
                compareString(item.converterAddress, half.converterAddress),
              "failed to find anchor address"
            ).anchorAddress,
            reserves: [half.connectorToken1, half.connectorToken2] as [
              string,
              string
            ],
            version: Number(half.version),
            converterType: determineConverterType(half.converterType)
          }
      )
    );

    const overWroteVersions = updateArray(
      polished,
      relay =>
        knownVersions.some(r =>
          compareString(r.converterAddress, relay.converterAddress)
        ),
      relay => ({
        ...relay,
        version: knownVersions.find(r =>
          compareString(r.converterAddress, relay.converterAddress)
        )!.version
      })
    );

    const passedFirstHalfs = overWroteVersions
      .filter(hasTwoConnectors)
      .filter(half =>
        poolTokenAddresses.some(poolTokenAddress =>
          compareString(poolTokenAddress.anchorAddress, half.anchorAddress)
        )
          ? poolTokenAddresses.find(poolTokenAddress =>
              compareString(poolTokenAddress.anchorAddress, half.anchorAddress)
            )!.poolTokenAddresses.length == 2
          : true
      );

    const verifiedV1Pools = passedFirstHalfs.filter(
      half => half.converterType == PoolType.Traditional
    );

    const verifiedV2Pools = passedFirstHalfs.filter(
      half => half.converterType == PoolType.ChainLink
    );

    const reserveTokens = uniqWith(
      passedFirstHalfs.flatMap(half => half.reserves),
      compareString
    );

    const tokenInMeta = (tokenMeta: TokenMeta[]) => (address: string) =>
      tokenMeta.find(
        meta => compareString(address, meta.contract) && meta.precision
      );

    const allTokensRequired = [
      ...reserveTokens,
      ...poolTokenAddresses.flatMap(pool => pool.poolTokenAddresses)
    ].filter(tokenAddress => !compareString(tokenAddress, ethReserveAddress));

    const tokenAddressesKnown = allTokensRequired.filter(
      tokenInMeta(this.tokenMeta)
    );
    const tokensKnown = tokenAddressesKnown.map(address => {
      const meta = tokenInMeta(this.tokenMeta)(address)!;
      return metaToTokenAssumedPrecision(meta);
    });
    const tokenAddressesMissing = differenceWith(
      allTokensRequired,
      tokenAddressesKnown,
      compareString
    );

    const [
      reserveAndPoolTokensAbi,
      v1ReserveBalances,
      v2PoolReserveBalances
    ] = ((await this.multi({
      groupsOfShapes: [
        tokenAddressesMissing.map(tokenShape),
        verifiedV1Pools.map(v1Pool =>
          reserveBalanceShape(v1Pool.converterAddress, v1Pool.reserves)
        ),
        verifiedV2Pools.map(pool =>
          v2PoolBalanceShape(
            pool.converterAddress,
            pool.reserves[0],
            pool.reserves[1],
            this.currentNetwork
          )
        )
      ],
      label: "to my eyes",
      traditional: smallLoad
    })) as [unknown, unknown, unknown]) as [
      RawAbiToken[],
      RawAbiReserveBalance[],
      RawAbiV2PoolBalances[]
    ];

    const stakedAndReserveWeights = v2PoolReserveBalances.map(
      rawAbiV2ToStacked
    );

    const reserveAndPoolTokens = reserveAndPoolTokensAbi.map(
      (token): Token => ({
        contract: token.contract,
        decimals: Number(token.decimals),
        network: "ETH",
        symbol: token.symbol
      })
    );

    const allTokens = [...reserveAndPoolTokens, ...tokensKnown];

    const polishedReserveAndPoolTokens = polishTokens(
      this.tokenMeta,
      allTokens
    );

    const matched = stakedAndReserveWeights.map(relay => ({
      ...relay,
      anchorAddress: findOrThrow(
        convertersAndAnchors,
        item => compareString(item.converterAddress, relay.converterAddress),
        "failed to match anchor address"
      ).anchorAddress,
      reserves: relay.reserves.map(reserve => ({
        ...reserve,
        token: polishedReserveAndPoolTokens.find(token =>
          compareString(token.contract, reserve.reserveAddress)
        )
      }))
    }));

    const confirmedTokenMatch = matched.filter(match =>
      match.reserves.every(reserve => reserve.token)
    ) as RawV2Pool[];

    const v2RelayFeeds = buildRelayFeedChainkLink({
      relays: confirmedTokenMatch,
      usdPriceOfBnt: this.bntUsdPrice
    });

    const v2Pools = verifiedV2Pools.map(
      (pool): ChainLinkRelay => {
        const rawPool = findOrThrow(
          confirmedTokenMatch,
          match => compareString(match.converterAddress, pool.converterAddress),
          `failed to find raw pool ${pool.converterAddress}`
        );

        return {
          anchor: {
            poolContainerAddress: rawPool.anchorAddress,
            poolTokens: rawPool.reserves.map(reserve => ({
              reserveId: reserve.reserveAddress,
              poolToken: findOrThrow(
                polishedReserveAndPoolTokens,
                token =>
                  compareString(token.contract, reserve.poolTokenAddress),
                `failed to find the pool token for ${reserve.poolTokenAddress}`
              )
            }))
          },
          contract: pool.converterAddress,
          id: rawPool.anchorAddress,
          converterType: PoolType.ChainLink,
          isMultiContract: false,
          network: "ETH",
          reserves: rawPool.reserves.map(reserve => ({
            ...reserve.token,
            reserveWeight:
              typeof reserve.reserveWeight !== "undefined"
                ? Number(reserve.reserveWeight) / oneMillion.toNumber()
                : undefined
          })),
          version: String(pool.version),
          fee: ppmToDec(pool.conversionFee)
        };
      }
    );

    const v1Pools = verifiedV1Pools.map(pool => {
      const smartTokenAddress = pool.anchorAddress;
      const converterAddress = convertersAndAnchors.find(item =>
        compareString(item.anchorAddress, smartTokenAddress)
      )!.converterAddress;
      const polishedHalf = overWroteVersions.find(pol =>
        compareString(pol.converterAddress, converterAddress)
      )!;
      const smartToken = smartTokens.find(token =>
        compareString(token.contract, smartTokenAddress)
      )!;
      const anchorProps = smartTokenAnchor({
        ...smartToken,
        network: "ETH",
        decimals: Number(smartToken.decimals)
      });
      const reserveBalances = v1ReserveBalances.find(reserve =>
        compareString(reserve.converterAddress, converterAddress)
      )!;
      if (!reserveBalances) return;

      const zippedReserveBalances = [
        {
          contract: polishedHalf.connectorToken1,
          amount: reserveBalances.reserveOne
        },
        {
          contract: polishedHalf.connectorToken2,
          amount: reserveBalances.reserveTwo
        }
      ];
      const reserveTokens = zippedReserveBalances.map(
        reserve =>
          polishedReserveAndPoolTokens.find(token =>
            compareString(token.contract, reserve.contract)
          )!
      );

      const relay: RelayWithReserveBalances = {
        id: smartTokenAddress,
        reserves: reserveTokens.map(x => ({
          ...x,
          reserveWeight: 0.5,
          decimals: Number(x.decimals)
        })),
        reserveBalances: zippedReserveBalances.map(zip => ({
          amount: zip.amount,
          id: zip.contract
        })),
        contract: converterAddress,
        fee: ppmToDec(polishedHalf.conversionFee),
        isMultiContract: false,
        network: "ETH",
        version: String(polishedHalf.version),
        anchor: anchorProps.anchor,
        converterType: anchorProps.converterType
      };

      return relay;
    });

    const completeV1Pools = (v1Pools.filter(
      Boolean
    ) as RelayWithReserveBalances[]).filter(x => x.reserves.every(Boolean));

    const bntTokenAddress = getNetworkVariables(this.currentNetwork).bntToken;

    const knownPrices = [
      { id: bntTokenAddress, usdPrice: String(this.bntUsdPrice) },
      ...trustedStables(this.currentNetwork)
    ];

    const traditionalRelayFeeds = buildPossibleReserveFeedsTraditional(
      completeV1Pools,
      knownPrices
    );

    const reserveFeeds = [...traditionalRelayFeeds, ...v2RelayFeeds];
    const pools = [...v2Pools, ...completeV1Pools];

    // debug
    const failed = differenceWith(convertersAndAnchors, pools, (a, b) =>
      compareString(a.converterAddress, b.contract)
    );
    if (failed.length > 0) {
      console.warn(failed, "FAILS");
    }

    // end debug
    return {
      reserveFeeds,
      pools
    };
  }

  @action async add(anchorAddresses: string[]) {
    const converters = await this.fetchConverterAddressesByAnchorAddresses(
      anchorAddresses
    );
    return zipAnchorAndConverters(anchorAddresses, converters);
  }

  previousPoolFeesArr: PreviousPoolFee[] = [];

  get previousPoolFees(): PreviousPoolFee[] {
    return [...this.previousPoolFeesArr, ...previousPoolFees];
  }

  get liquidityHistory(): {
    loading: boolean;
    data: ViewLiquidityEvent<ViewTradeEvent>[];
  } {
    if (!this.apiData)
      return {
        loading: true,
        data: []
      };

    const tokens = this.apiData!.tokens;
    const meta = this.tokenMeta;

    const validSwaps = this.apiData!.swaps.filter(swap => {
      const tradedTokens = [swap.source_token_dlt_id, swap.target_token_dlt_id];
      return tradedTokens.every(tokenAddress =>
        tokens.some(token => compareString(token.dlt_id, tokenAddress))
      );
    });

    const trades = validSwaps.map(
      (x): ViewLiquidityEvent<ViewTradeEvent> => {
        const fromToken = tokens.find(token =>
          compareString(x.source_token_dlt_id, token.dlt_id)
        )!;
        const toToken = tokens.find(token =>
          compareString(x.target_token_dlt_id, token.dlt_id)
        )!;
        const fromMetaToken = meta.find(meta =>
          compareString(meta.contract, x.source_token_dlt_id)
        );
        const toMetaToken = meta.find(meta =>
          compareString(meta.contract, x.target_token_dlt_id)
        );

        return {
          account: x.account_dlt_id,
          accountLink: generateEtherscanAccountLink(x.account_dlt_id),
          data: {
            from: {
              amount: x.input_amount,
              decimals: fromToken.decimals,
              id: x.source_token_dlt_id,
              logo: (fromMetaToken && fromMetaToken.image) || defaultImage,
              symbol: fromToken.symbol
            },
            to: {
              amount: x.output_amount,
              decimals: toToken.decimals,
              id: x.target_token_dlt_id,
              logo: (toMetaToken && toMetaToken.image) || defaultImage,
              symbol: toToken.symbol
            }
          },
          txHash: x.tx_hash,
          id: x.tx_hash,
          txLink: generateEtherscanTxLink(x.tx_hash),
          type: "swap",
          unixTime: x.timestamp / 1000,
          valueTransmitted: new BigNumber(x.input_amount)
            .times(fromToken.rate.usd || 0)
            .toNumber()
        };
      }
    );

    const groupedByHash = groupBy(trades, trade => trade.txHash.toLowerCase());
    const tradesUnderHash = toPairs(groupedByHash)
      .map(([hash, trades]) => ({ hash, trades }))
      .sort((a, b) => b.trades.length - a.trades.length);

    const x = tradesUnderHash
      .flatMap(x => {
        if (x.trades.length == 1) {
          return x.trades[0];
        }
        const tokensTraded = x.trades.reduce(
          (acc, item) => [...acc, item.data.from.id, item.data.to.id],
          [] as string[]
        );
        const firstTo = first(x.trades)!;
        const lastTo = last(x.trades)!;

        const terminatingTrades = [firstTo, lastTo];
        const terminatingTokens = terminatingTrades.map(x => x.data.to.id);

        const sameTerminatingTokens = terminatingTokens.every(
          (token, index, arr) => arr[0] === token
        );
        if (sameTerminatingTokens) return false;

        const uniqueTokens = uniqWith(tokensTraded, compareString);
        const zeroCounts = uniqueTokens.map(token => [token, 0]);
        const zeroCountObject = fromPairs(zeroCounts);

        const tokenCounts = toPairs(
          tokensTraded.reduce(
            (acc, item) => ({ ...acc, [item]: acc[item] + 1 }),
            zeroCountObject
          )
        ) as [string, number][];

        const lowestTwoCounts = tokenCounts
          .sort((a, b) => a[1] - b[1])
          .slice(0, 2);

        const toToken = terminatingTokens.find(token =>
          lowestTwoCounts.some(([t]) => compareString(token, t))
        );
        if (!toToken) {
          return false;
        }

        const lastTrade = terminatingTrades.find(x =>
          compareString(x.data.to.id, toToken)
        )!;
        const firstTrade = terminatingTrades.find(x => lastTrade.id !== x.id)!;
        if (!firstTrade || !lastTrade) return false;

        return {
          ...firstTrade,
          data: {
            ...firstTrade.data,
            to: lastTrade.data.to
          }
        };
      })
      .filter(Boolean) as ViewLiquidityEvent<ViewTradeEvent>[];

    return {
      loading: false,
      data: x
    };
  }

  get availableBalances(): ViewLockedBalance[] {
    const now = dayjs();
    const bntPrice = this.bntUsdPrice;
    const balances = this.lockedBalancesArr.filter(lockedBalance =>
      dayjs.unix(lockedBalance.expirationTime).isSameOrBefore(now)
    );
    if (balances.length == 0) return [];

    if (balances.length == 1) {
      const balance = balances[0];
      const decBnt = shrinkToken(balance.amountWei, 18);
      const usdValue = new BigNumber(decBnt).times(bntPrice).toNumber();
      return [
        {
          id: String(balance.expirationTime),
          amount: decBnt,
          lockedUntil: balance.expirationTime,
          usdValue
        }
      ];
    }
    return [
      balances
        .map(
          (balance): ViewLockedBalance => {
            const decBnt = shrinkToken(balance.amountWei, 18);
            const usdValue = new BigNumber(decBnt).times(bntPrice).toNumber();
            return {
              id: String(balance.expirationTime),
              amount: decBnt,
              lockedUntil: balance.expirationTime,
              usdValue
            };
          }
        )
        .reduce((acc, item) => ({
          ...item,
          amount: new BigNumber(acc.amount).plus(item.amount).toString()
        }))
    ];
  }

  get lockedBalances(): ViewLockedBalance[] {
    const now = dayjs();
    const bntPrice = this.bntUsdPrice;
    const balances = this.lockedBalancesArr.filter(lockedBalance =>
      dayjs.unix(lockedBalance.expirationTime).isAfter(now)
    );
    return balances.map(
      (balance): ViewLockedBalance => {
        const decBnt = shrinkToken(balance.amountWei, 18);
        const usdValue = new BigNumber(decBnt).times(bntPrice).toNumber();
        return {
          id: String(balance.expirationTime),
          amount: decBnt,
          lockedUntil: balance.expirationTime,
          usdValue: usdValue
        };
      }
    );
  }

  @action async fetchDynamicRelays(
    staticRelays: StaticRelay[]
  ): Promise<NewRelay[]> {
    const relaysShape = staticRelays.map(relay =>
      dynamicRelayShape(relay.converterAddress, reserveContractsInStatic(relay))
    );

    const [rawRelays] = ((await this.multi({
      groupsOfShapes: [relaysShape],
      label: "fetch dynamic relays"
    })) as unknown) as [RawABIDynamicRelay[]];

    const hydratedRelays = rawRelays.map(parseRawDynamic);

    const dynamicRelays = staticRelays.map(relay => {
      try {
        const hydrated = hydratedRelays.find(r =>
          compareString(relay.converterAddress, r.converterAddress)
        )!;
        const hydratedReserves = hydrated.reserves;

        const reserves = relay.reserves.map(reserve => {
          const { reserveBalance } = findOrThrow(
            hydratedReserves,
            ({ reserveAddress }) =>
              compareString(reserveAddress, reserve.contract)
          );
          return {
            ...reserve,
            reserveBalance
          };
        });
        const fee = ppmToDec(hydrated.conversionFee);
        return {
          ...relay,
          reserves,
          fee
        };
      } catch (e) {
        throw new Error(`Failed hydrating static relays ${e}`);
      }
    });
    return dynamicRelays;
  }

  bntSupply: string = "";

  @mutation setBntSupply(weiAmount: string) {
    this.bntSupply = weiAmount;
  }

  @action async fetchTokens(tokenContracts: string[]): Promise<RawAbiToken[]> {
    const tokenShapes = tokenContracts.map(tokenShape);
    const [res] = await this.multi({
      groupsOfShapes: [tokenShapes],
      label: "fetching tokens"
    });
    return res as RawAbiToken[];
  }

  @action async halfRelayToFullStatic(
    relays: HalfStaticRelay[]
  ): Promise<StaticRelay[]> {
    const cachedTokens = uniqWith(
      moreStaticRelays.flatMap(relay => relay.reserves),
      (a, b) => compareString(a.contract, b.contract)
    );

    const tokenContractsRequired = uniqWith(
      relays.flatMap(relay => relay.reserves),
      compareString
    );

    const [alreadyCovered, notCovered] = partition(
      tokenContractsRequired,
      contract =>
        cachedTokens.some(token => compareString(token.contract, contract))
    );

    const fetchedTokens = await this.fetchTokens(notCovered);
    const alreadyCoveredTokens = alreadyCovered.map(
      contract =>
        cachedTokens.find(token => compareString(contract, token.contract))!
    );

    const tokensRequired = [...fetchedTokens, ...alreadyCoveredTokens];

    return relays.map(
      (relay): StaticRelay => ({
        ...relay,
        reserves: relay.reserves.map(
          reserve =>
            tokensRequired.find(token =>
              compareString(reserve, token.contract)
            )!
        )
      })
    );
  }

  apiData: WelcomeData | undefined = undefined;
  newPools: NewPool[] = [];

  @mutation setApiData(data: WelcomeData) {
    this.apiData = data;
  }

  @mutation setPools(pools: NewPool[]) {
    this.newPools = pools;
  }

  @action async init() {
    if (this.initiated) {
      return this.refresh();
    }

    BigNumber.config({ EXPONENTIAL_AT: 256 });

    limitOrderTrigger$.next(true);
    web3.eth
      .getChainId()
      .then(chainId => networkVersionReceiver$.next(chainId));

    web3.eth
      .getBlockNumber()
      .then(number => currentBlockReceiver$.next(number));

    currentBlock$
      .pipe(firstItem())
      .subscribe(({ blockNumber }) => currentBlockTwo$.next(blockNumber));

    const anchors$ = bancorConverterRegistry$.pipe(
      filter(() => false),
      switchMap(converterRegistryAddress =>
        this.fetchAnchorAddresses({
          converterRegistryAddress
        })
      ),
      shareReplay(1)
    );

    const anchorAndConverters$ = combineLatest([
      anchors$,
      bancorConverterRegistry$
    ]).pipe(
      mergeMap(([anchorAddresses, converterRegistryAddress]) =>
        (async () => {
          const converters = await getConvertersByAnchors({
            anchorAddresses,
            converterRegistryAddress,
            web3
          });
          const anchorsAndConverters = zipAnchorAndConverters(
            anchorAddresses,
            converters
          );
          return anchorsAndConverters;
        })()
      ),
      distinctArrayItem(knownPools, compareAnchorAndConverter),
      shareReplay<ConverterAndAnchor[]>(3000)
    );

    if (this.currentUser) {
      authenticatedReceiver$.next(this.currentUser);
    }

    const individualAnchorsAndConverters$ = anchorAndConverters$.pipe(
      mergeMap(x => from(x))
    ) as Observable<ConverterAndAnchor>;

    const [v2Pools$, v1Pools$] = partitionOb(
      individualAnchorsAndConverters$,
      anchorSet =>
        v2Pools.some(anchor => compareString(anchor, anchorSet.anchorAddress))
    );
    v2Pools$.pipe(bufferTime(100)).subscribe(pools => {
      if (pools.length > 0) {
        this.addPoolsBulk(pools);
      }
    });

    const [toLocalLoad$, toRemoteLoad$] = partitionOb(
      v1Pools$,
      anchorAndConverter =>
        moreStaticRelays.some(staticRelay =>
          compareStaticRelayAndSet(staticRelay, anchorAndConverter)
        )
    );

    const staticRelayLocal$ = toLocalLoad$.pipe(
      map(anchorAndConverter =>
        findOrThrow(
          moreStaticRelays,
          staticRelay =>
            compareStaticRelayAndSet(staticRelay, anchorAndConverter),
          "failed to find static relay"
        )
      )
    );

    const staticRelaysRemote$ = toRemoteLoad$.pipe(
      bufferTime(100),
      map(pairs => [
        pairs.map(pair => pair.converterAddress).map(staticRelayShape),
        pairs.map(pair => pair.anchorAddress).map(poolTokenShape)
      ]),
      concatMap(groupsOfShapes => this.multi({ groupsOfShapes })),
      map(
        ([staticRelays, poolTokens]) =>
          zip(staticRelays, poolTokens) as [
            AbiStaticRelay,
            AbiCentralPoolToken
          ][]
      ),
      mergeMap(zipped => from(zipped)),
      map(([relay, poolToken]) => ({ relay, poolToken })),
      map(set => ({
        ...set,
        relay: {
          ...set.relay,
          version:
            knownVersions.find(version =>
              compareString(
                version.converterAddress,
                set.relay.converterAddress
              )
            )?.version || Number(set.relay.version)
        }
      })),
      filter(({ relay }) => !!relay.connectorToken2),
      map(
        ({ relay, poolToken }): HalfStaticRelay => ({
          ...relay,
          poolToken,
          reserves: [relay.connectorToken1, relay.connectorToken2] as [
            string,
            string
          ],
          version: Number(relay.version),
          converterType: determineConverterType(relay.converterType)
        })
      ),
      bufferTime<HalfStaticRelay>(50),
      mergeMap(relays => this.halfRelayToFullStatic(relays)),
      mergeMap(relays => from(relays))
    ) as Observable<StaticRelay>;

    try {
      const staticRelays$ = merge(staticRelayLocal$, staticRelaysRemote$).pipe(
        filter(
          relay =>
            true ||
            !v2Pools.some(r => compareString(relay.poolToken.contract, r))
        )
      );

      const dynamicRelayRemote$ = staticRelays$.pipe(
        bufferTime(100),
        filter(staticRelays => staticRelays && staticRelays.length > 0),
        mergeMap(x => this.fetchDynamicRelays(x).catch(e => false)),
        // @ts-ignore
        filter(x => Boolean(x)),
        share<NewRelay[]>()
      );

      const fullRelays$ = dynamicRelayRemote$.pipe(
        map(relays =>
          filterAndWarn(relays, x =>
            x.reserves.every(reserve => reserve.symbol)
          )
        ),
        map(relays => relays.map(newRelayToRelayWithBalances))
      );

      const emittedRelays$ = combineLatest([
        fullRelays$,
        usdPriceOfBnt$,
        supportedNetworkVersion$
      ]).pipe(
        map(([relay, usdPriceOfBnt, currentNetwork]) => {
          const bntTokenAddress = getNetworkVariables(currentNetwork).bntToken;

          const knownPrices = [
            ...trustedStables(this.currentNetwork),
            { id: bntTokenAddress, usdPrice: String(usdPriceOfBnt) }
          ];
          const reserveFeeds = buildPossibleReserveFeedsTraditional(
            relay,
            knownPrices
          );
          return {
            relay,
            reserveFeeds
          };
        })
      );

      const finalRelays$ = emittedRelays$.pipe(
        bufferTime(50),
        filter(x => x && x.length > 0),
        map(x => {
          const allReserveFeeds = x.flatMap(x => x.reserveFeeds);
          const relays = x.flatMap(x => x.relay);
          return { allReserveFeeds, relays };
        }),
        tap(x => {
          this.addThePools({
            pools: x.relays,
            reserveFeeds: x.allReserveFeeds
          });
        }),
        share()
      );

      await newPools$.pipe(firstItem()).toPromise();
    } catch (e) {
      console.error("thrown in x", e);
    }
  }

  poolLiqMiningAprs: PoolLiqMiningApr[] = [];

  @mutation updateLiqMiningApr(liqMiningApr: PoolLiqMiningApr[]) {
    if (liqMiningApr.length == 0) return;
    const existing = this.poolLiqMiningAprs;
    const withoutOld = existing.filter(
      apr => !liqMiningApr.some(a => compareString(a.poolId, apr.poolId))
    );
    this.poolLiqMiningAprs = [...withoutOld, ...liqMiningApr];
  }

  @action async checkFees(pools: Relay[]) {
    const convertersAndAnchors: ConverterAndAnchor[] = pools.map(relay => ({
      anchorAddress: relay.id,
      converterAddress: relay.contract
    }));
    convertersAndAnchors.forEach(converterAndAnchor =>
      convertersAndAnchors$.next(converterAndAnchor)
    );
  }

  @action async addThePools({
    pools,
    reserveFeeds
  }: {
    pools: RelayWithReserveBalances[];
    reserveFeeds: ReserveFeed[];
  }) {
    this.updateRelays(pools);
    this.updateRelayFeeds(
      await this.addPossiblePropsFromBancorApi(reserveFeeds)
    );

    const allTokens = pools.flatMap(tokensInRelay);
    const contracts = allTokens.map(token => token.contract);

    void this.checkFees(pools);
    return contracts;
  }

  @action async addPoolsBulk(convertersAndAnchors: ConverterAndAnchor[]) {
    if (!convertersAndAnchors || convertersAndAnchors.length == 0) return;

    const { pools, reserveFeeds } = await this.addPoolsV2(convertersAndAnchors);

    const allPools = [...pools];
    const allReserveFeeds = [...reserveFeeds];

    const poolsFailed = differenceWith(convertersAndAnchors, allPools, (a, b) =>
      compareString(a.anchorAddress, b.id)
    );
    this.updateFailedPools(
      poolsFailed.map(failedPool => failedPool.anchorAddress)
    );

    this.updateRelays(allPools);
    this.updateRelayFeeds(
      await this.addPossiblePropsFromBancorApi(allReserveFeeds)
    );

    const tokenAddresses = pools
      .flatMap(tokensInRelay)
      .map(token => token.contract);

    void this.checkFees(allPools);

    return tokenAddresses;
  }

  @action async fetchAndSetTokenBalances(tokenContractAddresses: string[]) {
    if (!this.currentUser) return;

    const govToken = await govTokenAddress$.pipe(take(1)).toPromise();

    const governanceToken = web3.utils.isAddress(govToken) && govToken;

    if (governanceToken) {
      tokenContractAddresses.push(govToken);
    }

    const uniqueAddresses = uniqWith(
      tokenContractAddresses,
      compareString
    ).filter(web3.utils.isAddress);

    const ethAddresses = [
      ethReserveAddress,
      "0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315"
    ];
    const includesEth = uniqueAddresses.some(address =>
      ethAddresses.some(a => compareString(address, a))
    );
    const withoutEth = uniqueAddresses.filter(
      address => !ethAddresses.some(a => compareString(address, a))
    );

    const [balances, ethBalance] = (await Promise.all([
      this.fetchTokenBalances([...withoutEth, wethTokenContractAddress]),
      (async () => {
        if (!includesEth) return;
        const weiBalance = await web3.eth.getBalance(this.currentUser);
        return fromWei(weiBalance);
      })()
    ])) as [Balance[], string | undefined];

    if (ethBalance) {
      this.updateUserBalances([
        ...balances,
        { id: ethReserveAddress, balance: ethBalance }
      ]);
    } else {
      this.updateUserBalances(balances);
    }
  }

  @action async fetchConverterAddressesByAnchorAddresses(
    anchorAddresses: string[]
  ) {
    return getConvertersByAnchors({
      anchorAddresses,
      converterRegistryAddress: this.contracts.BancorConverterRegistry,
      web3: w3
    });
  }

  @action async fetchAnchorAddresses({
    converterRegistryAddress
  }: {
    converterRegistryAddress: string;
  }): Promise<string[]> {
    try {
      const anchors = await getAnchors(converterRegistryAddress, w3);
      return anchors;
    } catch (e) {
      throw new Error(`Failed to fetch Anchors ${e}`);
    }
  }

  @mutation updateRelays(relays: Relay[]) {
    const allReserves = this.relaysList
      .concat(relays)
      .flatMap(relay => relay.reserves);
    const uniqueTokens = uniqWith(allReserves, (a, b) =>
      compareString(a.contract, b.contract)
    );

    const decimalUniformityBetweenTokens = uniqueTokens.every(token => {
      const allReservesTokenFoundIn = allReserves.filter(reserve =>
        compareString(token.contract, reserve.contract)
      );
      return allReservesTokenFoundIn.every(
        (reserve, _, arr) => reserve.decimals == arr[0].decimals
      );
    });
    if (!decimalUniformityBetweenTokens) {
      console.error(
        `There is a mismatch of decimals between relays of the same token, will not store ${relays.length} new relays`
      );
      return;
    }

    const meshedRelays = uniqWith(
      [...relays, ...this.relaysList],
      compareRelayById
    ).map(relay => ({
      ...relay,
      reserves: sortByNetworkTokens(
        updateArray(
          relay.reserves,
          reserve => !reserve.meta,
          reserve => {
            const meta = this.tokenMeta.find(meta =>
              compareString(reserve.contract, meta.contract)
            );
            return {
              ...reserve,
              meta: {
                logo: (meta && meta.image) || defaultImage,
                ...(meta && meta!.name && { name: meta.name })
              }
            };
          }
        ),
        reserve => reserve.symbol
      )
    }));

    this.relaysList = Object.freeze(meshedRelays);
  }

  @mutation wipeTokenBalances() {
    this.tokenBalances = [];
  }

  @action async onAuthChange(userAddress: string) {
    this.wipeTokenBalances();
    const govToken = await govTokenAddress$.pipe(take(1)).toPromise();
    if (userAddress) {
      Sentry.setUser({ id: userAddress.toLowerCase() });
      const govAddress = web3.utils.isAddress(govToken);
      if (govAddress) {
        this.fetchAndSetTokenBalances([govToken]);
      }
      authenticatedReceiver$.next(userAddress);
      if (this.apiData && this.apiData.tokens) {
        const uniqueTokenAddresses = uniqWith(
          [
            ...this.apiData.tokens.map(token => token.dlt_id),
            ...this.apiData.pools.map(pool => pool.pool_dlt_id)
          ],
          compareString
        );
        this.fetchAndSetTokenBalances(uniqueTokenAddresses);
      }
    } else {
      Sentry.configureScope(scope => scope.setUser(null));
    }
  }

  @action async focusSymbol(id: string) {
    if (this.currentUser) {
      this.fetchTokenBalances([id]);
    }
  }

  @action async refreshBalances(symbols?: BaseToken[]) {
    if (symbols) {
      symbols.forEach(symbol => this.focusSymbol(symbol.symbol));
    } else if (this.currentUser && this.apiData) {
      const tokenAddresses = [
        ...this.apiData.tokens.map(token => token.dlt_id),
        ...this.apiData.pools.map(pool => pool.pool_dlt_id)
      ];
      this.fetchAndSetTokenBalances(tokenAddresses);
    }
  }

  @action async tokenById(id: string) {
    return findOrThrow(
      this.tokens,
      token => compareString(token.id, id),
      `tokenById failed to find token with ID ${id} `
    );
  }

  @action async tokensById(ids: string[]) {
    return Promise.all(ids.map(id => this.tokenById(id)));
  }

  @action async findPath({
    fromId,
    toId,
    relays
  }: {
    fromId: string;
    toId: string;
    relays: readonly MinimalRelay[];
  }): Promise<MinimalRelay[]> {
    const lowerCased = relays.map(relay => ({
      ...relay,
      reserves: relay.reserves.map(reserve => ({
        ...reserve,
        contract: reserve.contract.toLowerCase()
      }))
    }));
    const path = await findNewPath(
      fromId.toLowerCase(),
      toId.toLowerCase(),
      lowerCased,
      relay => [relay.reserves[0].contract, relay.reserves[1].contract]
    );

    const flattened = path.hops.flatMap(hop => hop[0]);
    return flattened.map(flat =>
      findOrThrow(
        relays,
        relay => compareString(relay.contract, flat.contract),
        "failed to find relays used in pathing"
      )
    );
  }

  @action async promptUserForApprovalType(
    onPrompt: OnPrompt
  ): Promise<{ unlimitedApproval: boolean }> {
    const promptId = String(Date.now());

    enum ApproveTypes {
      limited = "limited",
      unlimited = "unlimited"
    }
    const questions = [
      ApproveTypes.unlimited,
      ApproveTypes.limited
    ].map(label => ({ id: [promptId, label].join(":"), label }));

    onPrompt({ questions });

    const receivedPromptId = await selectedPromptReceiver$
      .pipe(
        filter(id => {
          const [pId] = id.split(":");
          return pId == promptId;
        }),
        take(1)
      )
      .toPromise();

    const selectedQuestion = findOrThrow(
      questions,
      question => question.id == receivedPromptId,
      "failed finding selected question"
    );

    const unlimitedApproval = selectedQuestion.label == ApproveTypes.unlimited;
    return { unlimitedApproval };
  }

  @action async convert({
    from,
    to,
    onUpdate,
    onPrompt
  }: ProposedConvertTransaction): Promise<TxResponse> {
    if (compareString(from.id, to.id))
      throw new Error("Cannot convert a token to itself.");
    const [fromToken, toToken] = await this.tokensById([from.id, to.id]);
    const fromIsEth = compareString(fromToken.symbol, "eth");

    const steps: Section[] = [
      {
        name: "Pathing",
        description: "Finding path..."
      },
      {
        name: "SetApprovalAmount",
        description: "Setting approval amount..."
      },
      {
        name: "ConvertProcessing",
        description: "Processing conversion..."
      },
      {
        name: "WaitingTxConf",
        description: "Awaiting block confirmation..."
      },
      {
        name: "Done",
        description: "Done!"
      }
    ];
    onUpdate!(0, steps);

    const fromTokenDecimals = await this.getDecimalsByTokenAddress(
      fromToken.id
    );
    const toTokenDecimals = await this.getDecimalsByTokenAddress(toToken.id);

    const minimalRelays = await this.winningMinimalRelays();

    const fromAmount = from.amount;
    const fromSymbol = fromToken.symbol;
    const fromTokenContract = fromToken.id;
    const toTokenContract = toToken.id;

    const fromWei = expandToken(fromAmount, fromTokenDecimals);
    const relays = await this.findBestPath({
      relays: minimalRelays,
      fromId: from.id,
      toId: to.id
    });

    const conversion = {
      conversion_type: "Market",
      conversion_approve: "Unlimited",
      conversion_blockchain: "ethereum",
      conversion_blockchain_network:
        vxm.ethBancor.currentNetwork === EthNetworks.Ropsten
          ? "Ropsten"
          : "MainNet",
      conversion_settings:
        vxm.bancor.slippageTolerance === 0.005 ? "Regular" : "Advanced",
      conversion_token_pair: fromSymbol + "/" + toToken.symbol,
      conversion_from_token: fromSymbol,
      conversion_to_token: toToken.symbol,
      conversion_from_amount: fromAmount,
      conversion_to_amount: to.amount
    };

    const ethPath = generateEthPath(fromSymbol, relays);

    onUpdate!(1, steps);
    await this.triggerApprovalIfRequired({
      owner: this.currentUser,
      amount: fromWei,
      spender: this.contracts.BancorNetwork,
      tokenAddress: fromTokenContract,
      onPrompt
    });
    onUpdate!(2, steps);

    const networkContract = buildNetworkContract(this.contracts.BancorNetwork);

    const expectedReturn = to.amount;
    const expectedReturnWei = expandToken(expectedReturn, toTokenDecimals);

    sendConversionEvent(ConversionEvents.wallet_req, conversion);

    const confirmedHash = await this.resolveTxOnConfirmation({
      tx: networkContract.methods.convertByPath(
        ethPath.path,
        fromWei,
        await this.weiMinusSlippageTolerance(expectedReturnWei),
        zeroAddress,
        zeroAddress,
        0
      ),
      onConfirmation: () => {
        sendConversionEvent(ConversionEvents.success, {
          ...conversion,
          conversion_market_eth_usd_rate: this.stats.nativeTokenPrice.price,
          conversion_market_token_rate: fromToken.price?.toFixed(10),
          transaction_category: "Conversion",
          transaction_id: confirmedHash,
          transaction_revenue: ""
        });
        return this.spamBalances([fromTokenContract, toTokenContract]);
      },
      resolveImmediately: true,
      ...(fromIsEth && { value: fromWei }),
      onHash: () => {
        sendConversionEvent(ConversionEvents.wallet_confirm, conversion);
        return onUpdate!(3, steps);
      }
    });
    onUpdate!(4, steps);

    return this.createTxResponse(confirmedHash);
  }

  @action async isApprovalRequired({
    owner,
    spender,
    amount,
    tokenAddress
  }: TokenWithdrawParam): Promise<{
    approvalIsRequired: boolean;
    currentApprovedBalance: string;
  }> {
    const currentApprovedBalance = await getApprovedBalanceWei({
      owner,
      spender,
      tokenAddress
    });

    const sufficientBalanceAlreadyApproved = new BigNumber(
      currentApprovedBalance
    ).isGreaterThanOrEqualTo(amount);

    return {
      approvalIsRequired: !sufficientBalanceAlreadyApproved,
      currentApprovedBalance
    };
  }

  @action async approveTokenWithdrawal({
    owner,
    spender,
    amount,
    tokenAddress,
    currentApprovedBalance
  }: TokenWithdrawParam) {
    const isNullApprovalTokenContract = nullApprovals.some(contract =>
      compareString(tokenAddress, contract)
    );

    const nullingTxRequired =
      isNullApprovalTokenContract &&
      fromWei(
        currentApprovedBalance ||
          (await getApprovedBalanceWei({
            owner,
            spender,
            tokenAddress
          }))
      ) !== "0";

    if (nullingTxRequired) {
      await this.approveTokenWithdrawals([
        { approvedAddress: spender, amount: toWei("0"), tokenAddress }
      ]);
    }

    try {
      await this.approveTokenWithdrawals([
        { approvedAddress: spender, amount, tokenAddress }
      ]);
    } catch (e) {
      const isTxDenial = (e.message as string).toLowerCase().includes("denied");
      if (!isTxDenial) {
        nullApprovals.push(tokenAddress);
        console.error(
          "Approval had failed, forcing a zero approval in case required",
          e.message
        );
      }
      throw new Error(e.message);
    }
  }

  @action async awaitConfirmation(onPrompt: OnPrompt) {
    const promptId = String(Date.now());

    enum ApproveTypes {
      confirm = "confirm"
    }
    const questions = [ApproveTypes.confirm].map(label => ({
      id: [promptId, label].join(":"),
      label
    }));

    onPrompt({ questions });

    const receivedPromptId = await selectedPromptReceiver$
      .pipe(
        filter(id => {
          const [pId] = id.split(":");
          return pId == promptId;
        }),
        take(1)
      )
      .toPromise();

    findOrThrow(
      questions,
      question => question.id == receivedPromptId,
      "failed finding selected question"
    );
  }

  @action async depositWeth({
    decAmount,
    onPrompt
  }: {
    decAmount: string;
    onPrompt: OnPrompt;
  }): Promise<TxResponse> {
    if (this.currentNetwork !== EthNetworks.Mainnet)
      throw new Error("Ropsten not supported");

    const tokenContract = buildWethContract(wethTokenContractAddress);

    const wei = expandToken(decAmount, 18);

    await this.awaitConfirmation(onPrompt);

    const tx = tokenContract.methods.deposit();
    const estimatedGas = await this.determineTxGas(tx);
    const manualBuffer = 2;

    const txHash = await this.resolveTxOnConfirmation({
      value: wei,
      tx,
      gas: estimatedGas * manualBuffer
    });

    return this.createTxResponse(txHash);
  }

  @action async withdrawWeth({ decAmount }: { decAmount: string }) {
    if (this.currentNetwork !== EthNetworks.Mainnet)
      throw new Error("Ropsten not supported");

    const tokenContract = buildWethContract(wethTokenContractAddress);
    const wei = expandToken(decAmount, 18);

    const txHash = await this.resolveTxOnConfirmation({
      tx: tokenContract.methods.withdraw(wei)
    });

    this.spamBalances([wethTokenContractAddress]);

    return this.createTxResponse(txHash);
  }

  @action async triggerApprovalIfRequired(tokenWithdrawal: {
    owner: string;
    spender: string;
    tokenAddress: string;
    amount: string;
    onPrompt?: OnPrompt;
  }) {
    const fromIsEth = compareString(
      tokenWithdrawal.tokenAddress,
      ethReserveAddress
    );
    if (fromIsEth) {
      if (tokenWithdrawal.onPrompt) {
        return this.awaitConfirmation(tokenWithdrawal.onPrompt);
      }
    }
    const {
      approvalIsRequired,
      currentApprovedBalance
    } = await this.isApprovalRequired(tokenWithdrawal);

    if (!approvalIsRequired) {
      if (tokenWithdrawal.onPrompt) {
        return this.awaitConfirmation(tokenWithdrawal.onPrompt);
      }
      return;
    }

    const withCurrentApprovedBalance = {
      ...tokenWithdrawal,
      currentApprovedBalance
    };
    if (tokenWithdrawal.onPrompt) {
      const { unlimitedApproval } = await this.promptUserForApprovalType(
        tokenWithdrawal.onPrompt
      );
      await this.approveTokenWithdrawal({
        ...withCurrentApprovedBalance,
        ...(unlimitedApproval && { amount: unlimitedWei })
      });
      await this.awaitConfirmation(tokenWithdrawal.onPrompt);
    } else {
      return this.approveTokenWithdrawal(withCurrentApprovedBalance);
    }
  }

  @action async getReturnByPath({
    path,
    amount
  }: {
    path: string[];
    amount: string;
  }): Promise<string> {
    try {
      return await getReturnByPath({
        networkContract: this.contracts.BancorNetwork,
        path,
        amount,
        web3: w3
      });
    } catch (e) {
      throw new Error(
        `Threw getting return by path ${JSON.stringify(e)} ${path}`
      );
    }
  }

  @action async winningMinimalRelays(): Promise<MinimalRelay[]> {
    const relaysWithBalances = this.apiData!.pools.filter(pool =>
      pool.reserves.every(reserve => reserve.balance !== "0")
    );
    const relaysByLiqDepth = this.relays
      .sort(sortByLiqDepth)
      .filter(relay =>
        relaysWithBalances.some(r => compareString(relay.id, r.pool_dlt_id))
      );
    const winningRelays = uniqWith(relaysByLiqDepth, compareRelayByReserves);

    const relaysWithConverterAddress = winningRelays.map(relay => {
      const apiRelay = findOrThrow(this.apiData!.pools, pool =>
        compareString(pool.pool_dlt_id, relay.id)
      );
      return {
        ...relay,
        converterAddress: apiRelay.converter_dlt_id
      };
    });

    const minimalRelays = relaysWithConverterAddress.map(
      viewRelayConverterToMinimal
    );
    return minimalRelays;
  }

  @action async getDecimalsByTokenAddress(
    tokenAddress: string
  ): Promise<number> {
    if (compareString(tokenAddress, ethReserveAddress)) return 18;
    const token = findOrThrow(
      this.apiData!.tokens,
      token => compareString(token.dlt_id, tokenAddress),
      "failed to find token for decimals"
    );
    return token.decimals;
  }

  @action async calculateSingleWithdraw({
    id,
    decPercent
  }: {
    id: string;
    decPercent: number;
  }): Promise<{
    outputs: ViewAmountDetail[];
    expectedValue: ViewAmountDetail;
  }> {
    const [, posId] = id.split(":");
    const ppm = new BigNumber(decPercent).times(oneMillion).toString();
    const res = await getRemoveLiquidityReturn(
      this.contracts.LiquidityProtection,
      posId,
      ppm,
      dayjs().unix(),
      w3
    );

    const position = findOrThrow(
      this.protectedViewPositions,
      pos => compareString(pos.id.split(":")[1], posId),
      "failed finding protected position"
    );

    const reserveTokenAddress = position.inititalProtectedToken;

    const reserveTokenObj = findOrThrow(this.apiData!.tokens, token =>
      compareString(reserveTokenAddress, token.dlt_id)
    );

    return {
      outputs: [
        {
          amount: shrinkToken(res.baseAmount, reserveTokenObj.decimals),
          id: reserveTokenAddress,
          symbol: reserveTokenObj.symbol
        },
        {
          amount: shrinkToken(res.networkAmount, 18),
          id: this.liquidityProtectionSettings.networkToken,
          symbol: "BNT"
        }
      ].filter(output => new BigNumber(output.amount).isGreaterThan(0)),
      expectedValue: {
        amount: shrinkToken(res.targetAmount, reserveTokenObj.decimals),
        id: reserveTokenAddress,
        symbol: reserveTokenObj.symbol
      }
    };
  }

  @action async findBestPath({
    fromId,
    toId,
    relays
  }: {
    fromId: string;
    toId: string;
    relays: readonly MinimalRelay[];
  }): Promise<MinimalRelay[]> {
    const possibleStartingRelays = relays.filter(relay =>
      relay.reserves.some(reserve => compareString(reserve.contract, fromId))
    );
    const moreThanOneReserveOut = possibleStartingRelays.length > 1;
    const onlyOneHopNeeded = relays.some(relay =>
      [fromId, toId].every(id =>
        relay.reserves.some(reserve => compareString(reserve.contract, id))
      )
    );
    const fromIsBnt = compareString(
      fromId,
      this.liquidityProtectionSettings.networkToken
    );
    const checkMultiplePaths =
      moreThanOneReserveOut && !onlyOneHopNeeded && !fromIsBnt;

    const allViewRelays = this.relays;

    if (checkMultiplePaths) {
      const fromSymbol = findOrThrow(
        this.apiData!.tokens,
        token => compareString(token.dlt_id, fromId),
        "failed finding token...."
      ).symbol;
      const excludedRelays = relays.filter(
        relay =>
          !possibleStartingRelays.some(r =>
            compareString(r.anchorAddress, relay.anchorAddress)
          )
      );

      const results = await mapIgnoreThrown(
        possibleStartingRelays,
        async startingRelay => {
          const isolatedRelays = [startingRelay, ...excludedRelays];
          const relayPath = await Promise.race([
            this.findPath({
              fromId,
              relays: isolatedRelays,
              toId
            }),
            throwAfter(1000)
          ]);

          const path = generateEthPath(fromSymbol, relayPath);
          const viewRelay = findOrThrow(allViewRelays, relay =>
            compareString(relay.id, startingRelay.anchorAddress)
          );

          return {
            startingRelayAnchor: startingRelay.anchorAddress,
            liqDepth: viewRelay.liqDepth,
            path,
            relays: relayPath
          };
        }
      );

      const passedResults = results.filter(res => res.liqDepth);

      if (passedResults.length == 0)
        throw new Error(`Failed finding a path between tokens`);

      const sortedReturns = passedResults.sort((a, b) =>
        new BigNumber(b.liqDepth).minus(a.liqDepth).toNumber()
      );
      const bestReturn = sortedReturns[0];
      return bestReturn.relays;
    } else {
      return this.findPath({ fromId, toId, relays });
    }
  }

  daoTokenAddresses: string[] = [];

  @mutation setDaoTokens(tokenAddresses: string[]) {
    this.daoTokenAddresses = tokenAddresses;
  }

  @action async tokenPrecisionsById(ids: string[]): Promise<TokenPrecision[]> {
    const tokens = this.tokens;
    return ids.map(
      (id): TokenPrecision => {
        if (compareString(id, wethTokenContractAddress)) {
          return {
            contract: wethTokenContractAddress,
            precision: 18
          };
        } else if (compareString(id, ethReserveAddress)) {
          return {
            contract: wethTokenContractAddress,
            precision: 18
          };
        } else {
          const token = findOrThrow(tokens, token =>
            compareString(token.id, id)
          );
          return {
            contract: token.id,
            precision: token.precision
          };
        }
      }
    );
  }

  @action async cancelOrders({
    orderIds,
    onPrompt
  }: {
    orderIds: string[];
    onPrompt?: OnPrompt;
  }): Promise<TxResponse> {
    const limitOrders = orderIds.map(orderId =>
      findOrThrow(
        this.rawLimitOrdersArr,
        order => compareString(order.metaData.orderHash, orderId),
        `failed finding order with ID of ${orderId}`
      )
    );

    const stringOrders = limitOrders.map(limitOrder =>
      orderToStringOrder(limitOrder.order)
    );
    const exchangeProxyAddress = await exchangeProxy$.pipe(take(1)).toPromise();

    const contract = buildExchangeProxyContract(exchangeProxyAddress);

    const onlyOneOrder = stringOrders.length == 1;

    if (onPrompt) {
      await this.awaitConfirmation(onPrompt);
    }

    const res = await this.resolveTxOnConfirmation({
      tx: onlyOneOrder
        ? contract.methods.cancelRfqOrder(stringOrders[0])
        : contract.methods.batchCancelRfqOrders(stringOrders)
    });

    wait(100).then(() => limitOrderTrigger$.next(true));
    wait(1000).then(() => limitOrderTrigger$.next(true));
    wait(10000).then(() => limitOrderTrigger$.next(true));

    return this.createTxResponse(res);
  }

  @action async createOrder({
    from,
    to,
    expiryDuration,
    onPrompt
  }: ProposedCreateOrder): Promise<void> {
    const currentUser = this.currentUser as string;
    if (!currentUser) throw new Error("Cannot proceed without being logged in");

    const [fromToken, toToken] = await this.tokenPrecisionsById([
      from.id,
      to.id
    ]);

    const now = dayjs().unix();
    const expiry = new BigNumber(now + expiryDuration);

    const randomHex = web3.utils.randomHex(6);
    const randomNumber = web3.utils.hexToNumber(randomHex);
    const randomBigNumber = new BigNumber(randomNumber);

    const fromAmountWeiString = expandToken(from.amount, fromToken.precision);
    const fromAmountWei = new BigNumber(fromAmountWeiString);
    const toAmountWei = new BigNumber(
      expandToken(to.amount, toToken.precision)
    );

    const txOrigin = await getTxOrigin();

    const orderData = {
      fromAddress: fromToken.contract,
      toAddress: toToken.contract,
      fromAmountWei,
      toAmountWei,
      currentUser,
      expiry,
      salt: randomBigNumber,
      txOrigin,
      pool: "0x000000000000000000000000000000000000000000000000000000000000002d"
    };

    const order = createOrder(orderData);

    await this.triggerApprovalIfRequired({
      owner: currentUser,
      amount: fromAmountWeiString,
      spender: order.verifyingContract,
      tokenAddress: from.id,
      onPrompt
    });

    const signature = await order.getSignatureWithProviderAsync(
      // @ts-ignore
      web3.currentProvider,
      SignatureType.EIP712
    );

    const buildRfqJsonOrder = (
      order: RfqOrder,
      signature: Signature
    ): RfqOrderJson => ({
      maker: order.maker.toLowerCase(),
      taker: order.taker.toLowerCase(),
      chainId: order.chainId,
      expiry: order.expiry.toNumber(),
      makerAmount: order.makerAmount.toString().toLowerCase(),
      makerToken: order.makerToken.toLowerCase(),
      pool: order.pool.toLowerCase(),
      salt: order.salt.toString().toLowerCase(),
      signature,
      takerAmount: order.takerAmount.toString().toLowerCase(),
      takerToken: order.takerToken.toLowerCase(),
      txOrigin: order.txOrigin.toLowerCase(),
      verifyingContract: order.verifyingContract.toLowerCase()
    });

    const jsonOrder = buildRfqJsonOrder(order, signature);

    await sendOrders([jsonOrder]);
    wait(100).then(() => limitOrderTrigger$.next(true));
    wait(1000).then(() => limitOrderTrigger$.next(true));
    wait(10000).then(() => limitOrderTrigger$.next(true));
  }

  @action async getReturn({
    from,
    toId
  }: ProposedFromTransaction): Promise<ConvertReturn> {
    if (compareString(from.id, toId))
      throw new Error("Cannot convert a token to itself.");
    const [fromToken, toToken] = await this.tokensById([from.id, toId]);

    const [fromTokenContract, toTokenContract] = [fromToken.id, toToken.id];
    const amount = from.amount;

    const fromTokenDecimals = await this.getDecimalsByTokenAddress(
      fromTokenContract
    );
    const toTokenDecimals = await this.getDecimalsByTokenAddress(
      toTokenContract
    );

    const minimalRelays = await this.winningMinimalRelays();
    const fromWei = expandToken(amount, fromTokenDecimals);

    const relays = await this.findBestPath({
      fromId: from.id,
      toId,
      relays: minimalRelays
    });

    minimalPoolBalanceReceiver$.next(
      relays.map(
        (relay): MinimalPool => ({
          anchorAddress: relay.anchorAddress,
          converterAddress: relay.contract,
          reserves: relay.reserves.map(r => r.contract)
        })
      )
    );

    const wholePath = generateEthPath(fromToken.symbol, relays);
    const path = wholePath.path;
    console.log(
      wholePath.sortedRelays,
      "are the sorted relays with from and to sorted"
    );

    const sortedPools = wholePath.sortedRelays.map(relay => {
      const pool = findOrThrow(this.apiData!.pools, pool =>
        compareString(pool.pool_dlt_id, relay.anchorAddress)
      );

      const updatedReserves = sortAlongSide(
        pool.reserves,
        reserve => reserve.address,
        relay.reserves.map(r => r.contract)
      );
      return {
        ...pool,
        reserves: updatedReserves
      };
    }, "failed finding pools");

    console.log(
      sortedPools,
      "are the sorted relays",
      sortedPools.map(relay =>
        relay.reserves.map(x => x.address.slice(0, 6)).join(" / ")
      )
    );

    const noLiquidty = sortedPools.every(pool => pool.liquidity.usd === "0");
    if (noLiquidty) {
      throw new Error("insufficient_liquidity");
    }
    interface SpotPriceWithFee {
      rate: string;
      decFee: number;
    }

    const spotPrices = (sortedPools: Pool[]): SpotPriceWithFee[] =>
      sortedPools.map(pool => {
        const [fromReserve, toReserve] = pool.reserves;
        const rate = new BigNumber(toReserve.balance)
          .div(fromReserve.balance)
          .toString();

        const decFee = ppmToDec(pool.fee);
        return { rate, decFee };
      });

    const spotPriceReturn = (rates: SpotPriceWithFee[], amount: string) =>
      rates.reduce((acc, item) => {
        const spotReturn = new BigNumber(item.rate).times(acc);
        const feeCharged = spotReturn.times(
          new BigNumber(1).minus(item.decFee)
        );
        return feeCharged;
      }, new BigNumber(amount));

    const calculateSpotPriceReturn = (
      sortedPools: Pool[],
      amount: string
    ): BigNumber => {
      const prices = spotPrices(sortedPools);
      return spotPriceReturn(prices, amount);
    };

    try {
      const slippageWeiReturn = await this.getReturnByPath({
        path,
        amount: fromWei
      });

      const expectedReturnDec = shrinkToken(slippageWeiReturn, toTokenDecimals);

      console.log(expectedReturnDec, "is the user return amount");

      const slippageLessReturn = calculateSpotPriceReturn(sortedPools, amount);
      const slippageLessReturnRate = buildRate(
        new BigNumber(amount),
        slippageLessReturn
      );
      const userReturnRate = buildRate(
        new BigNumber(amount),
        new BigNumber(expectedReturnDec)
      );
      console.log(
        slippageLessReturnRate.toString(),
        "is the slippageless rate"
      );
      console.log(userReturnRate.toString(), "is the user return rate");

      let slippage: number | undefined;
      try {
        const slippageBigNumber = calculateSlippage(
          slippageLessReturnRate,
          userReturnRate
        );

        const slippageNumber = slippageBigNumber.toNumber();
        slippage = slippageNumber;
      } catch (e) {
        console.error("Failed calculating slippage", e.message);
      }

      return {
        amount: shrinkToken(slippageWeiReturn, toTokenDecimals),
        slippage
      };
    } catch (e) {
      console.error(e, "was caught in here...");
      if (
        e.message.includes(
          `Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from`
        )
      ) {
        const relayBalances = await Promise.all(
          relays.map(async relay => ({
            relay,
            balances: await this.fetchRelayBalances({
              poolId: relay.anchorAddress
            })
          }))
        );
        const relaysWithNoBalances = relayBalances.filter(
          relay =>
            !relay.balances.reserves.every(reserve => reserve.weiAmount !== "0")
        );
        if (relaysWithNoBalances.length > 0) {
          const moreThanOne = relayBalances.length > 1;
          throw new Error(
            moreThanOne
              ? "Pool does not have sufficient reserve balances"
              : "Pool does not have a sufficient reserve balance"
          );
        } else {
          throw new Error(e);
        }
      } else {
        throw new Error(e);
      }
    }
  }

  // @ts-ignore
  @action async getCost({ fromId, to }: ProposedToTransaction) {
    if (compareString(fromId, to.id)) {
      throw new Error("Cannot convert a token to itself.");
    }
    throw new Error("Fetching the cost of this token is not yet supported.");
  }
}
