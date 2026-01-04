/**
 * Reusable Input component with consistent styling.
 * Enhanced with better mobile responsiveness, improved error states, and accessibility.
 */

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Input component with accessible design and mobile-friendly touch targets.
 *
 * @param label - Input label text (automatically adds required indicator)
 * @param error - Error message to display (also sets error styling)
 * @param helperText - Helper text displayed below input when no error
 * @param success - Shows success styling (green border)
 * @param leftIcon - Icon to display on left side of input
 * @param rightIcon - Icon to display on right side of input
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, success = false, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const inputId = props.id || props.name

    // Dynamic border color based on state
    const getBorderColor = () => {
      if (error) return 'border-red-500 focus:ring-red-500'
      if (success) return 'border-green-500 focus:ring-green-500'
      return 'border-slate-300 focus:ring-blue-500'
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-3 py-2.5 border rounded-lg text-base
              min-h-[44px]
              focus:outline-none focus:ring-2 focus:border-transparent
              disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
              transition-colors duration-200
              ${getBorderColor()}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-start gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
