import {connect} from "react-redux";
import {dimensionsActions} from './dimensionsActions';
import DimensionsComponent from "./dimensionsComponent";
import {gridActions} from "./gridActions";
import {Dispatch} from "redux";

const mapStateToProps = (state: any) => ({
    dimensions: state.PPA.dimensions
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
    selectFirstDimension(value:string) {
        dispatch(dimensionsActions.selectDimension(value)).then(() => {
            dispatch(gridActions.getResults());
            dispatch(dimensionsActions.getDimensions());
        });
    },
    selectSecondDimension(value:string) {
        dispatch(dimensionsActions.selectDimension(value, false)).then(() => {
            dispatch(gridActions.getResults());
        });
    },
    swapDimensions() {
        dispatch(dimensionsActions.swapDimensions()).then(() => {
            dispatch(gridActions.getResults());
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DimensionsComponent);
