"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/utils/merge"
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
import { Season, Team } from "@/client/types"
import { useTeams } from "@/hooks/queries/teams"

type TeamSelectorProps = {
  currentTeam: Team | null
  onChange: (team: Team | null) => void
  season: Season
}

export function TeamSelector({ currentTeam, onChange, season }: TeamSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const displayText = currentTeam ? currentTeam.tricode : "Filter team"
  const { data: teams } = useTeams({ season })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {displayText}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Search" className="h-9" />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                value="all"
                onSelect={() => {
                  onChange(null)
                  setOpen(false)
                }}
              >
                All
                <Check
                  className={cn(
                    "ml-auto",
                    currentTeam?.tricode === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {teams?.map((team) => (
                <CommandItem
                  key={team.tricode}
                  value={team.name}
                  onSelect={() => {
                    onChange(team)
                    setOpen(false)
                  }}
                >
                  {team.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentTeam === team ? "opacity-100" : "opacity-0"
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
