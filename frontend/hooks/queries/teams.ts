import { type operations, type schemas, unwrap } from "@/utils/api/client"
import { api } from "@/utils/client"
import { useQuery } from "@tanstack/react-query"

export const useTeams = (
  parameters: operations["teams_get_teams_for_season"]["parameters"]["query"],
) =>
  useQuery({
    queryKey: ["teams", parameters],
    queryFn: async () =>
      unwrap(
        api.GET("/api/v1/teams", {
          params: {
            query: {
              season: parameters.season,
            },
          },
        }),
      ),
  })

export const useTeam = (
  parameters: operations["teams_get_team_by_id"]["parameters"]["path"],
  initialData?: schemas["TeamRead"],
) =>
  useQuery({
    queryKey: ["teams", parameters],
    queryFn: async () =>
      unwrap(
        api.GET("/api/v1/teams/{team_id}", {
          params: {
            path: {
              team_id: parameters.team_id,
            },
          },
        }),
      ),
    initialData: initialData,
  })
