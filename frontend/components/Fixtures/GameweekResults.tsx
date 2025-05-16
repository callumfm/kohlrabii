"use client"

import React from "react"
import { schemas } from "@/utils/api/client"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { FormattedDate } from "@/components/Fixtures/FormattedDate"
import Link from "next/link"
import Image from "next/image"
import { CONFIG } from "@/utils/config"
import { dashboardPath } from "@/utils/path"

interface GameweekResultsProps {
  fixtures: schemas["FixtureRead"][]
}

export function GameweekResults({ fixtures }: GameweekResultsProps) {
  if (fixtures.length === 0) {
    return null
  }

  const fixturesByDate: Record<string, GameweekResultsProps["fixtures"]> = {}

  fixtures.forEach(fixture => {
    const date = fixture.date ? fixture.date.split("T")[0] : "Unknown Date"
    if (!fixturesByDate[date]) {
      fixturesByDate[date] = []
    }
    fixturesByDate[date].push(fixture)
  })

  return (
    <div className="space-y-10">
      {Object.entries(fixturesByDate).map(([date, dateFixtures]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 text-center">
            <FormattedDate date={date} />
          </h3>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y">
                {dateFixtures.map((fixture, index) => {

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
                        <Link
                          href={dashboardPath(`/teams/${fixture.home_team.id}`)}
                          className="flex justify-end items-center gap-3 hover:underline"
                        >
                          <span className="font-semibold text-base truncate">{fixture.home_team.short_name}</span>
                          <div className="w-8 h-8 relative flex-shrink-0">
                            <Image
                              src={`${CONFIG.SUPABASE_BUCKET_URL}/badges/${fixture.home_team.id}.png`}
                              alt="Home Badge"
                              width={32}
                              height={32}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Score */}
                      <div className="px-3 mx-2 flex-shrink-0 relative group">
                        <div className="bg-purple-900 text-white font-bold text-base w-16 flex items-center justify-center py-1 rounded-md cursor-pointer">
                          {homeGoals !== null && awayGoals !== null
                            ? `${homeGoals} - ${awayGoals}`
                            : ' v '}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="flex-1 flex items-center gap-3 min-w-[150px]">
                        <Link
                          href={dashboardPath(`/teams/${fixture.away_team.id}`)}
                          className="flex items-center gap-3 hover:underline"
                        >
                          <div className="w-8 h-8 relative flex-shrink-0">
                            <Image
                              src={`${CONFIG.SUPABASE_BUCKET_URL}/badges/${fixture.away_team.id}.png`}
                              alt="Away Badge"
                              width={32}
                              height={32}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="font-semibold text-base truncate">{fixture.away_team.short_name}</span>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default GameweekResults
