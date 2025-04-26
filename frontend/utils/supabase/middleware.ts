import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { CONFIG } from "@/utils/config"

export const updateSession = async (req: NextRequest) => {
  // Get hostname of request
  let host = req.headers.get("host")!

  // Hacky replacement for redirect bug
  const originHeader = req.headers.get("origin")
  if (originHeader) {
    const origin = new URL(originHeader)
    if (origin.host.startsWith("dashboard.")) {
      host = origin.host
    }
  }

  // special case for Vercel preview deployment URLs
  if (host.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)) {
    if (host.startsWith("dashboard.")) {
      host = CONFIG.DASHBOARD_DOMAIN
    } else {
      host = CONFIG.WEB_DOMAIN
    }
  }

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${req.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // Auth
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
        domain: `.${CONFIG.WEB_DOMAIN}`,
        sameSite: 'lax' as const,
        secure: CONFIG.WEB_DOMAIN.startsWith("https") ? true : false,
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

  // console.log(host, "HOST")
  // console.log(new URL("https://kohlrabii-dij57flr9-kohlrabii.vercel.app/").host.split("-")[0], "URL HOST")

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser()

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

    return NextResponse.rewrite(
      new URL(`/dashboard${path === "/" ? "" : path}`, req.url),
    )
  }

  // rewrite root application to `/website` folder
  if (host === CONFIG.WEB_DOMAIN) {
    return NextResponse.rewrite(
      new URL(`/website${path === "/" ? "" : path}`, req.url),
    )
  }

  return response
}
