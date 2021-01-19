import {
    SessionId,
    GetUserListOptions,
    BaseUri,
    ResponseUserURLList,
    ResponseShortenURL, ApiOptions
} from "./types/api";

import axios, {AxiosRequestConfig} from "axios";
import {Tag} from "../types/_api";

const _baseUri = process.env["BACKEND_ENDPOINT"];
const apiDefaultOptions: ApiOptions = {
    baseUri: _baseUri
};
//
// export class BadRequestError extends Error {
//     reason: string;
//     constructor(err: AxiosError) {
//         super("BadRequest");
//         this.name = "BadRequestError";
//         this.reason = err.response.data;
//     }
// }
//
// export class UnauthorizedError extends Error {
//     constructor() {
//         super("Unauthorized");
//         this.name = "UnauthorizedError";
//     }
// }
//
// export class NotFoundError extends Error {
//     constructor() {
//         super("NotFound");
//         this.name = "NotFoundError";
//     }
// }
//
// export class UnknownStatusError extends Error {
//     err: AxiosError;
//     constructor(code: any, axiosErr: AxiosError) {
//         super("UnknownStatus code: " + code);
//         this.name = "UnknownStatusError";
//         this.err = axiosErr;
//     }
// }

const axiosOptions = (token?: SessionId) => {
    // TODO be more secure by separating this from client-rendered js codebase as some unnecessary headers to
    if (token) {
        return {
            headers: {
                Cookie: `connect.sid=${token}`,
                "X-Forwarded-Proto": (process.env["NEXT_PUBLIC_USE_HTTPS"] === "true") ? "https" : undefined
            },
            withCredentials: true,
        } as AxiosRequestConfig;
    }

    // be used in client
    return {
        withCredentials: true
    } as AxiosRequestConfig;
};

const PREFIX = "/internal-api";

export const getUserUrlList = async (baseUri: BaseUri, token: SessionId, options?: GetUserListOptions) => {
    const offset = (options && options.offset) || 0;
    const limit = (options && options.limit) || 100;

    const axiosObject = axios.get.bind(null, `${baseUri}/api/user/url/list?offset=${offset}&limit=${limit}`, axiosOptions(token));
    return (await processResponse(axiosObject)).data as ResponseUserURLList;
};

export const shortenUrl = async (baseUri: BaseUri, token: SessionId, url: string) => {
    const axiosObject = axios.post.bind(null, `${baseUri}/api/shortener/`, {
        url,
    }, axiosOptions(token));
    return (await processResponse(axiosObject)).data as ResponseShortenURL;
};

export const deleteUserUrl = async (baseUri: BaseUri, token: SessionId, shortenId: string) => {
    const axiosObject = axios.delete.bind(null, `${baseUri}/api/user/url/r/${shortenId}`, axiosOptions(token));
    await processResponse(axiosObject);
};

// public api (user)
// export const signOutUser = async (sessionId: SessionId, apiOptions: ApiOptions = apiDefaultOptions) => {
//     const axiosObject = axios.post.bind(null, `${apiOptions.baseUri}/api/user/logout`, axiosOptions(sessionId));
//     await processResponse(axiosObject);
// };
export const getUserInfo = (sessionId: SessionId, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}/api/user/info`, axiosOptions(sessionId));
    return processResponse(axiosObject);
};


export const signOutUser = async (sessionId: SessionId, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.post.bind(null, `${apiOptions.baseUri}/api/user/logout`, axiosOptions(sessionId));
    await processResponse(axiosObject);
};

// public api (videos)
export const getRecentVideos = (apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}/api/video/recent`, axiosOptions());
    return processResponse(axiosObject);
};

export const getUserVideos = (sessionId: SessionId, page: number = 1, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}/api/video/list?p=${page}`, axiosOptions(sessionId));
    return processResponse(axiosObject);
};

export const searchUserPublicVideos = (queryString: string, page: number = 1, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}/api/video/search?query=${escape(queryString)}&p=${page}`, axiosOptions());
    return processResponse(axiosObject);
};

export const getUserVideoPlayback = (sessionId: SessionId, videoId: string, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}/api/video/object/${videoId}`, axiosOptions(sessionId));
    return processResponse(axiosObject);
};

export const getUserVideoComments = (sessionId: SessionId, videoId: string, lastCommentId: string, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}/api/video/object/${videoId}/comment?skipped=${lastCommentId}`, axiosOptions(sessionId));
    return processResponse(axiosObject);
};

interface CSRFBody {
    _csrf: string;
}

interface Comment extends CSRFBody {
    content: string;
}

export const createUserVideoComment = (sessionId: SessionId, videoId: string, comment: Comment, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.post.bind(null, `${apiOptions.baseUri}/api/video/object/${videoId}/comment`, comment, axiosOptions(sessionId));
    return processResponse(axiosObject);
};

export const updateUserVideoLike = (sessionId: SessionId, videoId: string, csrf: CSRFBody, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.post.bind(null, `${apiOptions.baseUri}/api/video/object/${videoId}/like`, csrf, axiosOptions(sessionId));
    return processResponse(axiosObject);
};

export const uploadUserVideo = (sessionId: SessionId, csrf: CSRFBody, file: File, onUploadProgress: any, apiOptions: ApiOptions = apiDefaultOptions) => {
    const formData = new FormData();
    formData.append("file", file);

    const axiosObject = axios.post.bind(null, `${apiOptions.baseUri}/api/video/upload`, formData, {
        ...axiosOptions(sessionId),
        params: {
            _csrf: csrf._csrf
        },
        onUploadProgress,
    });
    return processResponse(axiosObject);
};

interface UserVideoCreationTicket extends CSRFBody {
    objectId: string;
    title: string;
    isPublic: boolean;
    tags: Tag[];
}

export const createUserVideo = (sessionId: SessionId,
                                ticket: UserVideoCreationTicket,
                                apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.post.bind(null, `${apiOptions.baseUri}/api/video/create`, ticket, axiosOptions(sessionId));
    return processResponse(axiosObject);
};

// internal apis
export const setSession = async (sessionId: SessionId, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}${PREFIX}/setSession`, axiosOptions(sessionId));
    return processResponse(axiosObject);
};

export const requestCSRFToken = async (sessionId: SessionId, apiOptions: ApiOptions = apiDefaultOptions) => {
    const axiosObject = axios.get.bind(null, `${apiOptions.baseUri}${PREFIX}/requestCSRFToken`, axiosOptions(sessionId));
    return processResponse(axiosObject);
};


const processResponse = async (axiosObject) => {
    // try {
    return axiosObject();
    // } catch (error) {
    //     if (error.response && error.response.status) {
    //         if (error.response.status === 400) {
    //             throw new BadRequestError(error);
    //         } else if (error.response.status === 401) {
    //             throw new UnauthorizedError();
    //         } else if (error.response.status === 404) {
    //             throw new NotFoundError();
    //         } else {
    //             throw new UnknownStatusError(error.response.status, error);
    //         }
    //     }
    //     throw error;
    // }
};