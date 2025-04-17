import { updateSession } from "@/utils/supabase/middleware"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Check if the request is for the dashboard subdomain
  const isDashboardSubdomain = hostname.startsWith('dashboard.')

  // If it's a dashboard subdomain request, rewrite to the dashboard route
  if (isDashboardSubdomain) {
    // Create a new URL for the dashboard path
    const dashboardUrl = new URL(`/dashboard${url.pathname === '/' ? '' : url.pathname}`, request.url)

    // Clone the search params
    url.searchParams.forEach((value, key) => {
      dashboardUrl.searchParams.set(key, value)
    })

    // First handle the session to ensure authentication
    const sessionResponse = await updateSession(request)

    // If the session response is a redirect (e.g., to login), follow that
    if (sessionResponse.headers.has('Location')) {
      return sessionResponse
    }

    // Otherwise rewrite to the dashboard path
    return NextResponse.rewrite(dashboardUrl)
  }

  // For regular requests, just update the session
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
