import { KolQueryClientProvider } from "@/providers/QueryClient"
import { AppSidebar } from "@/components/Sidebar/DashboardSidebar"
import { SiteHeader } from "@/components/Sidebar/SiteHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "next-themes"
import { getLatestSeason } from "@/server/seasons"
import { getServerSideAPI } from "@/utils/client/serverside"
import { SeasonContextProvider } from "@/providers/SeasonMetadata"
import { Season } from "@/client/types"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const api = await getServerSideAPI()
  const { season: latestSeason, gameweek: latestGameweek } = await getLatestSeason(api)

  return (
    <KolQueryClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SeasonContextProvider
                      latestSeason={latestSeason as Season}
                      latestGameweek={latestGameweek}
                    >
                      {children}
                    </SeasonContextProvider>
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </KolQueryClientProvider>
  )
}
