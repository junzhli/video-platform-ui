import {IResponseBodyUserVideos, Tag} from "../../types/_api";

// IGridVideo
export namespace IGridVideo {
    export interface IInnerProps {
        user: {
            fullname: string;
            avatar: string;
        };
        videoId: string;
        tags: Tag[];
        title: string;
        time: number;
        views: number;
        thumbnail?: string;
        duration?: number;
    }

    // export interface IStateFromProps {
    //     blockHeight: BlockHeightType;
    //     accountAddress: AddressType | null;
    //     membership: Membership | null;
    //     loadingHintEnabled: boolean;
    // }

    // export interface IPropsFromDispatch {
    //     setBlockHeight: (blockHeight: BlockHeightType) => void;
    //     setAccountAddress: (accountAddress: AddressType) => void;
    //     setMembership: (nextMembership: Membership) => void;
    //     setNotificationStatus: (status: boolean) => void;
    //     setUserWindowsFocus: (focus: boolean) => void;
    // }
}

export type IIGridVideoProps = IGridVideo.IInnerProps; // & IMainBanner.IStateFromProps & IMainBanner.IPropsFromDispatch;

export interface IIGridVideoStates {
    // isLoaded: boolean;
}



// ISearchResult
export namespace ISearchResult {
    export interface IInnerProps {
        query: string;
        total: number;
        page: number;
        data: IResponseBodyUserVideos;
    }

    // export interface IStateFromProps {
    //     blockHeight: BlockHeightType;
    //     accountAddress: AddressType | null;
    //     membership: Membership | null;
    //     loadingHintEnabled: boolean;
    // }

    // export interface IPropsFromDispatch {
    //     setBlockHeight: (blockHeight: BlockHeightType) => void;
    //     setAccountAddress: (accountAddress: AddressType) => void;
    //     setMembership: (nextMembership: Membership) => void;
    //     setNotificationStatus: (status: boolean) => void;
    //     setUserWindowsFocus: (focus: boolean) => void;
    // }
}

export type IISearchResultProps = ISearchResult.IInnerProps; // & IMainBanner.IStateFromProps & IMainBanner.IPropsFromDispatch;

export interface IISearchResultStates {
    // isLoaded: boolean;
}