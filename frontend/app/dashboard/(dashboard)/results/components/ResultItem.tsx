import type { TFixture } from "@/lib/api/types"
import { ResultScore } from "./ResultScore"
import { TeamNameResult } from "./TeamNameResult"

export const ResultItem = ({ fixture }: { fixture: TFixture }) => {
  return (
    <div className="flex items-center justify-between p-3 transition-colors hover:bg-accent/50">
      <TeamNameResult
        team_name={fixture.home_team.short_name}
        team_id={fixture.home_team.id}
        was_home={true}
      />
      <ResultScore
        homeGoals={fixture.result?.home_score}
        awayGoals={fixture.result?.away_score}
      />
      <TeamNameResult
        team_name={fixture.away_team.short_name}
        team_id={fixture.away_team.id}
        was_home={false}
      />
    </div>
  )
}
