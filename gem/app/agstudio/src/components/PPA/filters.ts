import {connect} from "react-redux";
import FiltersComponent from "./filtersComponent";
import {IPPAFiltersStore} from "./filtersReducer";
import {filtersActions} from "./filtersActions";
import {dimensionsActions, IPPADimensionsAction} from "./dimensionsActions";
import {gridActions} from "./gridActions";
import {Dispatch} from "redux";
import {IPPADimensionsStore} from "./dimensionsReducer";
import {IDomainStore} from "@agstudio/web/lib/components/Domain/reduxReducer";
import wrappedFetchFactory from "@agstudio/web/lib/helpers/wrappedFetch";
import {agstudioAPIServiceFactory} from "@agstudio/services/lib/services/agstudioAPIService";

const mapStateToProps = (state: any) => ({
    featureFlags: state.featureFlags,
    authentication: state.authentication,
    agstudioAPIUrl: state.app.agstudioAPIUrl,
    domain: state.domain,
    filters: state.PPA.filters,
    dimensions: state.PPA.dimensions
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    sendDispatch: () => dispatch,
    dispatchSaveFilters(values: any, state: any, domain: IDomainStore, dimensions: IPPADimensionsStore) {
        const filtersObject: IPPAFiltersStore = {
            filtersDomainKey: domain.growers.selected || domain.locations.selected || domain.territories.selected || domain.companies.selected,
            commodities: {
                selected: values.commodity,
                list: state.commodities
            },
            cropYears: {
                selected: values.cropYears,
                list: state.cropYearsOptions
            },
            previousCrops: {
                selected: values.previousCrop,
                list: state.previousCrops
            },
            traits: {
                selected: values.traits,
                list: state.traitsOptions
            },
            products: {
                selected: values.products,
                list: state.productsOptions
            },
            irrigation: {
                selected: values.irrigation,
                list: state.irrigationOptions
            },
        };
        const firstDimension = dimensions.firstList.selected;
        const secondDimension = dimensions.secondList.selected;
        dispatch(filtersActions.save(filtersObject)).then(() => {
            dispatch(gridActions.reset());
            dispatch(dimensionsActions.getDimensions(firstDimension, true)).then((firstAction: IPPADimensionsAction) => {
                if (firstAction.name) {
                    // Get second dimensions since the first selection remained
                    dispatch(dimensionsActions.getDimensions(secondDimension)).then(() => {
                        // Get results now either the second selection remained or wasn't available
                        if (secondDimension) {
                            dispatch(gridActions.getResults());
                        }
                    });
                    // Get results right away because there was no second dimension selected, so no need to wait for second list
                    if (!secondDimension) {
                        dispatch(gridActions.getResults());
                    }
                }
            });
        });
    }
});

const mergeProps = (propsFromState: any, propsFromDispatch: any, ownProps: any) => ({
    ...propsFromState,
    ...ownProps,
    agstudioAPIService: agstudioAPIServiceFactory(propsFromState.agstudioAPIUrl, wrappedFetchFactory(propsFromDispatch.sendDispatch(), propsFromState.authentication)),
    saveFilters: (values: any, state: any) => {
        propsFromDispatch.dispatchSaveFilters(values, state, propsFromState.domain, propsFromState.dimensions);
    }
});


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FiltersComponent);
