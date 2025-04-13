"use client";

import { FC, useCallback, useEffect, useState } from "react"
import { TFixtureForecastResponse } from "./types"
import { TPagination } from "@/lib/types"
import { TFilterFieldProps } from "./Filters"
import fetcher from "@/utils/fetch/client"
import useSWR from "swr"

type TFixtureForecastsPageProps = {
    forecasts: TFixtureForecastResponse
}

const FixtureForecastsContent: FC<TFixtureForecastsPageProps> = ({ forecasts }) => {
    const [filterData, setFilterData] = useState<TFilterFieldProps>()

    const [paginationData, setPaginationData] = useState<TPagination>({
        total: forecasts.total,
        totalPages: forecasts.totalPages,
        page: forecasts.page,
        pageSize: forecasts.pageSize,
    })

    const getQueryParams = useCallback(() => {
        return {
            search: filterData?.search,
            page: paginationData.page,
            pageSize: paginationData.pageSize,
        }
    }, [filterData, paginationData])

    const { data, mutate } = useSWR(
        "/fixture-forecasts",
        (pathname) => {
            return fetcher({
                url: "/api/data",
                params: {
                    pathname,
                    ...getQueryParams(),
                },
                baseUrl: ""
            })
        },
        { fallbackData: forecasts }
    )

    useEffect(() => {
        mutate()
    }, [mutate, getQueryParams])

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
          <div className="w-full">
            <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
              Dashboard landing page
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h2 className="font-bold text-2xl mb-4">Fixture forecasts</h2>
            <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
              {JSON.stringify(data)}
            </pre>
          </div>
        </div>
    );
}

export default FixtureForecastsContent
