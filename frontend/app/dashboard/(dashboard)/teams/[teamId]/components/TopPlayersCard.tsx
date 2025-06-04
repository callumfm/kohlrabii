import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Player {
  id: number
  first_name: string
  second_name: string
  position: string
  image: string
  points: string
}

interface PlayerItemProps {
  player: Player
}

function PlayerItem({ player }: PlayerItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="border-2 border-primary">
          <AvatarImage src={player.image} alt={player.first_name} />
          <AvatarFallback>{player.second_name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">
            {player.second_name}
          </p>
          <p className="text-xs text-muted-foreground">{player.position}</p>
        </div>
      </div>
      <div className="text-sm tabular-nums text-muted-foreground">
        {player.points}
      </div>
    </div>
  )
}

// Placeholder player data
const players: Player[] = [
  {
    id: 1,
    first_name: "Olivia",
    second_name: "Martin",
    position: "FWD",
    image: "/avatars/bruno.png",
    points: "24",
  },
  {
    id: 2,
    first_name: "Isabella",
    second_name: "Nguyen",
    position: "MID",
    image: "/avatars/bruno.png",
    points: "8",
  },
  {
    id: 3,
    first_name: "Sofia",
    second_name: "Davis",
    position: "DEF",
    image: "/avatars/bruno.png",
    points: "2",
  },
]

export function TopPlayersCard() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="relative">
        <CardTitle className="@[250px]/card:text-3xl text-xl tabular-nums">
          Top Players
        </CardTitle>
        <CardDescription>Highest value picks</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          {players.map((player) => (
            <PlayerItem key={player.id} player={player} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
