const someValue = (x:any) => x !== undefined && x !== null;
const empty = (xs:Array<any>) => xs.length == 0
const notEmpty = (xs:Array<any>) => xs.length != 0

export default {
  someValue,
  null: (x:any) => x === null, notNull: (x:any) => x !== null,
  someText: (x:any) => someValue(x) && x != "",
  empty, notEmpty
};
