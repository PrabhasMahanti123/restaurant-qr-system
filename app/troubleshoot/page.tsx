"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function TroubleshootPage() {
  const [checks, setChecks] = useState<Record<string, { status: "loading" | "success" | "error"; message: string }>>({})

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    const diagnostics = {
      "Server Health": checkServerHealth,
      "Environment Variables": checkEnvironmentVariables,
      "Authentication Status": checkAuthStatus,
      "Database Connection": checkDatabaseConnection,
    }

    for (const [name, checkFn] of Object.entries(diagnostics)) {
      setChecks((prev) => ({ ...prev, [name]: { status: "loading", message: "Checking..." } }))

      try {
        const result = await checkFn()
        setChecks((prev) => ({ ...prev, [name]: { status: "success", message: result } }))
      } catch (error) {
        setChecks((prev) => ({ ...prev, [name]: { status: "error", message: error.message } }))
      }
    }
  }

  const checkServerHealth = async () => {
    const response = await fetch("/api/health")
    if (!response.ok) throw new Error("Server health check failed")
    return "Server is responding correctly"
  }

  const checkEnvironmentVariables = async () => {
    const requiredVars = ["JWT_SECRET", "NEXTAUTH_URL"]
    const missing = requiredVars.filter((varName) => !process.env[`NEXT_PUBLIC_${varName}`])

    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(", ")}`)
    }
    return "All required environment variables are set"
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status")
      const data = await response.json()
      return data.authenticated ? "User is authenticated" : "User is not authenticated"
    } catch (error) {
      throw new Error("Authentication check failed")
    }
  }

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      })

      if (response.status === 405) {
        return "Database endpoint is accessible (method not allowed is expected)"
      }

      return "Database connection test completed"
    } catch (error) {
      throw new Error("Database connection failed")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-spin" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>System Diagnostics</CardTitle>
            <CardDescription>Check the status of various system components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(checks).map(([name, check]) => (
              <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-600">{check.message}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Button onClick={runDiagnostics} className="w-full">
                Run Diagnostics Again
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <a href="/" className="text-blue-600 hover:underline">
                    Home Page
                  </a>
                </p>
                <p>
                  <a href="/auth/signin?restaurant=test&table=1" className="text-blue-600 hover:underline">
                    Test Sign In
                  </a>
                </p>
                <p>
                  <a href="/auth/demo?restaurant=test&table=1" className="text-blue-600 hover:underline">
                    Demo Mode
                  </a>
                </p>
                <p>
                  <a href="/api/health" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    API Health Check
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
