import { ConverterAndAnchor, MinimalPool } from "@/types/bancor";
import { isEqual, zip } from "lodash";
import { combineLatest, Subject } from "rxjs";
import {
  distinctUntilChanged,
  map,
  pluck,
  share,
  shareReplay,
  startWith
} from "rxjs/operators";
import { getWelcomeData, WelcomeData } from "../eth/bancorApi";
import { getAnchors, getConvertersByAnchors } from "../eth/contractWrappers";
import { bancorConverterRegistry$ } from "./contracts";
import { logger, switchMapIgnoreThrow } from "./customOperators";
import { supportedNetworkVersion$ } from "./network";
import { fifteenSeconds$ } from "./timers";
import { web3 } from "@/api/web3";
import { compareString, updateArray } from "../helpers";
import { minimalPoolBalanceReceiver$ } from "../observables";

const zipAnchorAndConverters = (
  anchorAddresses: string[],
  converterAddresses: string[]
): ConverterAndAnchor[] => {
  if (anchorAddresses.length !== converterAddresses.length)
    throw new Error(
      "was expecting as many anchor addresses as converter addresses"
    );
  const zipped = zip(anchorAddresses, converterAddresses) as [string, string][];
  return zipped.map(([anchorAddress, converterAddress]) => ({
    anchorAddress: anchorAddress!.toLowerCase(),
    converterAddress: converterAddress!.toLowerCase()
  }));
};

export const apiData$ = combineLatest([
  supportedNetworkVersion$,
  fifteenSeconds$
]).pipe(
  switchMapIgnoreThrow(([networkVersion]) => getWelcomeData(networkVersion)),
  distinctUntilChanged<WelcomeData>(isEqual),
  share()
);

const trueAnchors$ = bancorConverterRegistry$.pipe(
  switchMapIgnoreThrow(converterRegistry =>
    getAnchors(converterRegistry, web3)
  ),
  shareReplay(1)
);

trueAnchors$.subscribe(() => {});

const anchorAndConverters$ = combineLatest([
  trueAnchors$,
  bancorConverterRegistry$
]).pipe(
  switchMapIgnoreThrow(async ([anchorAddresses, converterRegistryAddress]) => {
    const converters = await getConvertersByAnchors({
      anchorAddresses,
      converterRegistryAddress,
      web3
    });
    const anchorsAndConverters = zipAnchorAndConverters(
      anchorAddresses,
      converters
    );
    return anchorsAndConverters;
  }),
  startWith([]),
  shareReplay<ConverterAndAnchor[]>(1)
);

const apiPools$ = apiData$.pipe(
  pluck("pools"),
  map(pools =>
    pools.map(pool => ({
      ...pool,
      converter_dlt_id: pool.converter_dlt_id.toLowerCase(),
      pool_dlt_id: pool.pool_dlt_id.toLowerCase()
    }))
  ),
  distinctUntilChanged<WelcomeData["pools"]>(isEqual),
  shareReplay(1)
);

export const pools$ = combineLatest([apiPools$, anchorAndConverters$]).pipe(
  map(([pools, anchorAndConverters]) => {
    if (anchorAndConverters.length == 0) return pools;
    return updateArray(
      pools,
      pool => {
        const correctAnchor = anchorAndConverters.find(anchor =>
          compareString(anchor.anchorAddress, pool.pool_dlt_id)
        );
        if (!correctAnchor) return false;
        return !compareString(
          correctAnchor.converterAddress,
          pool.converter_dlt_id
        );
      },
      pool => {
        const correctAnchor = anchorAndConverters.find(anchor =>
          compareString(anchor.anchorAddress, pool.pool_dlt_id)
        )!;
        return {
          ...pool,
          converter_dlt_id: correctAnchor.converterAddress
        };
      }
    );
  }),
  distinctUntilChanged<WelcomeData["pools"]>(isEqual),
  shareReplay(1)
);

export const minimalPools$ = pools$.pipe(
  map(pools =>
    pools.map(
      (pool): MinimalPool => ({
        anchorAddress: pool.pool_dlt_id,
        converterAddress: pool.converter_dlt_id,
        reserves: pool.reserves.map(reserve => reserve.address)
      })
    )
  ),
  distinctUntilChanged<MinimalPool[]>(isEqual),
  shareReplay(1)
);

minimalPools$.subscribe(pools => {
  minimalPoolBalanceReceiver$.next(pools);
});

export const tokens$ = apiData$.pipe(
  pluck("tokens"),
  distinctUntilChanged<WelcomeData["tokens"]>(isEqual),
  share()
);
