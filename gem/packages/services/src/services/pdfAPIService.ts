import {IPdfAPIDisplayFilters, IPdfAPIQueryFilters, IPdfAPIService} from "../models/pdfAPIService";
import {IWarehouseQueryFilters} from "../models/warehouseAPIService";

const exportPDF = (apiUrl: string, wrappedFetch: any, filters: IWarehouseQueryFilters, displayFilters: IPdfAPIDisplayFilters, language: string) => {

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "N8Vdx29l2mkWNBvnIe1tqGLGVPWXKGP7"
        },
        body: JSON.stringify({
            DisplayFilters: displayFilters,
            Filters: filters,
            Meta: {
                TimeStamp: new Date(),
                Language: language
            }
        } as IPdfAPIQueryFilters)
    };

    return wrappedFetch(`${apiUrl}/export-pdf`, requestOptions).then((response: any) => response.blob());

};

// ***** public SERVICE *****

export const pdfAPIServiceFactory = (apiUrl: string, wrappedFetch: any) => ({
    exportPDF: (filters: IWarehouseQueryFilters, displayFilters: IPdfAPIDisplayFilters, language: string) => exportPDF(apiUrl, wrappedFetch, filters, displayFilters, language)
} as IPdfAPIService);
