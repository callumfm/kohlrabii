import { CONFIG } from "@/utils/config"

export function dashboardPath(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`

  return CONFIG.IS_PREVIEW ? `/dashboard${path}` : path
}
