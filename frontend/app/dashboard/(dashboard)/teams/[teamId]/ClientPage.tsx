"use client"

import type { TFixturePagination, TTeam } from "@/lib/api/types"
import { usePageTitle } from "@/providers/PageTitle"
import { useEffect } from "react"
import { ResultsChart } from "./components/ResultsChart"
import { StrengthCard } from "./components/StrengthCard"
import { TeamProfileCard } from "./components/TeamProfileCard"
import { TopPlayersCard } from "./components/TopPlayersCard"

interface ClientPageProps {
  team: TTeam
  fixtures: TFixturePagination
}

export function ClientPage({ team, fixtures }: ClientPageProps) {
  const { setTitle } = usePageTitle()
  useEffect(() => {
    setTitle(team.name)
  }, [team.name, setTitle])

  return (
    <div className="data-[slot=card]:shadow-xs data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6">
        <TeamProfileCard
          team_id={team.id}
          name={team.name}
          tricode={team.tricode}
        />
        <StrengthCard type="attack" strength={2.54} rank={1} rankChange={3} />
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
            <ResultsChart team_name={team.name} results={fixtures} />
          </div>
          {/* <div className="row-span-1 h-full">
            <FixturesChart team_name={team.name} fixtures={fixtures} />
          </div> */}
        </div>
        <div className="col-span-1 h-full">
          <TopPlayersCard />
        </div>
      </div>
    </div>
  )
}
