"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GameweekSelectorProps {
  currentGameweek: number
  onChange: (gameweek: number) => void
  minGameweek?: number
  maxGameweek?: number
}

export function GameweekSelector({
  currentGameweek,
  onChange,
  minGameweek = 1,
  maxGameweek = 38,
}: GameweekSelectorProps) {

  const handlePrevious = () => {
    if (currentGameweek > minGameweek) {
      onChange(currentGameweek - 1)
    }
  }

  const handleNext = () => {
    if (currentGameweek < maxGameweek) {
      onChange(currentGameweek + 1)
    }
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        disabled={currentGameweek <= minGameweek}
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
        onClick={handleNext}
        disabled={currentGameweek >= maxGameweek}
        aria-label="Next gameweek"
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default GameweekSelector
