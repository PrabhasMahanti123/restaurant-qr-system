import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Google OAuth Setup Guide</h1>
          <p className="text-lg text-gray-600">Follow these steps to configure Google OAuth for your application</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  1
                </span>
                <span>Create Google Cloud Project</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Go to{" "}
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li>Create a new project or select an existing one</li>
                <li>Enable the Google+ API (or Google Identity API)</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  2
                </span>
                <span>Configure OAuth Consent Screen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to "APIs & Services" → "OAuth consent screen"</li>
                <li>Choose "External" user type</li>
                <li>Fill in the required information:</li>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>App name: "Restaurant Feedback System"</li>
                  <li>User support email: Your email</li>
                  <li>Developer contact information: Your email</li>
                </ul>
                <li>Add scopes: email, profile, openid</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  3
                </span>
                <span>Create OAuth Credentials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to "APIs & Services" → "Credentials"</li>
                <li>Click "Create Credentials" → "OAuth 2.0 Client ID"</li>
                <li>Choose "Web application"</li>
                <li>Add authorized redirect URIs:</li>
              </ol>

              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">For Local Development:</p>
                <code className="text-xs bg-white p-2 rounded border block">
                  http://localhost:3000/api/auth/google/callback
                </code>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">For Production (replace with your domain):</p>
                <code className="text-xs bg-white p-2 rounded border block">
                  https://your-domain.vercel.app/api/auth/google/callback
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  4
                </span>
                <span>Set Environment Variables</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Add these environment variables to your `.env.local` file:</p>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="space-y-1">
                  <div>GOOGLE_CLIENT_ID=your_client_id_here</div>
                  <div>GOOGLE_CLIENT_SECRET=your_client_secret_here</div>
                  <div>NEXTAUTH_URL=http://localhost:3000</div>
                  <div>JWT_SECRET=your_jwt_secret_here</div>
                  <div>GOOGLE_OAUTH_CONFIGURED=true</div>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Generate JWT_SECRET with: <code className="bg-gray-100 px-1 rounded">openssl rand -base64 32</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Testing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">After configuration:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Restart your development server</li>
                <li>Test the Google OAuth flow</li>
                <li>For production, update the redirect URI to your Vercel domain</li>
              </ol>

              <div className="flex space-x-2">
                <Button asChild>
                  <Link href="/auth/signin?restaurant=test&table=1">Test OAuth</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/demo?restaurant=test&table=1">Use Demo Mode</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong>For Local Development:</strong> The app will automatically use demo mode when running on
                localhost. Google OAuth setup is only required for production deployment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
