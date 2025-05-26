"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

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
import { useTeams } from "@/hooks/queries/teams"
import type { TSeason, TTeam } from "@/lib/api/types"
import { cn } from "@/utils/merge"

type TeamSelectorProps = {
  currentTeam: TTeam | null
  onChange: (team: TTeam | null) => void
  season: TSeason
}

export function TeamSelector({
  currentTeam,
  onChange,
  season,
}: TeamSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const displayText = currentTeam ? currentTeam.tricode : "Filter team"
  const { data: teams } = useTeams({ season })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
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
                    currentTeam?.tricode === "all"
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
              {teams?.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.short_name}
                  onSelect={() => {
                    onChange(team)
                    setOpen(false)
                  }}
                >
                  {team.short_name}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentTeam === team ? "opacity-100" : "opacity-0",
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
