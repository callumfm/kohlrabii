import FixturesContent from "./content"
import { Season } from "@/client/types"

export default async function Page(props: {
  searchParams?: Promise<{
    gameweek?: string
    season?: string
  }>
}) {
  const searchParams = await props.searchParams;
  const gameweek = Number(searchParams?.gameweek) || 38;
  const season = (searchParams?.season || "2324") as Season;

  return (
    <FixturesContent
      team={null}
      gameweek={gameweek}
      season={season}
    />
  )
}
