"use client"

import type { TSeason } from "@/lib/api/types"
import { type ReactNode, createContext, useContext } from "react"

type SeasonContextType = {
  latestSeason: TSeason
  latestGameweek: number
}

const SeasonContext = createContext<SeasonContextType | null>(null)

export function SeasonContextProvider({
  latestSeason,
  latestGameweek,
  children,
}: {
  latestSeason: TSeason
  latestGameweek: number
  children: ReactNode
}) {
  return (
    <SeasonContext.Provider value={{ latestSeason, latestGameweek }}>
      {children}
    </SeasonContext.Provider>
  )
}

export function useSeasonMetadata() {
  const ctx = useContext(SeasonContext)
  if (!ctx)
    throw new Error(
      "useSeasonMetadata must be used inside SeasonContextProvider",
    )
  return ctx
}
