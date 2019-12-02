import * as React from "react";
import * as ReactDOM from "react-dom";
import configureStore from "@agstudio/web/lib/configureStore";
import rootReducer from "./rootReducer";
import registerServiceWorker from "./registerServiceWorker";
import Root from "./components/Root";

const store = configureStore(rootReducer);
const render = () => ReactDOM.render(<Root store={store} />, document.getElementById("root") as HTMLElement);

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./components/Root', render);
}

render();
registerServiceWorker();

export default store;
