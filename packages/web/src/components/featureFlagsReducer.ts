import {featureFlagsTypes, IFeatureFlagsAction} from './featureFlagsActions';

// ***** TypeScript ANNOTATIONS *****

export interface IFeatureFlagsStore {
    [name: string]: IFeatureFlagsObject;
}

export interface IFeatureFlagsObject {
    description: string;
    enabled: boolean;
    global_enabled: boolean;
    name: string;
    overwritten_by?: string;
}

// ***** JavaScript IMPLEMENTATION *****

const initialState: IFeatureFlagsStore = {};

export default function featureFlags(state = initialState as IFeatureFlagsStore, action: IFeatureFlagsAction) {
    switch (action.type) {
        case featureFlagsTypes.SAVE:
            return action.payload;
        case featureFlagsTypes.CLEAR:
            return {};
        default:
            return state;
    }
}
