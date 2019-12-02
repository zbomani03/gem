import {authenticationTypes, IAuthAction} from './reduxActions';
import reducer, {IAuthenticationStore} from './reduxReducer';

describe('notifications reducer', () => {

    const usernameObject:IAuthenticationStore = {
        username: "email@granular.ag"
    };

    const successObject:IAuthenticationStore = {
        access_token: "fake-access-token",
        expires_in: 0,
        expires_at: 0,
        refresh_token: "fake-refresh-token",
        token_type: "Bearer"
    };

    const actions: any = {
        loginRequest: {
            type: authenticationTypes.LOGIN_REQUEST,
            ...usernameObject
        } as IAuthAction,
        renewRequest: {
            type: authenticationTypes.TOKEN_RENEW_REQUEST
        } as IAuthAction,
        loginSuccess: {
            type: authenticationTypes.LOGIN_SUCCESS,
            auth: successObject
        } as IAuthAction,
        renewSuccess: {
            type: authenticationTypes.TOKEN_RENEW_SUCCESS,
            auth: successObject
        } as IAuthAction,
        loginFailure: {
            type: authenticationTypes.LOGIN_FAILURE
        } as IAuthAction,
        renewFailure: {
            type: authenticationTypes.TOKEN_RENEW_FAILURE
        } as IAuthAction,
        logout: {
            type: authenticationTypes.LOGOUT
        } as IAuthAction,
    };

    it('request login', () => {
        expect(reducer({}, actions.loginRequest)).toEqual(usernameObject);
    });

    it('request token renewal', () => {
        const previousState: IAuthenticationStore = {
            ...usernameObject,
            ...successObject
        };
        expect(reducer(previousState, actions.renewRequest)).toEqual(previousState);
    });

    it('success login', () => {
        const expectedState: IAuthenticationStore = {
            ...usernameObject,
            ...successObject
        };
        expect(reducer(usernameObject, actions.loginSuccess)).toEqual(expectedState);
    });

    it('success token renewal', () => {
        const previousState: IAuthenticationStore = {
            ...usernameObject,
            ...successObject
        };
        const expectedState: IAuthenticationStore = {
            ...usernameObject,
            ...successObject
        };
        expect(reducer(previousState, actions.renewSuccess)).toEqual(expectedState);
    });

    it('failure login attempt', () => {
        expect(reducer(usernameObject, actions.loginFailure)).toEqual({});
    });

    it('failure token renewal attempt', () => {
        const previousState: IAuthenticationStore = {
            ...usernameObject,
            ...successObject
        };
        expect(reducer(previousState, actions.renewFailure)).toEqual(previousState);
    });

    it('logout', () => {
        const previousState: IAuthenticationStore = {
            ...usernameObject,
            ...successObject
        };
        expect(reducer(previousState, actions.logout)).toEqual({});
    });

});