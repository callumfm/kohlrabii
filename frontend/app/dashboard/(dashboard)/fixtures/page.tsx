import { getServerSideAPI } from "@/utils/client/serverside"
import { Season } from "@/client/types"
import { getLatestSeason } from "@/server/seasons"
import { getFixtures } from "@/server/fixtures"
import FixturesContent from "./content"
import { Suspense } from "react"
import GameweekResultsSkeleton from "@/components/Fixtures/GameweekResultsSkeleton"

export default async function FixturesPage(props: {
  searchParams?: Promise<{ gw?: string, s?: string }>
}) {
  const api = await getServerSideAPI()

  const searchParams = await props.searchParams
  let gameweek = searchParams?.gw ? Number(searchParams.gw) : undefined
  let season = searchParams?.s as Season | undefined

  if (!gameweek || !season) {
    const { season: latestSeason, gameweek: latestGameweek } = await getLatestSeason(api)
    gameweek = latestGameweek
    season = latestSeason as Season
  }

  const initialFixtures = await getFixtures(api, { gameweek, season })

  return (
    <Suspense fallback={<GameweekResultsSkeleton />}>
      <FixturesContent
        initialFixtures={initialFixtures}
        initialGameweek={gameweek}
        initialSeason={season}
      />
    </Suspense>
  )
}
