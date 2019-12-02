import {IPdfAPIDisplayFilters} from "./pdfAPIService";

// TODO this should be deleted since the numeric/string property should come from the API
export const numericDateUseValue = [
    "Quantity",
    "Measure",
    "Rate",
    "Scalar",
    "Date",
    "Time",
    "TimeStamp",
    "ProductRate",
    "NutrientRate",
    "SeedRate",
    "CommodityRate"
];

// This interface came from the API. Both objects should be the same.
export interface IBrandFilter {
    ManufacturerKey: string;
    ProductKeys: string[];
}

// This interface came from the API. Both objects should be the same.
export interface IWarehouseQueryFilters {
    DomainKey: string;
    CropYears: string[];
    CommodityKey: string;
    BrandFilters: IBrandFilter[];
    Irrigation: string;
    SeedTraits: string[];
    PreviousCropKey: string;
    Dimensions?: IDimensionObject[];
    MinimumTreatmentAcres?: number;
    IncludeEmptyDimensions?: boolean;
    TreatmentScriptKey?: string;
    MinimumTreatmentValueAcres?: number;
    IncludeGeometry?: boolean;
}

// This interface came from the API. Both objects should be the same.
export interface IDimensionObject {
    Name: string;
    CropZoneCount: number;
    CropZoneAcres: number;
    DataUse: string;
    SortColumn: string;
    SortDirection: string;
}

// This interface came from the API. Both objects should be the same.
export interface IResultObject {
    DimensionValue: any;
    Stats: IStatsObject;
    ChildResults: ITreatmentObject;
}

// This interface is for the UI.
export interface IResultObjectUI extends IResultObject {
    showChildren?: boolean;
}

// This interface came from the API. Both objects should be the same.
export interface IStatsObject {
    TotalYield: number;
    SumX: number;
    SumX2: number;
    Min: number;
    Max: number;
    NumberOfCropZones: number;
    NumberOfAcres: number;
    Mean: number;
    StdDev: number;
    HighMid: number;
    LowMid: number;
}

// This interface came from the API. Both objects should be the same.
export interface ITreatmentObject {
    Dimension: IDimensionObject;
    Results: IResultObjectUI[];
}

// This interface came from the API. Both objects should be the same.
export interface IUOMObject {
    UnitOfMeasure: string;
    Metric: string;
    TreatmentResults: ITreatmentObject;
}

// This interface came from the API. Both objects should be the same.
export interface IEmailInfo {
    SendTo: [string];
    Subject: string;
    Body: string;
}

// This the service interface.
export interface IWarehouseAPIService {
    getDimensions(filters: IWarehouseQueryFilters): Promise<IDimensionObject[]>;

    getResults(filters: IWarehouseQueryFilters): Promise<IUOMObject>;

    exportCSV(
        filters: IWarehouseQueryFilters,
        displayFilters: IPdfAPIDisplayFilters,
        language: string
    ): Promise<any>;

    emailFile(
        filters: IWarehouseQueryFilters,
        displayFilters: IPdfAPIDisplayFilters,
        language: string,
        exportFileType: string,
        emailInfo: IEmailInfo,
        exportReportType: string
    ): Promise<any>;
}
