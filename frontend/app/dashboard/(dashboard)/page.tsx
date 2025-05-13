"use client"

import { dashboardPath } from "@/utils/path"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    console.log("PUSHING TO", dashboardPath("/fixtures"))
    router.push(dashboardPath("/fixtures"))
  }, [router])

  return <></>
}
