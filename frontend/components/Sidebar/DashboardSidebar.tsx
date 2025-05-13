"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  Calendar1Icon,
  UsersRoundIcon,
} from "lucide-react"

import { NavMain } from "@/components/Sidebar/NavMain"
import { NavUser, TUser } from "@/components/Sidebar/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/User/useUser"
import { dashboardPath } from "@/utils/path"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Fixtures",
      url: dashboardPath("/fixtures"),
      icon: Calendar1Icon,
    },
    {
      title: "Teams",
      url: dashboardPath("/teams"),
      icon: UsersRoundIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser()

  if (loading) {
    return <div>Loading...</div>
  }

  const userData: TUser = {
    name: "Callum",
    email: user?.email || "",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={dashboardPath("/")}>
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Kohlrabii</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
