import {IWarehouseQueryFilters} from "./warehouseAPIService";

// This interface came from the API. Both objects should be the same.
export interface IPdfAPIQueryFilters {
    Filters: IWarehouseQueryFilters;
    DisplayFilters: IPdfAPIDisplayFilters;
    Meta: IPdfAPIMeta;
}

// This interface came from the API. Both objects should be the same.
export interface IPdfAPIDisplayFilters {
    Company: string;
    Territory: string;
    Location: string;
    Grower: string;
    Commodity: string;
    CropYears: string;
    PreviousCrop: string;
    Irrigation: string;
    Traits: string;
    Products: string;
    Dimensions?: string;
}

// This interface came from the API. Both objects should be the same.
export interface IPdfAPIMeta {
    TimeStamp: Date;
    Language: string;
}

// This the service interface.
export interface IPdfAPIService {
    exportPDF(filters: IWarehouseQueryFilters, displayFilters: IPdfAPIDisplayFilters, language: string): Promise<any>;
}
