import { IWithAuthProps } from "../components/types/WithAuth";
import {IResponseBodyUserVideos} from "./_api";

export namespace IResultPage {
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
        query: string;
        total: number;
        page: number;
        data: IResponseBodyUserVideos;
    }
}

export type IResultPageProps = IResultNextGetServerSideProps & IResultPage.IInnerProps;

export interface IResultPageStates {
    // isLoaded: boolean;
}

// export type IResultNextGetServerSideProps = IResultPage.INextGetServerSideInnerProps;
export type IResultNextGetServerSideProps = IWithAuthProps & IResultPage.INextGetServerSideInnerProps;
