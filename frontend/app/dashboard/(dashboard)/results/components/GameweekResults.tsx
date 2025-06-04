"use client"

import { FormattedDate } from "@/components/common/Date/FormattedDate"
import { Card, CardContent } from "@/components/ui/card"
import type { TFixture } from "@/lib/api/types"
import { ResultItem } from "./ResultItem"

interface DateResultsProps {
  date: string
  fixtures: TFixture[]
}

function DateResults({ date, fixtures }: DateResultsProps) {
  return (
    <section aria-labelledby={`date-${date}`}>
      <h3
        id={`date-${date}`}
        className="mb-2 text-center text-sm font-medium text-muted-foreground"
      >
        <FormattedDate date={date} />
      </h3>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <ul className="divide-y">
            {fixtures.map((fixture) => (
              <li key={fixture.fixture_id}>
                <ResultItem fixture={fixture} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

interface GameweekResultsProps {
  fixtures: Record<string, TFixture[]>
}

export function GameweekResults({ fixtures }: GameweekResultsProps) {
  if (Object.keys(fixtures).length === 0) {
    return null
  }

  return (
    <div className="space-y-10">
      {Object.entries(fixtures).map(([date, dateFixtures]) => (
        <DateResults key={date} date={date} fixtures={dateFixtures} />
      ))}
    </div>
  )
}
