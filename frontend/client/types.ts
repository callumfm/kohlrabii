import { operations, components } from "./index"

export type Season = NonNullable<
  NonNullable<
    operations["fixtures_get_fixtures_query"]["parameters"]["query"]
  >["season"]
>

export type Team = components["schemas"]["TeamRead"]
