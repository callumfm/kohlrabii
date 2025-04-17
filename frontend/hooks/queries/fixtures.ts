import { api } from '@/utils/client'
import { operations, unwrap } from '@/utils/api/client'
import { useQuery } from '@tanstack/react-query'
import { defaultRetry } from '@/hooks/queries/retry'

export const useFixtures = (
  parameters?: operations['fixtures_get_fixtures_query']['parameters']['query'],
  options?: { suspense?: boolean }
) =>
  useQuery({
    queryKey: ['fixtures', parameters],
    queryFn: async () =>
      unwrap(
        api.GET('/api/v1/fixtures/', {
          params: {
            query: {
              ...(parameters || {}),
            },
          },
        }),
      ),
    retry: defaultRetry,
    ...(options?.suspense ? { suspense: true } : {}),
  })
