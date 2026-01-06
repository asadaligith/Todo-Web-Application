/**
 * Registration form component with validation.
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '../ui/Input'
import Button from '../ui/Button'
import apiClient from '@/lib/services/api-client'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Invalid email format'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[a-zA-Z]/.test(password)) return 'Password must contain letters'
    if (!/[0-9]/.test(password)) return 'Password must contain numbers'
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate inputs
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.post('/api/v1/auth/register', {
        email,
        password,
      })

      if (response.data) {
        // Registration successful, redirect to login
        router.push('/login?registered=true')
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response

        if (status === 409) {
          setErrors({ email: 'Email already registered' })
        } else if (status === 400) {
          setErrors({ general: data.detail || 'Invalid input' })
        } else {
          setErrors({ general: 'Registration failed. Please try again.' })
        }
      } else {
        setErrors({ general: 'Network error. Please check your connection.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
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
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
          autoComplete="new-password"
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

      <div className="p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
        <p className="font-medium mb-1">Password must have:</p>
        <p>• At least 8 characters</p>
        <p>• Letters and numbers</p>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          ✕ {errors.general}
        </div>
      )}

      <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600 pt-2">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
      </p>
    </form>
  )
}
