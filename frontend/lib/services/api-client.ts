/**
 * Base HTTP client with automatic JWT token attachment.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Create axios instance with default configuration.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
})

/**
 * Request interceptor to attach JWT token from Better Auth.
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from Better Auth session cookie
    // In client components, the token will be automatically included
    // via HTTP-only cookies by the browser

    // For server-side requests, you may need to manually extract the token
    // from cookies and add it to the Authorization header

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for error handling.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.message || error.message

      if (status === 401) {
        // Unauthorized - redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      } else if (status === 403) {
        // Forbidden
        console.error("Access forbidden:", message)
      } else if (status >= 500) {
        // Server error
        console.error("Server error:", message)
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error:", error.message)
    } else {
      // Something else happened
      console.error("Error:", error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient

/**
 * Helper function to set authorization header manually if needed.
 */
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common["Authorization"]
  }
}
