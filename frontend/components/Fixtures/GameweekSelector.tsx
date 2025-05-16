"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GameweekSelectorProps {
  currentGameweek: number
  onChange: (gameweek: number) => void
  onHover: (gameweek: number) => void
  minGameweek?: number
  maxGameweek?: number
}

export function GameweekSelector({
  currentGameweek,
  onChange,
  onHover,
  minGameweek = 1,
  maxGameweek = 38,
}: GameweekSelectorProps) {
  const previousGameweek = currentGameweek > minGameweek ? currentGameweek - 1 : null
  const nextGameweek = currentGameweek < maxGameweek ? currentGameweek + 1 : null

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => previousGameweek && onChange(previousGameweek)}
        onMouseEnter={() => previousGameweek && onHover(previousGameweek)}
        disabled={!previousGameweek}
        aria-label="Previous gameweek"
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Badge variant="outline" className="text-base px-6 py-1.5">
        Gameweek {currentGameweek}
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => nextGameweek && onChange(nextGameweek)}
        onMouseEnter={() => nextGameweek && onHover(nextGameweek)}
        disabled={!nextGameweek}
        aria-label="Next gameweek"
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default GameweekSelector
