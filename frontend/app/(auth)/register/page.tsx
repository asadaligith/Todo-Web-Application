/**
 * Registration page.
 */

import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Register | Todo App',
  description: 'Create a new account to start managing your tasks',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Start managing your tasks with a free account
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow-lg rounded-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
