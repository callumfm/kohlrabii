import { Button } from "@/components/ui/button"
import { CONFIG } from "@/utils/config"
import Link from "next/link"

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="sr-only">Kohlrabii home page</h1>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-4xl font-bold sm:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
              Forecasts for the Premier League
            </span>
          </h1>
          <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
          <p className="mt-5 text-base text-white sm:text-xl">
            Get ahead in your Fantasy leagues with AI-powered team and player
            performance forecasts.
          </p>

          <div className="inline-flex items-center px-6 py-4 mt-8 font-semibold">
            <Button asChild size="lg" variant={"default"}>
              <Link href={`${CONFIG.DASHBOARD_URL}/sign-up`}>
                Sign up for free
                <svg
                  className="w-6 h-6 ml-8 -mr-2"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Arrow right icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
