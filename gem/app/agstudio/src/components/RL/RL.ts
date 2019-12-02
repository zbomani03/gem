import {connect} from "react-redux";
import RLComponent from "./RLComponent";
import {IReduxStore} from "../../rootReducer";
import wrappedFetchFactory from "@agstudio/web/lib/helpers/wrappedFetch";
import {agstudioAPIServiceFactory} from "@agstudio/services/lib/services/agstudioAPIService";
import {basedataAPIServiceFactory} from "@agstudio/services/lib/services/basedataAPIService";
import {Dispatch} from "redux";

const mapStateToProps = (state:IReduxStore) => ({
    authentication: state.authentication,
    agstudioAPIUrl: state.app.agstudioAPIUrl,
    basedataAPIUrl: state.app.basedataAPIUrl,
    domain: state.domain
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    sendDispatch: () => dispatch
});

const mergeProps = (propsFromState: any, propsFromDispatch: any, ownProps: any) => {
    return {
        ...propsFromState,
        ...ownProps,
        agstudioAPIService: agstudioAPIServiceFactory(propsFromState.agstudioAPIUrl, wrappedFetchFactory(propsFromDispatch.sendDispatch(), propsFromState.authentication)),
        basedataAPIService: basedataAPIServiceFactory(propsFromState.basedataAPIUrl, wrappedFetchFactory(propsFromDispatch.sendDispatch(), propsFromState.authentication))
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(RLComponent);
