import * as React from "react";
import { shallowWithIntl } from '@agstudio/web/lib/test/intl-enzyme-test-helper';
import GridComponent from "./gridComponent";
import { initialState as filters } from "./filtersReducer";
import { initialState as dimensions } from "./dimensionsReducer";
import {initialState as domain} from "@agstudio/web/lib/components/Domain/reduxReducer";
import { IPPAGridStore } from "./gridReducer";
import { ITreatmentObject } from "@agstudio/services/lib/models/warehouseAPIService";

const displayFilters = {
    Company: "",
    Territory: "",
    Location: "",
    Grower: "",
    Commodity: "",
    CropYears: "",
    PreviousCrop: "",
    Irrigation: "",
    Traits: "",
    Products: ""
};
const sort: (treatmentResults: ITreatmentObject, column: string, dimensionValue?: string) => void = jest.fn();
const grid: IPPAGridStore = {
    isLoading: false,
    results: {
        UnitOfMeasure: 'bu/acre',
        Metric: 'Yield',
        TreatmentResults: {
            Dimension: {
                Name: 'SeedRate',
                DataUse: 'Measure',
                SortColumn: 'Mean',
                SortDirection: 'Descending',
                CropZoneCount: 0,
                CropZoneAcres: 0,
            },
            Results: [{
                DimensionValue: 'undefined',
                Stats: {
                    TotalYield: 0,
                    SumX: 0,
                    SumX2: 0,
                    Min: 0,
                    Max: 0,
                    NumberOfAcres: 0,
                    NumberOfCropZones: 0,
                    Mean: 0,
                    StdDev: 0,
                    HighMid: 0,
                    LowMid: 0
                },
                ChildResults: {
                    Dimension: {
                        Name: '',
                        CropZoneAcres: 0,
                        CropZoneCount: 0,
                        DataUse: '',
                        SortColumn: 'NumberOfAcres',
                        SortDirection: 'desc',
                    },
                    Results: []
                },
            }]
        },
    }
};
const toggleChildren: (dimensionValue: string) => void = jest.fn();
const toggleAllChildren: (showChildren: boolean) => void = jest.fn();
// const sendEmail = jest.fn();

test('renders without crashing', () => {
    shallowWithIntl(<GridComponent domain={domain} warehouseAPIService={{} as any} pdfAPIService={{} as any} filters={filters} dimensions={dimensions} displayFilters={displayFilters} sort={sort} grid={grid} toggleChildren={toggleChildren} toggleAllChildren={toggleAllChildren} isFilterEditing={false} />);
});

// describe('calls sendEmail method when email button is clicked', () => {
//     const component = shallowWithIntl(<GridComponent warehouseAPIUrl={""} pdfAPIUrl={""} filters={filters} dimensions={dimensions} displayFilters={displayFilters} sort={sort} grid={grid} toggleChildren={toggleChildren} toggleAllChildren={toggleAllChildren} isFilterEditing={isFilterEditing} />);
//     beforeEach(() => {
//         component.dive().find('[data-qa="ppa-email-button"]').simulate('click');
//     });
//     test('invokes the callback', () => {
//         expect(sendEmail).toBeCalled();
//     });
// });