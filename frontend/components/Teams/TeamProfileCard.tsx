import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CONFIG } from "@/utils/config"
import Image from 'next/image'

interface TeamProfileCardProps {
    team_id: number
    name: string
    tricode: string
}

export function TeamProfileCard({ team_id, name, tricode }: TeamProfileCardProps) {
    return (
        <Card className="@container/card md:col-span-2 xl:col-span-2">
            <CardHeader className="relative">
                <div className="flex items-center gap-4">
                    <Image
                        src={`${CONFIG.SUPABASE_BUCKET_URL}/badges/${team_id}.png`}
                        alt="Badge"
                        width={48}
                        height={48}
                        className="h-12 w-12"
                    />
                    <div>
                        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            {name}
                        </CardTitle>
                        <CardDescription>{tricode}</CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}
