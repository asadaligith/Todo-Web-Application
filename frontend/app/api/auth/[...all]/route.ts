/**
 * Better Auth API route handler.
 * This handles all authentication-related API requests.
 */

import { auth } from "@/lib/auth/config"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
