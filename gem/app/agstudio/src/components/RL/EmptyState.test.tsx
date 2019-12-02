import * as React from "react";
import {shallowWithIntl} from '@agstudio/web/lib/test/intl-enzyme-test-helper';
import EmptyState from "./EmptyState";

describe('<RL>', () => {

    test('renders without crashing', () => {
        shallowWithIntl(<EmptyState title="Test title"/>);
    });

});
