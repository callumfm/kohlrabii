import { redirect } from "next/navigation"
import fetcher from "./fetch"
import type { TFetchProps } from "./types"
import camelcaseKeys from "camelcase-keys"

const instance = async (params: TFetchProps) => {

    const results = await fetcher({})(
        params
    ).catch((error) => {
        return error
    })

    if (results.status === 401) {
        redirect("/api/auth/signin")
    }

    return camelcaseKeys(results, { deep: true })
}

export default instance;
