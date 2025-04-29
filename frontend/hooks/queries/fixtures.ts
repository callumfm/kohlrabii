import { api } from '@/utils/client'
import { operations, unwrap } from '@/utils/api/client'
import { useQuery } from '@tanstack/react-query'

export const useFixtures = (
  parameters?: operations['fixtures_get_fixtures_query']['parameters']['query'],
  options?: { suspense?: boolean }
) =>
  useQuery({
    queryKey: ['fixtures', parameters],
    queryFn: async () =>
      unwrap(
        api.GET('/api/v1/fixtures', {
          params: {
            query: {
              ...(parameters || {}),
            },
          },
        }),
      ),
    ...(options?.suspense ? { suspense: true } : {}),
  })
