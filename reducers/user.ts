import { SET_USER_IS_LOGGED_IN } from "../actions/constant";
import { IUserMisc } from "../store/types";
import { UserActionType } from "../actions/types/user";

const userInitialState: IUserMisc = {
    userLoggedIn: false
};

const userReducer = (state: IUserMisc = userInitialState, action: UserActionType): IUserMisc => {
    switch (action.type) {
        case SET_USER_IS_LOGGED_IN: {
            const userLoggedIn = action.payload;
            return {
                ...state,
                userLoggedIn,
            };
        }
    }

    return state;
};

export {
    userInitialState,
    userReducer
};
