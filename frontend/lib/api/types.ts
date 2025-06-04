import type { schemas } from "@/lib/api/core"
import type { operations } from "./schema"

export type TPagination = {
  total: number
  totalPages: number
  page: number
  pageSize: number
}

export type TSeason = NonNullable<
  NonNullable<
    operations["fixtures_get_fixtures_query"]["parameters"]["query"]
  >["season"]
>

export type TTeam = schemas["TeamRead"]
export type TFixture = schemas["FixtureRead"]
export type TFixturePagination = schemas["FixtureReadPagination"]
