import {notificationTypes, INotificationAction} from './notificationActions';
import reducer, {INotificationStore} from './notificationReducer';

jest.mock("uuid/v4", () => {
    return () => "mock-uuid";
});

describe('notifications reducer', () => {

    const oldNotification: INotificationStore = {
        message: 'Old error notification',
        color: "danger",
        id: "mock-uuid"
    };
    const notificationToClear: INotificationStore = {
        message: 'Old success notification',
        color: "success",
        id: "new-mock-uuid"
    };
    const actions: any = {
        success: {
            type: notificationTypes.SUCCESS,
            message: 'This is a success.'
        } as INotificationAction,
        warning: {
            type: notificationTypes.WARNING,
            message: 'This is a warning.'
        } as INotificationAction,
        error: {
            type: notificationTypes.ERROR,
            message: 'This is an error.'
        } as INotificationAction,
        clear: {
            type: notificationTypes.CLEAR,
            id: 'new-mock-uuid'
        } as INotificationAction,
        clear_all: {
            type: notificationTypes.CLEAR_ALL
        } as INotificationAction
    };

    it('adding a success notification to an empty state', () => {
        const expectedState: INotificationStore[] = [{
            message: 'This is a success.',
            color: "success",
            id: "mock-uuid"
        }];
        expect(reducer([], actions.success)).toEqual(expectedState);
    });

    it('adding a success notification to a non empty state', () => {
        const previousState: INotificationStore[] = [oldNotification];
        const expectedState: INotificationStore[] = [
            oldNotification,
            {
                message: 'This is a success.',
                color: "success",
                id: "mock-uuid"
            }
        ];
        expect(reducer(previousState, actions.success)).toEqual(expectedState);
    });

    it('adding a warning notification to an empty state', () => {
        const expectedState: INotificationStore[] = [{
            message: 'This is a warning.',
            color: "warning",
            id: "mock-uuid"
        }];
        expect(reducer([], actions.warning)).toEqual(expectedState);
    });

    it('adding a warning notification to a non empty state', () => {
        const previousState: INotificationStore[] = [oldNotification];
        const expectedState: INotificationStore[] = [
            oldNotification,
            {
                message: 'This is a warning.',
                color: "warning",
                id: "mock-uuid"
            }
        ];
        expect(reducer(previousState, actions.warning)).toEqual(expectedState);
    });

    it('adding an error notification to an empty state', () => {
        const expectedState: INotificationStore[] = [{
            message: 'This is an error.',
            color: "danger",
            id: "mock-uuid"
        }];
        expect(reducer([], actions.error)).toEqual(expectedState);
    });

    it('adding an error notification to a non empty state', () => {
        const previousState: INotificationStore[] = [oldNotification];
        const expectedState: INotificationStore[] = [
            oldNotification,
            {
                message: 'This is an error.',
                color: "danger",
                id: "mock-uuid"
            }
        ];
        expect(reducer(previousState, actions.error)).toEqual(expectedState);
    });

    it('clear one notification from an empty state', () => {
        expect(reducer([], actions.clear)).toEqual([]);
    });

    it('clear one notification from a non empty state without a match', () => {
        const previousState: INotificationStore[] = [oldNotification];
        expect(reducer(previousState, actions.clear)).toEqual(previousState);
    });

    it('clear one notification from one-notification state with a match', () => {
        const previousState: INotificationStore[] = [notificationToClear];
        expect(reducer(previousState, actions.clear)).toEqual([]);
    });

    it('clear one notification from a non empty state', () => {
        const previousState: INotificationStore[] = [notificationToClear, oldNotification];
        const expectedState: INotificationStore[] = [oldNotification];
        expect(reducer(previousState, actions.clear)).toEqual(expectedState);
    });

    it('clear all notifications from an empty state', () => {
        expect(reducer([], actions.clear_all)).toEqual([]);
    });

    it('clear all notifications from a non empty state', () => {
        const previousState: INotificationStore[] = [oldNotification];
        expect(reducer(previousState, actions.clear_all)).toEqual([]);
    });

});