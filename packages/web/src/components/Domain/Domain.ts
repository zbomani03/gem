import {connect} from 'react-redux';
import {IDomainStore} from "./reduxReducer";
import {domainActions} from "./reduxActions";
import DomainComponent from './DomainComponent';
import {Dispatch} from "redux";
import wrappedFetchFactory from "../../helpers/wrappedFetch";
import {agstudioAPIServiceFactory} from "@agstudio/services/lib/services/agstudioAPIService";

const mapStateToProps = (state: any) => ({
    authentication: state.authentication,
    agstudioAPIUrl: state.app.agstudioAPIUrl,
    domain: state.domain
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    sendDispatch: () => dispatch,
    saveDomain(values: any, state: any, callback?: () => any) {
        const domainObject: IDomainStore = {
            companies: {
                selected: values.company,
                list: state.companies
            },
            territories: {
                selected: values.territory,
                list: state.territories
            },
            locations: {
                selected: values.location,
                list: state.locations
            },
            growers: {
                selected: values.grower,
                list: state.growers
            }
        };
        dispatch(domainActions.save(domainObject)).then(() => {
            if (callback) {
                callback();
            }
        });
    }
});

const mergeProps = (propsFromState: any, propsFromDispatch: any, ownProps: any) => {
    return {
        ...propsFromState,
        ...propsFromDispatch,
        ...ownProps,
        agstudioAPIService: agstudioAPIServiceFactory(propsFromState.agstudioAPIUrl, wrappedFetchFactory(propsFromDispatch.sendDispatch(), propsFromState.authentication))
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DomainComponent);
