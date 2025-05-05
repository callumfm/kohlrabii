"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartCard } from "./ChartCard"
import { useFixtures } from "@/hooks/queries/fixtures"
import { schemas } from "@/utils/api/client"

const chartConfig = {
  forGoals: {
    label: "Goals For",
    color: "hsl(var(--primary))",
  },
  againstGoals: {
    label: "Goals Against",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig


export function FixturesChart({ team }: { team: schemas["TeamRead"] }) {
  const { data, error } = useFixtures({
    season: "2324",
    team: team.name
  }, { suspense: true })

  // Get raw fixture data
  const fixtureItems = (data as schemas["FixtureReadPagination"])?.items ?? []

  // Transform the data for better charting
  const chartData = fixtureItems.map(fixture => {
    const teamName = team.name
    const wasHome = fixture.home_team.name === teamName
    const opponentTeam = wasHome ? fixture.away_team : fixture.home_team

    // Calculate goals for and against
    let goalsFor = 0
    let goalsAgainst = 0

    if (fixture.result) {
      if (wasHome) {
        goalsFor = fixture.result.home_score
        goalsAgainst = fixture.result.away_score
      } else {
        goalsFor = fixture.result.away_score
        goalsAgainst = fixture.result.home_score
      }
    }

    return {
      gameweek: fixture.gameweek,
      date: fixture.date,
      opponentTeam: opponentTeam.name,
      opponentCode: opponentTeam.tricode,
      wasHome,
      goalsFor,
      goalsAgainst,
      result: fixture.result,
      forecast: fixture.forecast,
      // Additional derived data
      venue: wasHome ? "Home" : "Away",
      // Simple win/loss/draw calculation
      outcome: fixture.result
        ? (goalsFor > goalsAgainst
            ? "Win"
            : goalsFor < goalsAgainst
              ? "Loss"
              : "Draw")
        : null
    }
  })

  // Sort by gameweek or date for chronological display
  .sort((a, b) => {
    return (a.gameweek ?? 0) - (b.gameweek ?? 0)
  })

  // Take only the last 10 games
  .slice(-10)

  return (
    <ChartCard title="Upcoming Fixtures" description="Next 10 games">
      <ChartContainer
        config={chartConfig}
        className="aspect-[5/1] w-full"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="opponentCode"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="goalsFor" fill="var(--color-forGoals)" radius={4} />
          <Bar dataKey="goalsAgainst" fill="var(--color-againstGoals)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
