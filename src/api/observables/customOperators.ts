import { differenceWith, isEqual } from "lodash";
import { combineLatest, Observable } from "rxjs";
import {
  distinctUntilChanged,
  startWith,
  switchMap,
  tap,
  filter,
  scan,
  pluck,
  skip
} from "rxjs/operators";
import { compareString } from "../helpers";

export const combineLatestImmediate = <T>(
  observables: Observable<T>[]
): Observable<(T | undefined)[]> =>
  combineLatest(observables.map(obs => obs.pipe(startWith(undefined)))).pipe(
    skip(1)
  );

export interface RankItem<T> {
  priority: number;
  data: T;
}

export const rankPriority = () => <T>(source: Observable<RankItem<T>>) =>
  source.pipe(
    scan(
      (lastEmitted, value) => {
        const betterPriority =
          !lastEmitted.emittedOnce || value.priority < lastEmitted.lastPriority;

        return betterPriority
          ? {
              emit: true,
              emittedOnce: true,
              lastPriority: value.priority,
              toEmit: value.data
            }
          : {
              emit: false,
              emittedOnce: true,
              lastPriority: lastEmitted.lastPriority,
              toEmit: undefined
            };
      },
      {
        emit: false,
        emittedOnce: false,
        lastPriority: 0,
        toEmit: undefined
      } as {
        emit: boolean;
        emittedOnce: boolean;
        lastPriority: number;
        toEmit: undefined | T;
      }
    ),
    filter(emission => emission.emit),
    pluck("toEmit")
  ) as Observable<T>;

interface DataCache<T> {
  allEmissions: T[];
  newData: T[];
}

let difference = Date.now();

export const logger = <T>(label: string, hideReturn = false) => (
  source: Observable<T>
): Observable<T> =>
  source.pipe(
    tap({
      next: data => {
        if (difference) {
          difference = Date.now() - difference;
        }
        console.log(
          `Logger (Next): (${difference} ms): ${label} returned ${
            hideReturn
              ? Array.isArray(data)
                ? `${data.length} elements`
                : ""
              : JSON.stringify(data)
          }`
        );
        difference = Date.now();
      },
      error: error => {
        console.error(
          `Logger (Error): ${label} has received an error in ${error}`
        );
      },
      complete: () => console.log(`Logger (Complete): ${label} has completed`)
    })
  );

export const optimisticContract = (key: string) => (
  source: Observable<string>
) => {
  const cachedData = localStorage.getItem(key);

  if (cachedData) {
    return source.pipe(
      startWith(cachedData),
      distinctUntilChanged(compareString),
      tap(data => {
        const isSame = cachedData === data;
        if (!isSame) {
          localStorage.setItem(key, data);
        }
      })
    );
  } else {
    return source.pipe(
      distinctUntilChanged(compareString),
      tap(data => localStorage.setItem(key, data))
    );
  }
};

const getCachedPositions = (): string[] | false => {
  const cachedPositionIdsString = localStorage.getItem("positionIds");
  return cachedPositionIdsString
    ? (JSON.parse(cachedPositionIdsString) as string[])
    : false;
};

export const compareIdArray = (a: string[], b: string[]) => {
  const sameLength = a.length == b.length;
  const allFound = a.every(id => b.some(i => id == i));
  return sameLength && allFound;
};

export const optimisticPositionIds = () => (source: Observable<string[]>) => {
  const cachedPositionIds = getCachedPositions();
  if (cachedPositionIds) {
    return source.pipe(
      startWith(cachedPositionIds),
      tap(data => {
        const isSame = compareIdArray(data, cachedPositionIds);
        if (!isSame) {
          const hasContent = data.length > 0;
          if (hasContent) {
            localStorage.setItem("positionIds", JSON.stringify(data));
          } else {
            localStorage.removeItem("positionIds");
          }
        }
      })
    );
  } else {
    return source.pipe(
      tap(data => {
        const hasData = data.length > 0;
        if (hasData) {
          localStorage.setItem("positionIds", JSON.stringify(data));
        }
      })
    );
  }
};

export const switchMapIgnoreThrow = <T, Y>(
  switchMapProm: (data: T) => Promise<Y>
) => (source: Observable<T>): Observable<Y> =>
  source.pipe(
    switchMap(whatever =>
      switchMapProm(whatever).catch(() => ("DONT THROW" as unknown) as Y)
    ),
    filter(x => !(typeof x == "string" && x === "DONT THROW"))
  );

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

// Will emit stale data from cache
// Will overwrite cache with remote data

export const optimisticObservable = <T, Y>(
  localKey: string,
  remoteCall: (param: Y) => Promise<T>
) => (source: Observable<Y>): Observable<T> => {
  const localData = localStorage.getItem(localKey);
  if (localData) {
    const parsedData = JSON.parse(localData) as T;

    return source.pipe(
      switchMapIgnoreThrow(remoteCall),
      filter(remoteData => !isEqual(remoteData, parsedData)),
      startWith(parsedData),
      tap(data => {
        const isSame = isEqual(parsedData, data);
        if (!isSame) {
          console.log(
            "data is not the same! setting...",
            JSON.stringify(data),
            "from",
            parsedData
          );
          localStorage.setItem(localKey, JSON.stringify(data));
        } else {
          console.log("data is the same, setting");
        }
      })
    );
  } else {
    return source.pipe(
      switchMapIgnoreThrow(remoteCall),
      tap(data => {
        localStorage.setItem(localKey, JSON.stringify(data));
      })
    );
  }
};
