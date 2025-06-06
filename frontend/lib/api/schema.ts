/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/v1/fixtures": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Fixtures Query */
    get: operations["fixtures_get_fixtures_query"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/v1/teams/{team_id}": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Team By Id */
    get: operations["teams_get_team_by_id"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/v1/teams": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Teams For Season */
    get: operations["teams_get_teams_for_season"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/v1/seasons/current": {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Current Season */
    get: operations["seasons_get_current_season"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    /** CurrentSeasonRead */
    CurrentSeasonRead: {
      /** Season */
      season: string
      /** Gameweek */
      gameweek: number
    }
    /** FixtureRead */
    FixtureRead: {
      /** Fixture Id */
      fixture_id: number
      /** Date */
      date: string | null
      /** Gameweek */
      gameweek: number | null
      /** Season */
      season: string
      home_team: components["schemas"]["TeamRead"]
      away_team: components["schemas"]["TeamRead"]
      result: components["schemas"]["ResultRead"] | null
    }
    /** FixtureReadPagination */
    FixtureReadPagination: {
      /** Total */
      total: number
      /** Page */
      page: number
      /** Page Size */
      page_size: number
      /** Total Pages */
      total_pages: number
      /** Items */
      items: components["schemas"]["FixtureRead"][]
    }
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][]
    }
    /** ResultRead */
    ResultRead: {
      /** Home Score */
      home_score: number
      /** Away Score */
      away_score: number
    }
    /** TeamRead */
    TeamRead: {
      /** Id */
      id: number
      /** Tricode */
      tricode: string
      /** Name */
      name: string
      /** Short Name */
      short_name: string
    }
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (string | number)[]
      /** Message */
      msg: string
      /** Error Type */
      type: string
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  fixtures_get_fixtures_query: {
    parameters: {
      query?: {
        sort_by?: string | null
        sort_desc?: boolean
        page?: number
        page_size?: number
        season?:
          | (
              | "1516"
              | "1617"
              | "1718"
              | "1819"
              | "1920"
              | "2021"
              | "2122"
              | "2223"
              | "2324"
            )
          | null
        gameweek?: number | null
        date?: string | null
        team_id?: number | null
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["FixtureReadPagination"]
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["HTTPValidationError"]
        }
      }
    }
  }
  teams_get_team_by_id: {
    parameters: {
      query?: never
      header?: never
      path: {
        team_id: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["TeamRead"]
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["HTTPValidationError"]
        }
      }
    }
  }
  teams_get_teams_for_season: {
    parameters: {
      query: {
        season: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["TeamRead"][]
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["HTTPValidationError"]
        }
      }
    }
  }
  seasons_get_current_season: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          "application/json": components["schemas"]["CurrentSeasonRead"]
        }
      }
    }
  }
}
