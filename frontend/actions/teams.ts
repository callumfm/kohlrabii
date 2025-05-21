"use server"

import type { operations } from "@/lib/api/schema"
import { notFound } from "next/navigation"
import { cache } from "react"
import { type Client, type schemas, unwrap } from "../lib/api/core"

const _getTeam = async (
  api: Client,
  params: operations["teams_get_team_by_id"]["parameters"]["path"],
): Promise<schemas["TeamRead"]> => {
  return unwrap(
    api.GET("/api/v1/teams/{team_id}", {
      params: {
        path: {
          team_id: params.team_id,
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
export const getTeam = cache(_getTeam)
