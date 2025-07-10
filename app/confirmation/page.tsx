"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Heart, Star } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const isWinner = searchParams.get("isWinner") === "true"
  const discount = searchParams.get("discount")

  const getRandomMessage = () => {
    const messages = [
      "Thank you for your valuable feedback!",
      "We appreciate you taking the time to share your thoughts!",
      "Your feedback helps us serve you better!",
      "Thanks for being an amazing customer!",
      "We're grateful for your honest review!",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getWinnerMessage = () => {
    const messages = [
      `🎉 Congratulations! You got ${discount}% off your next meal!`,
      `🎊 You're a winner! Enjoy ${discount}% discount on your next visit!`,
      `🏆 Lucky you! ${discount}% off your next dining experience!`,
      `✨ Amazing! You've won ${discount}% off your next meal with us!`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            {isWinner ? <Gift className="w-16 h-16 text-yellow-500" /> : <Heart className="w-16 h-16 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">{isWinner ? "🎉 You're a Winner!" : "Thank You!"}</CardTitle>
          <CardDescription className="text-lg">{isWinner ? getWinnerMessage() : getRandomMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isWinner && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-800">Special Offer</span>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-yellow-700">
                Show this screen to your server to claim your discount on your next visit!
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                *Valid for 30 days from today. Cannot be combined with other offers.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Your feedback is invaluable to us and helps us create better experiences for all our customers.
            </p>

            {!isWinner && (
              <p className="text-sm text-gray-500">
                Keep sharing your feedback for more chances to win exciting rewards!
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Generate Another QR Code</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a href="https://your-restaurant-website.com" target="_blank" rel="noopener noreferrer">
                Visit Our Website
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
