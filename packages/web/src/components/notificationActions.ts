// ***** TypeScript ANNOTATIONS *****

export interface INotificationAction {
    type: string;
    id?: string;
    message?: string;
}

// ***** TypeScript IMPLEMENTATION *****

export const notificationTypes = {
    SUCCESS: "NOTIFICATION_SUCCESS",
    WARNING: "NOTIFICATION_WARNING",
    ERROR: "NOTIFICATION_ERROR",
    CLEAR: "NOTIFICATION_CLEAR",
    CLEAR_ALL: "NOTIFICATION_CLEAR_ALL"
};

const success = (message: string) => ({type: notificationTypes.SUCCESS, message} as INotificationAction);

const warning = (message: string) => ({type: notificationTypes.WARNING, message} as INotificationAction);

const error = (message: string) => ({type: notificationTypes.ERROR, message} as INotificationAction);

const clear = (id: string) => ({type: notificationTypes.CLEAR, id} as INotificationAction);

const clearAll = () => ({type: notificationTypes.CLEAR_ALL} as INotificationAction);

export const notificationActions = {
    success,
    warning,
    error,
    clear,
    clearAll
};
