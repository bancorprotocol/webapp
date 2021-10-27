import { vxm } from "@/store";
import { combineLatest, partition, merge, BehaviorSubject } from "rxjs";
import { distinctUntilChanged, share, map, shareReplay } from "rxjs/operators";

export const authenticatedReceiver$ = new BehaviorSubject<string | false>(
  false
);

export const authenticated$ = combineLatest([authenticatedReceiver$]).pipe(
  map(([authenticated]) => authenticated),
  distinctUntilChanged(),
  share()
);

const [onLoginNoType$, onLogoutNoType$] = partition(
  authenticated$,
  currentUser => Boolean(currentUser)
);

export const onLogin$ = onLoginNoType$.pipe(
  map(currentUser => currentUser as string),
  shareReplay(1)
);

export const onLogout$ = onLogoutNoType$.pipe(
  map(currentUser => currentUser as unknown as false),
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
