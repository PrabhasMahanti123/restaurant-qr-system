export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession()

    return NextResponse.json({
      authenticated: !!session,
      session,
    })
  } catch (error) {
    console.error("Auth status error:", error)
    return NextResponse.json({ error: "Failed to fetch authentication status" }, { status: 500 })
  }
}
