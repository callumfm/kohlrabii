import { TeamContent } from "../content"

interface TeamPageProps {
  params: Promise<{
    teamId: string
  }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const resolvedParams = await params;
  const teamId = parseInt(resolvedParams.teamId, 10);
  return <TeamContent teamId={teamId} />
}
