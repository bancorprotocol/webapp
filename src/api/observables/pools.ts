import { MinimalPool } from "@/types/bancor";
import { isEqual } from "lodash";
import { combineLatest, timer } from "rxjs";
import { distinctUntilChanged, map, pluck, share } from "rxjs/operators";
import { getWelcomeData, WelcomeData } from "../eth/bancorApi";
import { switchMapIgnoreThrow } from "./customOperators";
import { networkVersion$ } from "./network";

const fifteenSeconds$ = timer(0, 15000);

export const apiData$ = combineLatest([networkVersion$, fifteenSeconds$]).pipe(
  switchMapIgnoreThrow(([networkVersion]) => getWelcomeData(networkVersion)),
  distinctUntilChanged<WelcomeData>(isEqual),
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
  ),
  distinctUntilChanged<MinimalPool[]>(isEqual)
);

export const tokens$ = apiData$.pipe(
  pluck("tokens"),
  distinctUntilChanged<WelcomeData["tokens"]>(isEqual),
  share()
);
