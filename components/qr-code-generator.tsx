"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Download, AlertCircle } from "lucide-react"

export function QRCodeGenerator() {
  const [restaurantId, setRestaurantId] = useState("restaurant-001")
  const [tableNumber, setTableNumber] = useState("1")
  const [error, setError] = useState<string | null>(null)
  const [baseUrl, setBaseUrl] = useState("")
  const [mounted, setMounted] = useState(false)

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
      // You could add a toast notification here
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!error && (
        <Card className="p-6">
          <CardContent className="flex flex-col items-center space-y-4">
            <QRCodeSVG id="qr-code" value={qrUrl} size={200} level="M" includeMargin={true} />
            <p className="text-sm text-gray-600 text-center break-all">{qrUrl}</p>
            <div className="flex space-x-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
