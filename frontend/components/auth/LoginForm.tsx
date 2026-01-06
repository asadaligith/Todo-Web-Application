/**
 * Login form component with validation.
 */

'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '../ui/Input'
import Button from '../ui/Button'
import apiClient, { setAuthToken } from '@/lib/services/api-client'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const registered = searchParams.get('registered')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Basic validation
    if (!email) {
      setErrors({ email: 'Email is required' })
      return
    }
    if (!password) {
      setErrors({ password: 'Password is required' })
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.post('/api/v1/auth/login', {
        email,
        password,
      })

      if (response.data) {
        const { access_token } = response.data

        // Store token in localStorage for persistence
        localStorage.setItem('access_token', access_token)

        // Set token in axios headers
        setAuthToken(access_token)

        // Redirect to dashboard
        router.push('/tasks')
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response

        if (status === 401) {
          setErrors({ general: 'Invalid email or password' })
        } else if (status === 400) {
          setErrors({ general: data.detail || 'Invalid input' })
        } else {
          setErrors({ general: 'Login failed. Please try again.' })
        }
      } else {
        setErrors({ general: 'Network error. Please check your connection.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {registered && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✓ Registration successful! Please sign in.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
          autoComplete="email"
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            ✕ {errors.general}
          </div>
        )}

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
          Sign In
        </Button>

        <p className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={
      <div className="w-full space-y-5">
        <div className="animate-pulse space-y-5">
          <div className="h-20 bg-slate-200 rounded-lg"></div>
          <div className="h-20 bg-slate-200 rounded-lg"></div>
          <div className="h-11 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  )
}
