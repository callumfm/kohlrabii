import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/merge";

// Define the type for a match fixture
interface Fixture {
  date: string;
  gameweek: number;
  home_team: string;
  away_team: string;
  season: string;
}

// Define the type for the match prediction
interface MatchData {
  home_win: number;
  away_win: number;
  home_clean_sheet: number;
  away_clean_sheet: number;
  home_goals_for: number;
  away_goals_for: number;
  fixture: Fixture;
}

interface MatchResultProps {
  match: MatchData;
  className?: string;
}

export function MatchResult({ match, className }: MatchResultProps) {
  // Format the date nicely
  const matchDate = new Date(match.fixture.date);
  const formattedDate = matchDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Determine the favorite team based on win probability
  const isFavorite = match.home_win > match.away_win ? "home" : "away";
  const drawProbability = 1 - match.home_win - match.away_win;

  // Determine the most likely scoreline (simplified)
  const predictedHomeGoals = Math.round(match.home_goals_for);
  const predictedAwayGoals = Math.round(match.away_goals_for);

  // Calculate percentages for the win probability bar
  const homeWinPercent = Math.round(match.home_win * 100);
  const drawPercent = Math.round(drawProbability * 100);
  const awayWinPercent = Math.round(match.away_win * 100);

  // Calculate clean sheet percentages
  const homeCleanSheetPercent = Math.round(match.home_clean_sheet * 100);
  const awayCleanSheetPercent = Math.round(match.away_clean_sheet * 100);

  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Header with stacked gameweek and date */}
        <div className="flex flex-col items-center text-sm text-muted-foreground gap-2">
          <Badge variant="secondary" className="self-center text-md">GW {match.fixture.gameweek}</Badge>
          <span>{formattedDate}</span>
        </div>

        {/* Teams and Score - adjusted layout with wider space for score */}
        <div className="grid grid-cols-11 items-center py-3">
          {/* Home team */}
          <div className="col-span-5 text-right pr-3">
            <div
              className={cn(
                "font-bold text-xl",
                isFavorite === "home" && "text-primary"
              )}
            >
              {match.fixture.home_team}
            </div>
          </div>

          {/* Score prediction */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="text-2xl font-bold whitespace-nowrap">
              {predictedHomeGoals} - {predictedAwayGoals}
            </div>
          </div>

          {/* Away team */}
          <div className="col-span-5 pl-3">
            <div
              className={cn(
                "font-bold text-xl",
                isFavorite === "away" && "text-primary"
              )}
            >
              {match.fixture.away_team}
            </div>
          </div>
        </div>

        {/* Clean sheet visualization */}
        <div className="grid grid-cols-2 gap-4 py-1">
          {/* Home clean sheet */}
          <div className="flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${homeCleanSheetPercent}%` }}
              ></div>
            </div>
            <div className="text-xs mt-1 text-muted-foreground">
              {homeCleanSheetPercent}% clean sheet chance
            </div>
          </div>

          {/* Away clean sheet */}
          <div className="flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${awayCleanSheetPercent}%` }}
              ></div>
            </div>
            <div className="text-xs mt-1 text-muted-foreground">
              {awayCleanSheetPercent}% clean sheet chance
            </div>
          </div>
        </div>

        {/* Win probability bar */}
        <div className="mt-2">
          <div className="flex w-full h-6 rounded-md overflow-hidden">
            {/* Home win section */}
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${homeWinPercent}%` }}
            >
              {homeWinPercent}%
            </div>

            {/* Draw section */}
            <div
              className="bg-gray-400 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${drawPercent}%` }}
            >
              {drawPercent}%
            </div>

            {/* Away win section */}
            <div
              className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${awayWinPercent}%` }}
            >
              {awayWinPercent}%
            </div>
          </div>

          {/* Labels for the bar */}
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <div>Home win</div>
            <div>Draw</div>
            <div>Away win</div>
          </div>
        </div>
      </div>
    </div>
  );
}
