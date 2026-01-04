/**
 * Dashboard layout with authentication check.
 * Redirects unauthenticated users to login page.
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAuthToken } from '@/lib/services/api-client'
import { Toaster } from 'react-hot-toast'

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
    <div className="min-h-screen bg-slate-50">
      {/* Toast Notifications - mobile optimized */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          className: 'text-sm sm:text-base',
          style: {
            background: '#fff',
            color: '#363636',
            maxWidth: '90vw',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Header - mobile optimized */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">My Tasks</h1>
                {userEmail && (
                  <p className="text-xs sm:text-sm text-slate-600 truncate hidden sm:block">{userEmail}</p>
                )}
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="
                px-3 sm:px-4 py-2 text-sm font-medium
                text-slate-700 hover:text-slate-900
                hover:bg-slate-100 active:bg-slate-200
                rounded-lg transition-colors
                min-h-[44px] flex items-center gap-2
                flex-shrink-0
              "
              aria-label="Sign out"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - mobile optimized padding */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>

      {/* Footer - optional, mobile-friendly */}
      <footer className="mt-auto py-4 px-3 sm:px-4 text-center border-t border-slate-200 bg-white">
        <p className="text-xs sm:text-sm text-slate-500">
          2024 Todo App. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
