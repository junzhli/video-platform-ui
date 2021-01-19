import {IResponseBodyUserVideos} from "../../types/_api";

export namespace IMyVideoLibrary {
    export interface IInnerProps {
        myvideos: IResponseBodyUserVideos;
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

export type IIMyVideoLibraryProps = IMyVideoLibrary.IInnerProps; // & IMainBanner.IStateFromProps & IMainBanner.IPropsFromDispatch;

export interface IIMyVideoLibraryStates {
    // isLoaded: boolean;
}