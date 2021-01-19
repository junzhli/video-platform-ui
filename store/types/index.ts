import {UserActionType} from "../../actions/types/user";

export type ActionType = UserActionType;

export type Action = {
    type: ActionType,
    payload: any
};

export type StoreReducer = (state: StoreState, action: Action) => StoreState;

export interface IUserMisc {
    userLoggedIn: boolean;
}

export interface StoreState {
    userMisc: IUserMisc;
}


