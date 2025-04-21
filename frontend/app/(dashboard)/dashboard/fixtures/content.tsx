"use client"

import { type FC, useState, Suspense } from "react"
import { useFixtures } from "@/hooks/queries/fixtures"
import { ClientResponseError, components, schemas } from "@/utils/api/client"
import GameweekResults from "@/components/Fixtures/GameweekResults"
import GameweekSelector from "@/components/Fixtures/GameweekSelector"
import GameweekResultsSkeleton from "@/components/Fixtures/GameweekResultsSkeleton"
import { SeasonSelector } from "@/components/Fixtures/SeasonSelector"
import { useDebouncedCallback } from "use-debounce"
import { useSearchParams, usePathname, useRouter, notFound } from "next/navigation"
import { Season, Team } from "@/client/types"
import { TeamSelector } from "@/components/Fixtures/TeamSelector"

type TFixturesProps = {
  gameweek: number
  season: Season
  team: Team | null
}

const ResultsContent = ({ gameweek, season, team }: TFixturesProps) => {
  const { data, error } = useFixtures(
    { gameweek, season, team: team?.name },
    { suspense: true }
  )

  if (
    error instanceof ClientResponseError &&
    (error.response.status === 404 || error.response.status === 422)
  ) {
    notFound()
  }

  const fixturesData = (data as schemas["FixtureReadPagination"])?.items ?? []

  return <GameweekResults fixtures={fixturesData} />
}

const FixturesContent: FC<TFixturesProps> = ({ gameweek, season }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const initialGameweek = Number(searchParams.get('gameweek')) || gameweek
  const initialSeason = searchParams.get('season') || season

  const [selectedGameweek, setSelectedGameweek] = useState<number>(initialGameweek)
  const [currentGameweek, setCurrentGameweek] = useState<number>(initialGameweek)
  const [currentSeason, setCurrentSeason] = useState<Season>(initialSeason as Season)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)

  const updateURL = useDebouncedCallback((gw: number, season: Season, team: Team | null = null) => {
    setCurrentGameweek(gw)
    const params = new URLSearchParams(searchParams)
    params.set("gameweek", gw.toString())
    params.set("season", season)
    if (team) { params.set("team", team.tricode) }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleGameweekChange = (gw: number) => {
    setSelectedGameweek(gw)
    updateURL(gw, currentSeason)
  }

  const handleSeasonChange = (season: Season) => {
    setCurrentSeason(season)
    updateURL(currentGameweek, season)
  }

  const handleTeamChange = (team: Team | null) => {
      setCurrentTeam(team)
      updateURL(currentGameweek, currentSeason, team)
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
        />
        <TeamSelector
          currentTeam={currentTeam}
          onChange={handleTeamChange}
          season={currentSeason}
        />
      </div>

      <Suspense fallback={<GameweekResultsSkeleton />}>
        <ResultsContent
          gameweek={currentGameweek}
          season={currentSeason}
          team={currentTeam}
        />
      </Suspense>
    </div>
  )
}

export default FixturesContent
