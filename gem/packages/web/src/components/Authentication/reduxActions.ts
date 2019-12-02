import {identityAPIServiceFactory} from '@agstudio/services/lib/services/identityAPIService';
import {IAuthObjectUI, IIdentityAPIService} from '@agstudio/services/lib/models/identityAPIService';
import {notificationActions} from '../notificationActions';
import {featureFlagsActions} from "../featureFlagsActions";
import {Dispatch} from "redux";
import JWT from 'jwt-decode';
import {IntlShape} from 'react-intl';
import wrappedFetchFactory from "../../helpers/wrappedFetch";
import {FeatureFlagContext, FeatureFlagService} from "granular-ff-web-client";

// ***** TypeScript ANNOTATIONS *****

export interface IAuthAction {
    type: string;
    username?: string;
    auth?: IAuthObjectUI;
}

interface IToken {
    CNAME: string;
    amr: string[];
    aud: string;
    auth_time: number;
    client_id: string;
    email: string;
    exp: number;
    idp: string;
    iss: string;
    name: string;
    nbf: number;
    role: string[];
    scope: string[];
    sub: string;
}

// ***** TypeScript IMPLEMENTATION *****

export const authenticationTypes = {
    LOGIN_FAILURE: "AUTHENTICATION_LOGIN_FAILURE",
    LOGIN_REQUEST: "AUTHENTICATION_LOGIN_REQUEST",
    LOGIN_SUCCESS: "AUTHENTICATION_LOGIN_SUCCESS",
    TOKEN_RENEW_FAILURE: "AUTHENTICATION_TOKEN_RENEW_FAILURE",
    TOKEN_RENEW_REQUEST: "AUTHENTICATION_TOKEN_RENEW_REQUEST",
    TOKEN_RENEW_SUCCESS: "AUTHENTICATION_TOKEN_RENEW_SUCCESS",
    LOGOUT: "AUTHENTICATION_LOGOUT"
};

const login:any = (
    username: string,
    password: string,
    intl: IntlShape,
    JWTService:any = JWT,
    apiServiceFactory: (apiUrl: string, wrappedFetch: any) => IIdentityAPIService = identityAPIServiceFactory,
    flagService: any = FeatureFlagService
) => (dispatch:Dispatch, getState: () => any) => {
    const {authentication, app} = getState();
    const identityAPIService = apiServiceFactory(app.identityAPIUrl, wrappedFetchFactory(dispatch, authentication));
    dispatch({type: authenticationTypes.LOGIN_REQUEST, username} as IAuthAction);
    return identityAPIService.login(username, password).then(
        (auth: IAuthObjectUI) => {
            const featureFlagContext = new FeatureFlagContext("AgStudio", app.featureFlagEnvironment, auth.access_token, {username});
            const myFeatureFlagService = new flagService(featureFlagContext);
            myFeatureFlagService.loadFlags().then(() => {
                myFeatureFlagService.getFlags().then((allFlags: any) => {
                    dispatch(featureFlagsActions.save(allFlags));
                    dispatch({type: authenticationTypes.LOGIN_SUCCESS, auth} as IAuthAction);
                    dispatch(notificationActions.clearAll());
                    // Notify if some permission is missing
                    const tokenJSON:IToken = JWTService(auth.access_token);
                    if (tokenJSON.role.indexOf("AgStudioWarehouse") === -1 ||
                        tokenJSON.role.indexOf("AgStudioAPI") === -1 ||
                        tokenJSON.scope.indexOf("AgStudioApi.readonly") === -1 ||
                        tokenJSON.scope.indexOf("AgStudioApi.Warehouse") === -1) {
                        dispatch(notificationActions.warning(intl.formatMessage({id: "common.permissionsWarning"})));
                    }
                });
            });
        },
        () => {
            dispatch({type: authenticationTypes.LOGIN_FAILURE} as IAuthAction);
        }
    );
};

const renewToken:any = (
    apiServiceFactory: (apiUrl: string, wrappedFetch: any) => IIdentityAPIService = identityAPIServiceFactory
) => (dispatch:Dispatch, getState: () => any) => {
    const {authentication, app} = getState();
    const identityAPIService = apiServiceFactory(app.identityAPIUrl, wrappedFetchFactory(dispatch, authentication));
    if (authentication.refresh_token) {
        dispatch({type: authenticationTypes.TOKEN_RENEW_REQUEST} as IAuthAction);
        identityAPIService.renewToken(authentication.refresh_token).then(
            (auth: IAuthObjectUI) => {
                dispatch({type: authenticationTypes.TOKEN_RENEW_SUCCESS, auth} as IAuthAction);
            },
            () => {
                dispatch({type: authenticationTypes.TOKEN_RENEW_FAILURE} as IAuthAction);
            }
        );
    }
};

const logout = () => ({type: authenticationTypes.LOGOUT});

export const authenticationActions = {
    login,
    renewToken,
    logout
};
