import { State } from "./lib/DataContext";
import {
  ComputedModule,
  ComputedProduct,
  NeededModule,
  Module,
  ParentModule,
  FlatComputedProduct,
} from "./lib/model";

export const sorter = (param: string) => {
  return (a: any, b: any) => a[param] - b[param];
};

export const stringifyEnum = (enumObj: any, value: any) => {
  const text: string = enumObj[value];
  return text.replace(/([A-Z])/g, " $1");
};

export enum ToArrayType {
  Values,
  Keys,
  Entries,
}

export const toArray = (
  object: object,
  type: ToArrayType = ToArrayType.Values
) => {
  switch (type) {
    case ToArrayType.Values:
      return Object.values(object);
    case ToArrayType.Keys:
      return Object.keys(object);
    case ToArrayType.Entries:
      return Object.entries(object);
  }
};

export const toObject = (array: any[], path: string = "name") => {
  let res: any = {};

  array.forEach((item) => {
    let parts = path.split(".");
    let obj = item;

    let part = parts.shift();
    while (!!part) {
      obj = obj[part];
      part = parts.shift();
    }

    res[obj] = item;
  });

  return res;
};

export const objectToType = (object: object, Type: any) => {
  return Type.parse(object);
};

export const createComputedModules = (
  state: State
): Record<string, ComputedModule> => {
  let res: any = {};
  const { products, modules } = state;

  for (let product of toArray(products)) {
    product = (product as ComputedProduct).flatten();
    const { neededModules } = product;

    res = recursion(res, modules, neededModules, "", product);
  }

  return res;
};

const recursion = (
  res: any,
  modules: Record<string, Module>,
  neededModules: NeededModule[],
  parentName: string,
  product: FlatComputedProduct
) => {
  for (let neededModule of neededModules as NeededModule[]) {
    const { name, amount: amountNeeded } = neededModule;
    const parentModule = new ParentModule(
      parentName,
      product.name,
      amountNeeded * product.multiplier
    );

    const module = modules[name] as Module;

    if (!res[name]) {
      const computedModule = new ComputedModule(module, [parentModule]);

      res[name] = computedModule;
    } else {
      res[name] = (res[name] as ComputedModule).addParent(parentModule);
    }

    recursion(res, modules, module.neededModules, module.name, product);
  }

  return res;
};

export const deleteProperty = (object: Record<string, any>, property: string): Record<string, any> => {
  let newObject = {...object};
  delete newObject[property];
  return newObject;
}