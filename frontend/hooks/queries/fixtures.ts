import { api } from "@/lib/api/client"
import { type operations, unwrap } from "@/lib/api/core"
import { useQuery } from "@tanstack/react-query"

type TParams = operations["fixtures_get_fixtures_query"]["parameters"]["query"]

export const fixturesKey = (parameters?: TParams) =>
  // TODO: Unpack in same order
  ["fixtures", parameters] as const

export const fetchFixtures = async (parameters: TParams) =>
  unwrap(
    api.GET("/api/v1/fixtures", {
      params: {
        query: {
          ...(parameters || {}),
        },
      },
    }),
  )

export const useFixtures = (
  parameters?: TParams,
  options?: { suspense?: boolean },
) =>
  useQuery({
    queryKey: fixturesKey(parameters),
    queryFn: () => fetchFixtures(parameters),
    ...(options?.suspense ? { suspense: true } : {}),
    // dont speread options may override staleTime?
  })
