import { createClient } from "@/lib/supabase/server"
import { CONFIG } from "@/utils/config"
import Link from "next/link"
import { Button } from "../../ui/button"

export default async function AuthButton() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild size="sm" variant={"default"}>
        <Link href={`${CONFIG.DASHBOARD_URL}/`}>Dashboard</Link>
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href={`${CONFIG.DASHBOARD_URL}/sign-in`}>Sign in</Link>
      </Button>
      {/* <Button asChild size="sm" variant={"default"}>
        <Link href={`${CONFIG.DASHBOARD_URL}/sign-up`}>Sign up</Link>
      </Button> */}
    </div>
  )
}
