"use server"

import { Client, unwrap, schemas } from '../utils/api/client'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const _getLatestSeason = async (api: Client): Promise<schemas["CurrentSeasonRead"]> => {
  return unwrap(
    api.GET('/api/v1/seasons/current', {
      cache: 'no-store',
    }),
    {
      404: notFound,
    },
  )
}

export const getLatestSeason = cache(_getLatestSeason)
