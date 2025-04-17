import { cookies } from "next/headers"

export const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("next-auth.session-token")?.value
}
