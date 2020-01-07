const someValue = (x:any) => x !== undefined && x !== null;
const someText = (x:any) => someValue(x) && x != "";
const empty = (xs:Array<any>) => xs.length == 0
const notEmpty = (xs:Array<any>) => xs.length != 0

export default {
  someValue,
  null: (x:any) => x === null, notNull: (x:any) => x !== null,
  someText,
  empty, notEmpty
};
