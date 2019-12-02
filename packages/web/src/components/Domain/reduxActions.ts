import {IDomainStore} from "./reduxReducer";
import {ActionCreator, Dispatch} from "redux";

// ***** TypeScript ANNOTATIONS *****

export interface IDomainAction {
    type: string;
    payload: IDomainStore;
}

// ***** TypeScript IMPLEMENTATION *****

export const domainTypes = {
    SAVE: "DOMAIN_SAVE"
};

const save:ActionCreator<any> = (payload: IDomainStore) => (dispatch:Dispatch) => {
    return new Promise(resolve => {
        resolve(dispatch({type: domainTypes.SAVE, payload} as IDomainAction));
    });
};

export const domainActions = {
    save
};
