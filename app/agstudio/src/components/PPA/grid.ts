import {connect} from "react-redux";
import GridComponent from "./gridComponent";
import {gridActions} from "./gridActions";
import {ITreatmentObject} from "@agstudio/services/lib/models/warehouseAPIService";
import {IReduxStore} from "../../rootReducer";
import {Dispatch} from "redux";
import wrappedFetchFactory from "@agstudio/web/lib/helpers/wrappedFetch";
import {warehouseAPIServiceFactory} from "@agstudio/services/lib/services/warehouseAPIService";
import {pdfAPIServiceFactory} from "@agstudio/services/lib/services/pdfAPIService";

const mapStateToProps = (state:IReduxStore) => ({
    authentication: state.authentication,
    warehouseAPIUrl: state.app.warehouseAPIUrl,
    pdfAPIUrl: state.app.pdfAPIUrl,
    domain: state.domain,
    filters: state.PPA.filters,
    dimensions: state.PPA.dimensions,
    grid: state.PPA.grid,
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
    sendDispatch: () => dispatch,
    toggleChildren(dimensionValue:string) {
        dispatch(gridActions.toggleChildren(dimensionValue));
    },
    toggleAllChildren(showChildren:boolean) {
        dispatch(gridActions.toggleAllChildren(showChildren));
    },
    sort(treatmentResults:ITreatmentObject, column:string, dimensionValue?:string) {
        dispatch(gridActions.sort(column,treatmentResults.Dimension.SortColumn === column && treatmentResults.Dimension.SortDirection === "desc" ? "asc" : "desc", dimensionValue));
    }
});

const mergeProps = (propsFromState: any, propsFromDispatch: any, ownProps: any) => {
    return {
        ...propsFromState,
        ...propsFromDispatch,
        ...ownProps,
        pdfAPIService: pdfAPIServiceFactory(propsFromState.pdfAPIUrl, wrappedFetchFactory(propsFromDispatch.sendDispatch(), propsFromState.authentication)),
        warehouseAPIService: warehouseAPIServiceFactory(propsFromState.warehouseAPIUrl, wrappedFetchFactory(propsFromDispatch.sendDispatch(), propsFromState.authentication))
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GridComponent);
