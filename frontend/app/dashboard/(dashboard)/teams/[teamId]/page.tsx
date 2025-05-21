import { getFixtures } from "@/server/fixtures"
import { getTeam } from "@/server/teams"
import { getServerSideAPI } from "@/utils/client/serverside"
import { ClientPage } from "./ClientPage"

interface PageProps {
  params: Promise<{
    teamId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const teamId = Number.parseInt(resolvedParams.teamId, 10)
  const api = await getServerSideAPI()

  const [team, fixtures] = await Promise.all([
    getTeam(api, { team_id: teamId }),
    getFixtures(api, { team_id: teamId }),
  ])

  return <ClientPage team={team} fixtures={fixtures} />
}
