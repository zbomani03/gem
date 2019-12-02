import { PPATypes } from './actions';
import {IPPAFiltersAction} from "./filtersActions";
import {ICropYearObject, ICommodityObject, IManufacturerObject, IPreviousCropObject, ITraitObject} from "@agstudio/services/lib/models/agstudioAPIService";

// ***** TypeScript ANNOTATIONS *****

interface IPPAFiltersStoreSingleValue {
    selected: string;
}

interface IPPAFiltersStoreCommodities extends IPPAFiltersStoreSingleValue {
    list: ICommodityObject[];
}

interface IPPAFiltersStoreCropYears {
    selected: string[];
    list: ICropYearObject[];
}

interface IPPAFiltersStorePreviousCrops {
    selected: string;
    list: IPreviousCropObject[];
}

interface IPPAFiltersStoreTraits {
    selected: string[];
    list: ITraitObject[];
}

interface IPPAFiltersStoreProducts {
    selected: string[];
    list: IManufacturerObject[];
}

interface IPPAFiltersStoreIrrigation extends IPPAFiltersStoreSingleValue {
    list: string[];
}

export interface IPPAFiltersStore {
    filtersDomainKey: string;
    commodities: IPPAFiltersStoreCommodities;
    cropYears: IPPAFiltersStoreCropYears;
    previousCrops: IPPAFiltersStorePreviousCrops;
    traits: IPPAFiltersStoreTraits;
    products: IPPAFiltersStoreProducts;
    irrigation: IPPAFiltersStoreIrrigation;
}

// ***** JavaScript IMPLEMENTATION *****

// TODO This is hard-coded for now. We should find a way to get enums from API
const irrigationEnum = [
    "Any",
    "Unknown",
    "Irrigated",
    "Dry",
    "AnyKnown"
];

export const initialState: IPPAFiltersStore = {
    filtersDomainKey: "",
    commodities: {
        selected: "",
        list: []
    },
    cropYears: {
        selected: [],
        list: []
    },
    previousCrops: {
        selected: "",
        list: []
    },
    traits: {
        selected: [],
        list: []
    },
    products: {
        selected: [],
        list: []
    },
    irrigation: {
        selected: "Any",
        list: irrigationEnum
    },
};

export default function filters(state = initialState as IPPAFiltersStore, action: IPPAFiltersAction) {
    return action.type === PPATypes.filters.SAVE ? action.payload as IPPAFiltersStore : state;
}
