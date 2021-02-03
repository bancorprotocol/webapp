import { differenceWith, isEqual } from "lodash";
import {
  Subject,
  combineLatest,
  Observable,
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
  switchMapIgnoreThrow(protectionAddress =>
    fetchLiquidityProtectionSettingsContract(protectionAddress)
  ),
  optimisticContract("LiquiditySettings"),
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
  switchMapIgnoreThrow(([positionIds, storeAddress]) =>
    fetchPositionsMulti(positionIds, storeAddress)
  ),
  shareReplay(1)
);

const verifiedPositions$ = combineLatest([
  unVerifiedPositions$,
  authenticated$
]).pipe(
  map(([positions, currentUser]) =>
    positions.filter(position => compareString(position.owner, currentUser))
  )
);

const timeStart = Date.now();

combineLatest([
  verifiedPositions$,
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

    const timeNow = Date.now();
    const difference = timeNow - timeStart;
    console.log("difference", difference, difference / 1000);
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
