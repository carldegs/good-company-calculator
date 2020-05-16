import { State, ActionTypes } from "./DataContext";
import { ComputedProduct } from "./model";
import { createComputedModules } from "../helper";

const reducer = (state: State, action: any) => {
  const { payload, type } = action;
  switch (type) {
    case ActionTypes.AddProduct:
      return {
        ...state,
        products: {
          ...state.products,
          [(payload as ComputedProduct).module.name]: payload,
        }
      };
    case ActionTypes.ChangeMultiplier:
      return {
        ...state,
        products: {
          ...state.products,
          [payload.name]: state.products[payload.name].updateMultiplier(payload.value),
        }
      };
    case ActionTypes.ComputeModules:
      return {
        ...state,
        computedModules: createComputedModules(state),
      }
    case ActionTypes.UpdateBench:
      return {
        ...state,
        computedModules: {
          ...state.computedModules,
          [payload.moduleName]: state.computedModules[payload.moduleName].updateSelectedBench(payload.bench),
        }
      }
    default:
      return state;
  }
};

export default reducer;