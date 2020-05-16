import React, { useReducer } from "react";
import {
  Module,
  ComputedModule,
  ComputedProduct,
  NeededModule,
  Bench,
  BenchName,
} from "./model";
import { initModulesArr } from "../module";
import { toArray, ToArrayType, toObject } from "../helper";
import reducer from "./reducer";

const localStorageKey = "good-company-calculator";
const DataContext = React.createContext({});

export interface State {
  products: Record<string, ComputedProduct>;
  modules: Record<string, Module>;
  computedModules: Record<string, ComputedModule>;
}

export interface Action {
  type: ActionTypes;
  payload: any;
}

export enum ActionTypes {
  AddProduct,
  RemoveProduct,
  ChangeMultiplier,
  ComputeModules,
  UpdateBench,
}

const initialState = {
  products: {},
  modules: initModulesArr.reduce((acc: any, curr, i) => {
    if (i === 1) {
      acc = {
        [acc.name]: acc,
      };
    }
    acc[curr.name] = curr;
    return acc;
  }),
  computedModules: {},
};

const parseState = (item: object, Type: any, objectPath = "name") =>
  toObject(
    toArray(item).map((i) => Type.parse(i)),
    objectPath
  );

const getInitialState = () => {
  const dataStr = localStorage.getItem(localStorageKey);

  if (dataStr) {
    try {
      const { computedModules, modules, products } = JSON.parse(dataStr);
      return {
        computedModules: parseState(
          computedModules,
          ComputedModule,
          "module.name"
        ),
        modules: parseState(modules, Module),
        products: parseState(products, ComputedProduct, "module.name"),
      };
    } catch {
      return initialState;
    }
  }

  return initialState;
};

export interface ActionCreatorsType {
  addProduct(
    name: string,
    moduleObj: Record<string, number>,
    multiplier?: number
  ): null;
  changeMultiplier(name: string, value: number): null;
  computeModules(): null;
  updateBench(moduleName: string, bench: BenchName): null;
  removeProduct(name: string): null;
}

export interface DataContextType extends ActionCreatorsType {
  data: State;
}

const setActionCreators = (dispatch: any) => {
  const callDispatch = (type: ActionTypes, payload?: any) =>
    dispatch({ type, payload });

  return {
    addProduct: (name, moduleObj, multiplier = 1) => {
      const product = new Module(
        name,
        toArray(moduleObj, ToArrayType.Entries).map((m) => {
          const [nmName, nmAmount] = m;
          return new NeededModule(nmName, nmAmount);
        }),
        [new Bench(BenchName.AssemblyBench, 0.67)]
      );

      const computedProduct = new ComputedProduct(product, multiplier);

      callDispatch(ActionTypes.AddProduct, computedProduct);
    },
    changeMultiplier: (name, value) => {
      callDispatch(ActionTypes.ChangeMultiplier, { name, value });
    },
    computeModules: () => {
      callDispatch(ActionTypes.ComputeModules);
    },
    updateBench: (moduleName, bench) => {
      callDispatch(ActionTypes.UpdateBench, { moduleName, bench });
    },
    removeProduct: (name) => {
      callDispatch(ActionTypes.RemoveProduct, name);
    },
  } as ActionCreatorsType;
};

function DataProvider(props: any) {
  const [data, dispatch] = useReducer(reducer, getInitialState());
  const actionCreators: ActionCreatorsType = setActionCreators(dispatch);
  localStorage.setItem(localStorageKey, JSON.stringify(data));

  return (
    <DataContext.Provider value={{ data, dispatch, ...actionCreators }}>
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
