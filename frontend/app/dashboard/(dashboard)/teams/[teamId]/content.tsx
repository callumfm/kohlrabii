"use client"

import { ResultsChart } from "@/components/Teams/ResultsChart"
import { TeamProfileCard } from "@/components/Teams/TeamProfileCard"
import { StrengthCard } from "@/components/Teams/StrengthCard"
import { TopPlayersCard } from "@/components/Teams/TopPlayers"
import { FixturesChart } from "@/components/Teams/FixturesChart"
import { schemas } from "@/utils/api/client"

// Common card styles
const cardStyles = "data-[slot=card]:shadow-xs data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card"

interface TeamContentProps {
  team: schemas['TeamRead']
  fixtures: schemas['FixtureReadPagination']
}

export function TeamContent({ team, fixtures }: TeamContentProps) {
  return (
    <div className={cardStyles}>

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6">
        <TeamProfileCard
            team_id={team.id}
            name={team.name}
            tricode={team.tricode}
        />
        <StrengthCard
            type="attack"
            strength={2.54}
            rank={1}
            rankChange={3}
        />
        <StrengthCard
            type="defence"
            strength={1.23}
            rank={13}
            rankChange={-20}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 px-4 lg:px-6 mt-4">
        <div className="col-span-1 xl:col-span-3 grid grid-rows-2 gap-4 h-full">
          <div className="row-span-1 h-full">
            <ResultsChart
              team_name={team.name}
              results={fixtures}
            />
          </div>
          <div className="row-span-1 h-full">
            <FixturesChart
              team_name={team.name}
              fixtures={fixtures}
            />
          </div>
        </div>
        <div className="col-span-1 h-full">
          <TopPlayersCard />
        </div>
      </div>
    </div>
  )
}
