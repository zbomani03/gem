import { PPATypes } from './actions';
import {IPPAGridAction} from "./gridActions";
import {IUOMObject, IResultObject} from "@agstudio/services/lib/models/warehouseAPIService";
import reducer, {IPPAGridStore} from './gridReducer';

describe('grid reducer', () => {

    const initialState: IPPAGridStore = {
        isLoading: false
    };
    const results: IResultObject = {
        DimensionValue: 'undefined',
        Stats: {
            TotalYield: 0,
            SumX: 0,
            SumX2: 0,
            Min: 0,
            Max: 0,
            NumberOfAcres: 0,
            NumberOfCropZones: 0,
            Mean: 0,
            StdDev: 0,
            HighMid: 0,
            LowMid: 0
        },
        ChildResults: {
            Dimension: {
                Name: '',
                CropZoneAcres: 0,
                CropZoneCount: 0,
                DataUse: '',
                SortColumn: 'NumberOfAcres',
                SortDirection: 'desc',
            },
            Results: []
        },
    }
    const successObject:IUOMObject = {
        UnitOfMeasure: 'bu/acre',
        Metric: 'Yield',
        TreatmentResults: {
            Dimension: {
                Name: 'SeedRate',
                DataUse: 'Measure',
                SortColumn: 'Mean',
                SortDirection: 'Descending',
                CropZoneCount: 0,
                CropZoneAcres: 0,
            },
            Results: [{...results}]
        },
    };

    const actions: any = {
        gridRequest: {
            type: PPATypes.grid.REQUEST
        } as IPPAGridAction,
        gridSuccess: {
            type: PPATypes.grid.SUCCESS,
            results: successObject
        } as IPPAGridAction,
        gridFailure: {
            type: PPATypes.grid.FAILURE
        } as IPPAGridAction,
        gridReset: {
            type: PPATypes.grid.RESET
        } as IPPAGridAction,
        gridToggleChildren: {
            type: PPATypes.grid.TOGGLE_CHILDREN,
            dimensionValue: '139000'
        } as IPPAGridAction,
        gridExpandAllChildren: {
            type: PPATypes.grid.TOGGLE_ALL_CHILDREN,
            showChildren: true
        } as IPPAGridAction,
        gridContractAllChildren: {
            type: PPATypes.grid.TOGGLE_ALL_CHILDREN,
            showChildren: false
        } as IPPAGridAction,
        gridSort: {
            type: PPATypes.grid.SORT,
            column: 'Mean',
            direction: 'Descending',
            dimensionValue: undefined
        } as IPPAGridAction
    }

    it('should set isLoading to true on grid request', () => {

        const expectedState: IPPAGridStore = {
            isLoading: true
        };

        // when making a request, should set isLoading to true.
        expect(reducer(initialState, actions.gridRequest)).toEqual(expectedState);
    });

    it('should load results and set isLoading to false on grid success', () => {

        const expectedState: IPPAGridStore = {
            ...initialState,
            results: {...successObject},
        };

        expect(reducer(initialState, actions.gridSuccess)).toEqual(expectedState);
    });

    it('should set isLoading to false on grid failure', () => {

        const expectedState: IPPAGridStore = {
            ...initialState
        }

        expect(reducer(initialState, actions.gridFailure)).toEqual(expectedState);
    })

    it('should set isLoading to false on grid reset', () => {

        const expectedState: IPPAGridStore = {
            ...initialState
        }

        expect(reducer(initialState, actions.gridReset)).toEqual(expectedState);
    })

    it('should toggle children', () => {

        const uomObject = {
            UnitOfMeasure: 'bu/acre',
            Metric: 'Yield',
            TreatmentResults: {
                Dimension: {
                    Name: 'SeedRate',
                    DataUse: 'Measure',
                    SortColumn: 'Mean',
                    SortDirection: 'Descending',
                    CropZoneCount: 0,
                    CropZoneAcres: 0,
                },
                Results: [{
                    ...results,
                    ...{ DimensionValue: '139000' }
                }]
            },
        }
        const previousState: IPPAGridStore = {
            ...initialState,
            results: { ...uomObject },
        };
        const data = (reducer(previousState, actions.gridToggleChildren));
        const toggledItem = data.results !== undefined && data.results.TreatmentResults.Results[0];
        
        expect(toggledItem.hasOwnProperty('showChildren')).toBe(true);
    })

    it('should expand/open all children', () => {

        const previousState: IPPAGridStore = {
            ...initialState,
            results: { ...successObject },
        };
        const data = reducer(previousState, actions.gridExpandAllChildren);
        const toggledItem:any = data.results !== undefined && data.results.TreatmentResults.Results[0];
        
        expect(toggledItem.showChildren).toBe(true);
    })

    it('should contract/close all children', () => {

        const previousState: IPPAGridStore = {
            ...initialState,
            results: { ...successObject },
        };
        const data = reducer(previousState, actions.gridContractAllChildren);
        const toggledItem:any = data.results !== undefined && data.results.TreatmentResults.Results[0];
        
        expect(toggledItem.showChildren).toBe(false);
    })

    it('should sort the grid column', () => {

        const previousState: IPPAGridStore = {
            ...initialState,
            results: { ...successObject },
        };
        const data:any = reducer(previousState, actions.gridSort);

        // SortColumn should change from 'NumberOfAcres' to 'Mean'...
        expect(data.results.TreatmentResults.Dimension.SortColumn).toEqual('Mean');
    })
});