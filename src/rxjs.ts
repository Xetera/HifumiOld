import { from, Observable, of } from "rxjs";
import { partition, switchMap } from "rxjs/operators";

export const filterAndHandle = <K, T>(filter: (inc: K) => boolean, handle: (_: K) => T) =>
  (obs: Observable<K>) => {
    const [yes, no] = partition(filter)(obs);
    no.subscribe(handle);
    return yes;
  };

export const converge = <T>(input: T | Promise<T> | Observable<T>): Observable<T> => {
  if (input instanceof Promise) {
    return from(input);
  }
  if (input instanceof Observable) {
    return input;
  }
  return of(input);
};
