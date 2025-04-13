import fetcher, { type TParams } from "@/utils/fetch"
import { TFixtureForecastResponse } from "./types"

export const getFixtureForecasts = async (
    params?: TParams,
): Promise<TFixtureForecastResponse> => {
    const data = await fetcher({
        url: "/fixture-forecasts",
        params: { ...params },
    })
    return data
}
