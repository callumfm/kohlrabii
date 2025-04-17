import { api } from '@/utils/client'
import { operations, unwrap } from '@/utils/api/client'
import { useQuery } from '@tanstack/react-query'
import { defaultRetry } from '@/hooks/queries/retry'

export const useFixtureForecasts = (
  parameters?: Omit<
    NonNullable<operations['fixtures_get_fixture_forecasts_query']['parameters']['query']>,
    'pageParam'
  >,
  options?: { initialData?: any }
) =>
  useQuery({
    queryKey: ['fixtures', parameters],
    queryFn: async () =>
      unwrap(
        api.GET('/api/v1/fixtures/forecasts', {
          params: {
            query: {
              ...parameters,
            },
          },
        }),
      ),
    retry: defaultRetry,
    initialData: options?.initialData,
  })
