import { Subject, partition } from "rxjs";
import { distinctUntilChanged, share, map, filter } from "rxjs/operators";
import { compareString } from "../helpers";

export const authenticatedReceiver$ = new Subject<string | false>();

export const authenticated$ = authenticatedReceiver$.pipe(
  distinctUntilChanged(),
  map(() => "0x5f7a009664B771E889751f4FD721aDc439033ECD" as string | false),
  share()
);

const [onLoginNoType$, onLogoutNoType$] = partition(
  authenticated$,
  currentUser => Boolean(currentUser)
);

export const onLogin$ = onLoginNoType$.pipe(
  map(currentUser => currentUser as string),
  share()
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
  map(currentUser => currentUser as false),
  share()
);
