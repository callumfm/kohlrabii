import type { Season } from "@/client/types"
import { fixturesKey } from "@/hooks/queries/fixtures"
import { getFixtures } from "@/server/fixtures"
import { getLatestSeason } from "@/server/seasons"
import { queryClient } from "@/utils/api/query"
import { getServerSideAPI } from "@/utils/client/serverside"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import ClientPage from "./ClientPage"

export default async function Page(props: {
  searchParams?: Promise<{ gw?: string; s?: string }>
}) {
  const api = await getServerSideAPI()

  const searchParams = await props.searchParams
  let gameweek = searchParams?.gw ? Number(searchParams.gw) : undefined
  let season = searchParams?.s as Season | undefined

  if (!gameweek || !season) {
    const { season: latestSeason, gameweek: latestGameweek } =
      await getLatestSeason(api)
    gameweek = latestGameweek
    season = latestSeason as Season
  }

  await queryClient.prefetchQuery({
    queryKey: fixturesKey({ season, gameweek }),
    queryFn: () => getFixtures(api, { season, gameweek }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage initialGameweek={gameweek} initialSeason={season} />
    </HydrationBoundary>
  )
}
