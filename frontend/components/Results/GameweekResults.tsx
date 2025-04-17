"use client"

import React from "react"
import { schemas } from "@/utils/api/client"
import {
  Card,
  CardContent
} from "@/components/ui/card"

interface GameweekResultsProps {
  fixtures: schemas['FixtureRead'][]
  className?: string
}

export function GameweekResults({ fixtures, className }: GameweekResultsProps) {
  if (fixtures.length === 0) {
    return null
  }

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y">
            {fixtures.map((fixture, index) => {

              const homeGoals = fixture.result?.home_score !== undefined
                ? fixture.result.home_score
                : fixture.forecast?.home_goals_for !== undefined
                  ? Math.round(fixture.forecast.home_goals_for)
                  : null;

              const awayGoals = fixture.result?.away_score !== undefined
                ? fixture.result.away_score
                : fixture.forecast?.away_goals_for !== undefined
                  ? Math.round(fixture.forecast.away_goals_for)
                  : null;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
                >
                  {/* Home Team */}
                  <div className="flex-1 flex justify-end items-center gap-3 min-w-[150px]">
                    <span className="font-semibold text-base truncate">{fixture.home_team}</span>
                    <div className="w-8 h-8 relative flex-shrink-0">
                      {/* Placeholder club crest - replace with actual image when available */}
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-muted">
                        <span className="text-[10px]">
                          {fixture.home_team.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="px-3 mx-2 flex-shrink-0">
                    <div className="bg-purple-900 text-white font-bold text-base w-16 flex items-center justify-center py-1 rounded-md">
                      {homeGoals !== null && awayGoals !== null
                        ? `${homeGoals} - ${awayGoals}`
                        : ' v '}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 flex items-center gap-3 min-w-[150px]">
                    <div className="w-8 h-8 relative flex-shrink-0">
                      {/* Placeholder club crest - replace with actual image when available */}
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-muted">
                        <span className="text-[10px]">
                          {fixture.away_team.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-base truncate">{fixture.away_team}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GameweekResults
