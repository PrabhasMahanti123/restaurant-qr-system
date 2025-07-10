// Simple token-based authentication system
import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

// Secret key for JWT signing
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_change_this")

// Generate a JWT token
export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

// Verify a JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

// Set auth cookie
export function setAuthCookie(token: string) {
  cookies().set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
}

// Get auth cookie
export function getAuthCookie() {
  return cookies().get("auth-token")?.value
}

// Clear auth cookie
export function clearAuthCookie() {
  cookies().delete("auth-token")
}

// Check if user is authenticated
export async function isAuthenticated() {
  const token = getAuthCookie()
  if (!token) return false

  const payload = await verifyToken(token)
  return !!payload
}

// Get current user
export async function getCurrentUser() {
  const token = getAuthCookie()
  if (!token) return null

  const payload = await verifyToken(token)
  return payload
}
