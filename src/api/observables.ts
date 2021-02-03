import { differenceWith, isEqual } from "lodash";
import {
  Subject,
  combineLatest,
  Observable,
  merge,
  EMPTY,
  of,
  PartialObserver,
  timer
} from "rxjs";
import {
  distinctUntilChanged,
  map,
  filter,
  startWith,
  tap,
  switchMap,
  shareReplay,
  pluck,
  scan,
  share,
  withLatestFrom,
  catchError
} from "rxjs/operators";
import dayjs from "dayjs";
import { vxm } from "@/store";
import { EthNetworks } from "./web3";
import { getWelcomeData, NewPool, TokenMetaWithReserve } from "./eth/bancorApi";
import {
  getTokenMeta,
  ppmToDec,
  defaultImage
} from "@/store/modules/swap/ethBancor";
import { getNetworkVariables } from "./config";
import { RegisteredContracts } from "@/types/bancor";
import { compareString, findOrThrow } from "./helpers";
import { buildStakingRewardsContract } from "./eth/contractTypes";
import { filterAndWarn } from "./pureHelpers";
import {
  fetchContractAddresses,
  fetchLiquidityProtectionSettings,
  fetchLiquidityProtectionSettingsContract,
  fetchMinLiqForMinting,
  fetchPositionIds,
  fetchPositionsMulti,
  fetchWhiteListedV1Pools
} from "./eth/contractWrappers";
import { expandToken } from "./pureHelpers";

interface DataCache<T> {
  allEmissions: T[];
  newData: T[];
}

export const distinctArrayItem = <T>(
  initialValue: T[],
  comparator?: (a: T, b: T) => boolean
) => (source: Observable<T[]>) =>
  source.pipe(
    scan(
      (acc, item) => {
        const difference = differenceWith(
          item,
          acc.allEmissions,
          comparator || isEqual
        );
        return {
          allEmissions: [...acc.allEmissions, ...difference],
          newData: difference
        };
      },
      { allEmissions: initialValue, newData: [] } as DataCache<T>
    ),
    filter(dataCache => dataCache.newData.length > 0),
    pluck("newData"),
    startWith(initialValue)
  );

let difference = Date.now();

const logger = (label: string): PartialObserver<any> => ({
  next: data => {
    if (difference) {
      difference = Date.now() - difference;
    }
    console.log(
      `Logger (Next): (${difference}): ${label} returned ${JSON.stringify(
        data
      )}`
    );
    difference = Date.now();
  },
  error: error => {
    console.warn(`Logger (Error): ${label} has received an error in ${error}`);
  },
  complete: () => console.log(`Logger (Complete): ${label} has completed`)
});

export const authenticated$ = new Subject<string>();
export const networkVersionReceiver$ = new Subject<EthNetworks>();
export const fetchPositionsTrigger$ = new Subject<null>();
fetchPositionsTrigger$.next(null);

const onLogin$ = authenticated$.pipe(
  filter(x => Boolean(x)),
  share()
);
const onLogout$ = authenticated$.pipe(
  filter(x => !Boolean(x)),
  share()
);

const fifteenSeconds$ = timer(0, 15000);
let networkVersionCount: number = 0;

export const catchOptimisticNetwork = (label?: string) => (
  source: Observable<any>
) =>
  source.pipe(
    catchError(err => {
      console.log(`CaughtError: ${label} catch optimistic received`, err);
      return of(false);
      if (networkVersionCount >= 2) {
        console.log(
          "throwing because the network version count is",
          networkVersionCount
        );
        return EMPTY;
        throw new Error(err);
      } else {
        console.log(
          "deciding not to throw because network version count is",
          networkVersionCount
        );
        return EMPTY;
      }
    }),
    filter(x => false)
  );

export const networkVersion$ = networkVersionReceiver$.pipe(
  startWith(EthNetworks.Mainnet),
  distinctUntilChanged(),
  shareReplay(1)
);

export const apiData$ = combineLatest([networkVersion$, fifteenSeconds$]).pipe(
  switchMap(([networkVersion]) => getWelcomeData(networkVersion)),
  share()
);

export const tokenMeta$ = networkVersion$.pipe(
  switchMap(network => getTokenMeta(network)),
  catchError(() => EMPTY),
  share()
);

export const usdPriceOfBnt$ = apiData$.pipe(
  map(x => Number(x.bnt_price.usd)),
  distinctUntilChanged()
);

export const currentBlockReceiver$ = new Subject<number>();

export const currentBlock$ = currentBlockReceiver$.pipe(
  distinctUntilChanged(),
  map(block => ({ unixTime: dayjs().unix(), blockNumber: block })),
  shareReplay(1)
);

export const networkVars$ = networkVersion$.pipe(
  map(getNetworkVariables),
  shareReplay(1)
);

export const contractAddresses$ = networkVars$.pipe(
  switchMap(networkVariables => {
    console.log("network vars got..", networkVariables);
    return fetchContractAddresses(networkVariables.contractRegistry).catch(
      e => {
        return vxm.ethBancor
          .fetchContractAddresses(networkVariables.contractRegistry)
          .catch(e => console.log("bad error thrown...", e));
      }
    );
  }),
  filter(x => Boolean(x)),
  startWith({
    BancorNetwork: "0x2F9EC37d6CcFFf1caB21733BdaDEdE11c823cCB0",
    BancorConverterRegistry: "0xC0205e203F423Bcd8B2a4d6f8C8A154b0Aa60F19",
    LiquidityProtectionStore: "0xf5FAB5DBD2f3bf675dE4cB76517d4767013cfB55",
    LiquidityProtection: "0x64f21D00088b52638C5770F3bA99FcCe1697f176",
    StakingRewards: "0xB443DEA978B39178Cb05Ae005074227A4390DfCe"
  }),
  tap(logger("incoming contract addresses after")),
  tap(x => {
    if (vxm && vxm.ethBancor) {
      vxm.ethBancor.setContractAddresses(x);
    }
  }),
  distinctUntilChanged<RegisteredContracts>(isEqual),
  tap(logger("incoming contract addresses after ----")),
  shareReplay(1)
);

export const bancorConverterRegistry$ = contractAddresses$.pipe(
  pluck("BancorConverterRegistry"),
  distinctUntilChanged(compareString),
  share()
);

export const stakingRewards$ = contractAddresses$.pipe(
  pluck("StakingRewards"),
  distinctUntilChanged(compareString),
  shareReplay(1)
);

export const storeRewards$ = stakingRewards$.pipe(
  switchMap(async stakingRewardsContract => {
    const contract = buildStakingRewardsContract(stakingRewardsContract);
    return contract.methods
      .store()
      .call()
      .catch(e => "");
  }),
  filter(x => Boolean(x)),
  share()
);

export const poolPrograms$ = storeRewards$.pipe(
  switchMap(storeRewardContract =>
    vxm.rewards.fetchPoolPrograms(storeRewardContract).catch(() => [])
  ),
  filter(x => x && x.length > 0),
  share()
);

export const liquidityProtection$ = contractAddresses$.pipe(
  pluck("LiquidityProtection"),
  distinctUntilChanged(compareString),
  shareReplay(1)
);

export const liquidityProtectionStore$ = contractAddresses$.pipe(
  pluck("LiquidityProtectionStore"),
  distinctUntilChanged(compareString),
  shareReplay(1)
);

export const newPools$ = combineLatest([apiData$, tokenMeta$]).pipe(
  map(([apiData, tokenMeta]) => {
    {
      const pools = apiData.pools;
      const tokens = apiData.tokens;

      const betterPools = pools.map(pool => {
        const reserveTokens = pool.reserves
          .map(
            (reserve): TokenMetaWithReserve => {
              const meta = tokenMeta.find(meta =>
                compareString(meta.contract, reserve.address)
              );
              const token = findOrThrow(
                tokens,
                token => compareString(token.dlt_id, reserve.address),
                "was expecting a token for a known reserve in API data"
              );

              return {
                id: reserve.address,
                contract: reserve.address,
                reserveWeight: ppmToDec(reserve.weight),
                decBalance: reserve.balance,
                name: token.symbol,
                symbol: token.symbol,
                image: (meta && meta.image) || defaultImage,
                precision: token.decimals
              };
            }
          )
          .filter(pool => pool.contract);
        const decFee = ppmToDec(pool.fee);
        return {
          ...pool,
          decFee,
          reserveTokens
        };
      });

      const passedPools = filterAndWarn(
        betterPools,
        pool => pool.reserveTokens.length == 2,
        "lost pools"
      ) as NewPool[];

      return passedPools;
    }
  }),
  filter(pools => pools.length > 0)
);

newPools$.subscribe(pools => vxm.ethBancor.setPools(pools));

networkVersion$.subscribe(network => vxm.ethBancor.setNetwork(network));
networkVersion$.subscribe(network => {
  if (vxm && vxm.ethBancor) {
    vxm.ethBancor.setNetwork(network);
  }
});
apiData$.subscribe(data => vxm.ethBancor.setApiData(data));
apiData$
  .pipe(
    pluck("bnt_supply"),
    map(decSupply => expandToken(decSupply, 18))
  )
  .subscribe(weiSupply => vxm.ethBancor.setBntSupply(weiSupply));
tokenMeta$.subscribe(tokenMeta => vxm.ethBancor.setTokenMeta(tokenMeta));

combineLatest([
  liquidityProtectionStore$,
  onLogin$
]).subscribe(([storeAddress, currentUser]) =>
  vxm.ethBancor
    .fetchAndSetLockedBalances({ storeAddress, currentUser })
    .catch(e => console.warn("fetch and set locked balances threw..."))
);

const settingsContractAddress$ = liquidityProtection$.pipe(
  tap(logger("liquidity protection contract")),
  switchMap(protectionAddress =>
    fetchLiquidityProtectionSettingsContract(protectionAddress).catch(() => "")
  ),
  filter(x => Boolean(x)),
  startWith("0xd444ec18952c7cAf09636f21807683DaCC1d7dA9"),
  distinctUntilChanged(compareString),
  tap(logger("settings contract")),
  shareReplay<string>(1)
);

settingsContractAddress$
  .pipe(
    switchMap(settingsContractAddress =>
      fetchMinLiqForMinting(settingsContractAddress).catch(() => "")
    ),
    filter(x => Boolean(x))
  )
  .subscribe(settingsContract =>
    vxm.minting.setMinNetworkTokenLiquidityForMinting(settingsContract)
  );

combineLatest([liquidityProtection$, settingsContractAddress$])
  .pipe(
    tap(logger("before fetch liquidity protection settings")),
    switchMap(([protectionContractAddress, settingsContractAddress]) =>
      fetchLiquidityProtectionSettings({
        settingsContractAddress,
        protectionContractAddress
      }).catch(e =>
        vxm.ethBancor
          .fetchLiquidityProtectionSettings({
            protectionContractAddress,
            settingsContractAddress
          })
          .catch(e => {
            console.log("failed again", e);
            return "";
          })
      )
    ),
    filter(x => Boolean(x)),
    tap(logger("after liquidity protection"))
  )
  .subscribe(settings => {
    vxm.ethBancor.setLiquidityProtectionSettings(settings);
    vxm.ethBancor.fetchAndSetTokenBalances([settings.govToken]);
  });

settingsContractAddress$
  .pipe(
    tap(logger("white listed pool address")),
    switchMap(address => fetchWhiteListedV1Pools(address).catch(() => "")),
    filter(x => Boolean(x)),
    tap(logger("white listed pools"))
  )
  .subscribe(whitelistedPools =>
    vxm.ethBancor.setWhiteListedPools(whitelistedPools)
  );

const positionIds$ = combineLatest([
  authenticated$,
  liquidityProtectionStore$
]).pipe(
  tap(() => vxm.ethBancor.setLoadingPositions(true)),
  switchMap(([currentUser, storeAddress]) =>
    fetchPositionIds(currentUser, storeAddress).catch(() => "")
  ),
  filter(x => Boolean(x)),
  shareReplay(1)
);

const rawPositions$ = combineLatest([
  positionIds$,
  liquidityProtectionStore$
]).pipe(
  tap(logger("raw positions")),
  switchMap(([positionIds, storeAddress]) =>
    fetchPositionsMulti(positionIds, storeAddress).catch(() => "")
  ),
  filter(x => Boolean(x)),
  tap(logger("raw positions res")),
  shareReplay(1)
);

combineLatest([
  rawPositions$,
  liquidityProtectionStore$,
  liquidityProtection$,
  currentBlock$,
  apiData$
]).subscribe(
  ([
    rawPositions,
    liquidityProtectionStore,
    liquidityProtection,
    { blockNumber },
    apiData
  ]) => {
    const supportedAnchors = apiData.pools.map(pool => pool.pool_dlt_id);

    vxm.ethBancor
      .buildFullPositions({
        rawPositions,
        liquidityProtection,
        blockNumberNow: blockNumber,
        supportedAnchors,
        liquidityProtectionStore
      })
      .catch(e => console.log("failed on build full positions"));
  }
);

onLogin$.pipe(withLatestFrom(apiData$)).subscribe(([userAddress, apiData]) => {
  if (userAddress) {
    const reserveTokens = apiData.tokens.map(token => token.dlt_id);
    const poolTokens = apiData.pools.map(pool => pool.pool_dlt_id);
    const allTokens = [...poolTokens, ...reserveTokens];
    vxm.ethBancor.fetchAndSetTokenBalances(allTokens);
  }
});
