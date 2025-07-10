import { QRCodeGenerator } from "@/components/qr-code-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientOnly } from "@/components/client-only1"
import { Utensils, QrCode, Smile, Gift, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-100 flex flex-col items-center justify-center p-0 md:p-4">
      {/* Hero Section */}
      <div className="w-full max-w-3xl mx-auto text-center py-10 md:py-16">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="inline-flex items-center justify-center bg-white shadow-lg rounded-full w-20 h-20 mb-4 border-4 border-pink-100">
            <Utensils className="w-10 h-10 text-pink-500" />
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight drop-shadow-lg">Welcome to <span className="text-pink-500">Feedback Feast</span></h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">Scan, sign in, and share your dining experience for a chance to win rewards! Your feedback helps us serve you better.</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Card className="w-full max-w-lg shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-pink-600">
                <QrCode className="w-7 h-7" /> Customer QR Code
              </CardTitle>
              <CardDescription className="text-gray-500">Display this QR code on tables or receipts for customers to scan</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientOnly
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  </div>
                }
              >
                <QRCodeGenerator />
              </ClientOnly>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-4xl mx-auto mt-10 md:mt-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <QrCode className="w-10 h-10 text-blue-500 mb-2" />
            <span className="text-lg font-semibold text-gray-700 mb-1">Scan QR</span>
            <p className="text-sm text-gray-500 text-center">Customer scans the QR code with their phone</p>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <Smile className="w-10 h-10 text-pink-500 mb-2" />
            <span className="text-lg font-semibold text-gray-700 mb-1">Sign In</span>
            <p className="text-sm text-gray-500 text-center">Redirected to Google Sign-in for authentication</p>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <Utensils className="w-10 h-10 text-yellow-500 mb-2" />
            <span className="text-lg font-semibold text-gray-700 mb-1">Share Feedback</span>
            <p className="text-sm text-gray-500 text-center">Fill out a quick feedback form with your experience</p>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <Gift className="w-10 h-10 text-green-500 mb-2" />
            <span className="text-lg font-semibold text-gray-700 mb-1">Win Rewards</span>
            <p className="text-sm text-gray-500 text-center">Random chance to win discounts and rewards!</p>
          </div>
        </div>
      </div>

      {/* Call to Action for Feedback (Mobile Only) */}
      <div className="block md:hidden mt-10 mb-4 w-full text-center">
        <Link href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-600 transition">
          Start Feedback <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
