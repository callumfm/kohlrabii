import { toast } from "@/components/common/Toast/use-toast"
import { createClient } from "@/lib/supabase/client"
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

export const createClientSideAPI = async (): Promise<Client> => {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const token = session?.access_token
  const api = baseCreateClient(process.env.NEXT_PUBLIC_API_URL as string, token)
  api.use(errorMiddleware)
  return api
}
