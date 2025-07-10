import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Insert feedback into database
    const { error: insertError } = await supabase.from("feedback").insert([
      {
        name: data.name,
        age: Number.parseInt(data.age),
        gender: data.gender,
        review: data.review,
        rating: Number.parseInt(data.rating),
        visit_frequency: data.visitFrequency,
        recommendation: data.recommendation,
        email: data.email,
        restaurant_id: data.restaurant,
        table_number: data.table,
        submitted_at: data.submittedAt,
      },
    ])

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    // Get total submissions count for this restaurant
    const { count } = await supabase
      .from("feedback")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", data.restaurant)

    // Winner logic: 2-3 out of every 10 submissions
    const submissionNumber = (count || 0) % 10
    const winnerNumbers = [2, 5, 8] // 3 out of 10 positions
    const isWinner = winnerNumbers.includes(submissionNumber)

    let discount = 0
    if (isWinner) {
      // Random discount between 10-25%
      const discounts = [10, 15, 20, 25]
      discount = discounts[Math.floor(Math.random() * discounts.length)]

      // Log the winner
      await supabase.from("winners").insert([
        {
          email: data.email,
          restaurant_id: data.restaurant,
          table_number: data.table,
          discount_percentage: discount,
          won_at: new Date().toISOString(),
        },
      ])
    }

    return NextResponse.json({
      success: true,
      isWinner,
      discount,
      submissionNumber: submissionNumber + 1,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
