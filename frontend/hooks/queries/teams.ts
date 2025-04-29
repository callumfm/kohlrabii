import { api } from '@/utils/client'
import { operations, unwrap } from '@/utils/api/client'
import { useQuery } from '@tanstack/react-query'

export const useTeams = (
  parameters: operations['teams_get_teams_for_season']['parameters']['query'],
) =>
  useQuery({
    queryKey: ['teams', parameters],
    queryFn: async () =>
      unwrap(
        api.GET('/api/v1/teams', {
          params: {
            query: {
              season: parameters.season,
            },
          },
        }),
      ),
  })
