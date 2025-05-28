import { createClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"
import { cache } from "react"
import type { Client } from "./core"
import { createClient as baseCreateClient } from "./core"

export const getServerURL = (path?: string): string => {
  const stringPath = path || ""
  const baseURL = process.env.SERVER_API_URL
  return `${baseURL}${stringPath}`
}

export const createServerSideAPI = (
  headers: Headers,
  cookies: any,
  token?: string,
): Client => {
  let apiHeaders = {}

  const xForwardedFor = headers.get("X-Forwarded-For")
  if (xForwardedFor) {
    apiHeaders = {
      ...apiHeaders,
      "X-Forwarded-For": xForwardedFor,
    }
  }

  apiHeaders = {
    ...apiHeaders,
    Cookie: cookies.toString(),
  }

  const client = baseCreateClient(
    process.env.NEXT_PUBLIC_API_URL as string,
    token,
    apiHeaders,
  )

  return client
}

const _getServerSideAPI = async (): Promise<Client> => {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const token = session?.access_token
  const headers_ = await headers()
  const cookies_ = await cookies()
  return createServerSideAPI(headers_, cookies_, token)
}

// Memoize the API instance for the duration of the request
export const getServerSideAPI = cache(_getServerSideAPI)
