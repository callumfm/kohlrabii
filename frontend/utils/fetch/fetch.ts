import queryString from "query-string";

import {
    RESPONSE_TYPES,
    type TFetchInstanceProps,
    type TFetchProps,
} from "./types";

const parseErrorData = async (error: any) => {
    try {
        return { ...(await error.json()) }
    } catch (error) {
        return {}
    }
}

const fetcher = ({ token }: TFetchInstanceProps) =>
    async ({
        url,
        init,
        body,
        params,
        type = RESPONSE_TYPES.JSON,
        baseUrl = process.env.NEXT_PUBLIC_API_URL,
        withAuthorization = true,
    }: TFetchProps) => {
        const paramsQuery = queryString.stringify(params || {}, {
            skipEmptyString: true,
        });

        const options: RequestInit = {
            ...init,
            credentials: "include",
            cache: "no-cache"
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        options.headers = new Headers(
            options.headers || {
                "Content-Type": "application/json",
            },
        )

        if (token && withAuthorization) {
            options.headers.set("Authorization", `Bearer ${token}`);
        }

        const response = await fetch(
            `${baseUrl}${url}${paramsQuery ? `?${paramsQuery}` : ""}`,
            options,
        )

        if (!response.ok || response.status > 400) {
            const data = await parseErrorData(response);

            return Promise.reject({
                status: response.status,
                ...data,
            })
        }

        if (type === RESPONSE_TYPES.EMPTY) {
            return {
                status: response.status,
            }
        }

        if (type === RESPONSE_TYPES.RAW) {
            return response
        }

        if (type === RESPONSE_TYPES.TEXT) {
            return response.text();
        }

        return response.json();
    }

export default fetcher;

export const fetchCatch = (response: Response) => {
    const message = "Failed to fetch data"
    const status = response.status

    throw new Error(
        JSON.stringify({
            message,
            status,
            url: response.url,
        }),
    )
}
