import { TPagination } from "@/lib/types"

export type TFixture = {
    date: string | null
    gameweek: number | null
    homeTeam: string
    awayTeam: string
    season: string
}

export type TFixtureForecast = {
    homeWin: number
    awayWin: number
    homeCleanSheet: number
    awayCleanSheet: number
    homeGoalsFor: number
    awayGoalsGor: number
    fixture: TFixture
}

export type TFixtureForecastResponse = {
    items: TFixtureForecast[]
} & TPagination
