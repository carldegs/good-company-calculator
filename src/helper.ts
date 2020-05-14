export const sorter = (param: string) => {
  return (a: any, b: any) => a[param] - b[param];
}

export const stringifyEnum = (enumObj: any, value: any) => {
  const text: string = enumObj[value];
  return text.replace( /([A-Z])/g, " $1" );
}