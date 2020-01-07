import { Predicate } from './util'

export class Peek<T> implements Iterator<T> {
  iter: Iterator<T>
  last: IteratorResult<T>
  constructor(iter: Iterator<T>) {
    this.iter = iter;
    this.last = iter.next()
  }
  get hasPeek() {
    return !this.last.done;
  }
  get peek() {
    return this.last.value;
  }
  next() {
    let oldLast = this.last;
    this.last = this.iter.next();
    return oldLast.value; //once more when iter has finished
  }
  toString() {
    return `Peek(${this.peek}..${this.iter})`;
  }
}
export function *peekWhile<T>(p: Predicate<T>, xs: Peek<T>) {
  while (xs.hasPeek && p(xs.peek))
    { yield xs.next(); }
}

class PartialIterable<T> implements Iterable<T> {
  iter: Iterator<T>
  constructor(iter: Iterator<T>) {
    this.iter = iter;
  }
  [Symbol.iterator]() {
    return this.iter;
  }
}
export function partialIterate<T>(iter: Iterator<T>): Iterable<T> {
  return new PartialIterable(iter);
}
