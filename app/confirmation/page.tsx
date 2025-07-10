"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Heart, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import react-confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const isWinner = searchParams.get("isWinner") === "true"
  const discount = searchParams.get("discount")
  const [showConfetti, setShowConfetti] = useState(false)
  const [showWheel, setShowWheel] = useState(true)
  const [spun, setSpun] = useState(false)

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

  useEffect(() => {
    if (isWinner && spun) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [isWinner, spun])

  // Simple wheel SVG and modal
  const WheelModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Spin the Wheel!</h2>
        <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
          <circle cx="60" cy="60" r="55" fill="#fbc2eb" stroke="#a1c4fd" strokeWidth="8" />
          <path d="M60 60 L60 10 A50 50 0 0 1 110 60 Z" fill="#a1c4fd" />
          <path d="M60 60 L110 60 A50 50 0 0 1 60 110 Z" fill="#fbc2eb" />
          <path d="M60 60 L60 110 A50 50 0 0 1 10 60 Z" fill="#a1c4fd" />
          <path d="M60 60 L10 60 A50 50 0 0 1 60 10 Z" fill="#fbc2eb" />
          <circle cx="60" cy="60" r="10" fill="#fff" stroke="#a1c4fd" strokeWidth="2" />
        </svg>
        <button
          className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-600 transition text-lg"
          onClick={() => { setShowWheel(false); setSpun(true); }}
        >
          Spin Now
        </button>
        <p className="mt-4 text-gray-500 text-sm">Tap to spin and reveal your reward!</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 relative">
      {isWinner && showConfetti && <Confetti width={typeof window !== 'undefined' ? window.innerWidth : 300} height={typeof window !== 'undefined' ? window.innerHeight : 300} numberOfPieces={300} recycle={false} />}
      {showWheel && <WheelModal />}
      {!showWheel && (
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
              <Button variant="secondary" asChild className="w-full mt-2">
                <Link href="/form">Submit Another Feedback</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
