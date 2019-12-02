import * as React from "react";
import {Redirect, Route} from "react-router-dom";
import {connect} from 'react-redux';

import Layout from "./Layout";
import {notificationActions} from "./notificationActions";
import {Dispatch} from "redux";
import {authenticationActions} from "./Authentication/reduxActions";
import {useEffect} from "react";

const mapStateToProps = (state: any) => ({
    authentication: state.authentication,
    notifications: state.notifications
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    clearNotification(id: string) {
        dispatch(notificationActions.clear(id));
    },
    renewToken() {
        dispatch(authenticationActions.renewToken());
    }
});

const PrivateRoute = (props: any) => {

    const {component: Component, authentication, notifications, location, clearNotification, renewToken, navMenu, domainRequired, ...rest} = props;
    const tokenRenewTimer: any = setInterval(() => {
        if (authentication.expires_at - Date.now() <= 300000) {
            props.renewToken();
        }
    }, 60000);

    useEffect(() => {
        return () => {
            clearInterval(tokenRenewTimer);
        }
    });

    return (
        <Route
            {...rest}
            render={
                props => authentication.access_token ?
                (
                    <>
                        <Layout location={location} notifications={notifications} clearNotification={clearNotification} navMenu={navMenu} domainRequired={domainRequired}>
                            <Component {...props} />
                        </Layout>
                    </>
                )
                :
                (
                    <Redirect to={{pathname: '/login', state: {from: location}}}/>
                )
            }
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
