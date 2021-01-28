import { differenceWith, isEqual } from "lodash";
import { Subject, combineLatest, Observable, merge, of } from "rxjs";
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
  share
} from "rxjs/operators";
import { vxm } from "@/store";
import { EthNetworks } from "./web3";
import { getWelcomeData } from "./eth/bancorApi";
import { getTokenMeta } from "@/store/modules/swap/ethBancor";
import { getNetworkVariables } from "./config";
import dayjs from "dayjs";
import { RegisteredContracts } from "@/types/bancor";
import { compareString } from "./helpers";
import { buildStakingRewardsContract } from "./eth/contractTypes";

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

const logger = (label: string) => (data: any) => {
  if (difference) {
    difference = Date.now() - difference;
  }
  console.log(`${label} returned ${data} ${difference}`);
  difference = Date.now();
};

export const authenticated$ = new Subject<string>();
export const networkVersionReceiver$ = new Subject<EthNetworks>();

export const networkVersion$ = networkVersionReceiver$.pipe(
  distinctUntilChanged(),
  shareReplay(1)
);

export const apiData$ = networkVersion$.pipe(
  switchMap(networkVersion => getWelcomeData(networkVersion)),
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

export const contractAddressesNetwork$ = networkVars$.pipe(
  switchMap(networkVariables =>
    vxm.ethBancor.fetchContractAddresses(networkVariables.contractRegistry)
  ),
  distinctUntilChanged<RegisteredContracts>(isEqual)
);

export const contractAddressesLocal$ = of<RegisteredContracts>({
  BancorNetwork: "0x2F9EC37d6CcFFf1caB21733BdaDEdE11c823cCB0",
  BancorConverterRegistry: "0xC0205e203F423Bcd8B2a4d6f8C8A154b0Aa60F19",
  LiquidityProtectionStore: "0xf5FAB5DBD2f3bf675dE4cB76517d4767013cfB55",
  LiquidityProtection: "0x9Ab934010E6f2D633FeEB5b6f1DdCeEdeD601BCF",
  StakingRewards: "0x457FE44E832181e1D3eCee0fc5be72cd9b36859f"
});

const contractAddresses$ = merge(
  contractAddressesNetwork$,
  contractAddressesLocal$
).pipe(share());

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

networkVersion$.subscribe(network => vxm.ethBancor.setNetwork(network));
apiData$.subscribe(data => vxm.ethBancor.setApiData(data));
tokenMeta$.subscribe(tokenMeta => vxm.ethBancor.setTokenMeta(tokenMeta));
networkVars$.subscribe(networkVariables =>
  vxm.ethBancor.fetchAndSetBntSupply(networkVariables.bntToken)
);

combineLatest([
  liquidityProtectionStore$,
  authenticated$
]).subscribe(([storeAddress, currentUser]) =>
  vxm.ethBancor.fetchAndSetLockedBalances({ storeAddress, currentUser })
);

const settingsContractAddress$ = liquidityProtection$.pipe(
  tap(logger("liquidity protection contract")),
  switchMap(protectionAddress =>
    vxm.ethBancor.fetchLiquidityProtectionSettingsContract(protectionAddress)
  ),
  distinctUntilChanged(compareString),
  tap(logger("settings contract")),
  share()
);

settingsContractAddress$.subscribe(settingsContract => {
  console.log("returned", settingsContract);
  return vxm.minting.fetchMinLiqForMinting(settingsContract);
});

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
  .pipe(
    switchMap(address => vxm.ethBancor.fetchWhiteListedV1Pools(address)),
    tap(logger("white listed pools"))
  )
  .subscribe(whitelistedPools =>
    vxm.ethBancor.setWhiteListedPools(whitelistedPools)
  );

combineLatest([
  authenticated$,
  liquidityProtectionStore$,
  currentBlock$,
  apiData$
]).subscribe(([userAddress, storeAddress, { blockNumber }, apiData]) => {
  const supportedAnchors = apiData.pools.map(pool => pool.pool_dlt_id);
  vxm.ethBancor.fetchProtectionPositions({
    storeAddress,
    blockNumberNow: blockNumber,
    userAddress: userAddress as string,
    supportedAnchors
  });
});

combineLatest([authenticated$, apiData$]).subscribe(
  ([userAddress, apiData]) => {
    if (userAddress) {
      const reserveTokens = apiData.tokens.map(token => token.dlt_id);
      const poolTokens = apiData.pools.map(pool => pool.pool_dlt_id);
      const allTokens = [...poolTokens, ...reserveTokens];
      vxm.ethBancor.fetchAndSetTokenBalances(allTokens);
    }
  }
);