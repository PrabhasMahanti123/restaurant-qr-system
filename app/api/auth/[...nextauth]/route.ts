import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Ensure we have the required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials")
}

// Create a minimal NextAuth configuration
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "RANDOM_STRING",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
