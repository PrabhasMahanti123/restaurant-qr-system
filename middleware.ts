import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_change_this")

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log("Middleware:", pathname)

  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/debug") ||
    pathname.startsWith("/troubleshoot")
  ) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (pathname.startsWith("/form")) {
    const token = request.cookies.get("auth-token")?.value
    console.log("Form route - token exists:", !!token)

    if (!token) {
      const restaurant = request.nextUrl.searchParams.get("restaurant") || "test"
      const table = request.nextUrl.searchParams.get("table") || "1"
      const redirectUrl = new URL("/auth/signin", request.url)
      redirectUrl.searchParams.set("restaurant", restaurant)
      redirectUrl.searchParams.set("table", table)

      console.log("Redirecting to signin:", redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      const restaurant = request.nextUrl.searchParams.get("restaurant") || "test"
      const table = request.nextUrl.searchParams.get("table") || "1"
      const redirectUrl = new URL("/auth/signin", request.url)
      redirectUrl.searchParams.set("restaurant", restaurant)
      redirectUrl.searchParams.set("table", table)

      console.log("Invalid token, redirecting to signin:", redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    console.log("Form access granted for user:", payload.email)
  }

  // Don't redirect authenticated users away from auth pages - let them access if they want
  // This prevents redirect loops

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
