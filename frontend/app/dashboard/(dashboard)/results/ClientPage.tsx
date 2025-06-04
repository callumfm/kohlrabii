"use client"

import { GameweekSelector } from "@/components/common/Selector/GameweekSelector"
import { SeasonSelector } from "@/components/common/Selector/SeasonSelector"
import { TeamSelector } from "@/components/common/Selector/TeamSelector"
import { fetchFixtures, fixturesKey } from "@/hooks/queries/fixtures"
import { queryClient } from "@/lib/api/query"
import type { TSeason, TTeam } from "@/lib/api/types"
import { useSeasonMetadata } from "@/providers/SeasonMetadata"
import { usePathname } from "next/navigation"
import { type FC, Suspense, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { GameweekResults } from "./components/GameweekResults"
import { GameweekResultsSkeleton } from "./components/GameweekResultsSkeleton"
import { useGameweekFixtures } from "./hooks/useGameweekFixtures"

type ClientPageProps = {
  initialGameweek?: number
  initialSeason?: TSeason
}

const ClientPage: FC<ClientPageProps> = ({
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
          fixtures={useGameweekFixtures({
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
