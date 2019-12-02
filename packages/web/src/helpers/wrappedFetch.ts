import fetch from 'cross-fetch';
import {authenticationTypes} from '../components/Authentication/reduxActions';
import {notificationActions} from "../components/notificationActions";
import {Dispatch} from "redux";

const wrappedFetch = (dispatch: Dispatch, authentication: any, url: string, params = {} as any) => {
    params.headers = Object.assign(
        {},
        params.hasOwnProperty("headers") && params.headers || {},
        {'Authorization': 'Bearer ' + authentication.access_token}
    );
    return fetch(url, params).then((response:any) => handleErrors(dispatch, response)).catch((error:any) => notifyError(dispatch, error));
};

const handleErrors = (dispatch: Dispatch, response:any) => {
    if (response.ok) {
        return response;
    }
    return response.json().then((error:any) => {
        if (response.status === 401) {
            dispatch({type: authenticationTypes.LOGOUT});
        }
        throw new Error(error.error_description || error.Message || error.message || error.error || "Unexpected internal server error.");
    });
};

const notifyError = (dispatch: Dispatch, error:any) => {
    dispatch(notificationActions.error(error.message as string));
};

const wrappedFetchFactory = (dispatch: Dispatch, authentication: any) => {
    return (url: string, params = {} as any) => wrappedFetch(dispatch, authentication, url, params);
};

export default wrappedFetchFactory;
