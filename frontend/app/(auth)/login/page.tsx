/**
 * Login page.
 */

import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login | Todo App',
  description: 'Sign in to your account to manage your tasks',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow-lg rounded-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
