import { differenceWith, isEqual } from "lodash";
import {
  Subject,
  combineLatest,
  Observable,
  merge,
  EMPTY,
  of,
  PartialObserver
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
  catchError
} from "rxjs/operators";
import dayjs from "dayjs";
import { store, vxm } from "@/store";
import { getTokenMeta } from "@/store/modules/swap/ethBancor";
import { EthNetworks } from "./web3";
import { getWelcomeData } from "./eth/bancorApi";
import { getNetworkVariables } from "./config";
import { RegisteredContracts } from "@/types/bancor";
import { compareString } from "./helpers";
import { buildStakingRewardsContract } from "./eth/contractTypes";
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

export const networkVersion$ = networkVersionReceiver$.pipe(
  startWith(EthNetworks.Mainnet),
  distinctUntilChanged(),
  shareReplay(1)
);

export const apiData$ = networkVersion$.pipe(
  switchMap(networkVersion => getWelcomeData(networkVersion)),
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
    LiquidityProtection: "0x9Ab934010E6f2D633FeEB5b6f1DdCeEdeD601BCF",
    StakingRewards: "0xB443DEA978B39178Cb05Ae005074227A4390DfCe"
  }),
  tap(logger("incoming contract addresses after")),
  tap(x => {
    if (vxm && vxm.ethBancor) {
      vxm.ethBancor.setContractAddresses(x);
    }
  }),
  distinctUntilChanged<RegisteredContracts>(isEqual),
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
  tap(logger("liquidity protection store")),
  distinctUntilChanged(compareString),
  shareReplay(1)
);

export const liquidityProtectionStore$ = contractAddresses$.pipe(
  pluck("LiquidityProtectionStore"),
  distinctUntilChanged(compareString),
  shareReplay(1)
);

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
  authenticated$
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

combineLatest([authenticated$, apiData$]).subscribe(
  ([userAddress, apiData]) => {
    if (userAddress) {
      const reserveTokens = apiData.tokens.map(token => token.dlt_id);
      const poolTokens = apiData.pools.map(pool => pool.pool_dlt_id);
      const allTokens = [...poolTokens, ...reserveTokens];
      try {
        vxm.ethBancor.fetchAndSetTokenBalances(allTokens);
      } catch (e) {}
    }
  }
);