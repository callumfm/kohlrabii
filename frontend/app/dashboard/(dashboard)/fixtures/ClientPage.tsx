"use client"

import { GameweekSelector } from "@/components/common/Selector/GameweekSelector"
import { SeasonSelector } from "@/components/common/Selector/SeasonSelector"
import { TeamSelector } from "@/components/common/Selector/TeamSelector"
import {
  fetchFixtures,
  fixturesKey,
  useFixtures,
} from "@/hooks/queries/fixtures"
import { ClientResponseError, type schemas } from "@/lib/api/core"
import { queryClient } from "@/lib/api/query"
import type { TSeason, TTeam } from "@/lib/api/types"
import { useSeasonMetadata } from "@/providers/SeasonMetadata"
import { notFound, usePathname } from "next/navigation"
import { type FC, Suspense, useMemo, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { GameweekResults } from "./components/GameweekResults"
import { GameweekResultsSkeleton } from "./components/GameweekResultsSkeleton"

type TFilteredFixturesProps = {
  gameweek: number
  season: TSeason
  team_id?: number | null
}

const getFilteredFixtures = ({
  gameweek,
  season,
  team_id,
}: TFilteredFixturesProps) => {
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

  const fixturesData = (data as schemas["FixtureReadPagination"])?.items ?? []

  const filteredFixtures = useMemo(() => {
    if (!team_id) return fixturesData
    return fixturesData.filter(
      (fixture) =>
        fixture.home_team.id === team_id || fixture.away_team.id === team_id,
    )
  }, [fixturesData, team_id])

  return filteredFixtures
}

type TClientPageProps = {
  initialGameweek?: number
  initialSeason?: TSeason
}

const ClientPage: FC<TClientPageProps> = ({
  initialGameweek,
  initialSeason,
}) => {
  const pathname = usePathname()
  const { latestSeason, latestGameweek } = useSeasonMetadata()
  const [selectedGameweek, setSelectedGameweek] = useState<number>(
    initialGameweek || latestGameweek,
  )
  const [currentGameweek, setCurrentGameweek] =
    useState<number>(selectedGameweek)
  const [currentSeason, setCurrentSeason] = useState<TSeason>(
    initialSeason || latestSeason,
  )
  const [currentTeam, setCurrentTeam] = useState<TTeam | null>(null)

  const updateURL = useDebouncedCallback((gw: number, season: TSeason) => {
    setCurrentGameweek(gw)
    const params = new URLSearchParams()
    params.set("gw", gw.toString())
    params.set("s", season)
    // 'replace' causes a server refresh with duplicate request
    window.history.pushState({}, "", `${pathname}?${params.toString()}`)
  }, 300)

  const handleGameweekHover = (next_gw: number) => {
    queryClient.prefetchQuery({
      queryKey: fixturesKey({ season: currentSeason, gameweek: next_gw }),
      queryFn: () =>
        fetchFixtures({ season: currentSeason, gameweek: next_gw }),
    })
  }

  const handleGameweekChange = (gw: number) => {
    setSelectedGameweek(gw)
    updateURL(gw, currentSeason)
  }

  const handleSeasonChange = (season: TSeason) => {
    setCurrentSeason(season)
    updateURL(currentGameweek, season)
  }

  return (
    <div className="container py-6 w-full max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <SeasonSelector
          currentSeason={currentSeason}
          onChange={handleSeasonChange}
        />
        <GameweekSelector
          currentGameweek={selectedGameweek}
          onChange={handleGameweekChange}
          onHover={handleGameweekHover}
        />
        <TeamSelector
          currentTeam={currentTeam}
          onChange={setCurrentTeam}
          season={currentSeason}
        />
      </div>

      <Suspense fallback={<GameweekResultsSkeleton />}>
        <GameweekResults
          fixtures={getFilteredFixtures({
            gameweek: currentGameweek,
            season: currentSeason,
            team_id: currentTeam?.id,
          })}
        />
      </Suspense>
    </div>
  )
}

export default ClientPage
