// reference: https://michalzalecki.com/testing-redux-thunk-like-you-always-want-it/

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

export const mockStore = configureMockStore([thunk]);
