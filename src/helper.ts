export const sorter = (param: string) => {
  return (a: any, b: any) => a[param] - b[param];
}

export const stringifyEnum = (enumObj: any, value: any) => {
  const text: string = enumObj[value];
  return text.replace( /([A-Z])/g, " $1" );
}

export enum ToArrayType {
  Values,
  Keys,
  Entries,
}

export const toArray = (object: object, type: ToArrayType = ToArrayType.Values) => {
  switch (type) {
    case ToArrayType.Values:
      return Object.values(object);
    case ToArrayType.Keys:
      return Object.keys(object);
    case ToArrayType.Entries:
      return Object.entries(object);
  }
}