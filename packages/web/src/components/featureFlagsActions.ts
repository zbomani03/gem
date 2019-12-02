import {IFeatureFlagsStore} from "./featureFlagsReducer";

// ***** TypeScript ANNOTATIONS *****

export interface IFeatureFlagsAction {
    type: string;
    payload?: IFeatureFlagsStore;
}

// ***** TypeScript IMPLEMENTATION *****

export const featureFlagsTypes = {
    SAVE: "FEATURE_FLAGS_SAVE",
    CLEAR: "FEATURE_FLAGS_CLEAR"
};

const save = (payload: IFeatureFlagsStore) => ({type: featureFlagsTypes.SAVE, payload} as IFeatureFlagsAction);

const clear = () => ({type: featureFlagsTypes.CLEAR} as IFeatureFlagsAction);

export const featureFlagsActions = {
    save,
    clear
};
