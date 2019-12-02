const loadState = (storage:any) => {
    try {
        const serializedState = storage.getItem("reduxStore-1.1.0");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (storage:any, state:any) => {
    try {
        const serializedState = JSON.stringify(state);
        storage.setItem("reduxStore-1.1.0", serializedState);
    } catch (err) {
        // ignore errors
    }
};

export const localStorageService = {
    loadState: ():any => loadState(localStorage),
    saveState: (state:any):void => saveState(localStorage, state)
};

export const sessionStorageService = {
    loadState: ():any => loadState(sessionStorage),
    saveState: (state:any):void => saveState(sessionStorage, state)
};
