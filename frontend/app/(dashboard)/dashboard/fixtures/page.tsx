import FixturesContent from "./content"

export default async function Page(props: {
  searchParams?: Promise<{
    gameweek?: string
    season?: string
  }>
}) {
  const searchParams = await props.searchParams;
  const gameweek = Number(searchParams?.gameweek) || 38;
  const season = searchParams?.season || "2324";

  return (
    <FixturesContent
      gameweek={gameweek}
      season={season}
    />
  )
}
