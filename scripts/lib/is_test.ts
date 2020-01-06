const someValue = (x:any) => x !== undefined && x !== null;

export default {
  someValue,
  null: (x:any) => x === null,
  notNull: (x:any) => x !== null,
  someText: (x:any) => someValue(x) && x != ""
};
