import { toast } from "@/components/Toast/use-toast"
import { CONFIG } from "@/utils/config"
import {
  type Client,
  type Middleware,
  createClient as baseCreateClient,
} from "./core"

const errorMiddleware: Middleware = {
  onError: async () => {
    toast({
      title: "A network error occurred",
      description: "Please try again later",
    })
  },
}

export const createClientSideAPI = (token?: string): Client => {
  const api = baseCreateClient(CONFIG.DASHBOARD_URL, token)
  api.use(errorMiddleware)
  return api
}

export const api = createClientSideAPI()
