import ReactPDF from '@react-pdf/renderer';
import {IPdfAPIQueryFilters} from "@agstudio/services/lib/models/pdfAPIService";
import {agstudioAPIServiceFactory} from "@agstudio/services/lib/services/agstudioAPIService";
import {warehouseAPIServiceFactory} from "@agstudio/services/lib/services/warehouseAPIService";
import PDFComponent from '../components/PDFComponent';
import wrappedFetch from "../helpers/wrappedFetch";

export interface IPDFService {
    create(body: IPdfAPIQueryFilters, token: string): Promise<NodeJS.ReadableStream>;
}

const PDFService: IPDFService = {
    // Create a pdf and return it as a ReadableStream
    create : (body: IPdfAPIQueryFilters, token: string) => {
        const agstudioAPIService = agstudioAPIServiceFactory(process.env.AGSTUDIO_API_URL, wrappedFetch(token));
        const warehouseAPIService = warehouseAPIServiceFactory(process.env.WAREHOUSE_API_URL, wrappedFetch(token));
        return Promise.all([
            agstudioAPIService.loadDomainLogo(body.Filters.DomainKey).catch(() => undefined),
            warehouseAPIService.getResults(body.Filters)
        ]).then((r:any[]) => {
            return ReactPDF.renderToStream(PDFComponent({
                Logo: r[0] || undefined,
                Results: r[1],
                Filters: body.DisplayFilters,
                Meta: body.Meta
            }));
        });
    }
};

export default PDFService;
