"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useDebouncedCallback } from "use-debounce"

interface TeamLinkProps {
  href: string
  className?: string
  children: ReactNode
}

export function PrefetchOnHoverLink({
  href,
  className,
  children,
}: TeamLinkProps) {
  const router = useRouter()
  const handleMouseEnter = useDebouncedCallback(() => {
    router.prefetch(href)
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
