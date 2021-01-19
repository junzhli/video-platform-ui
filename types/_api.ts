// all types refer to data from backend server

export const NUMBER_IN_PAGE = 20;

export type IResponseBodySearchUserPublicVideos = {
    total: number,
    results: IResponseBodyUserVideos
};
export type IResponseBodyUserVideos = IReponseBodyUserVideo[];

export interface IReponseBodyUserVideo {
    user: {
        fullname: string;
        avatar: string;
    };
    videoId: string;
    tags: Tag[];
    available: boolean;
    isPublic: boolean;
    title: string;
    time: number;
    likes: number;
    views: number;
    clips?: IResponseBodyClip[];
    thumbnail?: string;
    duration?: number;
}

export const DEFINITIONS = ["HD", "SD", "FullHD"] as const;

export interface IResponseBodyClip {
    definition: typeof DEFINITIONS[number];
}

export const TAGS = ["FUN", "EDUCATION", "POLITIC"] as const;
export type Tag = typeof TAGS[number];// data from api server
export type IResponseBodyComments = IResponseBodyComment[];

interface IResponseBodyGenericMessageObjectId {
    objectId: string;
}

export type IResponseBodyUploadedVideo = IResponseBodyGenericMessageObjectId;
export type IResponseBodyUploadedTempClip = IResponseBodyGenericMessageObjectId;

export interface IResponseBodyComment {
    id: any;
    userId: string;
    userFullname: string;
    userAvatar: string;
    content: string;
    edit: boolean;
    updated_timestamp: number;
}

export interface IResponseBodyUserLike {
    like: boolean;
}

export interface IResponseBodyUserPreVideoPlayback {
    tags: Tag[];
    title: string;
    time: number;
    playbacks: IResponseBodyClipPreVideoPlaybacks;
    duration: number;
    thumbnail?: string;
    isPublic?: boolean;
    likes: number;
    liked: boolean;
    views: number;
    comments: number;
    topComments?: IResponseBodyComment[];
}

export type Auth = "local" | "google";

export interface IResponseBodyUserInfo {
    id: string;
    username?: string;
    email: string;
    firstname?: string;
    lastname?: string;
    fullname?: string;
    avatar?: string;
    authMethod: Auth[];
}

export type IResponseBodyClipPreVideoPlaybacks = {
    [key in typeof DEFINITIONS[number]]?: IResponseBodyClipPreVideoPlayback;
};

export type IResponseBodyClipPreVideoPlayback = IResponseBodyGenericMessageObjectId;

interface IResponseBodyGenericMessageObjectId {
    objectId: string;
}