import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

function getOrdinal(n: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

interface StrengthCardProps {
    type: "attack" | "defence"
    strength: number
    rank: number
    rankChange: number
}

export function StrengthCard({ type, strength, rank, rankChange }: StrengthCardProps) {
    const title = type === "attack" ? "Attacking Strength" : "Defensive Strength"
    const desc_type = type === "attack" ? "scored" : "conceded"
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className="@container/card hover:border-primary transition-all duration-200">
                        <CardHeader className="relative">
                            <CardDescription>{title}</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl font-semibold tabular-nums">
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl">{strength}</div>
                                    <div className="text-muted-foreground">({getOrdinal(rank)})</div>
                                </div>
                            </CardTitle>
                            {rankChange && (
                                <div className="absolute right-4 top-4">
                                    <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                    {rankChange > 0 ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
                                    {rankChange > 0 ? "+" : ""}{rankChange}
                                    </Badge>
                                </div>
                            )}
                        </CardHeader>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-muted-foreground">
                        The expected number of goals <strong className="text-foreground">{desc_type}</strong> against the league average team.
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
