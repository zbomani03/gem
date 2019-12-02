import {combineReducers, Reducer} from "redux";
import {authenticationTypes} from '@agstudio/web/lib/components/Authentication/reduxActions';
import authentication, {IAuthenticationStore} from "@agstudio/web/lib/components/Authentication/reduxReducer";
import notifications, {INotificationStore} from "@agstudio/web/lib/components/notificationReducer";
import domain, {IDomainStore} from "@agstudio/web/lib/components/Domain/reduxReducer";
import app, {IAppStore} from "./appReducer";
import PPA, {IPPAStore} from "./components/PPA/reducer";
import {IFeatureFlagsStore} from "@agstudio/web/lib/components/featureFlagsReducer";
import featureFlags from "@agstudio/web/lib/components/featureFlagsReducer";

// ***** TypeScript ANNOTATIONS *****

export interface IReduxStore {
    authentication: IAuthenticationStore;
    app: IAppStore;
    featureFlags: IFeatureFlagsStore;
    notifications: INotificationStore[];
    domain: IDomainStore;
    PPA: IPPAStore;
}

// ***** TypeScript IMPLEMENTATION *****

const appReducer: Reducer = combineReducers({
    authentication,
    app,
    featureFlags,
    notifications,
    domain,
    PPA
});

const reducers: Reducer<IReduxStore> = (state, action) => {
    if (action.type === authenticationTypes.LOGOUT || (state && state.authentication && state.authentication.expires_at && state.authentication.expires_at - Date.now() <= 0)) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default reducers;
