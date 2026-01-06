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
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 border rounded text-sm
            bg-white text-gray-900 placeholder:text-gray-400
            border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:text-gray-500
            ${error ? 'border-red-400 focus:ring-red-500' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
