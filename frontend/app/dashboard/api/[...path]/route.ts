import { unwrap } from "@/lib/api/core"
import { getServerSideAPI } from "@/lib/api/server"
import { CONFIG } from "@/utils/config"
import { type NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  const api = await getServerSideAPI()
  const { ...params } = Object.fromEntries(request.nextUrl.searchParams)
  let pathname = request.url.split("?")[0].replace(request.nextUrl.origin, "")

  if (CONFIG.IS_PREVIEW) {
    pathname = pathname.replace("/dashboard", "")
  }

  const data = await unwrap(
    api.GET(pathname as any, {
      params: {
        query: {
          ...params,
        },
      },
    }),
  )

  return NextResponse.json(data, {
    status: data.status,
  })
}
