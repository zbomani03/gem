import * as React from "react";
import {shallowWithIntl} from '@agstudio/web/lib/test/intl-enzyme-test-helper';
import RLComponent from "./RLComponent";

describe('<RLComponent>', () => {

    test('renders without crashing', () => {
        shallowWithIntl(<RLComponent basedataAPIService={{} as any} agstudioAPIService={{} as any} domain={{} as any}/>);
        // expect(component).toMatchSnapshot;
    });
    
    // simulate crop year change
    // simulate sorting change
    // simulate filter change
});
