import {connect} from 'react-redux';
import {authenticationActions} from "../Authentication/reduxActions";
import HeaderComponent from './HeaderComponent';
import {Dispatch} from "redux";
import {withRouter} from "react-router";

const mapStateToProps = (state: any) => ({
    appName: state.app.name,
    domain: state.domain
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout() {
        dispatch(authenticationActions.logout());
    }
});

// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderComponent));
