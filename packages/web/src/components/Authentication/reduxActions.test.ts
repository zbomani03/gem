import {authenticationTypes, authenticationActions} from "./reduxActions";
import {notificationTypes} from '../notificationActions';
import {IAuthObjectUI} from '@agstudio/services/lib/models/identityAPIService';
import {mockStore} from '../../test/mockStore';
import {MockStore} from "redux-mock-store";
import {featureFlagsTypes} from "../featureFlagsActions";

describe('authenticationActions', () => {

    const store:MockStore = mockStore(
        {
            app: {
                identityAPIUrl: "",
                featureFlagEnvironment: "granappdevelopment"
            },
            authentication: {
                refresh_token: "fake_token"
            }
        }
    );
    const username = 'fake_username';
    const password = 'fake_password';
    const message = 'some message';
    const flags = {
        key: "value"
    };
    const successResponse: IAuthObjectUI = {
        access_token: 'fake_access_token',
        expires_in: 0,
        expires_at: 0,
        refresh_token: '',
        token_type: ''
    };

    const mockFlagService:any = () => ({
        loadFlags: (): Promise<void> => new Promise(resolve => { resolve(); }),
        getFlags: (): Promise<any> => new Promise(resolve => { resolve(flags); })
    });

    const mockUsersServiceSuccess:any = () => ({
        login: (): Promise<IAuthObjectUI> => new Promise(resolve => { resolve(successResponse); }),
        renewToken: (): Promise<IAuthObjectUI> => new Promise(resolve => { resolve(successResponse); })
    });

    const mockUsersServiceFailure:any = () => ({
        login: (): Promise<any> => new Promise((resolve, reject) => { reject(); }),
        renewToken: (): Promise<any> => new Promise((resolve, reject) => { reject(); })
    });

    const mockIntl:any = {
        formatMessage: () => message
    };

    const validJWT = () => ({
        scope: ["AgStudioApi.readonly","AgStudioApi.Warehouse"],
        role: ["AgStudioWarehouse","AgStudioAPI"]
    });

    const invalidJWT = () => ({
        scope: [],
        role: []
    });

    afterEach(() => {
        store.clearActions();
    });

    describe('logout', () => {
        beforeEach(() => {
            store.dispatch(authenticationActions.logout());
        });
        test('LOGOUT', () => {
            const expectedAction = {
                type: authenticationTypes.LOGOUT,
            };
            expect(store.getActions()).toContainEqual(expectedAction);
        });
    });

    describe('login (no warning)', () => {
        describe('success', () => {
            beforeEach(async () => {
                await store.dispatch(authenticationActions.login(username, password, mockIntl, validJWT, mockUsersServiceSuccess, mockFlagService));
            });

            test('dispatched the correct actions', () => {
                const expectedRequest = {
                    type: authenticationTypes.LOGIN_REQUEST,
                    username
                };
                const expectedFlags = {
                    type: featureFlagsTypes.SAVE,
                    payload: flags
                };
                const expectedSuccess = {
                    type: authenticationTypes.LOGIN_SUCCESS,
                    auth: successResponse
                };
                const expectedClear = {
                    type: notificationTypes.CLEAR_ALL
                };

                const actualActions = store.getActions();
                expect(actualActions).toHaveLength(4);
                expect(actualActions).toContainEqual(expectedRequest);
                expect(actualActions).toContainEqual(expectedFlags);
                expect(actualActions).toContainEqual(expectedSuccess);
                expect(actualActions).toContainEqual(expectedClear);
            });
        });

        describe('success (with warning)', () => {
            beforeEach(async () => {
                await store.dispatch(authenticationActions.login(username, password, mockIntl, invalidJWT, mockUsersServiceSuccess, mockFlagService));
            });

            test('dispatched the correct actions', () => {
                const expectedRequest = {
                    type: authenticationTypes.LOGIN_REQUEST,
                    username
                };
                const expectedFlags = {
                    type: featureFlagsTypes.SAVE,
                    payload: flags
                };
                const expectedSuccess = {
                    type: authenticationTypes.LOGIN_SUCCESS,
                    auth: successResponse
                };
                const expectedClear = {
                    type: notificationTypes.CLEAR_ALL
                };
                const expectedWarning = {
                    type: notificationTypes.WARNING,
                    message: message
                };

                const actualActions = store.getActions();
                expect(actualActions).toHaveLength(5);
                expect(actualActions).toContainEqual(expectedRequest);
                expect(actualActions).toContainEqual(expectedFlags);
                expect(actualActions).toContainEqual(expectedSuccess);
                expect(actualActions).toContainEqual(expectedClear);
                expect(actualActions).toContainEqual(expectedWarning);
            });
        });

        describe('failure', () => {
            beforeEach(async () => {
                await store.dispatch(authenticationActions.login(username, password, mockIntl, validJWT, mockUsersServiceFailure, mockFlagService));
            });

            test('dispatched the correct actions', () => {
                const expectedRequest = {
                    type: authenticationTypes.LOGIN_REQUEST,
                    username
                };
                const expectedFailure = {
                    type: authenticationTypes.LOGIN_FAILURE
                };

                const actualActions = store.getActions();
                expect(actualActions).toHaveLength(2);
                expect(actualActions).toContainEqual(expectedRequest);
                expect(actualActions).toContainEqual(expectedFailure);
            });
        });
    });

    describe('token renewal', () => {
        describe('success', () => {
            beforeEach(async () => {
                await store.dispatch(authenticationActions.renewToken(mockUsersServiceSuccess));
            });

            test('dispatched the correct actions', () => {
                const expectedRequest = {
                    type: authenticationTypes.TOKEN_RENEW_REQUEST
                };
                const expectedSuccess = {
                    type: authenticationTypes.TOKEN_RENEW_SUCCESS,
                    auth: successResponse
                };
                const actualActions = store.getActions();
                expect(actualActions).toHaveLength(2);
                expect(actualActions).toContainEqual(expectedRequest);
                expect(actualActions).toContainEqual(expectedSuccess);
            });
        });

        describe('failure', () => {
            beforeEach(async () => {
                await store.dispatch(authenticationActions.renewToken(mockUsersServiceFailure));
            });

            test('dispatched the correct actions', () => {
                const expectedRequest = {
                    type: authenticationTypes.TOKEN_RENEW_REQUEST
                };
                const expectedFailure = {
                    type: authenticationTypes.TOKEN_RENEW_FAILURE
                };

                const actualActions = store.getActions();
                expect(actualActions).toHaveLength(2);
                expect(actualActions).toContainEqual(expectedRequest);
                expect(actualActions).toContainEqual(expectedFailure);
            });
        });
    });
});
