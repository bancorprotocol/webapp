import {
  fetchContractAddresses,
  fetchLiquidityProtectionSettingsContract
} from "../eth/contractWrappers";
import {
  logger,
  optimisticContract,
  switchMapIgnoreThrow
} from "./customOperators";
import { networkVars$, supportedNetworkVersion$ } from "./network";
import { vxm } from "@/store";
import { distinctUntilChanged, pluck, shareReplay, tap } from "rxjs/operators";
import { RegisteredContracts } from "@/types/bancor";
import { isEqual } from "lodash";
import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";
import { buildLiquidityProtectionContract } from "../eth/contractTypes";
import { compareString } from "../helpers";
import { combineLatest, timer } from "rxjs";

const zeroXContracts$ = supportedNetworkVersion$.pipe(
  switchMapIgnoreThrow(async networkVersion =>
    getContractAddressesForChainOrThrow(networkVersion as number)
  )
);

export const exchangeProxy$ = zeroXContracts$.pipe(
  pluck("exchangeProxy"),
  shareReplay(1)
);

export const contractAddresses$ = networkVars$.pipe(
  switchMapIgnoreThrow(networkVariables => {
    console.log(networkVariables.contractRegistry, "contract registry");
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

export const liquidityProtection$ = contractAddresses$.pipe(
  pluck("LiquidityProtection"),
  optimisticContract("LiquidityProtection"),
  shareReplay(1)
);

export const liquidityProtectionStore$ = liquidityProtection$.pipe(
  switchMapIgnoreThrow(liquidityProtection => {
    const contract = buildLiquidityProtectionContract(liquidityProtection);
    return contract.methods.store().call();
  }),
  distinctUntilChanged(compareString),
  logger("store"),
  shareReplay(1)
);

export const bancorConverterRegistry$ = contractAddresses$.pipe(
  pluck("BancorConverterRegistry"),
  optimisticContract("BancorConverterRegistry"),
  shareReplay(1)
);

export const stakingRewards$ = contractAddresses$.pipe(
  pluck("StakingRewards"),
  optimisticContract("StakingRewards"),
  shareReplay(1)
);

export const settingsContractAddress$ = liquidityProtection$.pipe(
  switchMapIgnoreThrow(protectionAddress =>
    fetchLiquidityProtectionSettingsContract(protectionAddress)
  ),
  optimisticContract("LiquiditySettings"),
  logger("logger liquidity settings"),
  shareReplay<string>(1)
);

export const govTokenAddress$ = networkVars$.pipe(
  pluck("govToken"),
  shareReplay(1)
);

const vxmTimer$ = timer(2000);

combineLatest([govTokenAddress$, vxmTimer$]).subscribe(([govToken]) => {
  vxm.ethBancor.fetchAndSetTokenBalances([govToken]);
});
