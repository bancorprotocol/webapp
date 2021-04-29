import { vxm } from "@/store";
import { Subject, combineLatest, partition, merge } from "rxjs";
import {
  distinctUntilChanged,
  share,
  map,
  filter,
  shareReplay
} from "rxjs/operators";
import { compareString } from "../helpers";

export const mockModeReceiver$ = new Subject<boolean>();
export const authenticatedReceiver$ = new Subject<string | false>();
export const mockedAddressReceiver$ = new Subject<string | false>();

export const authenticated$ = combineLatest([
  authenticatedReceiver$,
  mockedAddressReceiver$,
  mockModeReceiver$
]).pipe(
  map(([authenticated, mocked, mockedMode]) =>
    mockedMode ? mocked : authenticated
  ),
  distinctUntilChanged(),
  share()
);

authenticated$.subscribe(x => console.log("auth..", x));

mockModeReceiver$.next(false);
authenticatedReceiver$.next(false);
mockedAddressReceiver$.next(false);
authenticatedReceiver$.next("0x5f7a009664B771E889751f4FD721aDc439033ECD");

const [onLoginNoType$, onLogoutNoType$] = partition(
  authenticated$,
  currentUser => Boolean(currentUser)
);

export const onLogin$ = onLoginNoType$.pipe(
  map(currentUser => currentUser as string),
  shareReplay(1)
);

const adminAddresses = ["0xCf057A4Ce6D27da5F0320D4e2A5b3deAF608971C"];

export const isAdmin$ = onLogin$
  .pipe(
    filter(authenticatedAddress =>
      adminAddresses.some(address =>
        compareString(authenticatedAddress, address)
      )
    )
  )
  .subscribe(() => {
    localStorage.setItem("IS_ADMIN", String(true));
  });

export const onLogout$ = onLogoutNoType$.pipe(
  map(currentUser => (currentUser as unknown) as false),
  share()
);

merge(onLogin$, onLogout$).subscribe(address => {
  const stringForm = address == false ? "" : address;
  try {
    vxm.ethBancor.onAuthChange(stringForm);
    vxm.ethWallet.setLoggedInAccount(stringForm);
  } catch (e) {
    console.error(e);
  }
});
