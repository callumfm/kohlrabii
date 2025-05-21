import { getFixtures } from "@/actions/fixtures"
import { getTeam } from "@/actions/teams"
import { getServerSideAPI } from "@/lib/api/server"
import { ClientPage } from "./ClientPage"

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const resolvedParams = await params
  const teamId = Number.parseInt(resolvedParams.teamId, 10)
  const api = await getServerSideAPI()

  const [team, fixtures] = await Promise.all([
    getTeam(api, { team_id: teamId }),
    getFixtures(api, { team_id: teamId }),
  ])

  return <ClientPage team={team} fixtures={fixtures} />
}
