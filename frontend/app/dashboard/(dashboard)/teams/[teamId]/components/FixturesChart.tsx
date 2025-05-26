"use client"

import { ChartCard } from "@/components/common/Card/ChartCard"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { schemas } from "@/lib/api/core"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

interface FixturesChartProps {
  fixtures: schemas["FixtureReadPagination"]
  team_name: string
}

export function FixturesChart({ fixtures, team_name }: FixturesChartProps) {
  const fixtureItems =
    (fixtures as schemas["FixtureReadPagination"])?.items ?? []

  const chartData = fixtureItems.map((fixture) => {
    const wasHome = fixture.home_team.name === team_name
    const opponentTeam = wasHome ? fixture.away_team : fixture.home_team

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
      venue: wasHome ? "Home" : "Away",
      outcome: fixture.result
        ? goalsFor > goalsAgainst
          ? "Win"
          : goalsFor < goalsAgainst
            ? "Loss"
            : "Draw"
        : null,
    }
  })

  return (
    <ChartCard title="Upcoming Fixtures" description="Next 10 games">
      <ChartContainer config={chartConfig} className="aspect-[5/1] w-full">
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
          <Bar
            dataKey="goalsAgainst"
            fill="var(--color-againstGoals)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
