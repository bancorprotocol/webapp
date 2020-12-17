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
