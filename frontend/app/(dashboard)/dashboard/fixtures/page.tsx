import FixturesContent from "./content"

export default async function Page({
  searchParams,
}: {
  searchParams: { gameweek?: string; season?: string }
}) {
  const gameweek = searchParams.gameweek ? parseInt(searchParams.gameweek) : 38
  const season = searchParams.season || "2324"

  return (
    <FixturesContent
      gameweek={gameweek}
      season={season}
    />
  )
}
