import {PPATypes} from './actions';
import {IPPAFiltersStore} from "./filtersReducer";
import {ActionCreator, Dispatch} from "redux";

// ***** TypeScript ANNOTATIONS *****

export interface IPPAFiltersAction {
    type: string;
    payload: IPPAFiltersStore;
}

// ***** TypeScript IMPLEMENTATION *****

const save:ActionCreator<any> = (payload: IPPAFiltersStore) => (dispatch:Dispatch) => {
    return new Promise(resolve => {
        resolve(dispatch({type: PPATypes.filters.SAVE, payload} as IPPAFiltersAction));
    });
};

export const filtersActions = {
    save
};
