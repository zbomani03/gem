import {IProductLotRow, IProductRowObject} from "./agstudioAPIService";

export interface IGlobalManufacturersQuery {
    SearchTerm: string;
    ProductType: number;
    RecordsPerPage: number
    CurrentRecordOffset: number;
}

export interface IGlobalManufacturers {
    Results: string[];
    HasMorePages: boolean;
    TotalCount: number
    SearchArgs: IGlobalManufacturersQuery;
}

export interface IGlobalProductsQuery {
    SearchTerm: string;
    Manufacturer: string;
    ProductType: number;
    CropKey: number;
    RecordsPerPage: number
    CurrentRecordOffset: number;
}

export interface IGlobalProducts {
    Results: IProductRowObject[];
    HasMorePages: boolean;
    TotalCount: number
    SearchArgs: IGlobalProductsQuery;
}

// This the service interface.
export interface IBaseDataService {

    searchProducts(resourceSubType: number, query: string, USDACropKey?: string, manufacturer?: string): Promise<IGlobalProducts>;

    loadManufacturers(resourceSubType: number): Promise<IGlobalManufacturers>;

    loadDefaultProductLot(resourceSubType: number, productKey: string): Promise<IProductLotRow>;

}
