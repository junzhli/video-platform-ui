
export interface GetUserListOptions {
    offset?: number;
    limit?: number;
}

export type BaseUri = string;

export type SessionId = string;

export interface ApiOptions {
    baseUri?: string;
}

interface ResponseUserURL {
    origin_url: string;
    shorten_url: string;
    hits: number;
}

export interface ResponseUserURLList {
    total: number;
    urls: ResponseUserURL[];
}

export interface ResponseShortenURL {
    url: string;
}

export interface ResponseSetSession {
    User: boolean;
    Session: boolean;
}