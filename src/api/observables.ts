import { differenceWith, isEqual } from "lodash";
import { Subject, combineLatest, Observable, timer } from "rxjs";
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
import { vxm } from "@/store";
import { EthNetworks } from "./web3";
import { getWelcomeData, NewPool, TokenMetaWithReserve } from "./eth/bancorApi";
import { getTokenMeta, ppmToDec, defaultImage } from "@/store/modules/swap/ethBancor";
import { getNetworkVariables } from "./config";
import dayjs from "dayjs";
import { RegisteredContracts } from "@/types/bancor";
import { compareString, findOrThrow } from "./helpers";
import { buildStakingRewardsContract } from "./eth/contractTypes";
import { filterAndWarn } from './pureHelpers';

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

export const authenticated$ = new Subject<string>();
export const networkVersionReceiver$ = new Subject<EthNetworks>();

const onLogin$ = authenticated$.pipe(filter(x => Boolean(x)), share())
const onLogout$ = authenticated$.pipe(filter(x => !Boolean(x)), share())

const fifteenSeconds$ = timer(0, 15000)

export const networkVersion$ = networkVersionReceiver$.pipe(
  distinctUntilChanged(),
  shareReplay(1)
);

export const apiData$ = combineLatest([networkVersion$, fifteenSeconds$]).pipe(
  switchMap(([networkVersion]) => getWelcomeData(networkVersion)),
  share()
);

export const tokenMeta$ = networkVersion$.pipe(
  switchMap(network => getTokenMeta(network)),
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
  switchMap(networkVariables =>
    vxm.ethBancor.fetchContractAddresses(networkVariables.contractRegistry)
  ),
  distinctUntilChanged<RegisteredContracts>(isEqual),
  tap(x => console.log("sending out contracts...", x)),
  share()
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
    return contract.methods.store().call();
  }),
  share()
);

export const poolPrograms$ = storeRewards$.pipe(
  switchMap(storeRewardContract =>
    vxm.rewards.fetchPoolPrograms(storeRewardContract)
  ),
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
)


newPools$.subscribe(pools => vxm.ethBancor.setPools(pools))

networkVersion$.subscribe(network => vxm.ethBancor.setNetwork(network));
apiData$.subscribe(data => vxm.ethBancor.setApiData(data));
tokenMeta$.subscribe(tokenMeta => vxm.ethBancor.setTokenMeta(tokenMeta));
networkVars$.subscribe(networkVariables =>
  vxm.ethBancor.fetchAndSetBntSupply(networkVariables.bntToken)
);

combineLatest([
  liquidityProtectionStore$,
  onLogin$
]).subscribe(([storeAddress, currentUser]) =>
  vxm.ethBancor.fetchAndSetLockedBalances({ storeAddress, currentUser })
);

const settingsContractAddress$ = liquidityProtection$.pipe(
  switchMap(protectionAddress =>
    vxm.ethBancor.fetchLiquidityProtectionSettingsContract(protectionAddress)
  ),
  distinctUntilChanged(compareString),
  share()
);

settingsContractAddress$.subscribe(settingsContract =>
  vxm.minting.fetchMinLiqForMinting(settingsContract)
);

combineLatest([liquidityProtection$, settingsContractAddress$])
  .pipe(
    switchMap(([protectionContractAddress, settingsContractAddress]) =>
      vxm.ethBancor.fetchLiquidityProtectionSettings({
        settingsContractAddress,
        protectionContractAddress
      })
    )
  )
  .subscribe(settings => {
    vxm.ethBancor.setLiquidityProtectionSettings(settings);
    vxm.ethBancor.fetchAndSetTokenBalances([settings.govToken]);
  });

settingsContractAddress$
  .pipe(switchMap(address => vxm.ethBancor.fetchWhiteListedV1Pools(address)))
  .subscribe(whitelistedPools =>
    vxm.ethBancor.setWhiteListedPools(whitelistedPools)
  );

combineLatest([
  onLogin$,
  liquidityProtectionStore$,
  currentBlock$,
]).pipe(
  withLatestFrom(apiData$)
).subscribe(([[currentUser, storeAddress, { blockNumber }], apiData]) => {
  const supportedAnchors = apiData.pools.map(pool => pool.pool_dlt_id);
  vxm.ethBancor.fetchProtectionPositions({
    storeAddress,
    blockNumberNow: blockNumber,
    userAddress: currentUser,
    supportedAnchors
  });
});

onLogin$.pipe(
  withLatestFrom(apiData$)
).subscribe(
  ([userAddress, apiData]) => {
    if (userAddress) {
      const reserveTokens = apiData.tokens.map(token => token.dlt_id);
      const poolTokens = apiData.pools.map(pool => pool.pool_dlt_id);
      const allTokens = [...poolTokens, ...reserveTokens];
      vxm.ethBancor.fetchAndSetTokenBalances(allTokens);
    }
  }
);