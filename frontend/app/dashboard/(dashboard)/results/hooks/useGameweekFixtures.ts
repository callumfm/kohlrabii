"use client"

import { useFixtures } from "@/hooks/queries/fixtures"
import { ClientResponseError } from "@/lib/api/core"
import type { TFixturePagination, TSeason } from "@/lib/api/types"
import { filterFixturesByTeam, groupFixturesByDate } from "@/utils/fixtures"
import { notFound } from "next/navigation"
import { useMemo } from "react"

type GameweekFixturesProps = {
  gameweek: number
  season: TSeason
  team_id?: number | null
}

export const useGameweekFixtures = ({
  gameweek,
  season,
  team_id,
}: GameweekFixturesProps) => {
  const { data, error } = useFixtures(
    { season: season, gameweek: gameweek },
    { suspense: true },
  )

  if (
    error instanceof ClientResponseError &&
    (error.response.status === 404 || error.response.status === 422)
  ) {
    notFound()
  }

  const fixtures = (data as TFixturePagination)?.items ?? []

  const filteredFixtures = useMemo(() => {
    return groupFixturesByDate(filterFixturesByTeam(fixtures, team_id))
  }, [fixtures, team_id])

  return filteredFixtures
}
