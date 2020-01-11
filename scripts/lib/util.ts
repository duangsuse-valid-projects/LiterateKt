import is from './is_test'

export type Action = () => any
export type Consumer<T> = (it:T) => any
export type Producer<T> = () => T
export type Rewrite<T> = (old:T) => T
export type Show<T> = (item:T) => string
export type Predicate<T> = (it:T) => Boolean
export type Links<T> = (item:T) => Iterable<T>

export function negate<T>(p: Predicate<T>): Predicate<T>
  { return x => !p(x); }
export function or<T>(p: Predicate<T>, q: Predicate<T>): Predicate<T>
  { return x => p(x) || q(x); }
export function and<T>(p: Predicate<T>, q: Predicate<T>): Predicate<T>
  { return x => p(x) && q(x); }

export function iterableBy<T>(succ: Rewrite<T>): (init:T) => Iterable<T> {
  return function *(init) {
    for (let cur = init;
      is.someValue(succ(cur)); cur = succ(cur)) yield cur;
  };
}
export function iterator<T>(xs: Iterable<T>): Iterator<T> {
  return xs[Symbol.iterator]();
}
export function entries<T>(obj: {[s:string]:T}): Array<[string, T]> {
  if (is.someValue(Object.entries))
    return Object.entries(obj);
  else
    return Object.keys(obj).map(key => [key, obj[key]] );
}

export function preetyShowList(xs: Array<String>, sep = ", ", last_sep = " and ") {
  const last = xs.length-1;
  if (xs.length == 0 || xs.length == 1) return xs.join(sep);
  else return xs.slice(0, last).join(sep) + last_sep + xs[last];
}
export function showIfSome<T>(show: Show<T>, item: T): string {
  return is.someValue(item)? show(item) : "";
}

declare global {
  interface String {
    capitalize(): string
  }
  interface Object {
    getOrPut(key: string, init: Producer<any>): any
  }
}
String.prototype.capitalize = function(this: string): string {
  return showIfSomeLength(s => s[0].toUpperCase()+s.slice(1, s.length), this);
}
Object.prototype.getOrPut = function(this: any, key: string, init: Producer<any>): any {
  if (!is.someValue(this[key])) this[key] = init();
  return this[key];
}

export function showIfSomeLength(show: Show<string>, item: string): string;
export function showIfSomeLength(show: Show<Array<any>>, item: Array<any>): string;
export function showIfSomeLength(show: Show<any>, item: any): string {
  if (typeof item === "string")
    return is.someText(item)? show(item) : "";
  else
    return is.notEmpty(item)? show(item) : "";
}

export function makeScheduler(schedulePlace: any): (name:string, ...args:any) => void {
  const scheduleQueues: {[name:string]: Array<Array<any>>} = {};
  return (name:string, ...args:any) => { //begin
    let scheduleQueue = scheduleQueues.getOrPut(name, Array);
    let found: Function = schedulePlace[name];
    if (is.someValue(found)) {
      while (is.notEmpty(scheduleQueue)) found(...scheduleQueue.shift());
      /*and then call*/found(...args);
    }
    else scheduleQueue.push(args);
  }; //end
}

export function flatten<T>(xss: Array<Array<T>>): Array<T> {
  let flat = [];
  for (let xs of xss) flat.push(...xs);
  return flat;
}
/** Preorder walk of dependency tree, circular dependencies is not allowed. */
export function deepDependencies<T>(node: T, links: Links<T>): Array<T> {
  let dependencies: Array<T> = [...links(node)];
  if (is.empty(dependencies)) return []; //base:no-dependency
  else return flatten(dependencies.map(eDep => deepDependencies(eDep, links).concat(eDep)));
}
export function flatDependencies<T>(root: T, links: Links<T>): Array<T> {
  let addWithDepTodo: Array<T> = [...links(root)]; //data:bfs-queue
  let dependencySet: Set<T> = new Set();
  while (is.notEmpty(addWithDepTodo)) {
    let someNode = addWithDepTodo.shift();
    if (dependencySet.has(someNode)) {
      continue; // skip circular deps like a-b
    } else {
      dependencySet.add(someNode);
      let itsDepencencies = links(someNode);
      addWithDepTodo.push(...itsDepencencies);
    }
  }
  return [...dependencySet.values()];
}
