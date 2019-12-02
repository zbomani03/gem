import {IPPAFiltersStore} from "../components/PPA/filtersReducer";
import {IPPADimensionsStore} from "../components/PPA/dimensionsReducer";
import {IPdfAPIDisplayFilters} from "@agstudio/services/lib/models/pdfAPIService";
import {
    IBrandFilter,
    IWarehouseQueryFilters
} from "@agstudio/services/lib/models/warehouseAPIService";
import {IDomainStore} from "@agstudio/web/lib/components/Domain/reduxReducer";

const normalizeProducts = (filters: IPPAFiltersStore) => {
    if (filters.products.selected.length === 0) {
        return [];
    }
    return filters.products.list.filter(
        m => m.Products.some(
            p => filters.products.selected.indexOf(p.ProductKey) !== -1
        )
    ).map(
        m => ({
                ManufacturerKey: m.ManufacturerKey,
                ProductKeys: m.Products.every(
                    p => filters.products.selected.indexOf(p.ProductKey) !== -1
                ) ? [] : m.Products.filter(
                    p => filters.products.selected.indexOf(p.ProductKey) !== -1
                ).map(p => p.ProductKey)
            } as IBrandFilter
        )
    );
};

const getDimensionObjects = (dimensions: IPPADimensionsStore) => {
    if (!dimensions.firstList.selected) {
        return undefined;
    }
    return dimensions.firstList.list.filter(
        d => d.Name === dimensions.firstList.selected
    ).concat(
        dimensions.secondList.selected ? dimensions.secondList.list.filter(
            d => d.Name === dimensions.secondList.selected
        ) : []
    );
};

export const buildDisplayFilters = (displayFilters: IPdfAPIDisplayFilters, dimensions: IPPADimensionsStore): IPdfAPIDisplayFilters => {
    const Dimensions = dimensions.firstList.selected ?
        dimensions.firstList.list.filter(d => d.Name === dimensions.firstList.selected).map(d => d.Name).join("") + (
            dimensions.secondList.selected ? " X " + dimensions.secondList.list.filter(d => d.Name === dimensions.secondList.selected).map(d => d.Name).join("") : ""
        ) : "";
    return {...displayFilters, Dimensions};
};

export const buildWarehouseFilters = (
    domain: IDomainStore,
    filters: IPPAFiltersStore,
    dimensions: IPPADimensionsStore
): IWarehouseQueryFilters => ({
    DomainKey: domain.growers.selected || domain.locations.selected || domain.territories.selected || domain.companies.selected,
    CropYears: filters.cropYears.selected,
    CommodityKey: filters.commodities.selected,
    BrandFilters: normalizeProducts(filters),
    Irrigation: filters.irrigation.selected,
    SeedTraits: filters.traits.selected,
    PreviousCropKey: filters.previousCrops.selected,
    Dimensions: getDimensionObjects(dimensions)
});
