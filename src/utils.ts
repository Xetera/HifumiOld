import { from, Observable, of, pipe, UnaryFunction } from "rxjs";
import { catchError, concatAll, filter, flatMap, map, partition, switchMap, takeWhile, tap } from "rxjs/operators";

export class CommandError extends Error {
  constructor(...args: any[]) {
    super(...args);
    Error.captureStackTrace(this, CommandError);
  }
}

export const filterAsync = <T>(promise: (input: T) => Promise<boolean>) => pipe(
  switchMap((val: T) => of([(val), promise(val)])),
  // @ts-ignore
  tap(([val, canPass]) => console.log(canPass)),
  // @ts-ignore
  filter(([val, canPass]) => canPass),
  // @ts-ignore
  map(([val]) => val),
) as UnaryFunction<Observable<T>, Observable<T>>;

export const filterAndHandle = <T>(funnel: (input: T) => boolean, handle: (input: T) => any) => pipe(
  filter((x: T) => funnel(x)),
  tap((x: T) => handle(x))
);

