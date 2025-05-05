"use client"

import { ResultsChart } from "@/components/Teams/ResultsChart"
import { TeamProfileCard } from "@/components/Teams/TeamProfileCard"
import { StrengthCard } from "@/components/Teams/StrengthCard"
import { useTeam } from "@/hooks/queries/teams"
import { TopPlayersCard } from "@/components/Teams/TopPlayers"
import { FixturesChart } from "@/components/Teams/FixturesChart"

// Common card styles
const cardStyles = "data-[slot=card]:shadow-xs data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card"

export function TeamContent({ teamId }: { teamId: number }) {
  const { data: team } = useTeam({ team_id: teamId })

  if (!team) {
    return <div>Team not found</div>
  }

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
              <ResultsChart team={team} />
            </div>
            <div className="row-span-1 h-full">
              <FixturesChart team={team} />
            </div>
          </div>
          <div className="col-span-1 h-full">
            <TopPlayersCard />
          </div>
      </div>
    </div>
  )
}
