"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import type { Season } from "@/client/types"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/utils/merge"

const formatSeasonLabel = (season: string): string => {
  return `20${season.substring(0, 2)}/${season.substring(2, 4)}`
}

const seasonValues: Season[] = [
  "2324",
  "2223",
  "2122",
  "2021",
  "1920",
  "1819",
  "1718",
  "1617",
  "1516",
]

type SeasonSelectorProps = {
  currentSeason: Season
  onChange: (value: Season) => void
}

export function SeasonSelector({
  currentSeason,
  onChange,
}: SeasonSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {currentSeason
            ? formatSeasonLabel(currentSeason)
            : "Select season..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Search season" className="h-9" />
          <CommandList>
            <CommandEmpty>No season found.</CommandEmpty>
            <CommandGroup>
              {seasonValues.map((seasonValue) => (
                <CommandItem
                  key={seasonValue}
                  value={seasonValue}
                  onSelect={(value) => {
                    onChange(value as Season)
                    setOpen(false)
                  }}
                >
                  {formatSeasonLabel(seasonValue)}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentSeason === seasonValue
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
