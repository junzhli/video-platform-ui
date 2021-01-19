
export namespace ICommentBox {
    export interface IInnerProps {
        user: {
            id: string
            fullname: string
            avatar: string
        };
        id: string;
        content: string;
        updated_timestamp: number;
        edit: boolean;
        // likes: number;
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

export type ICommentBoxProps = ICommentBox.IInnerProps; // & IMainBanner.IStateFromProps & IMainBanner.IPropsFromDispatch;

export interface ICommentBoxStates {
    // isLoaded: boolean;
}