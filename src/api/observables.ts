import { uniqWith } from "lodash";
import { combineLatest, merge, Subject } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  share,
  shareReplay,
  startWith,
  throttleTime,
  withLatestFrom
} from "rxjs/operators";
import dayjs from "dayjs";
import { vxm } from "@/store";
import { EthNetworks } from "./web3";
import { NewPool, TokenMetaWithReserve } from "./eth/bancorApi";
import { ppmToDec } from "@/store/modules/swap/ethBancor";
import { getNetworkVariables } from "./config";
import {
  calculatePercentIncrease,
  calculateProgressLevel,
  compareString,
  findOrThrow
} from "./helpers";
import {
  buildStakingRewardsContract,
  buildTokenContract
} from "./eth/contractTypes";
import { expandToken, filterAndWarn } from "./pureHelpers";
import {
  MinimalPool,
  PoolLiqMiningApr,
  ProtectedLiquidity,
  ProtectedLiquidityCalculated,
  RemoveLiquidityReturn,
  ViewProtectedLiquidity
} from "@/types/bancor";
import {
  fetchLiquidityProtectionSettings,
  fetchLockedBalances,
  fetchMinLiqForMinting,
  fetchPoolLiqMiningApr,
  fetchPositionIds,
  fetchPositionsMulti,
  fetchRewardsMultiplier,
  fetchWhiteListedV1Pools,
  getHistoricBalances,
  getPoolAprs,
  pendingRewardRewards,
  removeLiquidityReturn
} from "./eth/contractWrappers";
import axios, { AxiosResponse } from "axios";
import { ethReserveAddress } from "./eth/ethAbis";
import { MinimalPoolWithReserveBalances, shrinkToken } from "./eth/helpers";
import BigNumber from "bignumber.js";
import {
  compareIdArray,
  logger,
  optimisticObservable,
  optimisticPositionIds,
  RankItem,
  rankPriority,
  switchMapIgnoreThrow
} from "./observables/customOperators";
import {
  networkVars$,
  networkVersion$,
  supportedNetworkVersion$
} from "./observables/network";
import { apiData$, minimalPools$, tokens$ } from "./observables/pools";
import { onLogin$, onLogout$ } from "./observables/auth";
import {
  liquidityProtection$,
  liquidityProtectionStore$,
  settingsContractAddress$,
  stakingRewards$
} from "./observables/contracts";

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

export const fetchPositionsTrigger$ = new Subject<true>();
const fetchPositionsTrig$ = fetchPositionsTrigger$.pipe(shareReplay(1));
fetchPositionsTrigger$.next(true);

onLogout$.subscribe(() => {
  vxm.ethBancor.setProtectedViewPositions([]);
});

export const tokenMeta$ = supportedNetworkVersion$.pipe(
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

export const immediateTokenMeta$ = tokenMeta$.pipe(startWith(undefined));

export const minimalPoolBalanceReceiver$ = new Subject<MinimalPool[]>();

const freshReserveBalances$ = minimalPoolBalanceReceiver$.pipe(
  throttleTime(5000),
  switchMapIgnoreThrow(minimalPools =>
    vxm.ethBancor.getReserveBalances(minimalPools)
  )
);

const decimalReserveBalances$ = freshReserveBalances$.pipe(
  withLatestFrom(tokens$),
  map(([pools, tokens]) => {
    const poolsCovered = filterAndWarn(
      pools,
      pool =>
        pool.reserveBalances.every(balance =>
          tokens.some(token => compareString(balance.id, token.dlt_id))
        ),
      "lost reserve balances because it was not covered in API tokens"
    );

    return poolsCovered.map(
      (pool): MinimalPoolWithReserveBalances => ({
        ...pool,
        reserveBalances: pool.reserveBalances.map(reserveBalance => {
          const token = findOrThrow(tokens, token =>
            compareString(token.dlt_id, reserveBalance.id)
          );
          return {
            ...reserveBalance,
            amount: shrinkToken(reserveBalance.amount, token.decimals)
          };
        })
      })
    );
  })
);

decimalReserveBalances$.subscribe(pools =>
  vxm.ethBancor.updateReserveBalances(pools)
);

export const newApiPools$ = apiData$.pipe(
  map(apiData => {
    const pools = apiData.pools;
    const tokens = apiData.tokens;

    const betterPools = pools.map(pool => {
      const reserveTokens = pool.reserves.map(
        (reserve): TokenMetaWithReserve => {
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
            image: defaultImage,
            precision: token.decimals
          };
        }
      );
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
  })
);

export const newPools$ = combineLatest([
  newApiPools$,
  immediateTokenMeta$
]).pipe(
  map(([pools, tokenMeta]) =>
    pools.map(
      (pool): NewPool => ({
        ...pool,
        reserveTokens: pool.reserveTokens.map(reserve => {
          const meta =
            tokenMeta &&
            tokenMeta.find(meta =>
              compareString(meta.contract, reserve.contract)
            );

          return {
            ...reserve,
            image: (meta && meta.image) || defaultImage
          };
        })
      })
    )
  )
);

newPools$.subscribe(pools => vxm.ethBancor.setPools(pools));

networkVersion$.subscribe(network => {
  if (vxm && vxm.ethBancor) {
    vxm.ethBancor.setNetwork(network);
  }
});

apiData$.subscribe(data => {
  vxm.ethBancor.setApiData(data);
  const minimalPools = data.pools.map(
    (pool): MinimalPool => ({
      anchorAddress: pool.pool_dlt_id,
      converterAddress: pool.converter_dlt_id,
      reserves: pool.reserves.map(r => r.address)
    })
  );
  minimalPoolBalanceReceiver$.next(minimalPools);
});

const bntSupplyApi$ = apiData$.pipe(
  pluck("bnt_supply"),
  map(decSupply => expandToken(decSupply, 18)),
  map((supplyWei): RankItem<string> => ({ data: supplyWei, priority: 5 }))
);

const bntSupplyChain$ = networkVars$.pipe(
  switchMapIgnoreThrow(vars => {
    const contract = buildTokenContract(vars.bntToken);
    return contract.methods.totalSupply().call();
  }),
  map((supplyWei): RankItem<string> => ({ data: supplyWei, priority: 3 }))
);

const bntSupply$ = merge(bntSupplyApi$, bntSupplyChain$).pipe(
  rankPriority(),
  distinctUntilChanged()
);

bntSupply$.subscribe(weiSupply => vxm.ethBancor.setBntSupply(weiSupply));

tokenMeta$.subscribe(tokenMeta => vxm.ethBancor.setTokenMeta(tokenMeta));

export const lockedBalancesTrigger$ = new Subject<null>();

combineLatest([liquidityProtectionStore$, onLogin$, lockedBalancesTrigger$])
  .pipe(
    switchMapIgnoreThrow(([storeAddress, currentUser]) =>
      fetchLockedBalances(storeAddress, currentUser)
    )
  )
  .subscribe(balances => {
    vxm.ethBancor.setLockedBalances(balances);
  });

lockedBalancesTrigger$.next(null);

export const minNetworkTokenLiquidityForMinting$ = settingsContractAddress$.pipe(
  switchMapIgnoreThrow(settingsContractAddress =>
    fetchMinLiqForMinting(settingsContractAddress)
  ),
  share()
);

minNetworkTokenLiquidityForMinting$.subscribe(
  minNetworkTokenLiquidityForMinting =>
    vxm.minting.setMinNetworkTokenLiquidityForMinting(
      minNetworkTokenLiquidityForMinting
    )
);

const liquiditySettings$ = combineLatest([
  liquidityProtection$,
  settingsContractAddress$
]).pipe(
  switchMapIgnoreThrow(([protectionContractAddress, settingsContractAddress]) =>
    fetchLiquidityProtectionSettings({
      settingsContractAddress
    }).catch(e =>
      vxm.ethBancor.fetchLiquidityProtectionSettings({
        protectionContractAddress,
        settingsContractAddress
      })
    )
  ),
  share()
);

export const liquidityProtectionNetworkToken$ = liquiditySettings$.pipe(
  pluck("networkToken"),
  share()
);

liquiditySettings$.subscribe(settings => {
  vxm.ethBancor.setLiquidityProtectionSettings(settings);
});

const whitelistedPools$ = settingsContractAddress$.pipe(
  switchMapIgnoreThrow(address => fetchWhiteListedV1Pools(address)),
  share()
);

whitelistedPools$.subscribe(whitelistedPools => {
  vxm.ethBancor.setWhiteListedPools(whitelistedPools);
  vxm.ethBancor.setWhiteListedPoolsLoading(false);
});

const doNothing = () => {
  // seems some observables need to be subscribed too for other observables to receive them?
  // unknown behavior
};

onLogin$.subscribe(doNothing);
liquidityProtectionStore$.subscribe(doNothing);
fetchPositionsTrig$.subscribe(doNothing);

const localAndRemotePositionIds$ = combineLatest([
  onLogin$,
  liquidityProtectionStore$,
  fetchPositionsTrig$
]).pipe(
  switchMapIgnoreThrow(([currentUser, storeAddress]) =>
    fetchPositionIds(currentUser, storeAddress)
  ),
  optimisticPositionIds(),
  distinctUntilChanged(compareIdArray),
  filter(positions => positions.length > 0),
  shareReplay(1)
);

fetchPositionsTrigger$.next(true);

const unVerifiedPositions$ = combineLatest([
  localAndRemotePositionIds$,
  liquidityProtectionStore$
]).pipe(
  optimisticObservable("positionsss", ([positionIds, storeAddress]) =>
    fetchPositionsMulti(positionIds, storeAddress)
  ),
  shareReplay(1)
);

const removeLiquidityReturn$ = combineLatest([
  unVerifiedPositions$,
  liquidityProtection$
]).pipe(
  switchMapIgnoreThrow(([positions, contractAddress]) =>
    Promise.all(
      positions.map(position =>
        removeLiquidityReturn(position, contractAddress).catch(() => false)
      )
    )
  ),
  map(positions => positions.filter(Boolean) as RemoveLiquidityReturn[]),
  startWith(undefined)
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
  onLogin$
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

const historicPoolBalances$ = combineLatest([
  unVerifiedPositions$,
  minimalPools$
]).pipe(
  withLatestFrom(currentBlock$),
  switchMapIgnoreThrow(async ([[unverified, minimal], currentBlock]) => {
    const res = await getHistoricBalances(
      unverified,
      currentBlock.blockNumber,
      minimal
    );
    console.log(res, "was the res...");
    return res;
  })
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
  onLogin$,
  stakingRewards$
]).pipe(
  switchMapIgnoreThrow(([unVerifiedPositions, currentUser, stakingReward]) => {
    const poolReserves = uniquePoolReserves(unVerifiedPositions);
    return Promise.all(
      poolReserves.map(async poolReserve => {
        let multiplier = new BigNumber(0);
        try {
          multiplier = await fetchRewardsMultiplier(
            poolReserve.poolToken,
            poolReserve.reserveToken,
            stakingReward,
            currentUser
          );
        } catch (e) {
          console.error("Failed to fetch rewards multiplier", e);
        }

        return {
          ...poolReserve,
          multiplier
        };
      })
    );
  }),
  startWith(undefined)
);

const immediatePoolPrograms$ = poolPrograms$.pipe(startWith(undefined));

const fullPositions$ = combineLatest([
  unVerifiedPositions$,
  removeLiquidityReturn$,
  pendingReserveRewards$,
  poolReturns$,
  rewardMultipliers$,
  immediatePoolPrograms$
]).pipe(
  map(
    ([
      unverifiedPositions,
      removeLiquidityReturn,
      pendingReserveRewards,
      poolReturns,
      rewardMultipliers,
      poolPrograms
    ]) =>
      unverifiedPositions.map(
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
                compareString(r.poolId, position.poolToken) &&
                compareString(r.reserveId, position.reserveToken)
            );

          const rewardMultiplier =
            rewardMultipliers &&
            rewardMultipliers.find(
              r =>
                compareString(r.poolToken, position.poolToken) &&
                compareString(r.reserveToken, position.reserveToken)
            );

          const multiplier =
            poolPrograms &&
            poolPrograms.some(x =>
              compareString(x.poolToken, position.poolToken)
            )
              ? rewardMultiplier
              : null;

          return {
            ...position,
            ...(reserveReward && {
              pendingReserveReward: reserveReward.decBnt.toString()
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
            ...(multiplier && {
              rewardsMultiplier: multiplier.multiplier.toNumber()
            })
          };
        }
      )
  )
);

const whitelistedImmediate$ = whitelistedPools$.pipe(startWith(undefined));

combineLatest([
  fullPositions$,
  onLogin$,
  liquiditySettings$,
  whitelistedImmediate$,
  tokens$,
  usdPriceOfBnt$
])
  .pipe(
    map(
      ([
        positions,
        currentUser,
        liquiditySettings,
        whitelistedPools,
        tokens,
        usdPriceOfBnt
      ]) => {
        const { minDelay, maxDelay, networkToken } = liquiditySettings;

        const whitelistedPositions = whitelistedPools
          ? positions.filter(pos =>
              whitelistedPools.some(whitelistedPool =>
                compareString(whitelistedPool, pos.poolToken)
              )
            )
          : positions;
        const knownTokenPrecision = whitelistedPositions.filter(pos =>
          tokens.some(token => compareString(token.dlt_id, pos.reserveToken))
        );

        const passedPositions = knownTokenPrecision;

        return passedPositions
          .filter(entry => compareString(entry.owner, currentUser))
          .map(
            (singleEntry): ViewProtectedLiquidity => {
              const isWhiteListed = true;

              const startTime = Number(singleEntry.timestamp);

              const reserveToken = findOrThrow(tokens, token =>
                compareString(token.dlt_id, singleEntry.reserveToken)
              );
              const reservePrecision = Number(reserveToken.decimals);

              const reserveTokenDec = shrinkToken(
                singleEntry.reserveAmount,
                reservePrecision
              );

              const pendingReserveReward =
                singleEntry.pendingReserveReward &&
                singleEntry.pendingReserveReward.toString();

              const fullyProtectedDec =
                singleEntry.fullLiquidityReturn &&
                shrinkToken(
                  singleEntry.fullLiquidityReturn.targetAmount,
                  reservePrecision
                );

              const currentProtectedDec =
                singleEntry.currentLiquidityReturn &&
                shrinkToken(
                  singleEntry.currentLiquidityReturn.targetAmount,
                  reservePrecision
                );

              const progressPercent = calculateProgressLevel(
                startTime,
                startTime + maxDelay
              );

              const givenVBnt =
                compareString(reserveToken.dlt_id, networkToken) &&
                reserveTokenDec;

              const feeGenerated = new BigNumber(fullyProtectedDec || 0).minus(
                reserveTokenDec
              );

              const reserveTokenPrice = Number(reserveToken.rate.usd);

              return {
                id: `${singleEntry.poolToken}:${singleEntry.id}`,
                initialProtectedWei: singleEntry.reserveAmount,
                inititalProtectedToken: singleEntry.reserveToken,
                whitelisted: isWhiteListed,
                ...(givenVBnt && { givenVBnt }),
                single: true,
                apr: {
                  day: Number(singleEntry.oneDayDec),
                  week: Number(singleEntry.oneWeekDec)
                },
                insuranceStart: startTime + minDelay,
                fullCoverage: startTime + maxDelay,
                stake: {
                  amount: reserveTokenDec,
                  symbol: reserveToken.symbol,
                  poolId: singleEntry.poolToken,
                  unixTime: startTime,
                  usdValue: new BigNumber(reserveTokenDec)
                    .times(reserveTokenPrice)
                    .toNumber()
                },
                ...(fullyProtectedDec && {
                  fullyProtected: {
                    amount: fullyProtectedDec,
                    symbol: reserveToken.symbol,
                    id: reserveToken.dlt_id,
                    usdValue: new BigNumber(fullyProtectedDec)
                      .times(reserveTokenPrice)
                      .toNumber()
                  }
                }),
                ...(currentProtectedDec && {
                  protectedAmount: {
                    amount: currentProtectedDec,
                    id: reserveToken.dlt_id,
                    symbol: reserveToken.symbol,
                    ...(fullyProtectedDec && {
                      usdValue: new BigNumber(currentProtectedDec)
                        .times(reserveTokenPrice)
                        .toNumber()
                    })
                  }
                }),
                coverageDecPercent: progressPercent,
                fees: {
                  amount: feeGenerated.toString(),
                  symbol: reserveToken.symbol,
                  id: reserveToken.dlt_id
                },
                ...(fullyProtectedDec && {
                  roi: Number(
                    calculatePercentIncrease(reserveTokenDec, fullyProtectedDec)
                  )
                }),
                ...(pendingReserveReward && { pendingReserveReward }),
                ...(singleEntry.rewardsMultiplier && {
                  rewardsMultiplier: singleEntry.rewardsMultiplier
                }),
                reserveTokenPrice,
                bntTokenPrice: usdPriceOfBnt
              };
            }
          );
      }
    )
  )
  .subscribe(positions => {
    vxm.ethBancor.setProtectedViewPositions(positions);
    vxm.ethBancor.setLoadingPositions(false);
  });

onLogout$.subscribe(() => vxm.ethBancor.wipeTokenBalances());

combineLatest([onLogin$, minimalPools$]).subscribe(
  ([userAddress, minimalPools]) => {
    if (userAddress) {
      const allTokens = minimalPools.flatMap(pool => [
        ...pool.reserves,
        pool.anchorAddress
      ]);
      vxm.ethBancor.fetchAndSetTokenBalances(allTokens);
    }
  }
);

combineLatest([
  newPools$,
  tokens$,
  networkVars$,
  liquidityProtectionNetworkToken$,
  poolPrograms$,
  liquidityProtectionStore$
])
  .pipe(
    switchMapIgnoreThrow(
      async ([
        pools,
        tokens,
        networkVars,
        liquidityProtectionNetworkToken,
        poolPrograms,
        liquidityProtectionStore
      ]) => {
        const minimalPools = pools.map(
          (pool): MinimalPoolWithReserveBalances => ({
            anchorAddress: pool.pool_dlt_id,
            converterAddress: pool.converter_dlt_id,
            reserves: pool.reserves.map(r => r.address),
            reserveBalances: pool.reserves.map(reserve => ({
              amount: expandToken(
                reserve.balance,
                findOrThrow(tokens, token =>
                  compareString(token.dlt_id, reserve.address)
                ).decimals
              ),
              id: reserve.address
            }))
          })
        );

        const liqApr = await fetchPoolLiqMiningApr(
          networkVars.multiCall,
          poolPrograms,
          minimalPools,
          liquidityProtectionStore,
          liquidityProtectionNetworkToken
        );

        const complementSymbols = liqApr.map(
          (apr): PoolLiqMiningApr => ({
            ...apr,
            rewards: apr.rewards.map(r => ({
              ...r,
              symbol: findOrThrow(tokens, token =>
                compareString(token.dlt_id, r.address)
              ).symbol
            }))
          })
        );

        return complementSymbols;
      }
    )
  )
  .subscribe(apr => vxm.ethBancor.updateLiqMiningApr(apr));

export const selectedPromptReceiver$ = new Subject<string>();
