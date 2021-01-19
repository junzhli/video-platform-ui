import {IWithAuthProps} from "../components/types/WithAuth";
import {IResponseBodyUserVideos} from "./_api";

export namespace IMyVideoPage {
    export interface IInnerProps {
    }

    // export interface IStateFromProps {
    //     userLoggedIn: boolean;
    // }
    //
    // export interface IPropsFromDispatch {
    //     setUserIsLoggedIn: (isLoggedIn: boolean) => void;
    // }

    export interface INextGetServerSideInnerProps {
        page: number;
        data: IResponseBodyUserVideos;
    }
}

export type IMyVideoPageProps = IMyVideoNextGetServerSideProps & IMyVideoPage.IInnerProps;

export interface IMyVideoPageStates {
    // isLoaded: boolean;
}

export type IMyVideoNextGetServerSideProps = IWithAuthProps & IMyVideoPage.INextGetServerSideInnerProps;

