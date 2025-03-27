export enum RESPONSE_TYPES {
    JSON = "json",
    RAW = "raw",
    TEXT = "text",
    EMPTY = "empty",
}

export type TParams = { [key: string]: unknown }
export type TBody = { [key: string]: unknown }

export type TFetchProps = {
    url: string,
    init?: RequestInit | undefined,
    type?: "json" | "raw" | "text" | "empty",
    baseUrl?: string,
    body?: TBody,
    params?: TParams,
    withAuthorization?: boolean,
}

export type TFetchInstanceProps = {
    token?: string,
}

export type TErrorResponse = {
    status?: number,
} & Response
