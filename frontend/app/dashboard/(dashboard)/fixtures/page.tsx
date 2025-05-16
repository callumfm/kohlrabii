import { getServerSideAPI } from "@/utils/client/serverside"
import { Season } from "@/client/types"
import { getLatestSeason } from "@/server/seasons"
import { getFixtures } from "@/server/fixtures"
import FixturesContent from "./content"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { queryClient } from "@/utils/api/query"
import { fixturesKey } from "@/hooks/queries/fixtures"


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

  await queryClient.prefetchQuery({
    queryKey: fixturesKey({ season, gameweek }),
    queryFn: () => getFixtures(api, { season, gameweek }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FixturesContent
        initialGameweek={gameweek}
        initialSeason={season}
      />
    </HydrationBoundary>
  )
}
