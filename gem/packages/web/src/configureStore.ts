import {applyMiddleware, createStore, Middleware, Store} from "redux";
import thunkMiddleware from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';
import {localStorageService, sessionStorageService} from "./helpers/persistState";
import throttle from "lodash/throttle";
import logger from "./middleware/logger";

export default function configureStore(rootReducer: any, preloadedState?: any) {

    let middlewares: Middleware[] = [thunkMiddleware];

    if (process.env.NODE_ENV !== 'production') {
        middlewares = [...middlewares, logger];
    }

    const middlewareEnhancer = applyMiddleware(...middlewares as any);

    const enhancers = [middlewareEnhancer];
    const composedEnhancers = composeWithDevTools(...enhancers as any);

    const persistedLocalState = localStorageService.loadState();
    const persistedSessionState = sessionStorageService.loadState();
    const persistedState = Object.assign(persistedLocalState || {}, persistedSessionState || {});

    const store: Store = createStore(rootReducer, preloadedState || persistedState, composedEnhancers);

    store.subscribe(throttle(() => {
        const {authentication, app, featureFlags, ...rest} = store.getState();
        localStorageService.saveState({authentication, app, featureFlags});
        sessionStorageService.saveState(rest);
    }, 1000));

    window.addEventListener('storage', () => {
        sessionStorageService.saveState({});
        location.reload();
    });

    return store;

}
