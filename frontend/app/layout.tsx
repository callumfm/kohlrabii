import { Analytics } from "@vercel/analytics/react"
import { Geist } from "next/font/google"
import localFont from "next/font/local"
import { CONFIG } from "@/utils/config"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(CONFIG.WEB_URL),
  title: "Kohlrabii",
  description: "Premier League football predictive modelling and analytics",
}

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
})

const alteHaasGrotesk = localFont({
  src: [
    { path: "../public/fonts/AlteHaasGroteskBold.ttf" },
    { path: "../public/fonts/AlteHaasGroteskRegular.ttf" },
  ],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
