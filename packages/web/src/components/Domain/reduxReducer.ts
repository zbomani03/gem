import {domainTypes, IDomainAction} from "./reduxActions";
import {ICompanyObject, IGrowerObject, ILocationObject, ITerritoryObject} from "@agstudio/services/lib/models/agstudioAPIService";

// ***** TypeScript ANNOTATIONS *****

interface IDomainStoreSingleValue {
    selected: string;
}

interface IDomainStoreCompanies extends IDomainStoreSingleValue {
    list: ICompanyObject[];
}

interface IDomainStoreTerritories extends IDomainStoreSingleValue {
    list: ITerritoryObject[];
}

interface IDomainStoreLocations extends IDomainStoreSingleValue {
    list: ILocationObject[];
}

interface IDomainStoreGrowers extends IDomainStoreSingleValue {
    list: IGrowerObject[];
}

export interface IDomainStore {
    companies: IDomainStoreCompanies;
    territories: IDomainStoreTerritories;
    locations: IDomainStoreLocations;
    growers: IDomainStoreGrowers;
}

// ***** JavaScript IMPLEMENTATION *****

export const initialState: IDomainStore = {
    companies: {
        selected: "",
        list: []
    },
    territories: {
        selected: "",
        list: []
    },
    locations: {
        selected: "",
        list: []
    },
    growers: {
        selected: "",
        list: []
    }
};

export default function domain(state = initialState as IDomainStore, action: IDomainAction) {
    return action.type === domainTypes.SAVE ? action.payload as IDomainStore : state;
}
