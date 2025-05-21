"use server"

import { type Client, type schemas, unwrap } from "@/lib/api/core"
import type { operations } from "@/lib/api/schema"
import { notFound } from "next/navigation"
import { cache } from "react"

const _getFixtures = async (
  api: Client,
  params?: operations["fixtures_get_fixtures_query"]["parameters"]["query"],
): Promise<schemas["FixtureReadPagination"]> => {
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
