import { updateSession } from "@/lib/supabase/middleware"
import { CONFIG } from "@/utils/config"
import type { UserResponse } from "@supabase/auth-js"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request)
  const host = getEffectiveHost(request)
  const path = getFullRequestPath(request)

  const isDashboardRequest = CONFIG.IS_PREVIEW
    ? path.startsWith("/dashboard")
    : host === CONFIG.DASHBOARD_DOMAIN

  // Handle dashboard requests (either by subdomain or path in preview)
  if (isDashboardRequest) {
    const authRedirect = handleAuthRedirects(user, path, response)
    if (authRedirect) return authRedirect

    // No rewrite for Vercel previews
    if (CONFIG.IS_PREVIEW) {
      return response
    }

    // Rewrite to `/dashboard` route
    return rewritePath("/dashboard", path, request.url, response)
  }

  // Handle website domain requests
  if (host === CONFIG.WEB_DOMAIN) {
    return rewritePath("/website", path, request.url, response)
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

function getFullRequestPath(request: NextRequest): string {
  const searchParams = request.nextUrl.searchParams.toString()
  return `${request.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`
}

function persistCookies(fromResponse: NextResponse, toResponse: NextResponse) {
  const cookies = fromResponse.cookies.getAll()
  cookies.forEach(({ name, value }) => {
    toResponse.cookies.set(name, value)
  })
  return toResponse
}

function handleAuthRedirects(
  user: UserResponse,
  path: string,
  response: NextResponse,
) {
  let redirectPath: string | undefined = undefined

  // Redirect unauthenticated users to sign-in
  if (user.error && !path.endsWith("/sign-in")) {
    redirectPath = `${CONFIG.DASHBOARD_URL}/sign-in`

    // Redirect authenticated users to dashboard
  } else if (!user.error && path.endsWith("/sign-in")) {
    redirectPath = CONFIG.DASHBOARD_URL
  }

  if (redirectPath) {
    return persistCookies(
      response,
      NextResponse.redirect(new URL(redirectPath)),
    )
  }

  return null
}

function rewritePath(
  prefix: string,
  path: string,
  requestUrl: string,
  response: NextResponse,
) {
  const rewriteUrl = new URL(`${prefix}${path === "/" ? "" : path}`, requestUrl)
  return persistCookies(response, NextResponse.rewrite(rewriteUrl))
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
