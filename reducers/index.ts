import combineReducers from "react-combine-reducers";
import {StoreReducer} from "../store/types";
import {userInitialState, userReducer} from "./user";



const [storeReducer, storeInitialState] = combineReducers<StoreReducer>({
    userMisc: [userReducer, userInitialState]
});

export {
    storeReducer,
    storeInitialState
};
