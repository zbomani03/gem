// This interface came from the API. Both objects should be the same.

export interface ICropYearObject {
    Name: string;
}

// This interface came from the API. Both objects should be the same.
export interface ICompanyObject {
    AreaUnit: string;
    Code: string;
    Key: string;
    Name: string;
    ResourceType: number;
}

// This interface came from the API. Both objects should be the same.
export interface ITerritoryObject {
    AreaUnit: string;
    Code: string;
    Key: string;
    Name: string;
    ParentKey: string;
}

// This interface came from the API. Both objects should be the same.
export interface ITerritoryResponse {
    Territories: ITerritoryObject[];
    // other properties
}

// This interface came from the API. Both objects should be the same.
export interface ILocationObject {
    AreaUnit: string;
    Code: string;
    Key: string;
    Name: string;
    ParentKey: string;
}

// This interface came from the API. Both objects should be the same.
export interface ILocationResponse {
    Locations: ILocationObject[];
    // other properties
}

// This interface came from the API. Both objects should be the same.
export interface ITraitObject {
    GMOTraitCode: string;
    Name: string;
    Description: string;
}

// This interface came from the API. Both objects should be the same.
export interface IGrowerObject {
    AreaUnit: string;
    Code: string;
    Key: string;
    Name: string;
    ParentKey: string;
    ResourceType: number;
}

// This interface came from the API. Both objects should be the same.
export interface IGrowerResponse {
    Growers: IGrowerObject[];
    // other properties
}

// This should removed when the API return a tree instead a flat list
export interface ICommodityObject {
    CommodityKey: string;
    CropKey: string;
    DisplayName: string;
}

// This should removed when the API return a tree instead a flat list
export interface IProductFlatObject {
    ManufacturerKey: string;
    ManufacturerName: string;
    ProductKey: string;
    ProductName: string;
}

export interface IPreviousCropObject {
    CropKey: string;
    CropName: string;
}

export interface IProductObject {
    ProductKey: string;
    ProductName: string;
}

export interface IManufacturerObject {
    ManufacturerKey: string;
    ManufacturerName: string;
    Products: IProductObject[];
}

export interface IUnlinkedProductObject {
    CardManagerRef: string;
    CropName: string;
    CropYear: number
    DomainKey: string;
    FieldOpXRefId: string;
    FirstSeenTime: Date;
    LastSeenTime: Date;
    ResourceSubType: number;
    ResourceType: number;
    ResourceXRef: string;
    SourceName: string;
    SourceResourceName: string;
    UnlinkCount: number;
}

export interface INutrientAnalysis {
    Key: string;
    ProductLotKey: string;
    Nutrient: any; // TODO Define Interface
    Analysis: number;
    NutrientFormAnalyses: any[];  // TODO Define Interface
}

export interface ILotCommodityObject {
    ProductLotKey: string;
    MarketUnit: number;
    InventoryUnit: number;
    MarketConversion: number;
    ShrinkToMarket: boolean;
    ExpandToMarket: boolean;
    RespirationLoss: number;
    MarketAdjustmentMethod: number;
    DefaultAdjustmentValue: number;
    TargetAdjustmentValue: number;
    AdjustmentName: string;
    NameMatchExpressions: string;
    YieldGoal: number;
    MinTheme: number;
    MaxTheme: number;
    USDACropUseCode: string;
    USDACropUseName: string;
    USDACropUseAbbreviation: string;
}

export interface IProductLotRow {
    ProductKey: string;
    Key: string;
    Name: string;
    IsDefault: boolean;
    Status: number;
    AppRateUnit: number;
    DefaultAppRate?: number;
    TransferUnit: number;
    PurchaseUnit: number;
    TransferDensityUnit?: number;
    TransferDensity: number;
    PurchaseDensityUnit?: number;
    PurchaseDensity: number;
    ProductDensityUnit?: number;
    ProductDensity: number;
    HasMinSetPoint?: boolean;
    MinSetPoint?: number;
    HasMaxSetPoint?: boolean;
    MaxSetPoint?: number;
    HasSwitchSetPoint?: boolean;
    SwitchSetPoint?: number
    HasDefaultRate?: boolean;
    DefaultRate?: number;
    HasOutOfFieldRate?: boolean;
    OutOfFieldRate?: number;
    RoundRecMethod?: number;
    RoundRecValue?: number;
    Filter: string
    BatchSizeUnit?: number;
    BatchSize?: number;
    IsBlend?: boolean;
    IsFiller?: boolean;
    ProductLotRef: string
    CommodityProperty?: ILotCommodityObject;
    NutrientAnalyses: INutrientAnalysis[];
}

export interface IDomainLotObject {
    CropYear: number;
    DomainKey: string;
    IsActive: boolean;
    IsDefault: boolean;
    ProductLotKey: string;
}

export interface IProductLotWrapper {
    ProductLotRow: IProductLotRow
    DomainLots: IDomainLotObject[];
    ProductLotMembers: any[] // TODO Define Interface
}

export interface IProductRowObject {
    Key: string;
    Name: string;
    Code: string;
    Description: string;
    ProductForm: number;
    MasterProductLotKey?: string;
    ProductCategory: IProductCategoryObject;
    Manufacturer: ILotManufacturerObject;
    DefaultProductLot?: IProductLotWrapper;
    CropKey?: string;
    EPARegistrationID: string;
    IsRestrictedUse?: boolean;
    ProductRef: string;
    BaseGenetic: string;
    USDACropCode?: string;
    GMOTraits: IGMOTraitsObject[];
    GDDMaturity?: number;
    GDDSilk?: number;
    CropHeatingUnits?: number;
    CRM?: number;
}

export interface IProductCategoryObject {
    Key: string;
    Name: string;
    ProductType: number;
    ReferenceID: string;
}

export interface ILotManufacturerObject {
    Code: string;
    Key: string;
    MfrCrops: any[]; // TODO Define Interface
    Name: string;
}

export interface IGMOTraitsObject {
    Description: string;
    GMOTraitCode: string;
    Name: string;
}

export interface IProductLotsObject {
    ResourceType: number;
    ProductLots: IProductLotWrapper[];
    ProductRow: IProductRowObject;
}

export interface ILinkedObject {
    LinkId: string | undefined;
    FieldOpXRefId: string;
    ResourceSubType: number;
}

export interface IGrowerCropsObject {
    CropName: string;
    CropKey: string;
    USDACropKey: string;
    USDACropCode: string;
}

export interface IManufacturer {
    Name: string;
    Key: string;
}

// This the service interface.
export interface IAgStudioService {
    loadCropYears(): Promise<ICropYearObject[]>;

    loadCompanies(): Promise<ICompanyObject[]>;

    loadTerritories(companyKey: string): Promise<ITerritoryObject[]>;

    loadLocations(territoryKey: string): Promise<ILocationObject[]>;

    loadGrowers(locationKey: string): Promise<IGrowerObject[]>;

    loadGrowerAncestors(growerKey: string): Promise<any>; // TODO Define Interface locally, this is returning a IDomainStore type

    loadCommodities(domainKey: string): Promise<ICommodityObject[]>;

    loadPreviousCrops(domainKey: string, cropYears: string[]): Promise<IPreviousCropObject[]>;

    loadTraits(): Promise<ITraitObject[]>;

    loadDomainLogo(domainKey: string): Promise<string>;

    loadProducts(domainKey: string, cropKey: string, cropYears: string[], seedTraits: string[]): Promise<IProductFlatObject[]>;

    loadUnlinkedProducts(growerKey: string, cropYear?: number): Promise<IUnlinkedProductObject[]>;

    addProductLots(growerKey: string, cropYear: number, product: IProductRowObject): Promise<IProductLotsObject>;

    loadProductLots(growerKey: string, cropYear: number, resourceSubType: number, cropKey?: string): Promise<IProductLotsObject[]>;

    submitLinkedResource(links: ILinkedObject[]): Promise<ILinkedObject[]>;

    loadCropsByGrower(growerKey: string, cropYear: number): Promise<IGrowerCropsObject[]>;

    searchProducts(resourceSubType: number, query: string, cropKey?: string, manufacturer?: string): Promise<IProductRowObject[]>;

    loadManufacturers(resourceSubType: number): Promise<IManufacturer[]>;

}
