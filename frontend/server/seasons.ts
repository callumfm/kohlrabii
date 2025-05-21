"use server"

import { notFound } from "next/navigation"
import { cache } from "react"
import { type Client, type schemas, unwrap } from "../utils/api/client"

const _getLatestSeason = async (
  api: Client,
): Promise<schemas["CurrentSeasonRead"]> => {
  return unwrap(
    api.GET("/api/v1/seasons/current", {
      cache: "no-store",
    }),
    {
      404: notFound,
    },
  )
}

export const getLatestSeason = cache(_getLatestSeason)
