"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { ChartContainer } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [feedback, setFeedback] = useState<any[]>([])
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/auth/signin")
        return
      }
      if (user.user_metadata?.role !== "admin") {
        router.replace("/auth/signin")
        return
      }
      setUser(user)
    })
  }, [router])

  useEffect(() => {
    async function fetchData() {
      const { data: feedbackData } = await supabase.from("feedback").select("*")
      const { data: winnerData } = await supabase.from("winners").select("*")
      setFeedback(feedbackData || [])
      setWinners(winnerData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
      <div className="mt-8">
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )

  // Analytics calculations
  const total = feedback.length
  const avgRating =
    total > 0
      ? (
          feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / total
        ).toFixed(2)
      : "-"
  const winnerCount = winners.length
  const winnerPercent = total > 0 ? ((winnerCount / total) * 100).toFixed(1) : "-"

  // Ratings distribution for chart
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: feedback.filter((f) => f.rating === r).length,
  }))

  // Most common feedback (by review text)
  const reviewWords = feedback
    .flatMap((f) => (f.review ? f.review.split(/\s+/) : []))
    .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 3)
  const wordFreq: Record<string, number> = {}
  reviewWords.forEach((w) => (wordFreq[w] = (wordFreq[w] || 0) + 1))
  const commonWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Reward distribution for chart
  const rewardCounts = [10, 15, 20, 25].map((d) => ({
    discount: d,
    count: winners.filter((w) => w.discount_percentage === d).length,
  }))

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-lg font-semibold">Total Feedback</div>
          <div className="text-3xl font-bold">{total}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-lg font-semibold">Avg. Rating</div>
          <div className="text-3xl font-bold">{avgRating}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-lg font-semibold">Winners (%)</div>
          <div className="text-3xl font-bold">{winnerPercent}%</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Ratings Distribution</h2>
          <ChartContainer
            config={{}}
          >
            {/* Replace with actual chart, e.g. BarChart */}
            <div className="h-40 flex items-center justify-center text-muted-foreground">[Bar Chart Placeholder]</div>
          </ChartContainer>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Reward Distribution</h2>
          <ChartContainer
            config={{}}
          >
            {/* Replace with actual chart, e.g. PieChart */}
            <div className="h-40 flex items-center justify-center text-muted-foreground">[Pie Chart Placeholder]</div>
          </ChartContainer>
        </Card>
      </div>
      <Card className="p-4 mt-8">
        <h2 className="font-semibold mb-2">Most Common Feedback Words</h2>
        <div className="flex flex-wrap gap-2">
          {commonWords.length === 0 && <span className="text-muted-foreground">No data</span>}
          {commonWords.map(([word, count]) => (
            <span key={word} className="bg-muted px-2 py-1 rounded text-sm">{word} ({count})</span>
          ))}
        </div>
      </Card>
    </div>
  )
} 