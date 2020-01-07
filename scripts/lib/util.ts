import is from './is_test';

export type Action = () => any
export type Consumer<T> = (it:T) => any
export type Rewrite<T> = (old:T) => T
export type Show<T> = (item:T) => string
export type Predicate<T> = (it:T) => Boolean

export function iterableBy<T>(succ: Rewrite<T>): (init:T) => Iterable<T> {
  return function *(init) {
    for (let cur = init;
      is.someValue(succ(cur)); cur = succ(cur)) yield cur;
  };
}
export function iterator<T>(xs: Iterable<T>): Iterator<T> {
  return xs[Symbol.iterator]();
}

export function negate<T>(p: Predicate<T>): Predicate<T>
  { return x => !p(x); }
export function or<T>(p: Predicate<T>, q: Predicate<T>): Predicate<T>
  { return x => p(x) || q(x); }
export function and<T>(p: Predicate<T>, q: Predicate<T>): Predicate<T>
  { return x => p(x) && q(x); }

export function preetyShowList(xs: Array<String>, sep = ", ", last_sep = " and ") {
  const last = xs.length-1;
  if (xs.length == 0 || xs.length == 1) return xs.join(sep);
  else return xs.slice(0, last).join(sep) + last_sep + xs[last];
}
export function showIfSome<T>(show: Show<T>, item: T): string {
  return is.someValue(item)? show(item) : "";
}

export function showIfSomeLength(show: Show<string>, item: string): string;
export function showIfSomeLength(show: Show<Array<any>>, item: Array<any>): string;
export function showIfSomeLength(show: Show<any>, item: any): string {
  if (typeof item === "string")
    return is.someText(item)? show(item) : "";
  else
    return is.notEmpty(item)? show(item) : "";
}

export function flatten<T>(xss: Array<Array<T>>): Array<T> {
  let flat = [];
  for (let xs of xss) flat.push(...xs);
  return flat;
}
