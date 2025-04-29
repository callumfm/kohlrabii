import { Client, schemas, unwrap } from './api/client'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { operations } from '@/client'

const _getFixtures = async (
  api: Client,
  params?: operations["fixtures_get_fixtures_query"]["parameters"]["query"],
): Promise<schemas['FixtureReadPagination']> => {
  return unwrap(
    api.GET('/api/v1/fixtures', {
      params: {
        query: {
            ...params,
        },
      },
      cache: 'no-store',
    }),
    {
      404: notFound,
    },
  )
}

// Tell React to memoize it for the duration of the request
export const getFixtures = cache(_getFixtures)
