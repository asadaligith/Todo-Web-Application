/**
 * Better Auth configuration for JWT-based authentication.
 */

import { betterAuth } from "better-auth"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: {
    // Using external backend database, no local DB needed
    provider: "none" as any,
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // No email verification for MVP
  },
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours in seconds
    updateAge: 60 * 60, // Update session every hour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache for 5 minutes
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
})

export type Session = typeof auth.$Infer.Session
