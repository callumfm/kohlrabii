import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { CONFIG } from "@/utils/config"

export const updateSession = async (req: NextRequest) => {
  // Cookies
  const cookieDomain = process.env.VERCEL_ENV === "preview" ? undefined : `.${CONFIG.WEB_DOMAIN}`
  const cookieSecure = CONFIG.WEB_DOMAIN.startsWith("https") ? true : false

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: cookieDomain,
        sameSite: 'lax' as const,
        secure: cookieSecure,
        httpOnly: true,
      },
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          )
          response = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser()

  // Rerouting
  const searchParams = req.nextUrl.searchParams.toString()
  const path = `${req.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`

  // Hacky host solution for redirect bug
  let host = req.headers.get("host")!

  const originHeader = req.headers.get("origin")
  if (originHeader) {
    const origin = new URL(originHeader)
    if (origin.host.startsWith("dashboard.")) {
      host = origin.host
    }
  }

  // rewrites for dashboard pages
  if (host == CONFIG.DASHBOARD_DOMAIN) {

    // if user is not logged in and is not on the sign-in page, redirect to the sign-in page
    if (user.error && path !== "/sign-in") {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    // if user is logged in and is on the sign-in page, redirect to the dashboard
    if (!user.error && path == "/sign-in") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // rewrite to `/dashboard` route
    return NextResponse.rewrite(
      new URL(`/dashboard${path === "/" ? "" : path}`, req.url),
    )
  }

  // rewrite root application to `/website` route
  if (host === CONFIG.WEB_DOMAIN) {
    return NextResponse.rewrite(
      new URL(`/website${path === "/" ? "" : path}`, req.url),
    )
  }

  return response
}
