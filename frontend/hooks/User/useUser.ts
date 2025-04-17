"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    // Initial fetch of user data
    async function getInitialUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Error fetching user:", error)
          setUser(null)
        } else if (data?.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
}
