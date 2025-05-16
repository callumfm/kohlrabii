"use client"

import { type FC, useState, Suspense, useMemo } from "react"
import { useFixtures, fixturesKey, fetchFixtures } from "@/hooks/queries/fixtures"
import { ClientResponseError, schemas } from "@/utils/api/client"
import GameweekResults from "@/components/Fixtures/GameweekResults"
import GameweekSelector from "@/components/Fixtures/GameweekSelector"
import GameweekResultsSkeleton from "@/components/Fixtures/GameweekResultsSkeleton"
import { SeasonSelector } from "@/components/Fixtures/SeasonSelector"
import { useDebouncedCallback } from "use-debounce"
import { usePathname, useRouter, notFound } from "next/navigation"
import { Season, Team } from "@/client/types"
import { TeamSelector } from "@/components/Fixtures/TeamSelector"
import { useSeasonMetadata } from "@/providers/SeasonMetadata"
import { queryClient } from "@/utils/api/query"

type TResultsProps = {
  gameweek: number
  season: Season
  team_id?: number | null
}

const ResultsContent = ({ gameweek, season, team_id }: TResultsProps) => {
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
    return fixturesData.filter(fixture =>
      fixture.home_team.id === team_id || fixture.away_team.id === team_id
    )
  }, [fixturesData, team_id])

  return <GameweekResults fixtures={filteredFixtures} />
}

type TFixturesProps = {
  initialGameweek?: number
  initialSeason?: Season
}

const FixturesContent: FC<TFixturesProps> = ({ initialGameweek, initialSeason }) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { latestSeason, latestGameweek } = useSeasonMetadata()

  const [selectedGameweek, setSelectedGameweek] = useState<number>(initialGameweek || latestGameweek)
  const [currentGameweek, setCurrentGameweek] = useState<number>(selectedGameweek)
  const [currentSeason, setCurrentSeason] = useState<Season>(initialSeason || latestSeason)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)

  const updateURL = useDebouncedCallback((gw: number, season: Season) => {
    setCurrentGameweek(gw)
    const params = new URLSearchParams()
    params.set("gw", gw.toString())
    params.set("s", season)
    // 'replace' causes a server refresh with duplicate request
    window.history.pushState({}, '', `${pathname}?${params.toString()}`)
  }, 300)

  const handleGameweekHover = (next_gw: number) => {
    queryClient.prefetchQuery({
      queryKey: fixturesKey({ season: currentSeason, gameweek: next_gw }),
      queryFn: () => fetchFixtures({ season: currentSeason, gameweek: next_gw }),
    })
  }

  const handleGameweekChange = (gw: number) => {
    setSelectedGameweek(gw)
    updateURL(gw, currentSeason)
  }

  const handleSeasonChange = (season: Season) => {
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
        <ResultsContent
          gameweek={currentGameweek}
          season={currentSeason}
          team_id={currentTeam?.id}
        />
      </Suspense>
    </div>
  )
}

export default FixturesContent
