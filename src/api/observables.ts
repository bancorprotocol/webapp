import { differenceWith, isEqual } from "lodash";
import {
  Subject,
  combineLatest,
  from,
  Observable,
  of,
  partition as partitionOb,
  merge
} from "rxjs";
import {
  distinctUntilChanged,
  map,
  filter,
  startWith,
  concatMap,
  mergeMap,
  tap,
  switchMap,
  shareReplay,
  pluck,
  scan,
  first as firstItem,
  bufferTime,
  delay,
  buffer,
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
  distinctUntilChanged<RegisteredContracts>(isEqual),
  tap(x => console.log("sending out contracts...", x)),
  share()
);

export const bancorConverterRegistry$ = contractAddresses$.pipe(
  pluck("BancorConverterRegistry"),
  distinctUntilChanged(compareString),
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
