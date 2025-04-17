"use client"

import { type FC, useMemo, useState } from "react"
import { useFixtureForecasts } from "@/hooks/queries/fixtureForecasts"
import { schemas } from "@/utils/api/client"
import GameweekResults from "@/components/Results/GameweekResults"
import GameweekSelector from "@/components/Results/GameweekSelector"

type TFixturesPageProps = {
  forecasts: schemas['FixtureForecastReadPagination']
}

const FixturesContent: FC<TFixturesPageProps> = ({
  forecasts,
}) => {
  const [currentGameweek, setCurrentGameweek] = useState<number>(38)

  const queryParams = useMemo(() => ({
    gameweek: currentGameweek,
  }), [currentGameweek])

  const { data, isLoading } = useFixtureForecasts(queryParams, {
    initialData: forecasts
  })

  const forecastItems = useMemo(
    () => data?.items ?? [],
    [data]
  )

  return (
    <div className="container py-6">
      <div className="mb-6">
        <GameweekSelector
          currentGameweek={currentGameweek}
          onChange={(value) => setCurrentGameweek(value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">
          Loading matches...
        </div>
      ) : (
        forecastItems.length > 0 ? (
          <GameweekResults matches={forecastItems} />
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No matches found for Gameweek {currentGameweek}
          </div>
        )
      )}
    </div>
  )
}

export default FixturesContent
