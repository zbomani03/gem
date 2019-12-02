import v4 from "uuid/v4";
import {notificationTypes, INotificationAction} from '../components/notificationActions';

// ***** TypeScript ANNOTATIONS *****

export interface INotificationStore {
    id: string;
    color: string;
    message: string;
}

// ***** JavaScript IMPLEMENTATION *****

const initialState: INotificationStore[] = [];

export default function notifications(state = initialState as INotificationStore[], action: INotificationAction) {
    switch (action.type) {
        case notificationTypes.SUCCESS:
            return [
                ...state,
                {
                    id: v4(),
                    color: 'success',
                    message: action.message
                } as INotificationStore];
        case notificationTypes.WARNING:
            return [
                ...state,
                {
                    id: v4(),
                    color: 'warning',
                    message: action.message
                } as INotificationStore];
        case notificationTypes.ERROR:
            return [
                ...state,
                {
                    id: v4(),
                    color: 'danger',
                    message: action.message
                } as INotificationStore];
        case notificationTypes.CLEAR:
            return state.filter((item:INotificationStore) => item.id !== action.id);
        case notificationTypes.CLEAR_ALL:
            return [];
        default:
            return state;
    }
}
