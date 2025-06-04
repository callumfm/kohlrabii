import type { TFixture } from "@/lib/api/types"

export function filterFixturesByTeam(
  fixtures: TFixture[],
  team_id?: number | null,
) {
  if (!team_id) return fixtures
  return fixtures.filter(
    (fixture) =>
      fixture.home_team.id === team_id || fixture.away_team.id === team_id,
  )
}

export function groupFixturesByDate(fixtures: TFixture[]) {
  const fixturesByDate: Record<string, TFixture[]> = {}
  for (const fixture of fixtures) {
    const date = fixture.date ? fixture.date.split("T")[0] : "Unknown Date"
    if (!fixturesByDate[date]) {
      fixturesByDate[date] = []
    }
    fixturesByDate[date].push(fixture)
  }
  return fixturesByDate
}
