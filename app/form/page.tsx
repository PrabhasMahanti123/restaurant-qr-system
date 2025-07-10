"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FeedbackForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Declare isLoading variable

  const restaurant = searchParams.get("restaurant") || ""
  const table = searchParams.get("table") || ""

  // Fix hydration by ensuring component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Fetch the current user
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/status")
        const data = await res.json()

        if (data.authenticated) {
          setUser(data.user)
        } else {
          // Redirect to sign in if not authenticated
          const callbackUrl = `/form?restaurant=${restaurant}&table=${table}`
          router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        // Redirect to sign in on error
        const callbackUrl = `/form?restaurant=${restaurant}&table=${table}`
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [mounted, restaurant, table, router])

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    review: "",
    rating: "",
    visitFrequency: "",
    recommendation: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsLoading(true) // Set isLoading to true when submitting

    try {
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email: user?.email || "anonymous@example.com",
          restaurant,
          table,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/confirmation?isWinner=${result.isWinner}&discount=${result.discount}`)
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("There was an error submitting your feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
      setIsLoading(false) // Set isLoading to false after submission
    }
  }

  // Show loading state until mounted and user data is fetched
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Share Your Experience</CardTitle>
            <CardDescription>Help us improve by sharing your feedback. You might win exciting rewards!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="13"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="rating">Overall Rating *</Label>
                <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rate your experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                    <SelectItem value="2">⭐⭐ Fair</SelectItem>
                    <SelectItem value="1">⭐ Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="review">Your Review *</Label>
                <Textarea
                  id="review"
                  placeholder="Tell us about your experience..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="visit-frequency">How often do you visit us?</Label>
                <Select
                  value={formData.visitFrequency}
                  onValueChange={(value) => setFormData({ ...formData, visitFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-time">First time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Would you recommend us to friends?</Label>
                <RadioGroup
                  value={formData.recommendation}
                  onValueChange={(value) => setFormData({ ...formData, recommendation: value })}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="rec-yes" />
                    <Label htmlFor="rec-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="rec-no" />
                    <Label htmlFor="rec-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="rec-maybe" />
                    <Label htmlFor="rec-maybe">Maybe</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
