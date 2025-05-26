import { getLatestSeason } from "@/actions/seasons"
import { AppSidebar } from "@/components/common/Sidebar/DashboardSidebar"
import { SiteHeader } from "@/components/common/Sidebar/SiteHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSideAPI } from "@/lib/api/server"
import type { TSeason } from "@/lib/api/types"
import { PageTitleProvider } from "@/providers/PageTitle"
import { KolQueryClientProvider } from "@/providers/QueryClient"
import { SeasonContextProvider } from "@/providers/SeasonMetadata"
import { ThemeProvider } from "next-themes"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const api = await getServerSideAPI()
  const { season, gameweek } = await getLatestSeason(api)

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
              <PageTitleProvider>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                      <SeasonContextProvider
                        latestSeason={season as TSeason}
                        latestGameweek={gameweek}
                      >
                        {children}
                      </SeasonContextProvider>
                    </div>
                  </div>
                </div>
              </PageTitleProvider>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </KolQueryClientProvider>
  )
}
