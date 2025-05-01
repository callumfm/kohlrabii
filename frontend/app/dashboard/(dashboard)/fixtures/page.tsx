import FixturesContent from "./content"
import { Season } from "@/client/types"

export default async function FixturesPage(props: {
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
      gameweek={gameweek}
      season={season}
    />
  )
}
