import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  // Construct Google OAuth URL
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = encodeURIComponent(
    `${process.env.NEXTAUTH_URL || request.headers.get("origin")}/api/auth/callback/google`,
  )
  const scope = encodeURIComponent("openid email profile")

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${encodeURIComponent(callbackUrl)}`

  return NextResponse.redirect(googleAuthUrl)
}
