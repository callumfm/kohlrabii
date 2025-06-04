"use server"

import { type Client, unwrap } from "@/lib/api/core"
import type { operations } from "@/lib/api/schema"
import type { TFixturePagination } from "@/lib/api/types"
import { notFound } from "next/navigation"
import { cache } from "react"

type TParams = operations["fixtures_get_fixtures_query"]["parameters"]["query"]

const _getFixtures = async (
  api: Client,
  params?: TParams,
): Promise<TFixturePagination> => {
  return unwrap(
    api.GET("/api/v1/fixtures", {
      params: {
        query: {
          ...params,
        },
      },
      cache: "no-store",
    }),
    {
      404: notFound,
    },
  )
}

// Tell React to memoize it for the duration of the request
export const getFixtures = cache(_getFixtures)
