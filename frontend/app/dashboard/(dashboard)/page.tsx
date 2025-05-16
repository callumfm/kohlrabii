"use client"

import { dashboardPath } from "@/utils/path"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/fixtures")
  }, [router])

  return <></>
}
