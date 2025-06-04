import { CONFIG } from "@/utils/config"
import Image from "next/image"

interface TeamBadgeProps {
  team_id: number
  was_home: boolean
}

export function TeamBadge({ team_id, was_home }: TeamBadgeProps) {
  return (
    <div className="relative h-8 w-8 flex-shrink-0">
      <Image
        src={`${CONFIG.SUPABASE_BUCKET_URL}/badges/${team_id}.png`}
        alt={`${was_home ? "Home" : "Away"} team badge`}
        width={32}
        height={32}
        className="h-full w-full object-contain"
        priority={false}
        sizes="32px"
      />
    </div>
  )
}
