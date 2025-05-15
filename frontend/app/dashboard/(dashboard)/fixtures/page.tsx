import FixturesContent from "./content"
import { Season } from "@/client/types"

export default async function FixturesPage(props: {
  searchParams?: Promise<{ gw?: string, s?: string }>
}) {
  const searchParams = await props.searchParams;
  const gameweek = searchParams?.gw ? Number(searchParams.gw) : undefined;
  const season = searchParams?.s as Season | undefined;

  return (
    <FixturesContent
      initialGameweek={gameweek}
      initialSeason={season}
    />
  )
}
