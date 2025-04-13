import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getFixtureForecasts } from "./api";
import FixtureForecastsContent from "./content";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const forecasts = await getFixtureForecasts()
  return <FixtureForecastsContent forecasts={forecasts}/>
}
