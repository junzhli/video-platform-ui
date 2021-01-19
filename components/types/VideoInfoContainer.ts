// IVideoInfo
export namespace IVideoInfo {
    export interface IInnerProps {
        className?: string;
        title: string;
        username: string;
        userImageLink: string;
        views: number;
        public: boolean;
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

// IVideoPreview
export namespace IVideoPreview {
    export interface IInnerProps {
        className?: string;
        imageLink: string;
        videoAvailable: boolean;
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


// IVideoInfoContainer
export namespace IVideoInfoContainer {
    export interface IInnerProps {
        className?: string;
        videoTitle: string;
        videoImage?: string;
        videoViews: number;
        videoAvailable?: boolean;
        videoPublic?: boolean;
        userFullname: string;
        userImage?: string;

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

export type IVideoInfoContainerProps = IVideoInfoContainer.IInnerProps; // & IMainBanner.IStateFromProps & IMainBanner.IPropsFromDispatch;

export interface IVideoLibraryStates {
    // isLoaded: boolean;
}