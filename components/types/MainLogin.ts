import { WithRouterProps } from "next/dist/client/with-router";

export namespace IMainLogin {
    export interface IInnerProps {
    }

    // export interface IStateFromProps {
    //     userLoggedIn: boolean;
    // }
    //
    // export interface IPropsFromDispatch {
    //     setUserIsLoggedIn: (isLoggedIn: boolean) => void;
    // }
}

export type IMainLoginProps = WithRouterProps & IMainLogin.IInnerProps;

export interface IMainLoginStates {
    userName: string;
    userPassword: string;
    localSignInErrMessage: string;
}
