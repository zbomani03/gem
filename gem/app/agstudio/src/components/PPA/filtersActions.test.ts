import {PPATypes} from './actions';
import {filtersActions} from './filtersActions';
import {mockStore} from '@agstudio/web/lib/test/mockStore';
import {MockStore} from "redux-mock-store";

describe('filtersActions', () => {

    // Mock data and store
    const store:MockStore = mockStore();
    const filters:any = {
        randomProp: 0
    };

    it('should create an action to save the filters', () => {
        const expectedAction = [{
            type: PPATypes.filters.SAVE,
            payload: filters
        }];
        return store.dispatch(filtersActions.save(filters)).then(() => {
            expect(store.getActions()).toEqual(expectedAction);
        });
    });

});