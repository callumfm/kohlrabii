"use client"

import { Button } from "@/components/ui/button"
import * as Sentry from "@sentry/nextjs"
import type { default as NextError } from "next/error"
import { useEffect } from "react"

export default function GlobalError({ error }: { error: NextError }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <>
      <body className="bg-blue-100">
        <div className="flex grow flex-col items-center justify-center space-y-4 p-16">
          <h2 className="text-xl">Something went wrong!</h2>

          <Button
            onClick={() => {
              window.location.href = "/"
            }}
          >
            <span>Go back to Home</span>
          </Button>

          <p className="pt-24 text-gray-400" />

          <pre className="whitespace-break-spaces text-sm text-gray-400">
            Error digest: {"digest" in error ? String(error.digest) : "oh oh"}
          </pre>
        </div>
      </body>
    </>
  )
}
