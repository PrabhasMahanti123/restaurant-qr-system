import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    return NextResponse.json({
      authenticated: !!user,
      user: user || null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Auth status error:", error)
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: "Failed to check authentication status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
