import { updateSession } from "@/utils/supabase/middleware"
import { NextRequest, NextResponse } from "next/server"
import { CONFIG } from "@/utils/config"
import { UserResponse } from "@supabase/auth-js"

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request)
  const host = getEffectiveHost(request)
  const path = getFullPath(request)

  const isDashboardRequest = CONFIG.IS_PREVIEW
    ? path.startsWith("/dashboard")
    : host === CONFIG.DASHBOARD_DOMAIN

  // Handle dashboard requests (either by subdomain or path in preview)
  if (isDashboardRequest) {
    // Handle authentication redirects for non-API routes
    if (!path.includes("/api/")) {
      const authRedirect = handleAuthRedirects(user, path)
      if (authRedirect) return authRedirect
    }

    // No rewrite for Vercel previews
    if (CONFIG.IS_PREVIEW) {
      return response
    }

    // Rewrite to `/dashboard` route
    return rewritePath("/dashboard", path, request.url)
  }

  // Handle website domain requests
  if (host === CONFIG.WEB_DOMAIN) {
    return rewritePath("/website", path, request.url)
  }

  return response
}

function getEffectiveHost(request: NextRequest): string {
  let host = request.headers.get("host") || ""

  const originHeader = request.headers.get("origin")
  if (originHeader) {
    const origin = new URL(originHeader)
    if (origin.host.startsWith("dashboard.")) {
      host = origin.host
    }
  }

  return host
}

function getFullPath(request: NextRequest): string {
  const searchParams = request.nextUrl.searchParams.toString()
  return `${request.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`
}

function handleAuthRedirects(user: UserResponse, path: string) {
  // Redirect unauthenticated users to sign-in
  if (user.error && !path.endsWith("/sign-in")) {
    return NextResponse.redirect(new URL(`${CONFIG.DASHBOARD_URL}/sign-in`))
  }

  // Redirect authenticated users to dashboard
  if (!user.error && path.endsWith("/sign-in")) {
    return NextResponse.redirect(new URL(CONFIG.DASHBOARD_URL))
  }

  return null
}

function rewritePath(prefix: string, path: string, requestUrl: string) {
  return NextResponse.rewrite(
    new URL(`${prefix}${path === "/" ? "" : path}`, requestUrl)
  )
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
