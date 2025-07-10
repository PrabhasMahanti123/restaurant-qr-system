import { type NextRequest, NextResponse } from "next/server"
import { signToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, callbackUrl } = await request.json()

    // Create a demo JWT token
    const token = await signToken({
      id: "demo-user-" + Date.now(),
      email: email || "demo@example.com",
      name: name || "Demo User",
      picture: null,
      demo: true, // Mark as demo user
    })

    // Set the token as a cookie
    setAuthCookie(token)

    return NextResponse.json({
      success: true,
      callbackUrl: callbackUrl || "/",
    })
  } catch (error) {
    console.error("Demo auth error:", error)
    return NextResponse.json({ error: "Demo authentication failed" }, { status: 500 })
  }
}
