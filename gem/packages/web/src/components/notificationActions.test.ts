import {notificationTypes, notificationActions, INotificationAction} from './notificationActions';

describe('notificationActions', () => {

    describe('actions', () => {

        const message:string = 'This is a notification.';
        const id:string = 'mock-uuid';

        it('should create an action to add a success notification', () => {
            const expectedAction:INotificationAction = {
                type: notificationTypes.SUCCESS,
                message
            };
            expect(notificationActions.success(message)).toEqual(expectedAction);
        });

        it('should create an action to add a warning notification', () => {
            const expectedAction:INotificationAction = {
                type: notificationTypes.WARNING,
                message
            };
            expect(notificationActions.warning(message)).toEqual(expectedAction);
        });

        it('should create an action to add a error notification', () => {
            const expectedAction:INotificationAction = {
                type: notificationTypes.ERROR,
                message
            };
            expect(notificationActions.error(message)).toEqual(expectedAction);
        });

        it('should create an action to delete a notification', () => {
            const expectedAction:INotificationAction = {
                type: notificationTypes.CLEAR,
                id
            };
            expect(notificationActions.clear(id)).toEqual(expectedAction);
        });

        it('should create an action to clear all the notifications', () => {
            const expectedAction:INotificationAction = {
                type: notificationTypes.CLEAR_ALL
            };
            expect(notificationActions.clearAll()).toEqual(expectedAction);
        });

    });

});