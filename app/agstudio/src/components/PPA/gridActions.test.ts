import {PPATypes} from './actions';
import {gridActions} from './gridActions';
import {initialState as filterSate} from "./filtersReducer";
import {initialState as dimensionsState} from "./dimensionsReducer";
import {initialState as domain} from "@agstudio/web/lib/components/Domain/reduxReducer";
import {mockStore} from '@agstudio/web/lib/test/mockStore';
import {MockStore} from "redux-mock-store";

describe('gridActions', () => {

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
    const column = "randomColumn";
    const direction = "randomDirection";
    const dimensionValue = "randomValue";
    const showChildren = true;
    const gridList = {
        randomProp: 0
    };

    // Mock Services
    const mockWarehouseAPIServiceSuccess = () => ({
        getResults: (): Promise<any> => new Promise((resolve) => { resolve(gridList); })
    });
    const mockWarehouseAPIServiceFailure = () => ({
        getResults: (): Promise<any> => new Promise((resolve, reject) => { reject(); })
    });

    afterEach(() => {
        store.clearActions();
    });

    it('should create an action to load the grid successfully', () => {
        const expectedRequest = {
            type: PPATypes.grid.REQUEST
        };
        const expectedSuccess = {
            type: PPATypes.grid.SUCCESS,
            results: gridList
        };
        return store.dispatch(gridActions.getResults(mockWarehouseAPIServiceSuccess)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedSuccess);
        });
    });

    it('should create an action to load the grid and fail', () => {
        const expectedRequest = {
            type: PPATypes.grid.REQUEST
        };
        const expectedFail = {
            type: PPATypes.grid.FAILURE
        };
        return store.dispatch(gridActions.getResults(mockWarehouseAPIServiceFailure)).then(() => {
            const actualActions = store.getActions();
            expect(actualActions).toHaveLength(2);
            expect(actualActions).toContainEqual(expectedRequest);
            expect(actualActions).toContainEqual(expectedFail);
        });
    });

    it('should create an action to sort a column of the grid, top level and children', () => {
        const expectedActionParent = {
            type: PPATypes.grid.SORT,
            column,
            direction
        };
        const expectedActionChild = {
            type: PPATypes.grid.SORT,
            column,
            direction,
            dimensionValue
        };
        expect(gridActions.sort(column, direction)).toEqual(expectedActionParent);
        expect(gridActions.sort(column, direction, dimensionValue)).toEqual(expectedActionChild);
    });

    it('should create an action to reset the grid', () => {
        const expectedAction = {
            type: PPATypes.grid.RESET
        };
        expect(gridActions.reset()).toEqual(expectedAction);
    });

    it('should create an action to toggle a row children', () => {
        const expectedAction = {
            type: PPATypes.grid.TOGGLE_CHILDREN,
            dimensionValue
        };
        expect(gridActions.toggleChildren(dimensionValue)).toEqual(expectedAction);
    });

    it('should create an action to toggle all children', () => {
        const expectedAction = {
            type: PPATypes.grid.TOGGLE_ALL_CHILDREN,
            showChildren
        };
        expect(gridActions.toggleAllChildren(showChildren)).toEqual(expectedAction);
    });

});