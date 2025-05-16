"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { dashboardPath } from "@/utils/path"
import { ReactNode } from "react"

interface TeamLinkProps {
  teamId: number
  className?: string
  children: ReactNode
}

export function TeamLink({ teamId, className, children }: TeamLinkProps) {
  const router = useRouter()
  const href = dashboardPath(`/teams/${teamId}`)

  const handleMouseEnter = useDebouncedCallback(() => {
    router.prefetch(href);
  }, 300)

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {children}
    </Link>
  )
}
