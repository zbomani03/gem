import {connect} from "react-redux";
import {IReduxStore} from "../../rootReducer";
import {injectIntl} from "react-intl";
import PPAComponent from "./PPAComponent";

const mapStateToProps = (state:IReduxStore) => ({
    domain: state.domain,
    filters: state.PPA.filters
});

export default connect(mapStateToProps)(injectIntl(PPAComponent));
