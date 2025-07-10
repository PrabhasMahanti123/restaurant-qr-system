"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status directly
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session")
        if (res.ok) {
          const session = await res.json()
          if (session && session.user) {
            setIsAuthenticated(true)
          } else {
            router.push("/auth/signin")
          }
        } else {
          router.push("/auth/signin")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth/signin")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
