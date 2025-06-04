import { PrefetchOnHoverLink } from "@/components/common/Link/PrefetchOnHoverLink"
import { cn } from "@/utils/merge"
import { dashboardPath } from "@/utils/path"
import { TeamBadge } from "./TeamBadge"

interface TeamNameResultProps {
  team_name: string
  team_id: number
  was_home: boolean
}

export function TeamNameResult({
  team_name,
  team_id,
  was_home,
}: TeamNameResultProps) {
  const justify = was_home ? "justify-end" : ""
  const teamNameClass = "truncate font-semibold text-base"

  return (
    <div
      className={cn("min-w-[150px] flex-1 flex items-center gap-3", justify)}
    >
      <PrefetchOnHoverLink
        href={dashboardPath(`/teams/${team_id}`)}
        className={cn("flex items-center gap-3 hover:underline")}
      >
        {was_home ? (
          <>
            <span className={teamNameClass}>{team_name}</span>
            <TeamBadge team_id={team_id} was_home={was_home} />
          </>
        ) : (
          <>
            <TeamBadge team_id={team_id} was_home={was_home} />
            <span className={teamNameClass}>{team_name}</span>
          </>
        )}
      </PrefetchOnHoverLink>
    </div>
  )
}
