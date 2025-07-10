import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function GET() {
  clearAuthCookie()
  return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL || "http://localhost:3000"))
}
