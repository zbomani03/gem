import * as React from "react";
import {useEffect, useState} from "react";
import Filters from "./filters";
import Grid from "./grid";
import {IDomainStore} from "@agstudio/web/lib/components/Domain/reduxReducer";
import {IPdfAPIDisplayFilters} from "@agstudio/services/lib/models/pdfAPIService";
import {IPPAFiltersStore} from "./filtersReducer";
import {IntlShape} from "react-intl";

const PPAComponent = (props: { domain: IDomainStore, filters: IPPAFiltersStore, intl: IntlShape }) => {

    const domainKey = props.domain.growers.selected || props.domain.locations.selected || props.domain.territories.selected || props.domain.companies.selected;

    const productsDisplayFilter = (productsAmount: number): string => {
        return productsAmount ?
            `${productsAmount} ${props.intl.formatMessage({id: productsAmount === 1 ? "common.oneProduct" : "common.multipleProducts"})}`
            :
            props.intl.formatMessage({id: "common.allProducts"})
    };

    const traitsDisplayFilter = (traits: string[]) => {
        if (!traits.length) {
            return props.intl.formatMessage({id: "common.allTraits"});
        }
        return traits.length === 1 ? traits[0] : `${traits.length} ${props.intl.formatMessage({id: "label.traits"})}`;
    };

    const domainDisplayFilter = (domainList: any, emptyResult: string = ""): string => {
        return domainList.selected ? domainList.list.filter((c: any) => c.Key === domainList.selected).map((c: any) => c.Name).join("") : emptyResult
    };

    const displayFilters: IPdfAPIDisplayFilters = {
        Company: domainDisplayFilter(props.domain.companies),
        Territory: domainDisplayFilter(props.domain.territories, props.intl.formatMessage({id: "common.allTerritories"})),
        Location: domainDisplayFilter(props.domain.locations, props.intl.formatMessage({id: "common.allLocations"})),
        Grower: domainDisplayFilter(props.domain.growers, props.intl.formatMessage({id: "common.allGrowers"})),
        Commodity: props.filters.commodities.selected ? props.filters.commodities.list.filter(
            c => c.CommodityKey === props.filters.commodities.selected
        ).map(c => c.DisplayName).join("") : "",
        CropYears: props.filters.cropYears.selected ? props.filters.cropYears.selected.slice().sort(
            (a, b) => parseInt(b, 10) - parseInt(a, 10)
        ).join(", ") : "",
        PreviousCrop: props.filters.previousCrops.selected ? props.filters.previousCrops.list.filter(
            pc => pc.CropKey === props.filters.previousCrops.selected
        ).map(pc => pc.CropName).join("") : props.intl.formatMessage({id: "common.allPreviousCrops"}),
        Irrigation: props.filters.irrigation.selected,
        Traits: traitsDisplayFilter(props.filters.traits.selected),
        Products: productsDisplayFilter(props.filters.products.selected.length)
    };

    const [isFilterEditing, setIsFilterEditing] = useState(props.filters.filtersDomainKey === "" || props.filters.filtersDomainKey !== domainKey);

    useEffect(() => {
        setIsFilterEditing(props.filters.filtersDomainKey === "" || props.filters.filtersDomainKey !== domainKey);
    }, [props.filters.filtersDomainKey, domainKey]);

    return (
        <div className="pb-4">
            <Filters domainKey={domainKey} displayFilters={displayFilters} isFilterEditing={isFilterEditing} setIsFilterEditing={setIsFilterEditing}/>
            <Grid displayFilters={displayFilters} isFilterEditing={isFilterEditing}/>
        </div>
    );
};

export default PPAComponent;
