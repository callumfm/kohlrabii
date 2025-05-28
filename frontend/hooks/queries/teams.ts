import { createClientSideAPI } from "@/lib/api/client"
import { type operations, unwrap } from "@/lib/api/core"
import { useQuery } from "@tanstack/react-query"

type TParams = operations["teams_get_teams_for_season"]["parameters"]["query"]

export const fetchTeams = async (parameters: TParams) => {
  const api = await createClientSideAPI()
  return unwrap(
    api.GET("/api/v1/teams", {
      params: {
        query: {
          season: parameters.season,
        },
      },
    }),
  )
}

export const useTeams = (parameters: TParams) =>
  useQuery({
    queryKey: ["teams", parameters],
    queryFn: async () => fetchTeams(parameters),
  })

// export const useTeam = (
//   parameters: operations["teams_get_team_by_id"]["parameters"]["path"],
//   initialData?: schemas["TeamRead"],
// ) =>
//   useQuery({
//     queryKey: ["teams", parameters],
//     queryFn: async () =>
//       unwrap(
//         api.GET("/api/v1/teams/{team_id}", {
//           params: {
//             path: {
//               team_id: parameters.team_id,
//             },
//           },
//         }),
//       ),
//     initialData: initialData,
//   })
