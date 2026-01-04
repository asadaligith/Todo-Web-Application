/**
 * Registration page - mobile-first responsive design.
 */

import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Register | Todo App',
  description: 'Create a new account to start managing your tasks',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 sm:w-9 sm:h-9 text-white"
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
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Start managing your tasks with a free account
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-xl border border-slate-100">
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-slate-500">
          By creating an account, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  )
}
