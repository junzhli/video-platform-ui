import React, { useReducer, createContext } from 'react';
import {storeReducer, storeInitialState} from "../reducers";
import {Action} from "./types";

const GlobalStateContext = createContext({ state: storeInitialState, dispatch: null as React.Dispatch<Action> });

const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, storeInitialState);
    const value = { state, dispatch };

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export {
    GlobalStateContext,
    GlobalStateProvider,
};

