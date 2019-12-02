import { PPATypes } from './actions';
import {IPPADimensionsAction} from "./dimensionsActions";
import {IDimensionObject} from "@agstudio/services/lib/models/warehouseAPIService";

// ***** TypeScript ANNOTATIONS *****

interface IPPADimensionsStoreList {
    isLoading: boolean;
    selected: string;
    list: IDimensionObject[];
}

export interface IPPADimensionsStore {
    firstList: IPPADimensionsStoreList;
    secondList: IPPADimensionsStoreList;
}

// ***** JavaScript IMPLEMENTATION *****

export const initialState: IPPADimensionsStore = {
    firstList: {
        isLoading: false,
        selected: "",
        list: []
    },
    secondList: {
        isLoading: false,
        selected: "",
        list: []
    }
};

const swapDimensions = (state: IPPADimensionsStore) => {
    const secondList = state.secondList.list.filter(
        (d) => d.Name !== state.secondList.selected
    ).concat(
        state.firstList.list.filter(
            (d) => d.Name === state.firstList.selected
        )
    );
    return {
        firstList: {
            ...state.firstList,
            selected: state.secondList.selected
        },
        secondList: {
            ...state.secondList,
            selected: state.firstList.selected,
            list: secondList
        }
    } as IPPADimensionsStore;
};

export default function dimensions(state = initialState as IPPADimensionsStore, action: IPPADimensionsAction) {
    switch (action.type) {
        case PPATypes.dimensions.FIRST_LIST_REQUEST:
            return {firstList: {isLoading: true, selected: "", list: []}, secondList: {isLoading: false, selected: "", list: []}} as IPPADimensionsStore;
        case PPATypes.dimensions.FIRST_LIST_SUCCESS:
            return {...state, firstList: {isLoading: false, selected: action.name, list: action.list}} as IPPADimensionsStore;
        case PPATypes.dimensions.FIRST_LIST_FAILURE:
            return {...state, firstList: {...state.firstList, isLoading: false}} as IPPADimensionsStore;
        case PPATypes.dimensions.FIRST_LIST_SELECT:
            return {firstList: {...state.firstList, selected: action.name}, secondList: {isLoading: false, selected: "", list: []}} as IPPADimensionsStore;
        case PPATypes.dimensions.SECOND_LIST_REQUEST:
            return {...state, secondList: {isLoading: true, selected: "", list: []}} as IPPADimensionsStore;
        case PPATypes.dimensions.SECOND_LIST_SUCCESS:
            return {...state, secondList: {isLoading: false, selected: action.name, list: action.list}} as IPPADimensionsStore;
        case PPATypes.dimensions.SECOND_LIST_FAILURE:
            return {...state, secondList: {...state.secondList, isLoading: false}} as IPPADimensionsStore;
        case PPATypes.dimensions.SECOND_LIST_SELECT:
            return {...state, secondList: {...state.secondList, selected: action.name}} as IPPADimensionsStore;
        case PPATypes.dimensions.SWAP:
            return swapDimensions(state) as IPPADimensionsStore;
        default:
            return state;
    }
}
