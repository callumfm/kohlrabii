'use client'

import { Button } from '@/components/ui/button'

export default function Error({ error }: { error: Error }) {
  return (
    <html>
      <body className="bg-blue-100">
        <div className="flex grow flex-col items-center justify-center space-y-4 p-16">
          <h2 className="text-xl">Something went wrong!</h2>

          <Button
            onClick={() => {
              window.location.href = '/'
            }}
          >
            <span>Go back to Home</span>
          </Button>

          <p className="pt-24 text-gray-400"></p>

          <pre className="whitespace-break-spaces text-sm text-gray-400">
            Error digest: {'digest' in error ? String(error.digest) : 'oh oh'}
          </pre>
        </div>
      </body>
    </html>
  )
}
