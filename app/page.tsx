import { QRCodeGenerator } from "@/components/qr-code-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientOnly } from "@/components/client-only1"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurant Feedback System</h1>
          <p className="text-lg text-gray-600">Generate QR codes for customer engagement and feedback collection</p>

          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/setup">
                <Settings className="w-4 h-4 mr-2" />
                Setup Google OAuth
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer QR Code</CardTitle>
              <CardDescription>Display this QR code on tables or receipts for customers to scan</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientOnly
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                }
              >
                <QRCodeGenerator />
              </ClientOnly>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-sm">Customer scans QR code with their phone</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-sm">Redirected to Google Sign-in for authentication</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-sm">Fills out feedback form with personal details</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <p className="text-sm">Random chance to win discounts and rewards!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Debug Links:
            <Link href="/auth/signin?restaurant=test&table=1" className="ml-2 text-blue-500 hover:underline">
              Sign In
            </Link>
            <Link href="/auth/demo?restaurant=test&table=1" className="ml-2 text-blue-500 hover:underline">
              Demo Mode
            </Link>
            <Link href="/api/auth/status" className="ml-2 text-blue-500 hover:underline" target="_blank">
              Auth Status
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
