import {PPATypes} from './actions';
import {warehouseAPIServiceFactory} from "@agstudio/services/lib/services/warehouseAPIService";
import {IDimensionObject, IWarehouseAPIService} from "@agstudio/services/lib/models/warehouseAPIService";
import {ActionCreator, Dispatch} from "redux";
import {IReduxStore} from "../../rootReducer";
import wrappedFetchFactory from "@agstudio/web/lib/helpers/wrappedFetch";
import {buildWarehouseFilters} from "../../helpers/dataTransforming";

// ***** TypeScript ANNOTATIONS *****

export interface IPPADimensionsAction {
    type: string;
    list?: IDimensionObject[];
    name?: string;
}

// ***** TypeScript IMPLEMENTATION *****

const getDimensions:ActionCreator<any> = (
    selectedDimension: string = "",
    firstList: boolean = false,
    serviceFactory: (apiUrl: string, wrappedFetch: any) => IWarehouseAPIService = warehouseAPIServiceFactory
) => (dispatch:Dispatch, getState: () => IReduxStore) => {

    const REQUEST = firstList ? PPATypes.dimensions.FIRST_LIST_REQUEST : PPATypes.dimensions.SECOND_LIST_REQUEST;
    const SUCCESS = firstList ? PPATypes.dimensions.FIRST_LIST_SUCCESS : PPATypes.dimensions.SECOND_LIST_SUCCESS;
    const FAILURE = firstList ? PPATypes.dimensions.FIRST_LIST_FAILURE : PPATypes.dimensions.SECOND_LIST_FAILURE;

    dispatch({type: REQUEST} as IPPADimensionsAction);

    const {authentication, app, domain, PPA} = getState();
    const warehouseAPIService = serviceFactory(app.warehouseAPIUrl, wrappedFetchFactory(dispatch, authentication));

    return warehouseAPIService.getDimensions(buildWarehouseFilters(domain, PPA.filters, PPA.dimensions)).then(
        (results) => {
            const name = (selectedDimension && results.some(d => d.Name === selectedDimension && d.CropZoneAcres > 0 && d.CropZoneCount > 0)) ? selectedDimension : "";
            return dispatch({type: SUCCESS, list: results as IDimensionObject[], name} as IPPADimensionsAction);
        },
        () => {
            dispatch({type: FAILURE} as IPPADimensionsAction);
        }
    );

};

const selectDimension:ActionCreator<any> = (name: string, firstList: boolean = true) => (dispatch:Dispatch) => {
    const SELECT = firstList ? PPATypes.dimensions.FIRST_LIST_SELECT : PPATypes.dimensions.SECOND_LIST_SELECT;
    return new Promise((resolve) => {
        resolve(dispatch({type: SELECT, name} as IPPADimensionsAction));
    });
};

const swapDimensions:ActionCreator<any> = () => (dispatch:Dispatch) => {
    return new Promise((resolve) => {
        resolve(dispatch({type: PPATypes.dimensions.SWAP} as IPPADimensionsAction));
    });
};

export const dimensionsActions = {
    getDimensions,
    selectDimension,
    swapDimensions
};
