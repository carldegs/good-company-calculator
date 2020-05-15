import React, { useReducer } from "react";
import { Module } from "../model";
import { initModulesArr } from "../module";
import ProductsTable from "../MainPage/ProductsTable";

export interface Product {
  name: string;
  modules: Record<string, number>;
  multiplier: number;
}

export interface State {
  products: Record<string, Product>;
  modules: Record<string, Module>;
}
export interface Action {
  type: ActionTypes;
  payload: any;
}

export enum ActionTypes {
  AddProduct,
  ChangeMultiplier,
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
};

let reducer = (state: any, action: any) => {
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.AddProduct:
      return {
        ...state,
        products: {
          ...state.products,
          [payload.product.name]: payload.product,
        }
      };
    case ActionTypes.ChangeMultiplier:
      return {
        ...state,
        products: {
          ...state.products,
          [payload.name]: {
            ...state.products[payload.name],
            multiplier: Number(payload.value),
          }
        }
      };
    default:
      return state;
  }
};

export interface ActionCreatorsType {
  addProduct(product: Product): null;
  changeMultiplier(name: string, value: number): null;
}
export interface DataContextType extends ActionCreatorsType {
  data: State;
}

const localStorageKey = 'good-company-calculator';
const DataContext = React.createContext({});
const getInitialState = () => {
  const dataStr = localStorage.getItem(localStorageKey);

  if (dataStr) {
    try {
      return JSON.parse(dataStr);
    } catch {
      return initialState;
    }
  }

  return initialState;
}
function DataProvider(props: any) {
  const [data, dispatch] = useReducer(reducer, getInitialState());

  const actionCreators = {
    addProduct: product => {
      if (!product.multiplier) {
        product.multiplier = 1;
      }

      dispatch({
        type: ActionTypes.AddProduct,
        payload: {
          product
        }
      })
    },
    changeMultiplier: (name, value) => {
      dispatch({
        type: ActionTypes.ChangeMultiplier,
        payload: { name, value },
      });
    },
  } as ActionCreatorsType;

  localStorage.setItem(localStorageKey, JSON.stringify(data));

  return (
    <DataContext.Provider value={{ data, dispatch, ...actionCreators }}>
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
