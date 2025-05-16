import { getServerSideAPI } from "@/utils/client/serverside"
import { TeamContent } from "./content"
import { getTeam } from "@/server/teams"
import { getFixtures } from "@/server/fixtures"

interface TeamPageProps {
  params: Promise<{
    teamId: string
  }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const resolvedParams = await params
  const teamId = parseInt(resolvedParams.teamId, 10)
  const api = await getServerSideAPI()

  const [team, fixtures] = await Promise.all([
    getTeam(api, { team_id: teamId }),
    getFixtures(api, { team_id: teamId })
  ])

  return <TeamContent team={team} fixtures={fixtures} />
}
