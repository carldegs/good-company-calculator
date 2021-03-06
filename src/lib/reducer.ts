import { State, ActionTypes } from "./DataContext";
import { ComputedProduct } from "./model";
import { createComputedModules, deleteProperty } from "../helper";

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
    case ActionTypes.RemoveProduct:
      return {
        ...state,
        products: deleteProperty(state.products, payload),
      }
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
    case ActionTypes.FetchModules:
      return {
        ...state,
        modules: payload.modules,
        modulesUpdateDate: payload.updateDate,
      }
    default:
      return state;
  }
};

export default reducer;