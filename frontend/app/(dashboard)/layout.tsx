/**
 * Dashboard layout with authentication check.
 * Redirects unauthenticated users to login page.
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAuthToken } from '@/lib/services/api-client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('access_token')

    if (!token) {
      // No token, redirect to login
      router.push('/login')
      return
    }

    // Set token in axios headers
    setAuthToken(token)
    setIsAuthenticated(true)

    // Optionally decode JWT to get user email (simplified for now)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      // Note: Our JWT only has user_id in 'sub', not email
      // We'll fetch user details in Phase 4 if needed
      setUserEmail('user@example.com') // Placeholder
    } catch (error) {
      console.error('Invalid token format')
    }
  }, [router])

  const handleSignOut = () => {
    // Clear token and redirect to login
    localStorage.removeItem('access_token')
    setAuthToken(null)
    router.push('/login')
  }

  if (!isAuthenticated) {
    // Show loading or nothing while redirecting
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              {userEmail && (
                <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
