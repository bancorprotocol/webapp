import { differenceWith, isEqual } from "lodash";
import { Subject, combineLatest, Observable, merge } from "rxjs";
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
import dayjs from "dayjs";
import { vxm } from "@/store";
import { getTokenMeta } from "@/store/modules/swap/ethBancor";
import { EthNetworks } from "./web3";
import { getWelcomeData } from "./eth/bancorApi";
import { getNetworkVariables } from "./config";
import { RegisteredContracts } from "@/types/bancor";
import { compareString } from "./helpers";
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
