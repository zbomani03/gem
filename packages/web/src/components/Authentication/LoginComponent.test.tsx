import * as React from "react";
import LoginComponent from "./LoginComponent";
import {INotificationStore} from "../notificationReducer";
import {IAuthenticationStore} from "./reduxReducer";
import { shallowWithIntl } from '../../test/intl-enzyme-test-helper';

describe('<LoginComponent>', () => {

    let authentication: IAuthenticationStore = {};
    const notifications: INotificationStore[] = [];
    const clearNotification = jest.fn();
    const login = jest.fn();
    const location = {};
    const values = {};
    const actions = {};

    test('renders without crashing', () => {
        shallowWithIntl(<LoginComponent location={location} authentication={authentication} notifications={notifications} clearNotification={clearNotification} login={login}/>);
    });

    describe('when the user is not logged in', () => {
        beforeEach(() => {
            authentication = {};
        });
        test('does not redirect', () => {
            const component = shallowWithIntl(<LoginComponent location={location} authentication={authentication} notifications={notifications} clearNotification={clearNotification} login={login}/>);
            expect(component.find('Redirect')).toHaveLength(0);
        });

        describe('with error notification', () => {
            beforeEach(() => {
                notifications.push({id: 'fake-id', color: 'error', message: 'fake_message'});
            });
            test('renders differently', () => {
                const component = shallowWithIntl(<LoginComponent location={location} authentication={authentication} notifications={notifications} clearNotification={clearNotification} login={login}/>);
                expect(component).toMatchSnapshot();
            });
        });

        describe('with info notification', () => {
            beforeEach(() => {
                notifications.push({id: 'fake-id', color: 'info', message: 'fake_message'});
            });
            test('renders differently', () => {
                const component = shallowWithIntl(<LoginComponent location={location} authentication={authentication} notifications={notifications} clearNotification={clearNotification} login={login}/>);
                expect(component).toMatchSnapshot();
            });
        });

        describe('clicking the login button', () => {
            const component = shallowWithIntl(<LoginComponent location={location} authentication={authentication} notifications={notifications} clearNotification={clearNotification} login={login}/>);
            describe('with username and password entered', () => {
                beforeEach(() => {
                    component.dive().dive().find('Formik').simulate('submit', {values, actions});
                });
                test('invokes the callback', () => {
                    expect(login).toBeCalled();
                });
            });
        });
    });

    describe('when the user is logged in', () => {
        beforeEach(() => {
            authentication = {
                access_token: "fake_access_token"
            };
        });
        test("they are redirected away from the login page", () => {
            const component = shallowWithIntl(<LoginComponent location={location} authentication={authentication} notifications={notifications} clearNotification={clearNotification} login={login}/>);
            expect(component.dive().dive().find('Redirect')).toHaveLength(1);
        });
    });
});