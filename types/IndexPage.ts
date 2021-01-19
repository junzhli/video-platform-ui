import { IWithAuthProps } from "../components/types/WithAuth";
import {IResponseBodyUserVideos} from "./_api";

export namespace IIndexPage {
    export interface IInnerProps {
        videos: IResponseBodyUserVideos;
    }

    // export interface IStateFromProps {
    //     userLoggedIn: boolean;
    // }
    //
    // export interface IPropsFromDispatch {
    //     setUserIsLoggedIn: (isLoggedIn: boolean) => void;
    // }

    export interface INextGetServerSideInnerProps {
        csrfToken?: string;
    }
}

export type IIndexPageProps = IIndexNextGetServerSideProps & IIndexPage.IInnerProps;

export interface IIndexPageStates {
    // isLoaded: boolean;
}

export type IIndexNextGetServerSideProps = IWithAuthProps & IIndexPage.INextGetServerSideInnerProps;
