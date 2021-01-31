import { differenceWith, isEqual } from "lodash";
import { Subject, combineLatest, Observable, timer, merge, of } from "rxjs";
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
  fetchLiquidityProtectionSettings,
  fetchLiquidityProtectionSettingsContract,
  fetchMinLiqForMinting,
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

// don't stop the feed if the function throws
// pipe(startWithMainnet )

let difference = Date.now();

const logger = (label: string) => (data: any) => {
  if (difference) {
    difference = Date.now() - difference;
  }
  console.log(`${label} returned ${data} ${difference}`);
  difference = Date.now();
};

export const authenticated$ = new Subject<string>();
export const networkVersionReceiver$ = new Subject<EthNetworks>();

const onLogin$ = authenticated$.pipe(
  filter(x => Boolean(x)),
  share()
);
const onLogout$ = authenticated$.pipe(
  filter(x => !Boolean(x)),
  share()
);

const fifteenSeconds$ = timer(0, 15000);

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
  startWith({
    BancorNetwork: "0x2F9EC37d6CcFFf1caB21733BdaDEdE11c823cCB0",
    BancorConverterRegistry: "0xC0205e203F423Bcd8B2a4d6f8C8A154b0Aa60F19",
    LiquidityProtectionStore: "0xf5FAB5DBD2f3bf675dE4cB76517d4767013cfB55",
    LiquidityProtection: "0x9Ab934010E6f2D633FeEB5b6f1DdCeEdeD601BCF",
    StakingRewards: "0x457FE44E832181e1D3eCee0fc5be72cd9b36859f"
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
  tap(logger("liquidity protection store")),
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
  vxm.ethBancor.fetchAndSetLockedBalances({ storeAddress, currentUser })
);

const settingsContractAddressLocal$ = networkVersion$.pipe(
  filter(network => network == EthNetworks.Mainnet),
  tap(logger("mainnet known")),
  map(() => "0xd444ec18952c7cAf09636f21807683DaCC1d7dA9")
);

const settingsContractAddressRemote$ = liquidityProtection$.pipe(
  tap(logger("liquidity protection contract")),
  switchMap(protectionAddress =>
    fetchLiquidityProtectionSettingsContract(protectionAddress)
  ),
  distinctUntilChanged(compareString),
  tap(logger("settings contract")),
  shareReplay<string>(1)
);

const settingsContractAddress$ = merge(
  settingsContractAddressLocal$,
  settingsContractAddressRemote$
).pipe(
  distinctUntilChanged(compareString),
  tap(logger("settings contract local")),
  shareReplay(1)
);

settingsContractAddress$
  .pipe(
    switchMap(settingsContractAddress =>
      fetchMinLiqForMinting(settingsContractAddress)
    )
  )
  .subscribe(settingsContract =>
    vxm.minting.setMinNetworkTokenLiquidityForMinting(settingsContract)
  );

combineLatest([liquidityProtection$, settingsContractAddress$])
  .pipe(
    switchMap(([protectionContractAddress, settingsContractAddress]) =>
      fetchLiquidityProtectionSettings({
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
  .pipe(
    tap(logger("white listed pool address")),
    switchMap(address => fetchWhiteListedV1Pools(address)),
    tap(logger("white listed pools"))
  )
  .subscribe(whitelistedPools =>
    vxm.ethBancor.setWhiteListedPools(whitelistedPools)
  );

combineLatest([onLogin$, liquidityProtectionStore$, currentBlock$])
  .pipe(withLatestFrom(apiData$))
  .subscribe(([[currentUser, storeAddress, { blockNumber }], apiData]) => {
    const supportedAnchors = apiData.pools.map(pool => pool.pool_dlt_id);
    vxm.ethBancor.fetchProtectionPositions({
      storeAddress,
      blockNumberNow: blockNumber,
      userAddress: currentUser,
      supportedAnchors
    });
  });

onLogin$.pipe(withLatestFrom(apiData$)).subscribe(([userAddress, apiData]) => {
  if (userAddress) {
    const reserveTokens = apiData.tokens.map(token => token.dlt_id);
    const poolTokens = apiData.pools.map(pool => pool.pool_dlt_id);
    const allTokens = [...poolTokens, ...reserveTokens];
    vxm.ethBancor.fetchAndSetTokenBalances(allTokens);
  }
});
