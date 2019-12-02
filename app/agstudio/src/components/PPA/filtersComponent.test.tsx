import * as React from "react";
import {shallowWithIntl} from '@agstudio/web/lib/test/intl-enzyme-test-helper';
import FiltersComponent from "./filtersComponent";
import {initialState as filters} from "./filtersReducer";

describe('<FiltersComponent>', () => {

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

    test('renders without crashing', () => {
        shallowWithIntl(<FiltersComponent featureFlags={{} as any} agstudioAPIService={{} as any} domainKey={""} filters={filters} displayFilters={displayFilters} saveFilters={jest.fn()} isFilterEditing={false} setIsFilterEditing={jest.fn()}/>);
    });

});
