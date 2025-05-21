import { Card, CardContent } from "@/components/ui/card"
import React from "react"

export const GameweekResultsSkeleton = () => (
  <div className="w-full max-w-3xl mx-auto">
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="divide-y">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3"
              >
                {/* Home Team */}
                <div className="flex-1 flex justify-end items-center gap-3 min-w-[150px]">
                  <div className="h-5 w-24 bg-muted animate-pulse rounded-md ml-auto" />
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full flex-shrink-0" />
                </div>

                {/* Score */}
                <div className="px-3 mx-2 flex-shrink-0">
                  <div className="bg-purple-900/30 w-16 h-7 animate-pulse rounded-md" />
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center gap-3 min-w-[150px]">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full flex-shrink-0" />
                  <div className="h-5 w-24 bg-muted animate-pulse rounded-md" />
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  </div>
)
