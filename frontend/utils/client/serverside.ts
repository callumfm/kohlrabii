import type { Client } from "@/utils/api/client"
import { cookies, headers } from "next/headers"
import { cache } from "react"
import { createServerSideAPI } from "."

const _getServerSideAPI = async (token?: string): Promise<Client> => {
  const headers_ = await headers()
  const cookies_ = await cookies()
  return createServerSideAPI(headers_, cookies_, token)
}

// Memoize the API instance for the duration of the request
export const getServerSideAPI = cache(_getServerSideAPI)
