import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Placeholder player data
const players = [
  {
    id: 1,
    first_name: "Olivia",
    second_name: "Martin",
    position: "FWD",
    image: "/avatars/01.png",
    points: "24",
  },
  {
    id: 2,
    first_name: "Isabella",
    second_name: "Nguyen",
    position: "MID",
    image: "/avatars/02.png",
    points: "8",
  },
  {
    id: 3,
    first_name: "Sofia",
    second_name: "Davis",
    position: "DEF",
    image: "/avatars/03.png",
    points: "2",
  },
];

export function TopPlayersCard() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="relative">
                <CardTitle className="@[250px]/card:text-3xl text-xl tabular-nums">
                    Top Players
                </CardTitle>
                <CardDescription>
                    Highest value picks
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-4">
                    {players.map((player) => (
                        <div key={player.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage src={player.image} alt={player.first_name} />
                                    <AvatarFallback>{player.second_name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{player.second_name}</p>
                                    <p className="text-xs text-muted-foreground">{player.position}</p>
                                </div>
                            </div>
                            <div className="text-sm tabular-nums text-muted-foreground">
                                {player.points}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
