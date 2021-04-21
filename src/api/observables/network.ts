import { Subject } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith
} from "rxjs/operators";
import { getNetworkVariables } from "../config";
import { EthNetworks } from "../web3";

export const networkVersionReceiver$ = new Subject<EthNetworks>();

export const networkVersion$ = networkVersionReceiver$.pipe(
  startWith(EthNetworks.Mainnet),
  distinctUntilChanged(),
  shareReplay(1)
);

export const networkVars$ = networkVersion$.pipe(
  map(getNetworkVariables),
  shareReplay(1)
);
