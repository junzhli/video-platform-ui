import {IWithAuthProps} from "../components/types/WithAuth";
import {IResponseBodyUserPreVideoPlayback} from "./_api";

export namespace IWatchPage {
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
        error?: boolean;
        videoId?: string;
        video?: IResponseBodyUserPreVideoPlayback;
        user?: {
            id: string
            fullname: string
            avatar: string
        };
        csrfToken?: string;
    }
}

export type IWatchPageProps = IWatchNextGetServerSideProps & IWatchPage.IInnerProps;

export interface IWatchPageStates {
    // isLoaded: boolean;
}

export type IWatchNextGetServerSideProps = IWithAuthProps & IWatchPage.INextGetServerSideInnerProps;

