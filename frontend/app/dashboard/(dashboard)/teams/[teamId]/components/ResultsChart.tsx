"use client"

import { ChartCard } from "@/components/common/Card/ChartCard"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import type { TFixturePagination } from "@/lib/api/types"
import { CONFIG } from "@/utils/config"
import React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

const chartConfig = {
  forGoals: {
    label: "Goals For",
    color: "hsl(var(--primary))",
  },
  againstGoals: {
    label: "Goals Against",
    color: "hsl(var(--black))",
  },
} satisfies ChartConfig

const toolTip = ({
  active,
  payload,
}: { active: boolean | undefined; payload: any }) => {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="text-muted-foreground">GW{data.gameweek}</div>
      <div className="flex items-center justify-between pt-1">
        <span
          className={`w-12 text-right ${data.winner === "H" ? "font-medium" : "text-muted-foreground"}`}
        >
          {data.home_team.tricode}
        </span>
        <span
          className={`w-4 text-center ${data.winner === "H" ? "font-medium" : "text-muted-foreground"}`}
        >
          {data.home_score}
        </span>
        <span className="text-muted-foreground">v</span>
        <span
          className={`w-4 text-center ${data.winner === "A" ? "font-medium" : "text-muted-foreground"}`}
        >
          {data.away_score}
        </span>
        <span
          className={`w-12 text-left ${data.winner === "A" ? "font-medium" : "text-muted-foreground"}`}
        >
          {data.away_team.tricode}
        </span>
      </div>
    </div>
  )
}

interface ResultsChartProps {
  results: TFixturePagination
  team_name: string
}

export function ResultsChart({ results, team_name }: ResultsChartProps) {
  const [hoveredGameweek, setHoveredGameweek] = React.useState<number | null>(
    null,
  )
  const fixtureItems = (results as TFixturePagination)?.items ?? []

  const chartData = fixtureItems.map((fixture) => {
    const wasHome = fixture.home_team.name === team_name
    const venue = wasHome ? "Home" : "Away"
    const opponentTeam = wasHome ? fixture.away_team : fixture.home_team

    const [goalsFor, goalsAgainst] = fixture.result
      ? [
          wasHome ? fixture.result.home_score : fixture.result.away_score,
          wasHome ? fixture.result.away_score : fixture.result.home_score,
        ]
      : [0, 0]

    let winner = null
    if (fixture.result) {
      if (goalsFor > goalsAgainst) {
        winner = wasHome ? "H" : "A"
      } else if (goalsFor < goalsAgainst) {
        winner = wasHome ? "A" : "H"
      }
    }

    return {
      gameweek: fixture.gameweek,
      date: fixture.date,
      opponentId: opponentTeam.id,
      opponentCode: opponentTeam.tricode,
      venue,
      goalsFor,
      goalsAgainst,
      home_score: fixture.result?.home_score,
      away_score: fixture.result?.away_score,
      home_team: fixture.home_team,
      away_team: fixture.away_team,
      winner,
    }
  })

  return (
    <ChartCard title="Recent Form" description="Last 10 games">
      <ChartContainer config={chartConfig} className="aspect-[4/1] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 24,
            right: 24,
            bottom: 12,
          }}
          onMouseMove={(e) => {
            if (e?.activePayload?.[0]) {
              setHoveredGameweek(e.activePayload[0].payload.gameweek)
            }
          }}
          onMouseLeave={() => setHoveredGameweek(null)}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="opponentCode"
            tickLine={false}
            tickMargin={12}
            axisLine={false}
            tick={(props) => {
              const { x, y, payload } = props
              const data = chartData[payload.index]
              const isHovered = hoveredGameweek === data.gameweek
              return (
                <g transform={`translate(${x},${y})`}>
                  <image
                    href={`${CONFIG.SUPABASE_BUCKET_URL}/badges/${data.opponentId}.png`}
                    x={-12}
                    y={0}
                    width={24}
                    height={24}
                    style={{
                      opacity:
                        hoveredGameweek === null ? 1 : isHovered ? 1 : 0.4,
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </g>
              )
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            hide={true}
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => toolTip({ active, payload })}
          />
          <Line
            dataKey="goalsAgainst"
            type="natural"
            stroke="var(--color-againstGoals)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-againstGoals)",
              opacity: 1,
            }}
            activeDot={{
              r: 6,
            }}
            style={{
              opacity: hoveredGameweek === null ? 1 : 0.4,
              transition: "opacity 0.2s ease-in-out",
            }}
          />
          <Line
            dataKey="goalsFor"
            type="natural"
            stroke="var(--color-forGoals)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-forGoals)",
              opacity: 1,
            }}
            activeDot={{
              r: 6,
            }}
            style={{
              opacity: hoveredGameweek === null ? 1 : 0.4,
              transition: "opacity 0.2s ease-in-out",
            }}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}
