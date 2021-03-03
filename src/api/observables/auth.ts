import { Subject, partition } from "rxjs";
import { distinctUntilChanged, share, map } from "rxjs/operators";

export const authenticatedReceiver$ = new Subject<string | false>();

export const authenticated$ = authenticatedReceiver$.pipe(
  distinctUntilChanged(),
  share()
);

authenticated$.subscribe(x => console.log(x, "was the derp"));

const [onLoginNoType$, onLogoutNoType$] = partition(
  authenticated$,
  currentUser => Boolean(currentUser)
);

export const onLogin$ = onLoginNoType$.pipe(
  map(currentUser => currentUser as string),
  share()
);

onLogin$.subscribe(x => console.log(x, "regular joe"));
onLogin$.subscribe(x => console.log(x, "regular joe 1"));

export const onLogout$ = onLogoutNoType$.pipe(
  map(currentUser => currentUser as false),
  share()
);
