import {combineReducers} from 'redux';
import filters, {IPPAFiltersStore} from "./filtersReducer";
import dimensions, {IPPADimensionsStore} from "./dimensionsReducer";
import grid, {IPPAGridStore} from "./gridReducer";

// ***** TypeScript ANNOTATIONS *****

export interface IPPAStore {
    filters: IPPAFiltersStore;
    dimensions: IPPADimensionsStore;
    grid: IPPAGridStore;
}

// ***** TypeScript IMPLEMENTATION *****

export default combineReducers<IPPAStore>({
    filters,
    dimensions,
    grid
});
