// ***** TypeScript ANNOTATIONS *****

export interface IAppStore {
    name: string;
    featureFlagEnvironment: string;
    identityAPIUrl: string;
    agstudioAPIUrl: string;
    warehouseAPIUrl: string;
    basedataAPIUrl: string;
    pdfAPIUrl: string;
}

// ***** JavaScript IMPLEMENTATION *****

const initialState: IAppStore = {
    name: "AgStudio",
    featureFlagEnvironment: process.env.REACT_APP_FEATURE_FLAG_ENVIRONMENT || "",
    identityAPIUrl: process.env.REACT_APP_IDENTITY_API_URL || "",
    agstudioAPIUrl: process.env.REACT_APP_AGSTUDIO_API_URL || "",
    warehouseAPIUrl: process.env.REACT_APP_WAREHOUSE_API_URL || "",
    basedataAPIUrl: process.env.REACT_APP_BASEDATA_API_URL || "",
    pdfAPIUrl: process.env.REACT_APP_PDF_API_URL || ""
};

export default function app(state = initialState as IAppStore) {
    return state;
}
