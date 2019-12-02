import {connect} from 'react-redux';
import {authenticationActions} from './reduxActions';
import {notificationActions} from '../notificationActions';
import LoginComponent from "./LoginComponent";
import {Dispatch} from "redux";
import {IntlShape} from 'react-intl';

const mapStateToProps = (state: any) => ({
    authentication: state.authentication,
    notifications: state.notifications
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
    login(values: any, intl:IntlShape, callback: () => any) {
        dispatch(authenticationActions.login(values.username, values.password, intl)).then(() => {callback();});
    },
    clearNotification(id:string) {
        dispatch(notificationActions.clear(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
