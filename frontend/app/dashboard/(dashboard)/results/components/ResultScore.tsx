interface ResultScoreProps {
  homeGoals?: number
  awayGoals?: number
}

export function ResultScore({ homeGoals, awayGoals }: ResultScoreProps) {
  const hasResult = homeGoals != null && awayGoals != null
  const scoreText = hasResult ? `${homeGoals} - ${awayGoals}` : "v"

  return (
    <div className="mx-2 flex-shrink-0 px-3">
      <div className="flex w-16 items-center justify-center rounded-md bg-purple-900 py-1 font-bold text-base text-white">
        {scoreText}
      </div>
    </div>
  )
}
