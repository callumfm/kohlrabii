import { Client, schemas, unwrap } from './api/client'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { type TParams } from "@/utils/fetch"

const _getFixtures = async (
  api: Client,
  params?: TParams,
): Promise<schemas['FixtureReadPagination']> => {
  return unwrap(
    api.GET('/api/v1/fixtures/', {
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
