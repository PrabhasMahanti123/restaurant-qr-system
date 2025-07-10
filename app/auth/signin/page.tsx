"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, AlertCircle, User, Info, ArrowRight } from "lucide-react"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLocalhost, setIsLocalhost] = useState(false)
  const [mounted, setMounted] = useState(false)

  const restaurant = searchParams.get("restaurant") || "test-restaurant"
  const table = searchParams.get("table") || "1"

  // Fix hydration and check localhost
  useEffect(() => {
    setMounted(true)
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    setIsLocalhost(isLocal)

    console.log("Sign-in page loaded:", {
      restaurant,
      table,
      isLocal,
      currentUrl: window.location.href,
    })
  }, [restaurant, table])

  const callbackUrl = `/form?restaurant=${restaurant}&table=${table}`

  const handleDemoMode = async () => {
    console.log(
      "Demo mode clicked, redirecting to:",
      `/auth/demo?restaurant=${restaurant}&table=${table}&callbackUrl=${encodeURIComponent(callbackUrl)}`,
    )

    setIsLoading(true)

    // Use window.location.href for a hard redirect to avoid any routing issues
    window.location.href = `/auth/demo?restaurant=${restaurant}&table=${table}&callbackUrl=${encodeURIComponent(callbackUrl)}`
  }

  const handleGoogleSignIn = () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Initiating Google sign-in with callback:", callbackUrl)
      window.location.href = `/api/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
    } catch (err) {
      console.error("Sign-in error:", err)
      setError("Failed to initiate sign-in. Please try again.")
      setIsLoading(false)
    }
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <CardDescription>Sign in to share your feedback and get a chance to win exciting rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {isLocalhost ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
              <Info className="w-4 h-4 text-green-500 mt-0.5" />
              <div className="text-sm text-green-700">
                <p className="font-medium mb-1">✅ Development Mode Active</p>
                <p>Using demo authentication for local testing.</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
              <p className="text-sm text-yellow-700">
                Google OAuth is not configured for localhost. Use demo mode for testing.
              </p>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Restaurant: <span className="font-medium text-blue-600">{restaurant}</span>
            </p>
            <p className="text-sm text-gray-600">
              Table: <span className="font-medium text-blue-600">{table}</span>
            </p>
          </div>

          <div className="space-y-3">
            {isLocalhost ? (
              <Button
                onClick={handleDemoMode}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <User className="w-5 h-5 mr-2" />
                {isLoading ? "Loading..." : "Continue with Demo Mode"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full" size="lg">
                <Chrome className="w-5 h-5 mr-2" />
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
            )}

            {/* Fallback demo mode button for production */}
            {!isLocalhost && (
              <Button onClick={handleDemoMode} variant="outline" className="w-full bg-transparent" size="lg">
                <User className="w-5 h-5 mr-2" />
                Use Demo Mode Instead
              </Button>
            )}
          </div>

          {/* Debug info */}
          <div className="text-xs text-gray-400 text-center space-y-1">
            <p>Debug: {isLocalhost ? "Localhost detected" : "Production mode"}</p>
            <p>Callback: {callbackUrl}</p>
          </div>

          <div className="text-xs text-gray-500 text-center">
            By signing in, you agree to participate in our feedback program and may receive promotional offers.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
