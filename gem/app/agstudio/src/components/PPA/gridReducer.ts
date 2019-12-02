import { PPATypes } from './actions';
import orderBy from 'lodash/orderBy';
import {IPPAGridAction} from "./gridActions";
import {IResultObjectUI, IUOMObject} from "@agstudio/services/lib/models/warehouseAPIService";

// ***** TypeScript ANNOTATIONS *****

export interface IPPAGridStore {
    isLoading: boolean;
    results?: IUOMObject;
}

// ***** JavaScript IMPLEMENTATION *****

const sortGrid = (results:IResultObjectUI[], column: string, direction: any) => {
    return orderBy(results, column === "DimensionValue" ? [column] : [o => (o as any).Stats[column]], [direction]);
};

const sortFirstLevelGrid = (state:IPPAGridStore, action:IPPAGridAction) => {
    if (state.results === undefined || action.column === undefined || action.direction === undefined) {
        return state;
    }
    return {
        ...state,
        results: {
            ...state.results,
            TreatmentResults: {
                ...state.results.TreatmentResults,
                Results: sortGrid(state.results.TreatmentResults.Results, action.column, action.direction),
                Dimension: {
                    ...state.results.TreatmentResults.Dimension,
                    SortColumn: action.column,
                    SortDirection: action.direction
                }
            }
        }
    } as IPPAGridStore;
};

const sortSecondLevelGrid = (state:IPPAGridStore, action:IPPAGridAction) => {
    if (state.results === undefined) {
        return state;
    }
    return {
        ...state,
        results: {
            ...state.results,
            TreatmentResults: {
                ...state.results.TreatmentResults,
                Results: state.results.TreatmentResults.Results.map((item) => {
                    if (item.DimensionValue === action.dimensionValue && action.column && action.direction) {
                        item.ChildResults.Results = sortGrid(item.ChildResults.Results, action.column, action.direction);
                        item.ChildResults.Dimension.SortColumn = action.column;
                        item.ChildResults.Dimension.SortDirection = action.direction;
                    }
                    return item;
                })
            }
        }
    } as IPPAGridStore;
};

const toggleChildren = (state:IPPAGridStore, action:IPPAGridAction) => {
    if (state.results === undefined) {
        return state;
    }
    return {
        ...state,
        results: {
            ...state.results,
            TreatmentResults: {
                ...state.results.TreatmentResults,
                Results: state.results.TreatmentResults.Results.map((item) => {
                    if (action.dimensionValue !== undefined) {
                        if (item.DimensionValue === action.dimensionValue) {
                            item.showChildren = item.showChildren === undefined ? true : !item.showChildren;
                        }
                    } else {
                        item.showChildren = action.showChildren;
                    }
                    return item;
                })
            }
        }
    } as IPPAGridStore;
};

const initialState: IPPAGridStore = {
    isLoading: false
};

export default function grid(state = initialState, action: IPPAGridAction) {
    switch (action.type) {
        case PPATypes.grid.REQUEST:
            return {isLoading: true} as IPPAGridStore;
        case PPATypes.grid.SUCCESS:
            return {isLoading: false, results: action.results} as IPPAGridStore;
        case PPATypes.grid.FAILURE:
            return {isLoading: false} as IPPAGridStore;
        case PPATypes.grid.RESET:
            return {isLoading: false} as IPPAGridStore;
        case PPATypes.grid.TOGGLE_CHILDREN:
            // TODO This is NOT recursive. It works for now since we only are using 2 level grid.
            return toggleChildren(state, action);
        case PPATypes.grid.TOGGLE_ALL_CHILDREN:
            return toggleChildren(state, action);
        case PPATypes.grid.SORT:
            // TODO This is NOT recursive. It works for now since we only are using 2 level grid.
            return action.dimensionValue === undefined ? sortFirstLevelGrid(state, action) : sortSecondLevelGrid(state, action);
        default:
            return state;
    }
}
