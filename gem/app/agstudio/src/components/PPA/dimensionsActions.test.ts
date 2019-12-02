import {PPATypes} from './actions';
import {dimensionsActions} from './dimensionsActions';
import {initialState as filterSate} from "./filtersReducer";
import {initialState as dimensionsState} from "./dimensionsReducer";
import {initialState as domain} from "@agstudio/web/lib/components/Domain/reduxReducer";
import {mockStore} from '@agstudio/web/lib/test/mockStore';
import {MockStore} from "redux-mock-store";

describe('dimensionsActions', () => {

    // Mock data and store
    const store:MockStore = mockStore({
        app: {
            warehouseAPIUrl: ""
        },
        domain: domain,
        PPA: {
            filters: filterSate,
            dimensions: dimensionsState
        }
    });
    const dimensionsName = "randomName";
    const dimensionsList:any[] = [{
        Name: dimensionsName,
        CropZoneAcres: 1,
        CropZoneCount: 1
    }];

    // Mock Services
    const mockWarehouseAPIServiceSuccess = () => ({
        getDimensions: (): Promise<any> => new Promise((resolve) => { resolve(dimensionsList); })
    });
    const mockWarehouseAPIServiceFailure = () => ({
        getDimensions: (): Promise<any> => new Promise((resolve, reject) => { reject(); })
    });

    afterEach(() => {
        store.clearActions();
    });

    it('should create an action to load the first dimension list successfully', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.FIRST_LIST_REQUEST
        };
        const expectedSuccess = {
            type: PPATypes.dimensions.FIRST_LIST_SUCCESS,
            name: "",
            list: dimensionsList
        };
        return store.dispatch(dimensionsActions.getDimensions(false, true, mockWarehouseAPIServiceSuccess)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedSuccess);
        });
    });

    it('should create an action to load the first dimension list successfully and keep the selection', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.FIRST_LIST_REQUEST
        };
        const expectedSuccess = {
            type: PPATypes.dimensions.FIRST_LIST_SUCCESS,
            name: dimensionsName,
            list: dimensionsList
        };
        return store.dispatch(dimensionsActions.getDimensions(dimensionsName, true, mockWarehouseAPIServiceSuccess)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedSuccess);
        });
    });

    it('should create an action to load the first dimension list successfully and not keep the selection', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.FIRST_LIST_REQUEST
        };
        const expectedSuccess = {
            type: PPATypes.dimensions.FIRST_LIST_SUCCESS,
            name: "",
            list: dimensionsList
        };
        return store.dispatch(dimensionsActions.getDimensions("randomDimension", true, mockWarehouseAPIServiceSuccess)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedSuccess);
        });
    });

    it('should create an action to load the second dimension list successfully', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.SECOND_LIST_REQUEST
        };
        const expectedSuccess = {
            type: PPATypes.dimensions.SECOND_LIST_SUCCESS,
            name: "",
            list: dimensionsList
        };
        return store.dispatch(dimensionsActions.getDimensions(false, false, mockWarehouseAPIServiceSuccess)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedSuccess);
        });
    });

    it('should create an action to load the second dimension list successfully and keep de selection', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.SECOND_LIST_REQUEST
        };
        const expectedSuccess = {
            type: PPATypes.dimensions.SECOND_LIST_SUCCESS,
            name: dimensionsName,
            list: dimensionsList
        };
        return store.dispatch(dimensionsActions.getDimensions(dimensionsName, false, mockWarehouseAPIServiceSuccess)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedSuccess);
        });
    });

    it('should create an action to load the second dimension list successfully and not keep de selection', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.SECOND_LIST_REQUEST
        };
        const expectedSuccess = {
            type: PPATypes.dimensions.SECOND_LIST_SUCCESS,
            name: "",
            list: dimensionsList
        };
        return store.dispatch(dimensionsActions.getDimensions("randomDimension", false, mockWarehouseAPIServiceSuccess)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedSuccess);
        });
    });

    it('should create an action to load the first dimension list and fail', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.FIRST_LIST_REQUEST
        };
        const expectedFail = {
            type: PPATypes.dimensions.FIRST_LIST_FAILURE
        };
        return store.dispatch(dimensionsActions.getDimensions(false, true, mockWarehouseAPIServiceFailure)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedFail);
        });
    });

    it('should create an action to load the second dimension list and fail', () => {
        const expectedRequest = {
            type: PPATypes.dimensions.SECOND_LIST_REQUEST
        };
        const expectedFail = {
            type: PPATypes.dimensions.SECOND_LIST_FAILURE
        };
        return store.dispatch(dimensionsActions.getDimensions(false, false, mockWarehouseAPIServiceFailure)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedFail);
        });
    });

    it('should create an action to select the first dimension', () => {
        const expectedAction = [{
            type: PPATypes.dimensions.FIRST_LIST_SELECT,
            name: dimensionsName
        }];
        return store.dispatch(dimensionsActions.selectDimension(dimensionsName)).then(() => {
            expect(store.getActions()).toEqual(expectedAction);
        });
    });

    it('should create an action to select the second dimension', () => {
        const expectedAction = [{
            type: PPATypes.dimensions.SECOND_LIST_SELECT,
            name: dimensionsName
        }];
        return store.dispatch(dimensionsActions.selectDimension(dimensionsName, false)).then(() => {
            expect(store.getActions()).toEqual(expectedAction);
        });
    });

    it('should create an action to swap the dimensions', () => {
        const expectedAction = [{
            type: PPATypes.dimensions.SWAP
        }];
        return store.dispatch(dimensionsActions.swapDimensions()).then(() => {
            expect(store.getActions()).toEqual(expectedAction);
        });
    });

});