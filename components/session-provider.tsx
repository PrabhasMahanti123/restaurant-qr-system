"use client"

import type React from "react"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Use a try-catch block to prevent client-side errors
  try {
    return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
  } catch (error) {
    console.error("SessionProvider error:", error)
    return <>{children}</>
  }
}
