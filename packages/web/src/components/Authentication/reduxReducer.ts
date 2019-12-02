import {authenticationTypes, IAuthAction} from './reduxActions';

// ***** TypeScript ANNOTATIONS *****

export interface IAuthenticationStore {
    username?: string;
    access_token?: string;
    expires_in?: number;
    expires_at?: number;
    refresh_token?: string;
    token_type?: string;
}

// ***** TypeScript IMPLEMENTATION *****

const initialState: IAuthenticationStore = {};

export default function authentication(state = initialState as IAuthenticationStore, action: IAuthAction) {
    switch (action.type) {
        case authenticationTypes.LOGIN_REQUEST:
            return {...state, username: action.username} as IAuthenticationStore;
        case authenticationTypes.LOGIN_SUCCESS:
            return {...state, ...action.auth} as IAuthenticationStore;
        case authenticationTypes.TOKEN_RENEW_SUCCESS:
            return {...state, ...action.auth} as IAuthenticationStore;
        case authenticationTypes.LOGIN_FAILURE:
            return {};
        case authenticationTypes.LOGOUT:
            return {};
        default:
            return state;
    }
}
