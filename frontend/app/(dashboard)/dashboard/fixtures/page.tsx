import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import FixturesContent from "./content"
import { getServerSideAPI } from "@/utils/client/serverside"
import { getFixtureForecasts } from "@/utils/fixtureForecasts"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  const api = await getServerSideAPI()
  const forecasts = await getFixtureForecasts(api)

  return <FixturesContent forecasts={forecasts} />
}
