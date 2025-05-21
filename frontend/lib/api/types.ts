import type { components, operations } from "./schema"

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

export type TTeam = components["schemas"]["TeamRead"]
