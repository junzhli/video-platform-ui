// IVideoInfo
export namespace ILayout {
    export interface IInnerProps {
        videoOn?: boolean;
        query?: string;
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

export type ILayoutProps = ILayout.IInnerProps; // & IMainBanner.IStateFromProps & IMainBanner.IPropsFromDispatch;

export interface ILayoutStates {
    // isLoaded: boolean;
}