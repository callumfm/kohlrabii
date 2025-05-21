import { getFixtures } from "@/actions/fixtures"
import { getLatestSeason } from "@/actions/seasons"
import { fixturesKey } from "@/hooks/queries/fixtures"
import { queryClient } from "@/lib/api/query"
import { getServerSideAPI } from "@/lib/api/server"
import type { TSeason } from "@/lib/api/types"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import ClientPage from "./ClientPage"

export default async function Page(props: {
  searchParams?: Promise<{ gw?: string; s?: string }>
}) {
  const api = await getServerSideAPI()

  const searchParams = await props.searchParams
  let gameweek = searchParams?.gw ? Number(searchParams.gw) : undefined
  let season = searchParams?.s as TSeason | undefined

  if (!gameweek || !season) {
    const { season: latestSeason, gameweek: latestGameweek } =
      await getLatestSeason(api)
    gameweek = latestGameweek
    season = latestSeason as TSeason
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
