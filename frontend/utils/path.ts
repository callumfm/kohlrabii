import { CONFIG } from "@/utils/config"

export function dashboardPath(path: string): string {
  const fullPath = path.startsWith("/") ? path : `/${path}`
  return CONFIG.IS_PREVIEW ? `/dashboard${fullPath}` : fullPath
}
