import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Restaurant QR Feedback System",
  description: "QR-based customer engagement system for restaurants",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="w-full mt-12 border-t border-gray-200 bg-gray-50 py-4 text-center text-sm text-gray-600 flex flex-col items-center gap-2">
          <div>
            <span className="font-medium">Your feedback is anonymous and your data is safe.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/privacy" className="underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Privacy Policy">Privacy Policy</a>
            <a href="/terms" className="underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Terms of Service">Terms of Service</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
