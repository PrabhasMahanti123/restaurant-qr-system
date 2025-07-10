export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Google OAuth route called")

    // Check for Google OAuth credentials
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("Missing Google OAuth credentials")
      console.error("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? "Set" : "Missing")
      console.error("GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET ? "Set" : "Missing")

      // Redirect to error page with specific error
      return NextResponse.redirect(new URL("/auth/error?error=missing_credentials", request.url))
    }

    const { searchParams } = new URL(request.url)
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    console.log("Callback URL:", callbackUrl)

    // Get the base URL from the request
    const baseUrl = process.env.NEXTAUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const REDIRECT_URI = `${baseUrl}/api/auth/google/callback`

    console.log("Redirect URI:", REDIRECT_URI)

    // Store the callback URL in the state parameter
    const state = Buffer.from(JSON.stringify({ callbackUrl })).toString("base64")

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    googleAuthUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID)
    googleAuthUrl.searchParams.append("redirect_uri", REDIRECT_URI)
    googleAuthUrl.searchParams.append("response_type", "code")
    googleAuthUrl.searchParams.append("scope", "openid email profile")
    googleAuthUrl.searchParams.append("state", state)

    console.log("Redirecting to Google:", googleAuthUrl.toString())

    return NextResponse.redirect(googleAuthUrl.toString())
  } catch (error) {
    console.error("Google OAuth route error:", error)
    return NextResponse.redirect(new URL("/auth/error?error=oauth_init_failed", request.url))
  }
}
