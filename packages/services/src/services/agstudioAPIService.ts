import {
    ICropYearObject,
    IAgStudioService,
    ICompanyObject,
    ITerritoryResponse,
    ILocationResponse, IGrowerResponse, ILinkedObject, IProductLotsObject, IGrowerCropsObject, IProductRowObject, ITraitObject
} from "../models/agstudioAPIService";

const requestOptions = {
    method: "GET",
    headers: {"Content-Type": "application/json"}
};

const loadCropYears = (apiUrl: string, wrappedFetch: any) => {
    return wrappedFetch(`${apiUrl}/v1/cropyears`, requestOptions).then((response: any) => response.json() as ICropYearObject[]);
};

const loadCompanies = (apiUrl: string, wrappedFetch: any) => {
    return wrappedFetch(`${apiUrl}/v1/companies`, requestOptions).then((response: any) => response.json() as ICompanyObject[]);
};

const loadTerritories = (apiUrl: string, wrappedFetch: any, companyKey: string) => {
    return wrappedFetch(`${apiUrl}/v1/companies/${companyKey}?includeTerritories=true`, requestOptions).then(
        (response: any) => response.json()
    ).then(
        (response: ITerritoryResponse) => response.Territories
    );
};

const loadLocations = (apiUrl: string, wrappedFetch: any, territoryKey: string) => {
    return wrappedFetch(`${apiUrl}/v1/territories/${territoryKey}?includeLocations=true`, requestOptions).then(
        (response: any) => response.json()
    ).then(
        (response: ILocationResponse) => response.Locations
    );
};

const loadGrowers = (apiUrl: string, wrappedFetch: any, locationKey: string) => {
    return wrappedFetch(`${apiUrl}/v1/locations/${locationKey}?includeGrowers=true`, requestOptions).then(
        (response: any) => response.json()
    ).then(
        (response: IGrowerResponse) => response.Growers
    );
};

const loadGrowerAncestors = (apiUrl: string, wrappedFetch: any, growerKey: string) => {
    return wrappedFetch(`${apiUrl}/v1/growers/ancestors/${growerKey}`, requestOptions).then((response: any) => response.json() as any);
};

const loadCommodities = (apiUrl: string, wrappedFetch: any, domainKey: string) => {
    return wrappedFetch(`${apiUrl}/v1/products/commodities/domain/${domainKey}`, requestOptions).then((response: any) => response.json());
};

const loadPreviousCrops = (apiUrl: string, wrappedFetch: any, domainKey: string, cropYears: string[]) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            domainKey,
            cropYears
        })
    };
    return wrappedFetch(`${apiUrl}/v1/crops/previouscrops`, requestOptions).then((response: any) => response.json());
};

const loadProducts = (apiUrl: string, wrappedFetch: any, domainKey: string, cropKey: string, cropYears: string[], seedTraits: string[]) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            domainKey,
            cropKey,
            cropYears,
            seedTraits
        })
    };
    return wrappedFetch(`${apiUrl}/v1/products/seedproducts`, requestOptions).then((response: any) => response.json());
};

const loadUnlinkedProducts = (apiUrl: string, wrappedFetch: any, growerKey: string, cropYear: number) => {
    return wrappedFetch(`${apiUrl}/v1/crossreference/unlinked/${growerKey}/524288/${cropYear}`, requestOptions).then((response: any) => response.json());
};

const addProductLots = (apiUrl: string, wrappedFetch: any, growerKey: string, cropYear: number, product: IProductRowObject) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product)
    };
    return wrappedFetch(`${apiUrl}/v1/products/addProduct/${growerKey}/${cropYear}`, requestOptions).then((response: any) => response.json());
};


const loadTraits = (apiUrl: string, wrappedFetch: any) => {
    return wrappedFetch(`${apiUrl}/v1/traits`, requestOptions).then((response: any) => response.json() as ITraitObject[]);
};

const loadDomainLogo = (apiUrl: string, wrappedFetch: any, domainKey: string) => {
    return wrappedFetch(`${apiUrl}/v1/logo/${domainKey}`, requestOptions).then((response: any) => response.json() as string);
};

const loadProductLots = (apiUrl: string, wrappedFetch: any, growerKey: string, cropYear: number, resourceSubType: number, cropKey?: string) => {
    const url = `${apiUrl}/v1/products/productlots/${growerKey}/${cropYear}/?productType=${resourceSubType}` + (cropKey ? `&cropKey=${cropKey}` : ``);
    return wrappedFetch(url, requestOptions).then((response: any) => response.json())
        .then((pl: IProductLotsObject[]) => pl.filter(r => r.ProductLots))
};

const submitLinkedResource = (apiUrl: string, wrappedFetch: any, links: ILinkedObject[]) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            LinkedResources: links
        })
    };
    return wrappedFetch(`${apiUrl}/v1/crossreference/submit`, requestOptions).then((response: any) => response.json());
};

const loadCropsByGrower = (apiUrl: string, wrappedFetch: any, growerKey: string, cropYear: number) => {
    return wrappedFetch(`${apiUrl}/v1/crops/${growerKey}/${cropYear}/`, requestOptions).then((response: any) => response.json() as IGrowerCropsObject[]);
};

const searchProducts = (apiUrl: string, wrappedFetch: any, resourceSubType: number, query: string, cropKey?: string, manufacturer?: string) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            ProductType: resourceSubType,
            ProductNameFragment: query,
            ManufacturerKey: manufacturer,
            CropKey: cropKey
        })
    };
    return wrappedFetch(`${apiUrl}/v1/products/database`, requestOptions).then((response: any) => response.json());
};


const loadManufacturers = (apiUrl: string, wrappedFetch: any, resourceSubType: number) => {
    return wrappedFetch(`${apiUrl}/v1/products/manufacturers?ProductType=${resourceSubType}`, requestOptions).then((response: any) => response.json());
};

// ***** public SERVICE *****

export const agstudioAPIServiceFactory = (apiUrl: string, wrappedFetch: any) => ({
    loadCropYears: () => loadCropYears(apiUrl, wrappedFetch),
    loadCompanies: () => loadCompanies(apiUrl, wrappedFetch),
    loadTerritories: (companyKey: string) => loadTerritories(apiUrl, wrappedFetch, companyKey),
    loadLocations: (territoryKey: string) => loadLocations(apiUrl, wrappedFetch, territoryKey),
    loadGrowers: (locationKey: string) => loadGrowers(apiUrl, wrappedFetch, locationKey),
    loadGrowerAncestors: (growerKey: string) => loadGrowerAncestors(apiUrl, wrappedFetch, growerKey),
    loadCommodities: (domainKey: string) => loadCommodities(apiUrl, wrappedFetch, domainKey),
    loadPreviousCrops: (
        domainKey: string,
        cropYears: string[]
    ) => loadPreviousCrops(apiUrl, wrappedFetch, domainKey, cropYears),
    loadTraits: () => loadTraits(apiUrl, wrappedFetch),
    loadDomainLogo: (domainKey: string) => loadDomainLogo(apiUrl, wrappedFetch, domainKey),
    loadProducts: (
        domainKey: string,
        cropKey: string,
        cropYears: string[],
        seedTraits: string[]
    ) => loadProducts(apiUrl, wrappedFetch, domainKey, cropKey, cropYears, seedTraits),
    loadUnlinkedProducts: (
        growerKey: string,
        cropYear: number
    ) => loadUnlinkedProducts(apiUrl, wrappedFetch, growerKey, cropYear),
    addProductLots: (
        growerKey: string,
        cropYear: number,
        product: IProductRowObject
    ) => addProductLots(apiUrl, wrappedFetch, growerKey, cropYear, product),
    loadProductLots: (
        growerKey: string,
        cropYear: number,
        resourceSubType: number,
        cropKey?: string
    ) => loadProductLots(apiUrl, wrappedFetch, growerKey, cropYear, resourceSubType, cropKey),
    submitLinkedResource: (
        links: ILinkedObject[]
    ) => submitLinkedResource(apiUrl, wrappedFetch, links),
    loadCropsByGrower: (
        growerKey: string,
        cropYear: number
    ) => loadCropsByGrower(apiUrl, wrappedFetch, growerKey, cropYear),
    loadManufacturers: (resourceSubType: number) => loadManufacturers(apiUrl, wrappedFetch, resourceSubType),
    searchProducts: (
        resourceSubType: number,
        query: string,
        cropKey?: string,
        manufacturer?: string,
    ) => searchProducts(apiUrl, wrappedFetch, resourceSubType, query, cropKey, manufacturer)
} as IAgStudioService);
