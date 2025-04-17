"use client"

import { type FC, useState, Suspense } from "react"
import { useFixtures } from "@/hooks/queries/fixtures"
import { schemas } from "@/utils/api/client"
import GameweekResults from "@/components/Results/GameweekResults"
import GameweekSelector from "@/components/Results/GameweekSelector"
import GameweekResultsSkeleton from "@/components/Results/GameweekResultsSkeleton"
import { useDebouncedCallback } from "use-debounce"
import { useSearchParams, usePathname, useRouter } from "next/navigation"

type TFixturesProps = {
  gameweek: number
  season: string
}

const ResultsContent = ({ gameweek, season }: TFixturesProps) => {
  const { data } = useFixtures(
    { gameweek, season },
    { suspense: true }
  )

  const fixturesData = (data as schemas["FixtureReadPagination"])?.items ?? []

  if (fixturesData.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No fixtures found for Gameweek {gameweek} {season ? `in season ${season}` : ""}
      </div>
    )
  }

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
  const [currentSeason, setCurrentSeason] = useState<string>(initialSeason)

  const updateURL = useDebouncedCallback((gw: number, season: string) => {
    setCurrentGameweek(gw)
    const params = new URLSearchParams(searchParams)
    params.set("gameweek", gw.toString())
    params.set("season", season)
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleGameweekChange = (value: number) => {
    setSelectedGameweek(value)
    updateURL(value, currentSeason)
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <GameweekSelector
          currentGameweek={selectedGameweek}
          onChange={handleGameweekChange}
        />
      </div>

      <Suspense fallback={<GameweekResultsSkeleton />}>
        <ResultsContent
          gameweek={currentGameweek}
          season={currentSeason}
        />
      </Suspense>
    </div>
  )
}

export default FixturesContent
