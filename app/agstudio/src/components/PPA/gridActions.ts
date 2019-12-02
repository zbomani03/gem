import {PPATypes} from './actions';
import {warehouseAPIServiceFactory} from "@agstudio/services/lib/services/warehouseAPIService";
import {IUOMObject, IWarehouseAPIService} from "@agstudio/services/lib/models/warehouseAPIService";
import {ActionCreator, Dispatch} from "redux";
import {IReduxStore} from "../../rootReducer";
import wrappedFetchFactory from "@agstudio/web/lib/helpers/wrappedFetch";
import {buildWarehouseFilters} from "../../helpers/dataTransforming";

// ***** TypeScript ANNOTATIONS *****

export interface IPPAGridAction {
    type: string;
    results?: IUOMObject;
    column?: string;
    direction?: string;
    dimensionValue?: string;
    showChildren?: boolean;
}

// ***** TypeScript IMPLEMENTATION *****

const getResults: ActionCreator<any> = (
    serviceFactory: (apiUrl: string, wrappedFetch: any) => IWarehouseAPIService = warehouseAPIServiceFactory
) => (dispatch: Dispatch, getState: () => IReduxStore) => {

    dispatch({type: PPATypes.grid.REQUEST} as IPPAGridAction);

    const {authentication, app, domain, PPA} = getState();
    const warehouseAPIService = serviceFactory(app.warehouseAPIUrl, wrappedFetchFactory(dispatch, authentication));

    return warehouseAPIService.getResults(buildWarehouseFilters(domain, PPA.filters, PPA.dimensions)).then(
        (results) => {
            dispatch({type: PPATypes.grid.SUCCESS, results: results as IUOMObject} as IPPAGridAction);
        },
        () => {
            dispatch({type: PPATypes.grid.FAILURE} as IPPAGridAction);
        }
    );

};

const sort = (column: string, direction: string, dimensionValue?: string) => ({type: PPATypes.grid.SORT, column, direction, dimensionValue});

const reset = () => ({type: PPATypes.grid.RESET} as IPPAGridAction);

const toggleChildren = (dimensionValue: string) => ({type: PPATypes.grid.TOGGLE_CHILDREN, dimensionValue} as IPPAGridAction);

const toggleAllChildren = (showChildren: boolean) => ({type: PPATypes.grid.TOGGLE_ALL_CHILDREN, showChildren} as IPPAGridAction);

export const gridActions = {
    sort,
    reset,
    toggleChildren,
    toggleAllChildren,
    getResults
};
