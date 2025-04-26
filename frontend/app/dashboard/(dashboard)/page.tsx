'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/fixtures')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse">Loading dashboard...</div>
    </div>
  )
}

// import { redirect } from 'next/navigation'

// export default function DashboardPage() {
//   redirect('/fixtures')
// }
