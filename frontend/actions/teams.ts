"use server"

import type { operations } from "@/lib/api/schema"
import type { TTeam } from "@/lib/api/types"
import { notFound } from "next/navigation"
import { cache } from "react"
import { type Client, unwrap } from "../lib/api/core"

type TParams = operations["teams_get_team_by_id"]["parameters"]["path"]

const _getTeam = async (api: Client, params: TParams): Promise<TTeam> => {
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
