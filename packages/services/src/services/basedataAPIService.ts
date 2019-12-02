import {IBaseDataService, IGlobalManufacturers, IGlobalProducts} from "../models/basedataAPIService";
import {IProductLotRow} from "../models/agstudioAPIService";

const requestOptions = {
    method: "GET",
    headers: {"Content-Type": "application/json"}
};

let memoizedManufacturers: any = {};
let memoizedProducts: any = {};
let memoizedProductLots: any = {};

const searchProducts = (apiUrl: string, wrappedFetch: any, resourceSubType: number, query: string, USDACropKey?: string, manufacturer?: string) => {
    const params = resourceSubType + query + USDACropKey + manufacturer;
    if (memoizedProducts[params]) {
        return new Promise((resolve) => {
            resolve(memoizedProducts[params]);
        });
    } else {
        let url: string = `${apiUrl}/v1/products?type=${resourceSubType}&nameFragment=${query}`;
        url += USDACropKey ? `&cropKey=${USDACropKey}` : ``;
        url += manufacturer ? `&manufacturer=${manufacturer}` : ``;
        return wrappedFetch(url, requestOptions).then((response: any) => response.json().then(
            (r: IGlobalProducts) => {
                memoizedProducts[params] = r;
                return r;
            }
        ));
    }
};


const loadManufacturers = (apiUrl: string, wrappedFetch: any, resourceSubType: number) => {
    if (memoizedManufacturers[resourceSubType]) {
        return new Promise((resolve) => {
            resolve(memoizedManufacturers[resourceSubType]);
        });
    } else {
        return wrappedFetch(`${apiUrl}/v1/products/manufacturers?type=${resourceSubType}`, requestOptions).then(
            (response: any) => response.json().then(
                (r: IGlobalManufacturers) => {
                    memoizedManufacturers[resourceSubType] = r;
                    return r;
                }
            )
        );
    }
};


const loadDefaultProductLot = (apiUrl: string, wrappedFetch: any, resourceSubType: number, productKey: string) => {
    const params = resourceSubType + productKey;
    if (memoizedProductLots[params]) {
        return new Promise((resolve) => {
            resolve(memoizedProductLots[params]);
        });
    } else {
        return wrappedFetch(`${apiUrl}/v1/products/defaultproductlot?productKey=${productKey}&productType=${resourceSubType}`, requestOptions).then(
            (response: any) => response.json().then(
                (r: IProductLotRow) => {
                    memoizedProductLots[params] = r;
                    return r;
                }
            )
        );
    }
};


// ***** public SERVICE *****

export const basedataAPIServiceFactory = (apiUrl: string, wrappedFetch: any) => {
    return {
        loadManufacturers: (resourceSubType: number) => loadManufacturers(apiUrl, wrappedFetch, resourceSubType),
        loadDefaultProductLot: (resourceSubType: number, productKey: string) => loadDefaultProductLot(apiUrl, wrappedFetch, resourceSubType, productKey),
        searchProducts: (
            resourceSubType: number,
            query: string,
            USDACropKey?: string,
            manufacturer?: string,
        ) => searchProducts(apiUrl, wrappedFetch, resourceSubType, query, USDACropKey, manufacturer)
    } as IBaseDataService;
};
