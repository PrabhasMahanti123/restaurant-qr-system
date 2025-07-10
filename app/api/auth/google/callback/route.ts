import { type NextRequest, NextResponse } from "next/server"
import { signToken, setAuthCookie } from "@/lib/auth"

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
const REDIRECT_URI = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const stateParam = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect("/auth/error?error=no_code")
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect("/auth/error?error=no_access_token")
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    // Create our own JWT token
    const token = await signToken({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    })

    // Set the token as a cookie
    setAuthCookie(token)

    // Parse the state parameter to get the callback URL
    let callbackUrl = "/"
    if (stateParam) {
      try {
        const stateObj = JSON.parse(Buffer.from(stateParam, "base64").toString())
        callbackUrl = stateObj.callbackUrl || "/"
      } catch (e) {
        console.error("Failed to parse state parameter:", e)
      }
    }

    return NextResponse.redirect(new URL(callbackUrl, request.url))
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect("/auth/error?error=oauth_error")
  }
}
