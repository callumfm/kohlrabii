"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePageTitle } from "@/providers/PageTitle"
import { capitalise } from "@/utils/strings"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

export function BreadcrumbNav() {
  const pathname = usePathname()
  const { title } = usePageTitle()

  // Get path segments, excluding empty segments and 'dashboard'
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "dashboard")

  // No breadcrumbs if we're at the root or dashboard
  if (!pathSegments.length) {
    return <h1 className="text-base font-medium">Dashboard</h1>
  }

  const items = pathSegments.map((segment, index) => {
    const urlSegments = [...pathSegments.slice(0, index + 1)]
    const url = `/${urlSegments.join("/")}`
    const displayName =
      index === pathSegments.length - 1 ? title : capitalise(segment)

    return {
      name: displayName,
      url,
      current: index === pathSegments.length - 1,
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.url}>
            <BreadcrumbItem>
              {item.current ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.url}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
