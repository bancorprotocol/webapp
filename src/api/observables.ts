import { differenceWith, isEqual, uniqWith } from "lodash";
import {
  Subject,
  combineLatest,
  Observable,
  EMPTY,
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
import { vxm } from "@/store";
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
  fetchWhiteListedV1Pools,
  pendingRewardRewards,
  removeLiquidityReturn
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

// Will emit stale data from cache
// Will overwrite cache with remote data

const optimisticObservable = <T, Y>(
  localKey: string,
  remoteCall: (param: Y) => Promise<T>
) => (source: Observable<Y>): Observable<T> => {
  const localData = localStorage.getItem(localKey);
  if (localData) {
    const parsedData = JSON.parse(localData) as T;

    return source.pipe(
      switchMapIgnoreThrow(remoteCall),
      filter(remoteData => !isEqual(remoteData, parsedData)),
      startWith(parsedData),
      tap(data => {
        const isSame = isEqual(parsedData, data);
        if (!isSame) {
          console.log("data is not the same! setting...", JSON.stringify(data));
          localStorage.setItem(localKey, JSON.stringify(data));
        } else {
          console.log("data is the same, setting");
        }
      })
    );
  } else {
    return source.pipe(
      switchMapIgnoreThrow(remoteCall),
      tap(data => {
        localStorage.setItem(localKey, JSON.stringify(data));
      })
    );
  }
};

export const optimisticContract = (key: string) => (
  source: Observable<string>
) => {
  const cachedData = localStorage.getItem(key);

  if (cachedData) {
    return source.pipe(
      startWith(cachedData),
      distinctUntilChanged(compareString),
      tap(data => {
        const isSame = cachedData === data;
        if (!isSame) {
          localStorage.setItem(key, data);
        }
      })
    );
  } else {
    return source.pipe(
      distinctUntilChanged(compareString),
      tap(data => localStorage.setItem(key, data))
    );
  }
};

const getCachedPositions = (): string[] | false => {
  const cachedPositionIdsString = localStorage.getItem("positionIds");
  return cachedPositionIdsString
    ? (JSON.parse(cachedPositionIdsString) as string[])
    : false;
};

const compareIdArray = (a: string[], b: string[]) => {
  const sameLength = a.length == b.length;
  const allFound = a.every(id => b.some(i => id == i));
  return sameLength && allFound;
};

export const optimisticPositionIds = () => (source: Observable<string[]>) => {
  const cachedPositionIds = getCachedPositions();
  if (cachedPositionIds) {
    return source.pipe(
      startWith(cachedPositionIds),
      tap(data => {
        const isSame = compareIdArray(data, cachedPositionIds);
        if (!isSame) {
          const hasContent = data.length > 0;
          if (hasContent) {
            localStorage.setItem("positionIds", JSON.stringify(data));
          } else {
            localStorage.removeItem("positionIds");
          }
        }
      })
    );
  } else {
    return source.pipe(
      tap(data => {
        const hasData = data.length > 0;
        if (hasData) {
          localStorage.setItem("positionIds", JSON.stringify(data));
        }
      })
    );
  }
};

export const switchMapIgnoreThrow = <T, Y>(
  switchMapProm: (data: T) => Promise<Y>
) => (source: Observable<T>): Observable<Y> =>
  source.pipe(
    switchMap(whatever =>
      switchMapProm(whatever).catch(() => ("DONT THROW" as unknown) as Y)
    ),
    filter(x => !(typeof x == "string" && x === "DONT THROW"))
  );

let difference = Date.now();

const logger = <T>(label: string, hideReturn = false) => (
  source: Observable<T>
) =>
  source.pipe(
    tap({
      next: data => {
        if (difference) {
          difference = Date.now() - difference;
        }
        console.log(
          `Logger (Next): (${difference} ms): ${label} returned ${
            hideReturn ? "" : JSON.stringify(data)
          }`
        );
        difference = Date.now();
      },
      error: error => {
        console.error(
          `Logger (Error): ${label} has received an error in ${error}`
        );
      },
      complete: () => console.log(`Logger (Complete): ${label} has completed`)
    })
  );

export const authenticated$ = new Subject<string>();
export const networkVersionReceiver$ = new Subject<EthNetworks>();
export const fetchPositionsTrigger$ = new Subject<null>();
fetchPositionsTrigger$.next(null);

authenticated$.pipe(logger("authenticated")).subscribe(x => {});

export const networkVersion$ = networkVersionReceiver$.pipe(
  startWith(EthNetworks.Mainnet),
  distinctUntilChanged(),
  logger("network version"),
  shareReplay(1)
);

export const apiData$ = networkVersion$.pipe(
  switchMap(networkVersion => getWelcomeData(networkVersion)),
  logger("api data", true),
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
  // logger("current block"),
  shareReplay(1)
);

export const networkVars$ = networkVersion$.pipe(
  map(getNetworkVariables),
  shareReplay(1)
);

export const contractAddresses$ = networkVars$.pipe(
  switchMapIgnoreThrow(networkVariables => {
    console.log("network vars got..", networkVariables);
    return fetchContractAddresses(networkVariables.contractRegistry).catch(() =>
      vxm.ethBancor.fetchContractAddresses(networkVariables.contractRegistry)
    );
  }),
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
  optimisticContract("BancorConverterRegistry"),
  share()
);

export const stakingRewards$ = contractAddresses$.pipe(
  pluck("StakingRewards"),
  optimisticContract("StakingRewards"),
  shareReplay(1)
);

export const storeRewards$ = stakingRewards$.pipe(
  switchMapIgnoreThrow(stakingRewardsContract => {
    const contract = buildStakingRewardsContract(stakingRewardsContract);
    return contract.methods.store().call();
  }),
  share()
);

export const poolPrograms$ = storeRewards$.pipe(
  switchMapIgnoreThrow(storeRewardContract =>
    vxm.rewards.fetchPoolPrograms(storeRewardContract)
  ),
  share()
);

export const liquidityProtection$ = contractAddresses$.pipe(
  pluck("LiquidityProtection"),
  optimisticContract("LiquidityProtection"),
  shareReplay(1)
);

export const liquidityProtectionStore$ = contractAddresses$.pipe(
  pluck("LiquidityProtectionStore"),
  optimisticContract("LiquidityProtectionStore"),
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
  switchMapIgnoreThrow(protectionAddress =>
    fetchLiquidityProtectionSettingsContract(protectionAddress)
  ),
  optimisticContract("LiquiditySettings"),
  logger("logger liquidity settings"),
  shareReplay<string>(1)
);

settingsContractAddress$
  .pipe(
    switchMapIgnoreThrow(settingsContractAddress =>
      fetchMinLiqForMinting(settingsContractAddress)
    )
  )
  .subscribe(settingsContract =>
    vxm.minting.setMinNetworkTokenLiquidityForMinting(settingsContract)
  );

combineLatest([liquidityProtection$, settingsContractAddress$])
  .pipe(
    switchMapIgnoreThrow(
      ([protectionContractAddress, settingsContractAddress]) =>
        fetchLiquidityProtectionSettings({
          settingsContractAddress,
          protectionContractAddress
        }).catch(e =>
          vxm.ethBancor.fetchLiquidityProtectionSettings({
            protectionContractAddress,
            settingsContractAddress
          })
        )
    )
  )
  .subscribe(settings => {
    vxm.ethBancor.setLiquidityProtectionSettings(settings);
    vxm.ethBancor.fetchAndSetTokenBalances([settings.govToken]);
  });

settingsContractAddress$
  .pipe(switchMapIgnoreThrow(address => fetchWhiteListedV1Pools(address)))
  .subscribe(whitelistedPools =>
    vxm.ethBancor.setWhiteListedPools(whitelistedPools)
  );

const localAndRemotePositionIds$ = combineLatest([
  authenticated$,
  liquidityProtectionStore$
]).pipe(
  tap(() => vxm.ethBancor.setLoadingPositions(true)),
  switchMapIgnoreThrow(([currentUser, storeAddress]) =>
    fetchPositionIds(currentUser, storeAddress)
  ),
  optimisticPositionIds(),
  distinctUntilChanged(compareIdArray),
  shareReplay(1)
);

const unVerifiedPositions$ = combineLatest([
  localAndRemotePositionIds$,
  liquidityProtectionStore$
]).pipe(
  optimisticObservable("positionsss", ([positionIds, storeAddress]) =>
    fetchPositionsMulti(positionIds, storeAddress)
  ),
  logger("positions"),
  shareReplay(1)
);

const removeLiquidityReturn$ = combineLatest([
  unVerifiedPositions$,
  liquidityProtection$
]).pipe(
  switchMapIgnoreThrow(([positions, contractAddress]) =>
    Promise.all(
      positions.map(position =>
        removeLiquidityReturn(position, contractAddress)
      )
    )
  ),
  logger("simple")
);

const pendingReserveRewards$ = combineLatest([
  stakingRewards$,
  unVerifiedPositions$,
  authenticated$
]).pipe(
  switchMapIgnoreThrow(([stakingRewards, positions, currentUser]) => {
    const uniquePoolReserveIds = uniqWith(
      positions,
      (a, b) =>
        compareString(a.poolToken, b.poolToken) &&
        compareString(a.reserveToken, b.reserveToken)
    );

    return Promise.all(
      uniquePoolReserveIds.map(poolReserve =>
        pendingRewardRewards(
          stakingRewards,
          currentUser,
          poolReserve.poolToken,
          poolReserve.reserveToken
        )
      )
    );
  })
);

const fullPositions$ = combineLatest([
  unVerifiedPositions$,
  liquidityProtection$,
  currentBlock$,
  apiData$
]).pipe(
  tap(() => vxm.ethBancor.setLoadingPositions(true)),
  switchMap(([rawPositions, liquidityProtection, { blockNumber }]) => {
    return vxm.ethBancor.buildFullPositions({
      rawPositions,
      liquidityProtection,
      blockNumberNow: blockNumber
    });
  }),
  logger("build full positions fetched")
);

combineLatest([fullPositions$, authenticated$, apiData$])
  .pipe(logger("with authentication"))
  .subscribe(([positions, currentUser, apiData]) => {
    const supportedAnchors = apiData.pools.map(pool => pool.pool_dlt_id);

    vxm.ethBancor.setProtectedPositions(
      positions
        .filter(position => compareString(position.owner, currentUser))
        .filter(position =>
          supportedAnchors.some(anchor =>
            compareString(anchor, position.poolToken)
          )
        )
    );
    vxm.ethBancor.setLoadingPositions(false);
  });

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