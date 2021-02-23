import { differenceWith, isEqual, uniqWith } from "lodash";
import {
  Subject,
  combineLatest,
  Observable,
  EMPTY,
  PartialObserver,
  interval,
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
  withLatestFrom
} from "rxjs/operators";
import dayjs from "dayjs";
import { vxm } from "@/store";
import { EthNetworks } from "./web3";
import { getWelcomeData, NewPool, TokenMetaWithReserve } from "./eth/bancorApi";
import { ppmToDec } from "@/store/modules/swap/ethBancor";
import { getNetworkVariables } from "./config";
import { compareString, findOrThrow } from "./helpers";
import { buildStakingRewardsContract } from "./eth/contractTypes";
import { filterAndWarn } from "./pureHelpers";
import {
  RegisteredContracts,
  MinimalPool,
  ProtectedLiquidityCalculated,
  ProtectedLiquidity
} from "@/types/bancor";
import {
  fetchContractAddresses,
  fetchLiquidityProtectionSettings,
  fetchLiquidityProtectionSettingsContract,
  fetchMinLiqForMinting,
  fetchPositionIds,
  fetchPositionsMulti,
  fetchWhiteListedV1Pools,
  pendingRewardRewards,
  removeLiquidityReturn,
  getHistoricBalances,
  getPoolAprs,
  fetchRewardsMultiplier
} from "./eth/contractWrappers";
import { expandToken } from "./pureHelpers";
import axios, { AxiosResponse } from "axios";
import { ethReserveAddress } from "./eth/ethAbis";

const tokenMetaDataEndpoint =
  "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/tokens.json";

interface TokenMeta {
  id: string;
  image: string;
  contract: string;
  symbol: string;
  name: string;
  precision?: number;
}
export const defaultImage =
  "https://ropsten.etherscan.io/images/main/empty-token.png";

export const getTokenMeta = async (currentNetwork: EthNetworks) => {
  const networkVars = getNetworkVariables(currentNetwork);
  if (currentNetwork == EthNetworks.Ropsten) {
    return [
      {
        symbol: "BNT",
        contract: networkVars.bntToken,
        precision: 18
      },
      {
        symbol: "DAI",
        contract: "0xc2118d4d90b274016cb7a54c03ef52e6c537d957",
        precision: 18
      },
      {
        symbol: "WBTC",
        contract: "0xbde8bb00a7ef67007a96945b3a3621177b615c44",
        precision: 8
      },
      {
        symbol: "BAT",
        contract: "0x443fd8d5766169416ae42b8e050fe9422f628419",
        precision: 18
      },
      {
        symbol: "LINK",
        contract: "0x20fe562d797a42dcb3399062ae9546cd06f63280",
        precision: 18
      },
      {
        contract: "0x4F5e60A76530ac44e0A318cbc9760A2587c34Da6",
        symbol: "YYYY"
      },
      {
        contract: "0x63B75DfA4E87d3B949e876dF2Cd2e656Ec963466",
        symbol: "YYY"
      },
      {
        contract: "0xAa2A908Ca3E38ECEfdbf8a14A3bbE7F2cA2a1BE4",
        symbol: "XXX"
      },
      {
        contract: "0xe4158797A5D87FB3080846e019b9Efc4353F58cC",
        symbol: "XXX"
      }
    ].map(
      (x): TokenMeta => ({
        ...x,
        id: x.contract,
        image: defaultImage,
        name: x.symbol
      })
    );
  }
  if (currentNetwork !== EthNetworks.Mainnet)
    throw new Error("Ropsten and Mainnet supported only.");

  const res: AxiosResponse<TokenMeta[]> = await axios.get(
    tokenMetaDataEndpoint
  );

  const drafted = res.data
    .filter(({ symbol, contract, image }) =>
      [symbol, contract, image].every(Boolean)
    )
    .map(x => ({ ...x, id: x.contract }));

  const existingEth = drafted.find(x => compareString(x.symbol, "eth"))!;

  const withoutEth = drafted.filter(meta => !compareString(meta.symbol, "eth"));
  const addedEth = {
    ...existingEth,
    id: ethReserveAddress,
    contract: ethReserveAddress
  };
  const final = [addedEth, existingEth, ...withoutEth];
  return uniqWith(final, (a, b) => compareString(a.id, b.id));
};

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

const onLogin$ = authenticated$.pipe(
  filter(x => Boolean(x)),
  share()
);
const onLogout$ = authenticated$.pipe(
  filter(x => !Boolean(x)),
  share()
);

export const networkVersion$ = networkVersionReceiver$.pipe(
  startWith(EthNetworks.Mainnet),
  distinctUntilChanged(),
  logger("network version"),
  shareReplay(1)
);

const fifteenSeconds$ = timer(0, 15000);

export const apiData$ = combineLatest([networkVersion$, fifteenSeconds$]).pipe(
  switchMap(([networkVersion]) => getWelcomeData(networkVersion)),
  logger("api data", true),
  share()
);

export const pools$ = apiData$.pipe(pluck("pools"), share());
export const minimalPools$ = pools$.pipe(
  map(pools =>
    pools.map(
      (pool): MinimalPool => ({
        anchorAddress: pool.pool_dlt_id,
        converterAddress: pool.converter_dlt_id,
        reserves: pool.reserves.map(reserve => reserve.address)
      })
    )
  )
);

export const tokens$ = apiData$.pipe(pluck("tokens"), share());

export const tokenMeta$ = networkVersion$.pipe(
  switchMapIgnoreThrow(network => getTokenMeta(network)),
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

const immediateTokenMeta$ = tokenMeta$.pipe(startWith(undefined));

export const newPools$ = combineLatest([apiData$, immediateTokenMeta$]).pipe(
  map(([apiData, tokenMeta]) => {
    {
      const pools = apiData.pools;
      const tokens = apiData.tokens;

      const betterPools = pools.map(pool => {
        const reserveTokens = pool.reserves
          .map(
            (reserve): TokenMetaWithReserve => {
              const meta =
                tokenMeta &&
                tokenMeta.find(meta =>
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
  startWith(undefined),
  logger("simple")
);

const uniquePoolReserves = (
  positions: ProtectedLiquidity[]
): { poolToken: string; reserveToken: string }[] =>
  uniqWith(
    positions,
    (a, b) =>
      compareString(a.poolToken, b.poolToken) &&
      compareString(a.reserveToken, b.reserveToken)
  ).map(position => ({
    reserveToken: position.reserveToken,
    poolToken: position.poolToken
  }));

const pendingReserveRewards$ = combineLatest([
  stakingRewards$,
  unVerifiedPositions$,
  authenticated$
]).pipe(
  switchMapIgnoreThrow(([stakingRewards, positions, currentUser]) => {
    const uniquePoolReserveIds = uniquePoolReserves(positions);

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
  }),
  startWith(undefined)
);

const poolAprs$ = combineLatest([unVerifiedPositions$, minimalPools$]).pipe(
  withLatestFrom(currentBlock$),
  switchMap(([[unverified, minimal], currentBlock]) => {
    return Promise.resolve(currentBlock.blockNumber);
  })
);

const historicPoolBalances$ = combineLatest([
  unVerifiedPositions$,
  minimalPools$
]).pipe(
  withLatestFrom(currentBlock$),
  switchMapIgnoreThrow(([[unverified, minimal], currentBlock]) =>
    getHistoricBalances(unverified, currentBlock.blockNumber, minimal)
  )
);

const poolReturns$ = combineLatest([
  unVerifiedPositions$,
  historicPoolBalances$,
  liquidityProtection$
]).pipe(
  switchMapIgnoreThrow(([positions, poolBalances, liquidityProtection]) =>
    getPoolAprs(positions, poolBalances.flat(), liquidityProtection)
  ),
  startWith(undefined)
);

const rewardMultipliers$ = combineLatest([
  unVerifiedPositions$,
  authenticated$,
  stakingRewards$
]).pipe(
  switchMapIgnoreThrow(([unVerifiedPositions, currentUser, stakingReward]) => {
    const poolReserves = uniquePoolReserves(unVerifiedPositions);
    return Promise.all(
      poolReserves.map(async poolReserve => ({
        ...poolReserve,
        multiplier: await fetchRewardsMultiplier(
          poolReserve.poolToken,
          poolReserve.reserveToken,
          stakingReward,
          currentUser
        )
      }))
    );
  }),
  startWith(undefined)
);

const fullPositions$ = combineLatest([
  unVerifiedPositions$,
  removeLiquidityReturn$,
  pendingReserveRewards$,
  poolReturns$,
  rewardMultipliers$
]).pipe(
  map(
    ([
      unverifiedPositions,
      removeLiquidityReturn,
      pendingReserveRewards,
      poolReturns,
      rewardMultipliers
    ]) => {
      return unverifiedPositions.map(
        (position): ProtectedLiquidityCalculated => {
          const removeLiq =
            removeLiquidityReturn &&
            removeLiquidityReturn.find(r => r.positionId == position.id);
          const scales =
            poolReturns &&
            poolReturns.find(poolReturns =>
              poolReturns.find(x => x.positionId == position.id)
            );

          const week =
            scales &&
            scales.find(scale => compareString(scale.scaleId, "week"));
          const day =
            scales && scales.find(scale => compareString(scale.scaleId, "day"));

          const reserveReward =
            pendingReserveRewards &&
            pendingReserveRewards.find(
              r =>
                compareString(r.poolId, position.id) &&
                compareString(r.reserveId, position.reserveToken)
            );

          const rewardMultiplier =
            rewardMultipliers &&
            rewardMultipliers.find(
              r =>
                compareString(r.poolToken, position.poolToken) &&
                compareString(r.reserveToken, position.reserveToken)
            );

          return {
            ...position,
            ...(reserveReward && {
              pendingReserveReward: reserveReward.decBnt
            }),
            ...(removeLiq && {
              fullLiquidityReturn: removeLiq.fullLiquidityReturn
            }),
            ...(removeLiq && {
              currentLiquidityReturn: removeLiq.currentLiquidityReturn
            }),
            ...(removeLiq && { roiDec: removeLiq.roiDec }),
            ...(day && { oneDayDec: day.calculatedAprDec }),
            ...(week && { oneWeekDec: week.calculatedAprDec }),
            ...(rewardMultiplier && {
              rewardsMultiplier: rewardMultiplier.multiplier.toNumber()
            })
          };
        }
      );
    }
  )
);

combineLatest([fullPositions$, authenticated$, minimalPools$])
  .pipe(logger("with authentication"))
  .subscribe(([positions, currentUser, pools]) => {
    const supportedAnchors = pools.map(pool => pool.anchorAddress);

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

combineLatest([authenticated$, minimalPools$]).subscribe(
  ([userAddress, pools]) => {
    if (userAddress) {
      const allTokens = pools.flatMap(pool => [
        ...pool.reserves,
        pool.anchorAddress
      ]);
      try {
        vxm.ethBancor.fetchAndSetTokenBalances(allTokens);
      } catch (e) {}
    }
  }
);
