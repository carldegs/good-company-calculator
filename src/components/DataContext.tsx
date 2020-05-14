import React, { useReducer } from "react"
import { Module } from "../model";

export interface Product {
  name: string;
  modules: Record<string, number>;
}

export interface State {
  products: Product[],
  modules: Module[],
}

export interface Action {
  type: ActionTypes,
  payload: any,
}

export enum ActionTypes {
  AddProduct,
}

const initialState = {
  products: [] as Product[],
  modules: [] as Module[],
}

let reducer = (state: any, action: any) => {
  console.log(action);
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.AddProduct:
      return {
        ...state,
        products: [
          ...state.products,
          payload.product,
        ],
      }
    default:
      return state;
  }
};

const DataContext = React.createContext({});
function DataProvider(props: any) {
  const [data, dispatch] = useReducer(reducer, initialState);

  return (
    <DataContext.Provider value={{ data, dispatch }}>
      {props.children}
    </DataContext.Provider>
  )
}

export { DataContext, DataProvider };
