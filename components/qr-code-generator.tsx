"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Download, AlertCircle, Info, Utensils, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function QRCodeGenerator() {
  // All hooks at the top
  const [restaurantId, setRestaurantId] = useState("restaurant-001")
  const [tableNumber, setTableNumber] = useState("1")
  const [error, setError] = useState<string | null>(null)
  const [baseUrl, setBaseUrl] = useState("")
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Fix hydration error by only setting baseUrl on client side
  useEffect(() => {
    setBaseUrl(window.location.origin)
    setMounted(true)
  }, [])

  // Validate inputs using useEffect instead of during render
  useEffect(() => {
    const isValidRestaurantId = restaurantId.trim().length > 0
    const isValidTableNumber = tableNumber.trim().length > 0

    if (!isValidRestaurantId || !isValidTableNumber) {
      setError("Please provide both restaurant ID and table number")
    } else {
      setError(null)
    }
  }, [restaurantId, tableNumber])

  // Don't render QR code until component is mounted on client
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="restaurant-id">Restaurant ID</Label>
            <Input
              id="restaurant-id"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              placeholder="restaurant-001"
            />
          </div>
          <div>
            <Label htmlFor="table-number">Table Number</Label>
            <Input
              id="table-number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="1"
            />
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  const qrUrl = `${baseUrl}/auth/signin?restaurant=${encodeURIComponent(restaurantId)}&table=${encodeURIComponent(tableNumber)}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      toast({
        title: "Copied!",
        description: "The QR code URL has been copied to your clipboard.",
        duration: 2000,
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadQR = () => {
    try {
      const svg = document.getElementById("qr-code")
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)

          const pngFile = canvas.toDataURL("image/png")
          const downloadLink = document.createElement("a")
          downloadLink.download = `qr-code-table-${tableNumber}.png`
          downloadLink.href = pngFile
          downloadLink.click()
        }

        img.src = "data:image/svg+xml;base64," + btoa(svgData)
      }
    } catch (err) {
      console.error("Failed to download QR code:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Label htmlFor="restaurant-id">Restaurant ID</Label>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-pink-300 transition">
            <Utensils className="w-4 h-4 text-pink-400 ml-2" />
            <Input
              id="restaurant-id"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              placeholder="restaurant-001"
              className="border-0 focus:ring-0 focus:outline-none rounded-lg px-2 py-1 bg-transparent"
            />
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="table-number">Table Number</Label>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-pink-300 transition">
            <QrCode className="w-4 h-4 text-blue-400 ml-2" />
            <Input
              id="table-number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="1"
              className="border-0 focus:ring-0 focus:outline-none rounded-lg px-2 py-1 bg-transparent"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!error && (
        <Card className="p-6 shadow-2xl border-2 border-pink-100 rounded-2xl">
          <CardContent className="flex flex-col items-center space-y-4">
            {/* Info tooltip */}
            <div className="flex items-center gap-2 mb-2">
              <span title="This QR code lets customers access the feedback form for this table.">
                <Info className="w-4 h-4 text-blue-400" />
              </span>
              <span className="text-xs text-gray-500">Show this QR code to your customers</span>
            </div>
            {/* QR code area with soft background */}
            <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-4 border border-pink-100 mb-2">
              <QRCodeSVG id="qr-code" value={qrUrl} size={200} level="M" includeMargin={true} />
            </div>
            <p className="text-sm text-gray-600 text-center break-all">{qrUrl}</p>
            <div className="flex space-x-2 w-full">
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
              <Button onClick={downloadQR} variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </div>
            <div className="mt-2 w-full flex justify-center">
              <Button
                onClick={() => window.open(qrUrl, '_blank', 'noopener,noreferrer')}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                Click to open URL
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
