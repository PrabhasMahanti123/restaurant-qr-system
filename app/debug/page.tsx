"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/status")
        const data = await res.json()
        setAuthStatus(data)
      } catch (error) {
        setAuthStatus({ error: error.message })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const testGoogleAuth = () => {
    window.location.href = "/api/auth/google?callbackUrl=/debug"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>System status and debugging information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Environment</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(
                  {
                    url: typeof window !== "undefined" ? window.location.href : "N/A",
                    userAgent: typeof window !== "undefined" ? navigator.userAgent : "N/A",
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Authentication Status</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(authStatus, null, 2)}</pre>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Test Authentication</h3>
              <Button onClick={testGoogleAuth}>Test Google Sign-In</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
