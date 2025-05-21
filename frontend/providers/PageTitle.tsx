"use client"

import { capitalise } from "@/utils/strings"
import { usePathname } from "next/navigation"
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

type PageTitleContextType = {
  title: string
  setTitle: (title: string) => void
}

const PageTitleContext = createContext<PageTitleContextType | null>(null)

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const initialTitle = capitalise(pathname.split("/").pop() ?? "")
  const [title, setTitle] = useState(initialTitle)

  useEffect(() => {
    setTitle(initialTitle)
  }, [pathname])

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  )
}

export function usePageTitle() {
  const ctx = useContext(PageTitleContext)
  if (!ctx) {
    throw new Error("usePageTitle must be used inside PageTitleProvider")
  }
  return ctx
}
