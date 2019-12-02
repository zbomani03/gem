import "@agstudio/web/lib/scss/index.css";

import * as React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";

// Adding languages
import {IntlProvider} from 'react-intl';
import locale from '@agstudio/web/lib/helpers/setupLocale';

// Define Routes
import PrivateRoute from "@agstudio/web/lib/components/PrivateRoute";
import Login from "@agstudio/web/lib/components/Authentication";
import NotFound from "@agstudio/web/lib/components/NotFound";
import Error from "@agstudio/web/lib/components/Error";
import PPA from "./PPA";
import RL from "./RL";
import {Store} from "redux";

const Root = ({store}:{store:Store}) => {

    let navMenu = [
        {
            intlKey: "header.productAnalyzer",
            path: "/",
            qaLocator: "product-analyzer"
        },
        {
            intlKey: "header.resourceLinker",
            path: "/resource-linker",
            qaLocator: "resource-linker"
        }
    ];

    return (
        <Provider store={store}>
            <IntlProvider locale={locale.language} messages={locale.messages as any}>
                <BrowserRouter>
                    <div className="App">
                        <Switch>
                            <Route path="/login" component={Login}/>
                            <Route path="/error" component={Error}/>
                            <PrivateRoute path="/" component={PPA} exact={true} navMenu={navMenu} domainRequired={"company"}/>
                            <PrivateRoute path="/resource-linker" component={RL} exact={true} navMenu={navMenu} domainRequired={"grower"}/>
                            <PrivateRoute path="/404" component={NotFound} navMenu={navMenu}/>
                            <Redirect to="/404" />
                        </Switch>
                    </div>
                </BrowserRouter>
            </IntlProvider>
        </Provider>
    );
};

export default Root;
