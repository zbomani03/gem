import {IPdfAPIDisplayFilters} from "../models/pdfAPIService";
import {
    IDimensionObject,
    IEmailInfo,
    IUOMObject,
    IWarehouseAPIService,
    IWarehouseQueryFilters
} from "../models/warehouseAPIService";
import {
    fixDimensionObject,
    fixTreatmentObject
} from "../helpers/dataTransforming";

const get = (apiUrl: string, wrappedFetch: any, filters: IWarehouseQueryFilters, endpoint: string) => {

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filters)
    };

    return wrappedFetch(`${apiUrl}/v1/${endpoint}`, requestOptions).then((response: any) => response.json());

};

const getDimensions = (
    apiUrl: string,
    wrappedFetch: any,
    filters: IWarehouseQueryFilters
) => get(apiUrl, wrappedFetch, filters, "dimensions").then((results: IDimensionObject[]) => results.map(r => fixDimensionObject(r)));

const getResults = (
    apiUrl: string,
    wrappedFetch: any,
    filters: IWarehouseQueryFilters
) => get(
    apiUrl,
    wrappedFetch,
    filters,
    "results"
).then((results: IUOMObject) => ({...results, TreatmentResults: fixTreatmentObject(results.TreatmentResults)}));

const emailFile = (
    apiUrl: string,
    wrappedFetch: any,
    filters: IWarehouseQueryFilters,
    displayFilters: IPdfAPIDisplayFilters,
    language: string,
    exportFileType: string,
    emailInfo: IEmailInfo,
    exportReportType: string
) => {

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            DisplayFilters: displayFilters,
            ExportFileType: exportFileType,
            ExportReportType: exportReportType,
            EmailInfo: emailInfo,
            Filters: filters,
            Meta: {
                TimeStamp: new Date(),
                Language: language
            }
        })
    };

    return wrappedFetch(`${apiUrl}/v1/export/email`, requestOptions).then((response: any) => response.json());

};

const exportCSV = (apiUrl: string, wrappedFetch: any, filters: IWarehouseQueryFilters, displayFilters: IPdfAPIDisplayFilters, language: string) => {

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            DisplayFilters: displayFilters,
            Filters: filters,
            Meta: {
                TimeStamp: new Date(),
                Language: language
            }
        })
    };

    return wrappedFetch(`${apiUrl}/v1/export/csv`, requestOptions).then((response: any) => response.blob());

};

// ***** public SERVICE *****

export const warehouseAPIServiceFactory = (apiUrl: string, wrappedFetch: any) => ({
    getDimensions: (filters) => getDimensions(apiUrl, wrappedFetch, filters),
    getResults: (filters) => getResults(apiUrl, wrappedFetch, filters),
    exportCSV: (
        filters,
        displayFilters,
        language
    ) => exportCSV(apiUrl, wrappedFetch, filters, displayFilters, language),
    emailFile: (
        filters,
        displayFilters,
        language,
        exportFileType,
        emailInfo,
        exportReportType
    ) => emailFile(apiUrl, wrappedFetch, filters, displayFilters, language, exportFileType, emailInfo, exportReportType)
} as IWarehouseAPIService);
