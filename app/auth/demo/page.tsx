"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, ArrowRight } from "lucide-react"

export default function DemoSignInPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [demoUser, setDemoUser] = useState({
    name: "Demo User",
    email: "demo@example.com",
  })

  const restaurant = searchParams.get("restaurant") || "test-restaurant"
  const table = searchParams.get("table") || "1"
  const callbackUrl = searchParams.get("callbackUrl") || `/form?restaurant=${restaurant}&table=${table}`

  useEffect(() => {
    setMounted(true)
    console.log("Demo page loaded:", { restaurant, table, callbackUrl })
  }, [restaurant, table, callbackUrl])

  const handleDemoSignIn = async () => {
    console.log("Demo sign-in starting...")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: demoUser.name,
          email: demoUser.email,
          callbackUrl,
        }),
      })

      console.log("Demo auth response:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Demo auth success, redirecting to:", callbackUrl)

        // Use window.location.href for hard redirect
        window.location.href = callbackUrl
      } else {
        throw new Error("Demo sign-in failed")
      }
    } catch (error) {
      console.error("Demo sign-in error:", error)
      alert("Demo sign-in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🎭 Demo Mode</CardTitle>
          <CardDescription>Sign in with demo credentials for testing purposes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-blue-800">Testing Context</p>
              <p className="text-xs text-blue-600">
                Restaurant: <span className="font-medium">{restaurant}</span>
              </p>
              <p className="text-xs text-blue-600">
                Table: <span className="font-medium">{table}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="demo-name">Name</Label>
              <Input
                id="demo-name"
                value={demoUser.name}
                onChange={(e) => setDemoUser({ ...demoUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="demo-email">Email</Label>
              <Input
                id="demo-email"
                type="email"
                value={demoUser.email}
                onChange={(e) => setDemoUser({ ...demoUser, email: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <User className="w-5 h-5 mr-2" />
            {isLoading ? "Signing in..." : "Continue to Feedback Form"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="text-xs text-gray-500 text-center">
            This is for testing purposes only. In production, use proper Google OAuth authentication.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
