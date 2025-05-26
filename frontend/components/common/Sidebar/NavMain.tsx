"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/utils/merge"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url === "/"
                ? pathname === "/"
                : pathname === item.url || pathname.startsWith(`${item.url}/`)

            return (
              <SidebarMenuItem
                key={item.title}
                className={cn(
                  "relative",
                  "after:absolute after:right-0 after:top-0 after:h-full after:w-1 after:scale-y-0 after:bg-primary after:opacity-0 after:transition-all after:duration-200 after:ease-in-out after:rounded-md",
                  "hover:after:scale-y-100 hover:after:opacity-70",
                  isActive && "after:scale-y-100 after:opacity-100",
                )}
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
