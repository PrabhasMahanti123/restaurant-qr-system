"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Settings } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "unknown_error"

  const errorMessages: Record<string, { title: string; description: string; solution: string }> = {
    missing_credentials: {
      title: "Google OAuth Not Configured",
      description: "The Google OAuth credentials are missing or not properly configured.",
      solution: "Please set up the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
    },
    no_code: {
      title: "Authorization Failed",
      description: "No authorization code was received from Google.",
      solution: "Please try signing in again or check your Google account permissions.",
    },
    no_access_token: {
      title: "Token Exchange Failed",
      description: "Failed to obtain access token from Google.",
      solution: "There may be an issue with the OAuth configuration. Please try again.",
    },
    oauth_error: {
      title: "Authentication Error",
      description: "An error occurred during the authentication process.",
      solution: "Please try signing in again or contact support if the problem persists.",
    },
    oauth_init_failed: {
      title: "OAuth Initialization Failed",
      description: "Failed to initialize the OAuth flow.",
      solution: "There may be a configuration issue. Please try again or contact support.",
    },
    unknown_error: {
      title: "Unknown Error",
      description: "An unknown error occurred during authentication.",
      solution: "Please try signing in again or contact support if the problem persists.",
    },
  }

  const errorInfo = errorMessages[error] || errorMessages.unknown_error

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
          <CardDescription className="text-red-600">{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Settings className="w-4 h-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">{errorInfo.solution}</p>
            </div>
          </div>

          {error === "missing_credentials" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium mb-2">For Development:</p>
              <p className="text-xs text-blue-700">
                You can continue testing without Google OAuth by using the demo mode or setting up Google OAuth
                credentials.
              </p>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
